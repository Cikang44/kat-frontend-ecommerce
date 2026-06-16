import { createStore } from 'zustand';
import { persist } from 'zustand/middleware';

import type { AuthUser } from '@/api/types.gen';

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

interface AuthState {
  user: AuthUser | null;
  isLoggedIn: boolean;
  /**
   * Temporary token returned from verify-otp, required as Bearer token for
   * the onboarding endpoint.  Not persisted to localStorage — lives only for
   * the browser session (survives page navigation, lost on tab close).
   */
  onboardingToken: string | null;
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

interface AuthActions {
  setUser: (user: AuthUser) => void;
  setOnboardingToken: (token: string) => void;
  clearOnboardingToken: () => void;
  clearAuth: () => void;
}

export type AuthStore = AuthState & AuthActions;

// ---------------------------------------------------------------------------
// Factory  —  called from Providers in src/lib/providers.tsx
// ---------------------------------------------------------------------------

export const createAuthStore = () =>
  createStore<AuthStore>()(
    persist(
      (set) => ({
        // ── State ──────────────────────────────────────────────────────────
        user: null,
        isLoggedIn: false,
        onboardingToken: null,

        // ── Actions ────────────────────────────────────────────────────────
        setUser: (user) => set({ user, isLoggedIn: true }),

        setOnboardingToken: (token) => set({ onboardingToken: token }),

        clearOnboardingToken: () => set({ onboardingToken: null }),

        clearAuth: () => set({ user: null, isLoggedIn: false, onboardingToken: null }),
      }),

      // ── Persistence ──────────────────────────────────────────────────────
      {
        name: 'ganesha-goods-auth',
        partialize: (state) => ({
          user: state.user,
          isLoggedIn: state.isLoggedIn,
        }),
      },
    ),
  );
