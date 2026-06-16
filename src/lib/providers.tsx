'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createContext, useContext, useRef, type ReactNode } from 'react';
import { useStore } from 'zustand';

import { UnauthorizedHandler } from '@/components/auth/unauthorized-handler';
import { createAuthStore, type AuthStore } from '@/domains/auth/auth.store';
import { createCartStore, type CartStore } from '@/domains/cart/cart.store';

// ---------------------------------------------------------------------------
// Contexts  —  each holds one zustand store instance per React tree (SSR-safe)
// ---------------------------------------------------------------------------

const AuthContext = createContext<ReturnType<typeof createAuthStore> | null>(null);
const CartContext = createContext<ReturnType<typeof createCartStore> | null>(null);

const queryClient = new QueryClient();

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function Providers({ children }: { children: ReactNode }) {
  const authStoreRef = useRef<ReturnType<typeof createAuthStore> | null>(null);
  const cartStoreRef = useRef<ReturnType<typeof createCartStore> | null>(null);

  if (!authStoreRef.current) authStoreRef.current = createAuthStore();
  if (!cartStoreRef.current) cartStoreRef.current = createCartStore();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={authStoreRef.current}>
        <UnauthorizedHandler />
        <CartContext.Provider value={cartStoreRef.current}>{children}</CartContext.Provider>
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

export function useCartStore<T>(selector: (state: CartStore) => T): T {
  const store = useContext(CartContext);
  if (!store) throw new Error('useCartStore must be used within <Providers>.');
  return useStore(store, selector);
}
