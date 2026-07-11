'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api, type SelectedVariant } from './cart.api';
import { queryKeys } from '@/lib/query-keys';

// ---------------------------------------------------------------------------
// Queries — fetch cart from backend (single source of truth)
// ---------------------------------------------------------------------------

export function useCartQuery() {
  return useQuery({
    queryKey: queryKeys.cart.all,
    queryFn: () => api.getCart(),
  });
}

/**
 * Total cart quantity for the navbar badge.
 * `enabled` gates the request so it doesn't fire (and 401) for logged-out users.
 */
export function useCartCount(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [...queryKeys.cart.all, 'count'],
    queryFn: () => api.getCartCount(),
    enabled: options?.enabled ?? true,
  });
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

/**
 * Add a single product variant to the backend cart.
 * On success, invalidates the cart query so the UI refreshes.
 */
export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ variantId, quantity }: { variantId: string; quantity: number }) =>
      api.addVariant(variantId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });
}

/**
 * Add a bundle (with chosen component variants) to the backend cart.
 */
export function useAddBundleToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bundleId,
      selectedVariants,
      quantity,
    }: {
      bundleId: string;
      selectedVariants: SelectedVariant[];
      quantity: number;
    }) => api.addBundle(bundleId, selectedVariants, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });
}

/**
 * Update the quantity of a backend cart item.
 */
export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      api.updateCartItem(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });
}

/**
 * Remove a backend cart item.
 */
export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => api.removeCartItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });
}
