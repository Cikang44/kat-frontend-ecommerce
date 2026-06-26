'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';

import { queryKeys } from '@/lib/query-keys';

import {
  api,
  type InitiateOrderResult,
  type CheckoutDataResult,
  type ConfirmOrderResult,
  type OrderDetailResult,
  type OrderHistoryResult,
  type GenerateQrResult,
} from './order.api';
import type { InitiateOrderBody, ConfirmOrderBody } from './order.types';

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

/**
 * POST /order/initiate
 *
 * Creates a draft checkout from the checked cart items.
 * On success, the returned orderId is used to navigate to the
 * checkout page, and cart caches are invalidated.
 */
export function useInitiateOrder(): UseMutationResult<
  InitiateOrderResult,
  Error,
  InitiateOrderBody
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body) => api.initiateOrder(body),
    onSuccess: () => {
      // Invalidate cart — the checked items are now in a draft
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

/**
 * POST /order/confirm
 *
 * Locks the draft into a final order. On success, the frontend
 * should redirect to the returned `redirect_url` (/payment/{order_id}).
 */
export function useConfirmOrder(): UseMutationResult<ConfirmOrderResult, Error, ConfirmOrderBody> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body) => api.confirmOrder(body),
    onSuccess: (_result) => {
      // Invalidate order history — a new order was created
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.history });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
  });
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/**
 * GET /order/{orderId}/checkout
 *
 * Fetch checkout draft data — items, delivery options, payment methods,
 * user prefill, and summary. Auto-enabled when orderId is truthy.
 */
export function useCheckoutData(
  orderId: string | undefined,
): UseQueryResult<CheckoutDataResult, Error> {
  return useQuery({
    queryKey: queryKeys.orders.checkout(orderId ?? ''),
    queryFn: () => api.getCheckoutData(orderId!),
    enabled: !!orderId,
    staleTime: 30 * 1000, // 30s — draft may expire server-side
  });
}

/**
 * GET /order/{orderId}
 *
 * Get full order detail (items, delivery, payment status).
 * Used on the payment page and transaction detail page.
 */
export function useOrderDetail(
  orderId: string | undefined,
): UseQueryResult<OrderDetailResult, Error> {
  return useQuery({
    queryKey: queryKeys.orders.detail(orderId ?? ''),
    queryFn: () => api.getOrderDetail(orderId!),
    enabled: !!orderId,
    staleTime: 10 * 1000, // 10s — payment status may update
  });
}

/**
 * GET /order/history
 *
 * Get the user's transaction history, ordered newest-first.
 */
export function useOrderHistory(): UseQueryResult<OrderHistoryResult, Error> {
  return useQuery({
    queryKey: queryKeys.orders.history,
    queryFn: () => api.getOrderHistory(),
    staleTime: 30 * 1000,
  });
}

/**
 * POST /order/{orderId}/generate-qr
 *
 * Generate a pickup QR code for a paid order.
 */
export function useGenerateOrderQr(): UseMutationResult<
  GenerateQrResult,
  Error,
  string // orderId
> {
  return useMutation({
    mutationFn: (orderId) => api.generateOrderQr(orderId),
  });
}
