'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';

import type {
  LoginBody,
  SignupBody,
  VerifyOtpBody,
  ResendOtpBody,
  OnboardingBody,
  ChangePasswordBody,
  PatchProfileBody,
  UserProfile,
  AuthUser,
} from '@/api/types.gen';
import { setStoredToken, clearStoredToken } from '@/lib/api-client';
import { useAuthStore } from '@/lib/providers';
import { queryKeys } from '@/lib/query-keys';

import { api, type LoginResult, type SignupResult, type VerifyOtpResult } from './auth.api';

// ---------------------------------------------------------------------------
// Mutations  —  write operations that change server-side auth state
// ---------------------------------------------------------------------------

/**
 * Login — authenticate with email & password.
 * On success, stores the access token and sets the user in zustand.
 */
export function useLogin(): UseMutationResult<LoginResult, Error, LoginBody> {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (body) => api.login(body),
    onSuccess: (result) => {
      setStoredToken(result.accessToken);
      setUser(result.user);

      // Pre-fetch profile so it's cached immediately
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile });
    },
  });
}

/**
 * Signup — register a new user.
 * On success, the user is redirected to OTP verification.
 */
export function useSignup(): UseMutationResult<SignupResult, Error, SignupBody> {
  return useMutation({
    mutationFn: (body) => api.signup(body),
  });
}

/**
 * Verify OTP — confirm the 6-digit code sent during signup.
 * On success, persists the onboardingToken in the zustand store so it
 * survives page navigation to the onboarding page.
 */
export function useVerifyOtp(): UseMutationResult<VerifyOtpResult, Error, VerifyOtpBody> {
  const setOnboardingToken = useAuthStore((s) => s.setOnboardingToken);

  return useMutation({
    mutationFn: (body) => api.verifyOtp(body),
    onSuccess: (result) => {
      setOnboardingToken(result.onboardingToken);
    },
  });
}

/**
 * Resend OTP — request a new code if the previous one expired.
 */
export function useResendOtp(): UseMutationResult<{ message: string }, Error, ResendOtpBody> {
  return useMutation({
    mutationFn: (body) => api.resendOtp(body),
  });
}

/**
 * Onboarding — complete the profile after OTP verification.
 *
 * The real backend authenticates this request via the onboardingToken
 * Bearer header (set on the HTTP client before calling the SDK).
 * The mock API internally validates the session that was created when
 * verifyOtp succeeded, so no token needs to be passed here.
 *
 * On success, stores the access token, sets the user, and clears the
 * temporary onboardingToken from the zustand store.
 */
export function useOnboarding(): UseMutationResult<
  { accessToken: string; user: AuthUser },
  Error,
  OnboardingBody
> {
  const setUser = useAuthStore((s) => s.setUser);
  const clearOnboardingToken = useAuthStore((s) => s.clearOnboardingToken);

  return useMutation({
    mutationFn: (body) => api.onboarding(body),
    onSuccess: (result) => {
      setStoredToken(result.accessToken);
      setUser(result.user);
      clearOnboardingToken();
    },
  });
}

/**
 * Logout — end the current session.
 * On success, clears the token, zustand state, and all query caches.
 */
export function useLogout(): UseMutationResult<{ message: string }, Error, void> {
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  return useMutation({
    mutationFn: () => api.logout(),
    onSuccess: () => {
      clearStoredToken();
      clearAuth();
      queryClient.clear(); // wipe all cached server state
    },
  });
}

/**
 * Change password — update the user's password.
 * On success, all other sessions are invalidated (backend-side).
 */
export function useChangePassword(): UseMutationResult<
  { message: string },
  Error,
  ChangePasswordBody
> {
  return useMutation({
    mutationFn: (body) => api.changePassword(body),
  });
}

/**
 * Refresh token — silently obtain a new access token.
 * Called by the API interceptor when a 401 occurs.
 */
export function useRefreshToken(): UseMutationResult<{ accessToken: string }, Error, void> {
  return useMutation({
    mutationFn: () => api.refreshToken(),
    onSuccess: (result) => {
      setStoredToken(result.accessToken);
    },
  });
}

// ---------------------------------------------------------------------------
// Queries  —  read operations that fetch user information
// ---------------------------------------------------------------------------

/**
 * User profile — fetch the current user's full profile data.
 * Auto-enabled only when the user is logged in.
 *
 * On success, syncs the user into the zustand store for synchronous access
 * (navbar, route guards, etc.).
 */
export function useProfile(): UseQueryResult<UserProfile, Error> {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const setUser = useAuthStore((s) => s.setUser);
  const currentUser = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: queryKeys.auth.profile,
    queryFn: async () => {
      const profile = await api.getProfile();
      // Sync zustand store with fresh profile data
      setUser({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role,
        isOnboardingComplete: true,
      });
      return profile;
    },
    enabled: isLoggedIn,
    staleTime: 5 * 60 * 1000, // 5 min — profile rarely changes
    placeholderData: currentUser
      ? ({
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          role: currentUser.role,
          lineId: '',
          phone: '',
          nim: '',
          division: { id: '', name: '', code: '' },
          kelompok: '',
        } as UserProfile)
      : undefined,
  });
}

/**
 * Check admin status — lightweight query for role-gated rendering.
 * Only enabled when the user is logged in.
 */
export function useIsAdmin(): UseQueryResult<{ isAdmin: boolean }, Error> {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  return useQuery({
    queryKey: queryKeys.auth.isAdmin,
    queryFn: () => api.isAdmin(),
    enabled: isLoggedIn,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Update profile — partial update of user profile fields.
 * Invalidates the profile query on success so the cache is refreshed.
 */
export function useUpdateProfile(): UseMutationResult<UserProfile, Error, PatchProfileBody> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body) => api.updateProfile(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile });
    },
  });
}
