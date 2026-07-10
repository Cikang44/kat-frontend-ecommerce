/**
 * Payment API layer — calls the generated SDK against the real backend.
 */

import type {
  PaymentFeeResponse,
  InitiatePaymentResponse,
  PaymentDetailResponse,
  PaymentStatusResponse,
} from '@/api';

import {
  getApiV1PaymentFee,
  postApiV1PaymentByOrderIdInitiate,
  getApiV1PaymentByOrderId,
  getApiV1PaymentByOrderIdStatus,
} from '@/api/sdk.gen';

// ---------------------------------------------------------------------------
// ApiError  —  mirrors the backend's ErrorResponse shape
// ---------------------------------------------------------------------------

export class ApiError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = 'ApiError';
  }
}

// ---------------------------------------------------------------------------
// Re-exported result types — derived from SDK types
// ---------------------------------------------------------------------------

export type PaymentFeeResult = PaymentFeeResponse['data'];
export type InitiatePaymentResult = InitiatePaymentResponse['data'];
export type PaymentDetailResult = PaymentDetailResponse['data'];
export type PaymentStatusResult = PaymentStatusResponse['data'];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type SdkResult = { data?: unknown; error?: unknown };

function unwrap<T>(response: SdkResult): T {
  const err = response.error;
  if (err == null) return response.data as T;
  // openapi-fetch returns the parsed error body on 4xx/5xx, but an Error
  // instance on network failure. Normalize both into ApiError.
  if (err instanceof Error) {
    throw new ApiError('NETWORK_ERROR', err.message);
  }
  const e = err as { error?: { code?: string; message?: string }; message?: string };
  throw new ApiError(
    e.error?.code ?? 'UNKNOWN_ERROR',
    e.error?.message ?? e.message ?? 'Terjadi kesalahan',
  );
}

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

export const api = {
  /**
   * GET /payment/fee
   * Calculate payment gateway fee for a method + amount.
   */
  async getFee(method: string, amount: number): Promise<PaymentFeeResult> {
    return unwrap<PaymentFeeResult>(await getApiV1PaymentFee({ query: { method, amount } }));
  },

  /**
   * POST /payment/{orderId}/initiate
   * Create a payment transaction at the gateway.
   */
  async initiatePayment(orderId: string, method: string): Promise<InitiatePaymentResult> {
    return unwrap<InitiatePaymentResult>(
      await postApiV1PaymentByOrderIdInitiate({ path: { orderId }, body: { method } }),
    );
  },

  /**
   * GET /payment/{orderId}
   * Get the full payment detail page data: QR/VA, countdown, shipping, summary.
   */
  async getPaymentDetail(orderId: string): Promise<PaymentDetailResult> {
    return unwrap<PaymentDetailResult>(await getApiV1PaymentByOrderId({ path: { orderId } }));
  },

  /**
   * GET /payment/{orderId}/status
   * Poll the current payment status.
   */
  async getPaymentStatus(orderId: string): Promise<PaymentStatusResult> {
    return unwrap<PaymentStatusResult>(await getApiV1PaymentByOrderIdStatus({ path: { orderId } }));
  },
};
