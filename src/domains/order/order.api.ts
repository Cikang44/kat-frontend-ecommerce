/**
 * Order API layer
 *
 * Wraps the generated SDK functions with a consistent error boundary.
 * Follows the same pattern as auth.api.ts.
 */

import {
  postApiV1OrderInitiate,
  getApiV1OrderByOrderIdCheckout,
  postApiV1OrderConfirm,
  getApiV1OrderByOrderId,
  getApiV1OrderHistory,
  postApiV1OrderByOrderIdGenerateQr,
} from '@/api';
import type {
  InitiateOrderBody,
  InitiateOrderResponse,
  CheckoutResponse,
  ConfirmOrderBody,
  ConfirmOrderResponse,
  OrderDetailResponse,
  OrderHistoryResponse,
  GenerateQrResponse,
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

export type InitiateOrderResult = InitiateOrderResponse['data'];
export type CheckoutDataResult = CheckoutResponse['data'];
export type ConfirmOrderResult = ConfirmOrderResponse['data'];
export type OrderDetailResult = OrderDetailResponse['data'];
export type OrderHistoryResult = OrderHistoryResponse['data'];
export type GenerateQrResult = GenerateQrResponse['data'];

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
   * POST /order/initiate
   * Create a draft checkout from selected cart items.
   */
  async initiateOrder(body: InitiateOrderBody): Promise<InitiateOrderResult> {
    return unwrap(await postApiV1OrderInitiate({ body }));
  },

  /**
   * GET /order/{orderId}/checkout
   * Fetch the draft checkout data with prefill, options, and summary.
   */
  async getCheckoutData(orderId: string): Promise<CheckoutDataResult> {
    return unwrap(await getApiV1OrderByOrderIdCheckout({ path: { orderId } }));
  },

  /**
   * POST /order/confirm
   * Lock the draft order into a final "belum_bayar" order.
   * Returns the redirect URL for the payment page.
   */
  async confirmOrder(body: ConfirmOrderBody): Promise<ConfirmOrderResult> {
    return unwrap(await postApiV1OrderConfirm({ body }));
  },

  /**
   * GET /order/{orderId}
   * Get full order detail including items and payment info.
   */
  async getOrderDetail(orderId: string): Promise<OrderDetailResult> {
    return unwrap(await getApiV1OrderByOrderId({ path: { orderId } }));
  },

  /**
   * GET /order/history
   * Get user's transaction history, newest first.
   */
  async getOrderHistory(): Promise<OrderHistoryResult> {
    return unwrap(await getApiV1OrderHistory());
  },

  /**
   * POST /order/{orderId}/generate-qr
   * Generate a pickup QR for a paid order.
   */
  async generateOrderQr(orderId: string): Promise<GenerateQrResult> {
    return unwrap(await postApiV1OrderByOrderIdGenerateQr({ path: { orderId } }));
  },
};
