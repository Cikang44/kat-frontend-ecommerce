'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { createContext, useContext, useRef, type ReactNode } from 'react';
import { useStore } from 'zustand';

import { UnauthorizedHandler } from '@/components/auth/unauthorized-handler';
import { createAuthStore, type AuthStore } from '@/domains/auth/auth.store';

// Side-effect import: configures the generated API client (baseUrl + token
// interceptor + 401 handling) at app init, before any SDK call can run.
// Guarantees devsecops proxy routing regardless of which page loads first.
import '@/lib/api-client';

import { getQueryClient } from './query-client';

// ---------------------------------------------------------------------------
// Contexts  —  holds one zustand store instance per React tree (SSR-safe)
// ---------------------------------------------------------------------------

const AuthContext = createContext<ReturnType<typeof createAuthStore> | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function Providers({ children }: { children: ReactNode }) {
  const authStoreRef = useRef<ReturnType<typeof createAuthStore> | null>(null);

  if (!authStoreRef.current) authStoreRef.current = createAuthStore();

  return (
    <QueryClientProvider client={getQueryClient()}>
      <AuthContext.Provider value={authStoreRef.current}>
        <UnauthorizedHandler />
        {children}
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}

// ---------------------------------------------------------------------------
// Selector hooks
// ---------------------------------------------------------------------------

export function useAuthStore<T>(selector: (state: AuthStore) => T): T {
  const store = useContext(AuthContext);
  if (!store) throw new Error('useAuthStore must be used within <Providers>.');
  return useStore(store, selector);
}
