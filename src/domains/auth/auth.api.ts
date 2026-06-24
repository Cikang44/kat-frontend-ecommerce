/**
 * MOCK API — Auth domain
 *
 * Simulates backend responses for all auth endpoints.
 */

import type {
  AuthUser,
  LoginBody,
  SignupBody,
  VerifyOtpBody,
  ResendOtpBody,
  OnboardingBody,
  ChangePasswordBody,
  PatchProfileBody,
  UserProfile,
  LoginResponse,
  SignupResponse,
  VerifyOtpResponse,
  ResendOtpResponse,
  OnboardingResponse,
  LogoutResponse,
  ChangePasswordResponse,
  IsAdminResponse,
} from '@/api/types.gen';

// ---------------------------------------------------------------------------
// ApiError  —  mirrors the backend's ErrorResponse shape
//             { success: false, error: { code, message } }
//             while remaining an instanceof Error for TQ compatibility.
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
// Types
// ---------------------------------------------------------------------------

export type LoginResult = LoginResponse['data'];
export type SignupResult = SignupResponse['data'];
export type VerifyOtpResult = VerifyOtpResponse['data'];
export type ResendOtpResult = ResendOtpResponse['data'];
export type OnboardingResult = OnboardingResponse['data'];
export type LogoutResult = LogoutResponse['data'];
export type ChangePasswordResult = ChangePasswordResponse['data'];
export type IsAdminResult = IsAdminResponse['data'];

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

interface MockUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'umum' | 'panitia' | 'admin';
  isOnboardingComplete: boolean;
  lineId: string | null;
  phone: string | null;
  nim: string | null;
  division: { id: string; name: string; code: string } | null;
  kelompok: string | null;
}

const MOCK_USERS: MockUser[] = [
  {
    id: 'usr-admin-001',
    name: 'Admin Ganesha',
    email: 'admin@ganesha.id',
    password: 'Admin1234',
    role: 'admin',
    isOnboardingComplete: true,
    lineId: '@admin_ganesha',
    phone: '081234567890',
    nim: null,
    division: null,
    kelompok: null,
  },
  {
    id: 'usr-panitia-001',
    name: 'Budi Panitia',
    email: 'test@example.com',
    password: 'Password12345',
    role: 'panitia',
    isOnboardingComplete: true,
    lineId: '@budi_panitia',
    phone: '081234567891',
    nim: '19622001',
    division: { id: 'div-001', name: 'Acara', code: 'ACR' },
    kelompok: null,
  },
  {
    id: 'usr-umum-001',
    name: 'Citra Umum',
    email: 'user@ganesha.id',
    password: 'User1234',
    role: 'umum',
    isOnboardingComplete: true,
    lineId: '@citra_umum',
    phone: '081234567892',
    nim: null,
    division: null,
    kelompok: '23',
  },
];

// ---------------------------------------------------------------------------
// In-memory registrations  —  simulates pending/unverified accounts
// ---------------------------------------------------------------------------

interface PendingRegistration {
  name: string;
  email: string;
  password: string;
  otp: string;
  otpExpiry: number; // timestamp ms
}

const pendingRegistrations = new Map<string, PendingRegistration>();

/**
 * Simulates the backend's session for onboarding.
 * Set when verifyOtp succeeds; checked when onboarding is called.
 * Mirrors the real flow where the frontend sends the onboardingToken
 * as a Bearer header and the backend validates it against an internal store.
 */
let _pendingOnboardingToken: string | null = null;
let _pendingOnboardingUserIndex: number | null = null;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function mockUserToAuthUser(u: MockUser): AuthUser {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    isOnboardingComplete: u.isOnboardingComplete,
  };
}

function mockUserToProfile(u: MockUser): UserProfile {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    lineId: u.lineId ?? '',
    phone: u.phone ?? '',
    nim: u.nim ?? '',
    // The generated type is non-nullable. For non-panitia users, return
    // empty strings — the real backend should behave consistently.
    division: u.division ?? { id: '', name: '', code: '' },
    kelompok: u.kelompok ?? '',
  };
}

function findMockUser(email: string): MockUser | undefined {
  return MOCK_USERS.find((u) => u.email === email);
}

const DEFAULT_ACCESS_TOKEN = 'mock-access-token-' + Date.now();

// ---------------------------------------------------------------------------
// API functions  —  replace bodies with real SDK calls later
// ---------------------------------------------------------------------------

