'use client';

import { createContext, useContext, useRef, type ReactNode } from 'react';
import { useStore } from 'zustand';

import { createCartStore, type CartStore } from '@/domains/cart/cart.store';

// ---------------------------------------------------------------------------
// Context  —  holds a single zustand store instance per React tree
// ---------------------------------------------------------------------------

const CartContext = createContext<ReturnType<typeof createCartStore> | null>(null);

// ---------------------------------------------------------------------------
// Provider  —  wraps the app so client components can access the store
// ---------------------------------------------------------------------------

export function Providers({ children }: { children: ReactNode }) {
  const storeRef = useRef<ReturnType<typeof createCartStore> | null>(null);

  if (!storeRef.current) {
    storeRef.current = createCartStore();
  }

  return <CartContext.Provider value={storeRef.current}>{children}</CartContext.Provider>;
}

// ---------------------------------------------------------------------------
// Hook  —  subscribe to a slice of the cart store from client components
// ---------------------------------------------------------------------------

export function useCartStore<T>(selector: (state: CartStore) => T): T {
  const store = useContext(CartContext);

  if (!store) {
    throw new Error(
      'useCartStore must be used within <Providers>. ' +
        'Wrap your app root in <Providers> inside layout.tsx.',
    );
  }

  return useStore(store, selector);
}
