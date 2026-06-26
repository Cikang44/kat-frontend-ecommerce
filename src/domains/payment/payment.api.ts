/**
 * Payment API layer
 *
 * Wraps the generated SDK functions with a consistent error boundary.
 * Follows the same pattern as auth.api.ts.
 */

import {
  getApiV1PaymentFee,
  postApiV1PaymentByOrderIdInitiate,
  getApiV1PaymentByOrderId,
  getApiV1PaymentByOrderIdStatus,
} from '@/api';
import type {
  PaymentFeeResponse,
  InitiatePaymentResponse,
  PaymentDetailResponse,
  PaymentStatusResponse,
} from '@/api';

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
// Re-exported result types
// ---------------------------------------------------------------------------

export type PaymentFeeResult = PaymentFeeResponse['data'];
export type InitiatePaymentResult = InitiatePaymentResponse['data'];
export type PaymentDetailResult = PaymentDetailResponse['data'];
export type PaymentStatusResult = PaymentStatusResponse['data'];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Throw ApiError when the SDK returns an error. Returns the inner `.data` directly. */
function unwrap<TResponse extends { success: true; data: D }, D>(
  result: { data: TResponse; error: undefined } | { data: undefined; error: unknown },
): D {
  if (!result.data) {
    const err = result.error as { code?: string; message?: string };
    throw new ApiError(err.code ?? 'UNKNOWN', err.message ?? 'Terjadi kesalahan');
  }
  return result.data.data;
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
    return unwrap(await getApiV1PaymentFee({ query: { method, amount } }));
  },

  /**
   * POST /payment/{orderId}/initiate
   * Create a payment transaction at the gateway.
   */
  async initiatePayment(orderId: string, method: string): Promise<InitiatePaymentResult> {
    return unwrap(
      await postApiV1PaymentByOrderIdInitiate({
        path: { orderId },
        body: { method },
      }),
    );
  },

  /**
   * GET /payment/{orderId}
   * Get the full payment detail page data: QR/VA, countdown, shipping, summary.
   */
  async getPaymentDetail(orderId: string): Promise<PaymentDetailResult> {
    return unwrap(await getApiV1PaymentByOrderId({ path: { orderId } }));
  },

  /**
   * GET /payment/{orderId}/status
   * Poll the current payment status (belum_bayar / lunas / expired / diterima).
   */
  async getPaymentStatus(orderId: string): Promise<PaymentStatusResult> {
    return unwrap(await getApiV1PaymentByOrderIdStatus({ path: { orderId } }));
  },
};
