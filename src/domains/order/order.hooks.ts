'use client';

import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';

import { queryKeys } from '@/lib/query-keys';

import {
  api,
  type InitiateOrderResult,
  type CheckoutDataResult,
  type ConfirmOrderResult,
  type OrderDetailResult,
  type OrderHistoryResult,
  type GenerateQrResult,
  type MockConfirmOrderBody,
} from './order.api';
import type { InitiateOrderBody } from './order.types';

// ---------------------------------------------------------------------------
// Combined types for useOrderHistoryWithDetails
// ---------------------------------------------------------------------------

export type OrderWithDetails = OrderHistoryResult[number] & {
  items: OrderDetailResult['items'];
  deliveryMethod?: OrderDetailResult['deliveryMethod'];
  paymentMethod?: OrderDetailResult['paymentMethod'];
};

// ---------------------------------------------------------------------------
// Types for usePickupQr
// ---------------------------------------------------------------------------

export interface PickupQrState {
  qrDataUrl: string | null;
  expiresAt: Date | null;
  timeLeft: string;
  isExpired: boolean;
}

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
  return useMutation({
    mutationFn: (body) => api.initiateOrder(body),
    // Note: Cart is zustand-based, not React Query.
    // Cart cleanup is handled by the caller (CartSummaryCard) after navigation.
  });
}

/**
 * POST /order/confirm
 *
 * Locks the draft into a final order. On success, the frontend
 * should redirect to the returned `redirect_url` (/payment/{order_id}).
 */
export function useConfirmOrder(): UseMutationResult<ConfirmOrderResult, Error, MockConfirmOrderBody> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body) => api.confirmOrder(body),
    onSuccess: (_result, variables) => {
      // Invalidate order history — a new order was created
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.history });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      // Remove stale checkout cache — draft is now confirmed
      queryClient.removeQueries({
        queryKey: queryKeys.orders.checkout(variables.order_id),
      });
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

// ---------------------------------------------------------------------------
// Combined Queries
// ---------------------------------------------------------------------------

/**
 * Combined hook that fetches order history with full item details.
 *
 * Fetches the order list, then fetches details for each order in parallel.
 * Returns merged data with item details (name, variant, quantity).
 *
 * Note: Creates N+1 API calls. Acceptable for typical user order count.
 */
export function useOrderHistoryWithDetails(): {
  data: OrderWithDetails[] | undefined;
  isLoading: boolean;
  error: Error | null;
} {
  const historyQuery = useOrderHistory();
  const orderIds = historyQuery.data?.map((order) => order.id) ?? [];

  const detailQueries = useQueries({
    queries: orderIds.map((id) => ({
      queryKey: queryKeys.orders.detail(id),
      queryFn: () => api.getOrderDetail(id),
      staleTime: 30 * 1000,
    })),
  });

  const isLoading = historyQuery.isLoading || detailQueries.some((q) => q.isLoading);

  // Collect all errors, not just the first one
  const errors: Error[] = [];
  if (historyQuery.error) errors.push(historyQuery.error);
  detailQueries.forEach((q) => {
    if (q.error) errors.push(q.error);
  });
  const error: Error | null = errors.length > 0 ? errors[0] : null;

  // Build a map from orderId → detail data to avoid index mismatch
  const detailMap = new Map<string, OrderDetailResult>();
  detailQueries.forEach((q, index) => {
    if (q.data && orderIds[index]) {
      detailMap.set(orderIds[index], q.data);
    }
  });

  const orders: OrderWithDetails[] | undefined = historyQuery.data?.map((historyItem) => {
    const detail = detailMap.get(historyItem.id);
    return {
      ...historyItem,
      items: detail?.items ?? [],
      deliveryMethod: detail?.deliveryMethod,
      paymentMethod: detail?.paymentMethod,
    };
  });

  return { data: orders, isLoading, error };
}

// ---------------------------------------------------------------------------
// QR Pickup Hook
// ---------------------------------------------------------------------------

/**
 * Manages QR generation and countdown for pickup orders.
 *
 * Usage:
 *   const { qrDataUrl, timeLeft, isExpired, generate } = usePickupQr(orderId);
 */
export function usePickupQr(orderId: string | undefined) {
  const generateQr = useGenerateOrderQr();
  const [state, setState] = useState<PickupQrState>({
    qrDataUrl: null,
    expiresAt: null,
    timeLeft: '',
    isExpired: false,
  });

  // Reset state when orderId changes
  useEffect(() => {
    setState({
      qrDataUrl: null,
      expiresAt: null,
      timeLeft: '',
      isExpired: false,
    });
  }, [orderId]);

  // Countdown timer
  useEffect(() => {
    if (!state.expiresAt || state.isExpired) return;

    const timer = setInterval(() => {
      const now = new Date();
      const diff = state.expiresAt!.getTime() - now.getTime();

      if (diff <= 0) {
        setState((prev) => ({ ...prev, timeLeft: 'expired', isExpired: true }));
        clearInterval(timer);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setState((prev) => ({
        ...prev,
        timeLeft: `${hours}j ${minutes}m ${seconds}s`,
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [state.expiresAt, state.isExpired]);

  const generate = useCallback(() => {
    if (!orderId) {
      console.warn('usePickupQr: generate called without orderId');
      return;
    }
    generateQr.mutate(orderId, {
      onSuccess: (data) => {
        setState({
          qrDataUrl: data.qrDataUrl,
          expiresAt: new Date(data.expiresAt),
          timeLeft: '',
          isExpired: false,
        });
      },
    });
  }, [orderId, generateQr.mutate]);

  return {
    ...state,
    generate,
    isGenerating: generateQr.isPending,
    error: generateQr.error,
  };
}
