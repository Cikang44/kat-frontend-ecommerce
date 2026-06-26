'use client';

import {
  useMutation,
  useQuery,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';

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
    enabled: !!method && !!amount && amount > 0,
    staleTime: 60 * 1000, // 1 min — fee is stable
  });
}

/**
 * GET /payment/{orderId}
 *
 * Full payment page data: QR string / VA info, countdown, shipping info,
 * order summary. Used on initial render of the payment page.
 *
 * Automatically refetches every 30s while the payment is still
 * `belum_bayar` to keep the countdown and QR up-to-date.
 */
export function usePaymentDetail(
  orderId: string | undefined,
): UseQueryResult<PaymentDetailResult, Error> {
  return useQuery({
    queryKey: queryKeys.payment.detail(orderId ?? ''),
    queryFn: () => api.getPaymentDetail(orderId!),
    enabled: !!orderId,
    staleTime: 15 * 1000,
    refetchInterval: (query) => (query.state.data?.status === 'belum_bayar' ? 30_000 : false),
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
  return useQuery({
    queryKey: queryKeys.payment.status(orderId ?? ''),
    queryFn: () => api.getPaymentStatus(orderId!),
    enabled: !!orderId,
    // Poll every 5s while still unpaid; stop on terminal states
    refetchInterval: (query) => (query.state.data?.status === 'belum_bayar' ? 5000 : false),
    staleTime: 0, // always fetch fresh status
  });
}
