/**
 * Order API layer — calls the generated SDK against the real backend.
 */

import type {
  OrderDraft,
  CheckoutOrder,
  OrderDetail,
  OrderHistoryResponse,
  GenerateQrResponse,
  ConfirmOrderResponse,
} from '@/api';

import {
  postApiV1OrderInitiate,
  getApiV1OrderHistory,
  getApiV1OrderByOrderIdCheckout,
  postApiV1OrderConfirm,
  getApiV1OrderByOrderId,
  postApiV1OrderByOrderIdGenerateQr,
} from '@/api/sdk.gen';

import type { InitiateOrderBody, ConfirmOrderBody } from './order.types';

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

export type InitiateOrderResult = OrderDraft;
export type CheckoutDataResult = CheckoutOrder;
export type ConfirmOrderResult = ConfirmOrderResponse['data'];
export type OrderDetailResult = OrderDetail;
export type OrderHistoryResult = OrderHistoryResponse['data'];
export type GenerateQrResult = GenerateQrResponse['data'];

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
  /** POST /order/initiate */
  async initiateOrder(body: InitiateOrderBody): Promise<InitiateOrderResult> {
    return unwrap<InitiateOrderResult>(await postApiV1OrderInitiate({ body }));
  },

  /** GET /order/{orderId}/checkout */
  async getCheckoutData(orderId: string): Promise<CheckoutDataResult> {
    return unwrap<CheckoutDataResult>(await getApiV1OrderByOrderIdCheckout({ path: { orderId } }));
  },

  /** POST /order/confirm */
  async confirmOrder(body: ConfirmOrderBody): Promise<ConfirmOrderResult> {
    return unwrap<ConfirmOrderResult>(await postApiV1OrderConfirm({ body }));
  },

  /** GET /order/{orderId} */
  async getOrderDetail(orderId: string): Promise<OrderDetailResult> {
    return unwrap<OrderDetailResult>(await getApiV1OrderByOrderId({ path: { orderId } }));
  },

  /** GET /order/history */
  async getOrderHistory(): Promise<OrderHistoryResult> {
    return unwrap<OrderHistoryResult>(await getApiV1OrderHistory());
  },

  /** POST /order/{orderId}/generate-qr */
  async generateOrderQr(orderId: string): Promise<GenerateQrResult> {
    return unwrap<GenerateQrResult>(await postApiV1OrderByOrderIdGenerateQr({ path: { orderId } }));
  },
};
