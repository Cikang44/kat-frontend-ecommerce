/**
 * Auth domain — real SDK integration.
 *
 * Replaces the previous mock implementation with calls to the generated SDK.
 * The backend handles authentication, OTP verification, and onboarding.
 */

import type {
  AuthUser,
  LoginBody,
  LoginResponse,
  OnboardingBody,
  ChangePasswordBody,
  PatchProfileBody,
  UserProfile,
} from '@/api/types.gen';

import {
  postApiV1AuthLogin,
  postApiV1AuthRefreshToken,
  postApiV1AuthLogout,
  postApiV1AuthChangePassword,
  postApiV1AuthOnboarding,
  getApiV1UserProfile,
  patchApiV1UserProfile,
  getApiV1UserProfileIsAdmin,
} from '@/api/sdk.gen';

// ---------------------------------------------------------------------------
// ApiError  —  mirrors the backend's ErrorResponse shape
// ---------------------------------------------------------------------------

export class ApiError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = 'ApiError';
  }
}

// ---------------------------------------------------------------------------
// Result types
// ---------------------------------------------------------------------------

/**
 * Login can succeed in two shapes (discriminated by `onboardingRequired`):
 *  - authenticated: carries a full `accessToken` (+ refresh cookie set by BE).
 *  - onboarding required: carries a short-lived `onboardingToken` only.
 * See docs/penyesuaian.md — seeded panitia/admin start with onboarding pending.
 */
export type LoginResult = LoginResponse['data'];
export type OnboardingResult = { accessToken: string; user: AuthUser };

/** Narrow a login result to a single branch decision (pure — unit tested). */
export function resolveLoginOutcome(data: LoginResult): 'onboarding' | 'authenticated' {
  return data.onboardingRequired ? 'onboarding' : 'authenticated';
}
export type LogoutResult = { message: string };
export type ChangePasswordResult = { message: string };
export type IsAdminResult = { isAdmin: boolean };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type SdkResult = { data?: unknown; error?: unknown };

function unwrap<T>(response: SdkResult): T {
  const err = response.error;
  if (err == null) return response.data as T;
  if (err instanceof Error) {
    throw new ApiError('NETWORK_ERROR', err.message);
  }
  const e = err as { error?: { code?: string; message?: string }; message?: string };
  throw new ApiError(
    e.error?.code ?? 'UNKNOWN_ERROR',
    e.error?.message ?? e.message ?? 'Terjadi kesalahan',
  );
}

/**
 * Unwrap the backend's { success, data } envelope.
 * The SDK returns the full response body; we extract the inner data.
 */
function unwrapEnvelope<T>(response: SdkResult): T {
  const result = unwrap<{ success: boolean; data: T }>(response);
  return result.data;
}

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

export const api = {
  /** POST /auth/login — authenticate with email & password (panitia/admin) */
  async login(body: LoginBody): Promise<LoginResult> {
    return unwrapEnvelope<LoginResult>(
      await postApiV1AuthLogin({ body }),
    );
  },

  /**
   * POST /auth/onboarding — complete profile after Google sign-in (umum) or
   * first login (panitia). Authenticated via the onboardingToken Bearer header.
   */
  async onboarding(body: OnboardingBody, onboardingToken: string): Promise<OnboardingResult> {
    // The SDK's onboarding endpoint expects a Bearer token.
    // We need to temporarily override the Authorization header
    // with the onboardingToken instead of the regular access token.
    const response = await postApiV1AuthOnboarding({
      body,
      headers: {
        Authorization: `Bearer ${onboardingToken}`,
      },
    });
    return unwrapEnvelope<OnboardingResult>(response);
  },

  /** POST /auth/logout — invalidate refresh token */
  async logout(): Promise<LogoutResult> {
    return unwrapEnvelope<LogoutResult>(
      await postApiV1AuthLogout(),
    );
  },

  /** POST /auth/change-password */
  async changePassword(body: ChangePasswordBody): Promise<ChangePasswordResult> {
    return unwrapEnvelope<ChangePasswordResult>(
      await postApiV1AuthChangePassword({ body }),
    );
  },

  /** POST /auth/refresh-token — get a new access token */
  async refreshToken(): Promise<{ accessToken: string }> {
    return unwrapEnvelope<{ accessToken: string }>(
      await postApiV1AuthRefreshToken(),
    );
  },

  /** GET /user/profile — fetch current user profile */
  async getProfile(): Promise<UserProfile> {
    return unwrapEnvelope<UserProfile>(
      await getApiV1UserProfile(),
    );
  },

  /** PATCH /user/profile — update profile fields */
  async updateProfile(body: PatchProfileBody): Promise<UserProfile> {
    return unwrapEnvelope<UserProfile>(
      await patchApiV1UserProfile({ body }),
    );
  },

  /** GET /user/profile/is-admin — check if current user is admin */
  async isAdmin(): Promise<IsAdminResult> {
    if (
      process.env.NODE_ENV === 'development' &&
      typeof window !== 'undefined' &&
      localStorage.getItem('dev_mock_admin') === 'true'
    ) {
      return { isAdmin: true };
    }
    return unwrapEnvelope<IsAdminResult>(
      await getApiV1UserProfileIsAdmin(),
    );
  },
};
