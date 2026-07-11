'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';
import { useEffect } from 'react';

import { queryKeys } from '@/lib/query-keys';

import {
  api,
  type PaymentFeeResult,
  type InitiatePaymentResult,
  type PaymentDetailResult,
  type PaymentStatusResult,
} from './payment.api';

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

/**
 * POST /payment/{orderId}/initiate
 *
 * Creates a payment transaction at the gateway.
 * Called when the user lands on the payment page.
 */
export function useInitiatePayment(): UseMutationResult<
  InitiatePaymentResult,
  Error,
  { orderId: string; method: string }
> {
  return useMutation({
    mutationFn: ({ orderId, method }) => api.initiatePayment(orderId, method),
  });
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/**
 * GET /payment/fee
 *
 * Calculate the payment gateway fee for a given method and subtotal.
 * Auto-enabled when both `method` and `amount` are provided (amount > 0).
 */
export function usePaymentFee(
  method: string | undefined,
  amount: number | undefined,
): UseQueryResult<PaymentFeeResult, Error> {
  return useQuery({
    queryKey: queryKeys.payment.fee(method ?? '', amount ?? 0),
    queryFn: () => api.getFee(method!, amount!),
    // Note: amount === 0 is intentionally excluded — no fee for zero amount
    enabled: !!method && amount !== undefined && amount > 0,
    staleTime: 60 * 1000, // 1 min — fee is stable
  });
}

/**
 * GET /payment/{orderId}
 *
 * Full payment page data: QR string / VA info, countdown, shipping info,
 * order summary. Used on initial render of the payment page.
 *
 * Status polling is handled separately by usePaymentStatus (5s interval).
 * This query only fetches on mount and refetches when window refocuses.
 */
export function usePaymentDetail(
  orderId: string | undefined,
  options?: { enabled?: boolean },
): UseQueryResult<PaymentDetailResult, Error> {
  // Detail must only be fetched once a payment record is guaranteed to exist,
  // otherwise the backend returns 404 "Pembayaran tidak ditemukan". The caller
  // gates this via `options.enabled` (see canLoadPaymentDetail).
  const enabled = !!orderId && (options?.enabled ?? true);
  return useQuery({
    queryKey: queryKeys.payment.detail(orderId ?? ''),
    queryFn: () => api.getPaymentDetail(orderId!),
    enabled,
    staleTime: 15 * 1000,
    refetchOnWindowFocus: true,
  });
}

/**
 * GET /payment/{orderId}/status
 *
 * Lightweight polling endpoint — returns only the status string.
 * Polls every 5 seconds while `belum_bayar`, stops on `lunas`/`expired`.
 *
 * Use this for the live payment status indicator.
 * The heavy `usePaymentDetail` query refetches less frequently.
 */
export function usePaymentStatus(
  orderId: string | undefined,
): UseQueryResult<PaymentStatusResult, Error> {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.payment.status(orderId ?? ''),
    queryFn: () => api.getPaymentStatus(orderId!),
    enabled: !!orderId,
    // Poll every 5s while still unpaid; stop on terminal states
    refetchInterval: (query) => (query.state.data?.status === 'belum_bayar' ? 5000 : false),
    staleTime: 0, // always fetch fresh status
  });

  // When status changes to terminal state, invalidate usePaymentDetail
  // so it fetches fresh data (items, shipping, etc.)
  const status = query.data?.status;
  useEffect(() => {
    if (status && status !== 'belum_bayar' && orderId) {
      queryClient.invalidateQueries({ queryKey: queryKeys.payment.detail(orderId) });
    }
  }, [status, orderId, queryClient]);

  return query;
}
