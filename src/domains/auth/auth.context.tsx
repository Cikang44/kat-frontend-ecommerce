'use client';

import { createContext, useContext, useRef, type ReactNode } from 'react';
import { useStore } from 'zustand';

import { createAuthStore, type AuthStore } from './auth.store';

// ---------------------------------------------------------------------------
// Context  —  holds a single zustand auth store instance per React tree
// ---------------------------------------------------------------------------

const AuthContext = createContext<ReturnType<typeof createAuthStore> | null>(null);

// ---------------------------------------------------------------------------
// Provider  —  wraps the app so client components can access auth state
// ---------------------------------------------------------------------------

export function AuthProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<ReturnType<typeof createAuthStore> | null>(null);

  if (!storeRef.current) {
    storeRef.current = createAuthStore();
  }

  return <AuthContext.Provider value={storeRef.current}>{children}</AuthContext.Provider>;
}

// ---------------------------------------------------------------------------
// Hook  —  subscribe to a slice of the auth store from client components
// ---------------------------------------------------------------------------

export function useAuthStore<T>(selector: (state: AuthStore) => T): T {
  const store = useContext(AuthContext);

  if (!store) {
    throw new Error(
      'useAuthStore must be used within <AuthProvider>. ' +
        'Wrap your app root in <AuthProvider> inside providers.tsx.',
    );
  }

  return useStore(store, selector);
}