export const api = {
  /** POST /auth/signup — register a new user, send OTP */
  async signup(body: SignupBody): Promise<SignupResult> {
    await delay(600);

    // ── Validation ──────────────────────────────────────────────────────
    if (!body.name || !body.email || !body.password) {
      throw new ApiError('VALIDATION_ERROR', 'Semua field wajib diisi');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      throw new ApiError('INVALID_EMAIL', 'Format email tidak valid');
    }

    if (body.password.length < 8) {
      throw new ApiError('WEAK_PASSWORD', 'Password minimal 8 karakter');
    }

    if (!/[A-Z]/.test(body.password)) {
      throw new ApiError('WEAK_PASSWORD', 'Password harus mengandung huruf besar');
    }

    if (!/[a-z]/.test(body.password)) {
      throw new ApiError('WEAK_PASSWORD', 'Password harus mengandung huruf kecil');
    }

    if (!/[0-9]/.test(body.password)) {
      throw new ApiError('WEAK_PASSWORD', 'Password harus mengandung angka');
    }

    if (findMockUser(body.email)) {
      throw new ApiError('EMAIL_EXISTS', 'Email sudah terdaftar');
    }

    if (pendingRegistrations.has(body.email)) {
      throw new ApiError('EMAIL_EXISTS', 'Email sudah terdaftar');
    }

    // ── Store pending registration ──────────────────────────────────────
    pendingRegistrations.set(body.email, {
      name: body.name,
      email: body.email,
      password: body.password,
      otp: '123456',
      otpExpiry: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    console.log(`[MOCK] OTP for ${body.email}: 123456`);

    return { message: 'OTP berhasil dikirim ke email', email: body.email };
  },

  /** POST /auth/login — authenticate with email & password */
  async login(body: LoginBody): Promise<LoginResult> {
    await delay(500);

    if (!body.email || !body.password) {
      throw new ApiError('VALIDATION_ERROR', 'Email dan password wajib diisi');
    }

    const user = findMockUser(body.email);

    if (!user || user.password !== body.password) {
      // Generic error — no user enumeration
      throw new ApiError('INVALID_CREDENTIALS', 'Email atau password salah');
    }

    if (!user.isOnboardingComplete) {
      throw new ApiError('ONBOARDING_INCOMPLETE', 'Silakan selesaikan onboarding terlebih dahulu');
    }

    return {
      accessToken: DEFAULT_ACCESS_TOKEN,
      user: mockUserToAuthUser(user),
    };
  },

  /** POST /auth/verify-otp — verify the 6-digit OTP */
  async verifyOtp(body: VerifyOtpBody): Promise<VerifyOtpResult> {
    await delay(400);

    if (!body.email || !body.otp) {
      throw new ApiError('VALIDATION_ERROR', 'Email dan OTP wajib diisi');
    }

    const pending = pendingRegistrations.get(body.email);

    if (!pending) {
      throw new ApiError('NOT_FOUND', 'Email tidak ditemukan atau sudah terverifikasi');
    }

    if (Date.now() > pending.otpExpiry) {
      pendingRegistrations.delete(body.email);
      throw new ApiError('OTP_EXPIRED', 'OTP kedaluwarsa, silakan minta OTP baru');
    }

    if (pending.otp !== body.otp) {
      throw new ApiError('INVALID_OTP', 'OTP salah, silakan coba lagi');
    }

    // Create the new user in mock data (isOnboardingComplete = false)
    const newUserIndex = MOCK_USERS.length;
    MOCK_USERS.push({
      id: 'usr-' + Date.now(),
      name: pending.name,
      email: pending.email,
      password: pending.password,
      role: 'umum', // default, can be changed during onboarding
      isOnboardingComplete: false,
      lineId: null,
      phone: null,
      nim: null,
      division: null,
      kelompok: null,
    });

    pendingRegistrations.delete(body.email);

    // Store session so the subsequent onboarding call is authenticated
    const onboardingToken = 'mock-onboarding-token-' + Date.now();
    _pendingOnboardingToken = onboardingToken;
    _pendingOnboardingUserIndex = newUserIndex;

    return {
      onboardingToken,
      message: 'Email berhasil diverifikasi',
    };
  },

  /** POST /auth/resend-otp — resend OTP code */
  async resendOtp(body: ResendOtpBody): Promise<ResendOtpResult> {
    await delay(400);

    const pending = pendingRegistrations.get(body.email);

    if (!pending) {
      throw new ApiError('NOT_FOUND', 'Email tidak ditemukan atau sudah terverifikasi');
    }

    // Reset OTP
    pending.otp = '123456';
    pending.otpExpiry = Date.now() + 10 * 60 * 1000;

    console.log(`[MOCK] Resent OTP for ${body.email}: 123456`);

    return { message: 'OTP berhasil dikirim ulang' };
  },

  /**
   * POST /auth/onboarding — complete profile after OTP verification
   *
   * In the real backend, authentication is via Bearer header using the
   * onboardingToken.  Here we validate against an internal session that was
   * set when verifyOtp succeeded — mirroring the same semantic.
   */
  async onboarding(body: OnboardingBody): Promise<OnboardingResult> {
    await delay(700);

    if (!_pendingOnboardingToken) {
      throw new ApiError('UNAUTHORIZED', 'Token onboarding tidak valid');
    }

    if (_pendingOnboardingUserIndex === null) {
      throw new ApiError('UNAUTHORIZED', 'Token onboarding tidak valid');
    }

    const user = MOCK_USERS[_pendingOnboardingUserIndex];

    if (!user || user.isOnboardingComplete) {
      throw new ApiError('CONFLICT', 'Onboarding sudah diselesaikan sebelumnya');
    }

    if (!body.lineId || !body.phone) {
      throw new ApiError('VALIDATION_ERROR', 'ID LINE dan nomor telepon wajib diisi');
    }

    // ── Update user data ────────────────────────────────────────────────
    user.lineId = body.lineId;
    user.phone = body.phone;
    user.role = body.role;
    user.isOnboardingComplete = true;

    if (body.role === 'panitia') {
      if (!body.nim || !body.divisionCode) {
        throw new ApiError('VALIDATION_ERROR', 'NIM dan kode bidang wajib diisi untuk panitia');
      }

      user.nim = body.nim;
      user.division = {
        id: 'div-' + body.divisionCode,
        name: 'Divisi ' + body.divisionCode,
        code: body.divisionCode,
      };
    }

    // Clear onboarding session — it's single-use
    _pendingOnboardingToken = null;
    _pendingOnboardingUserIndex = null;

    return {
      accessToken: DEFAULT_ACCESS_TOKEN,
      user: mockUserToAuthUser(user),
    };
  },

  /** POST /auth/logout — invalidate refresh token */
  async logout(): Promise<LogoutResult> {
    await delay(300);
    return { message: 'Berhasil logout' };
  },

  /** POST /auth/change-password */
  async changePassword(body: ChangePasswordBody): Promise<ChangePasswordResult> {
    await delay(500);

    if (!body.oldPassword || !body.newPassword || !body.confirmPassword) {
      throw new ApiError('VALIDATION_ERROR', 'Semua field wajib diisi');
    }

    if (body.newPassword !== body.confirmPassword) {
      throw new ApiError('VALIDATION_ERROR', 'Password baru dan konfirmasi tidak cocok');
    }

    if (body.newPassword.length < 8) {
      throw new ApiError('WEAK_PASSWORD', 'Password minimal 8 karakter');
    }

    // In production, the backend checks oldPassword against the hashed password.
    // For mock, we accept any oldPassword.

    return { message: 'Password berhasil diubah' };
  },

  /** POST /auth/refresh-token — get a new access token */
  async refreshToken(): Promise<{ accessToken: string }> {
    await delay(300);
    return { accessToken: 'mock-refreshed-token-' + Date.now() };
  },

  /** GET /user/profile — fetch current user profile */
  async getProfile(): Promise<UserProfile> {
    await delay(400);

    // In a real app, the backend resolves from the access token.
    // For the mock, return the first complete user.
    const mockUser = MOCK_USERS.find((u) => u.isOnboardingComplete);

    if (!mockUser) {
      throw new ApiError('NOT_FOUND', 'Pengguna tidak ditemukan');
    }

    return mockUserToProfile(mockUser);
  },

  /** PATCH /user/profile — update profile fields */
  async updateProfile(body: PatchProfileBody): Promise<UserProfile> {
    await delay(500);

    const mockUser = MOCK_USERS.find((u) => u.isOnboardingComplete);

    if (!mockUser) {
      throw new ApiError('NOT_FOUND', 'Pengguna tidak ditemukan');
    }

    if (body.name !== undefined) mockUser.name = body.name;
    if (body.lineId !== undefined) mockUser.lineId = body.lineId;
    if (body.phone !== undefined) mockUser.phone = body.phone;

    return mockUserToProfile(mockUser);
  },

  /** GET /user/profile/is-admin — check if current user is admin */
  async isAdmin(): Promise<IsAdminResult> {
    await delay(300);

    const mockUser = MOCK_USERS.find((u) => u.isOnboardingComplete);

    return { isAdmin: mockUser?.role === 'admin' };
  },
};
