/**
 * Payment API layer — MOCKED
 *
 * Returns mock data for development without backend.
 * Uses SDK types to stay in sync with the API contract.
 * Replace with real SDK calls when backend is ready.
 */

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
// Re-exported result types — derived from SDK types
// ---------------------------------------------------------------------------

/** GET /payment/fee response data */
export type PaymentFeeResult = PaymentFeeResponse['data'];

/** POST /payment/{orderId}/initiate response data */
export type InitiatePaymentResult = InitiatePaymentResponse['data'];

/** GET /payment/{orderId} response data */
export type PaymentDetailResult = PaymentDetailResponse['data'];

/** GET /payment/{orderId}/status response data */
export type PaymentStatusResult = PaymentStatusResponse['data'];

// ---------------------------------------------------------------------------
// Mock data — uses SDK types directly
// ---------------------------------------------------------------------------

const MOCK_ITEMS: PaymentDetailResult['orderSummary']['items'] = [
  {
    productName: 'Kaos Angkatan',
    variant: { size: 'XL', color: 'Hitam' },
    quantity: 2,
    unitPrice: 90000,
    subtotal: 180000,
  },
  {
    productName: 'Tas Kecil',
    variant: { color: 'Merah' },
    quantity: 1,
    unitPrice: 75000,
    subtotal: 75000,
  },
];

// Simulated payment status for demo
// Note: PaymentDetailResponse only allows 'belum_bayar' | 'lunas' | 'expired'
// but PaymentStatusResponse also allows 'diterima'
let simulatedStatus: PaymentStatusResult['status'] = 'belum_bayar';

// Simulated error for testing
let shouldFail = false;
let failMessage = '';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
    await delay(200);

    if (shouldFail) {
      throw new ApiError('MOCK_ERROR', failMessage || 'Simulated error');
    }

    // Mock fee calculation
    const feeRate = method === 'qris' ? 0.007 : 0.005; // 0.7% for QRIS, 0.5% for VA
    const fee = Math.round(amount * feeRate);

    return {
      method,
      subtotal: amount,
      fee,
      total: amount + fee,
    };
  },

  /**
   * POST /payment/{orderId}/initiate
   * Create a payment transaction at the gateway.
   */
  async initiatePayment(orderId: string, method: string): Promise<InitiatePaymentResult> {
    await delay(500);

    if (shouldFail) {
      throw new ApiError('MOCK_ERROR', failMessage || 'Simulated error');
    }

    // Mock: use fixed amount (255000) to avoid circular dependency with getPaymentDetail
    const amount = 255000;

    return {
      paymentId: `pay-${orderId}`,
      paymentReference: `ref-${Date.now()}`,
      method,
      expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      qrString: method === 'qris' ? 'https://mock-qris.example.com/qr' : undefined,
      bank: method === 'bca_va' ? 'BCA' : undefined,
      accountNumber: method === 'bca_va' ? '8808 1234 5678 9012' : undefined,
      amount,
    };
  },

  /**
   * GET /payment/{orderId}
   * Get the full payment detail page data: QR/VA, countdown, shipping, summary.
   */
  async getPaymentDetail(orderId: string): Promise<PaymentDetailResult> {
    await delay(300);

    if (shouldFail) {
      throw new ApiError('MOCK_ERROR', failMessage || 'Simulated error');
    }

    const amount = 255000;
    const isQris = !orderId.includes('va');
    // Use same fee calculation as getFee for consistency
    const feeRate = isQris ? 0.007 : 0.005;
    const fee = Math.round(amount * feeRate);

    return {
      status: simulatedStatus as PaymentDetailResult['status'],
      method: isQris ? 'qris' : 'bca_va',
      expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      countdown: 86400, // 24 hours in seconds
      orderSummary: {
        orderId,
        subtotal: amount,
        fee,
        total: amount + fee,
        items: MOCK_ITEMS,
      },
      shipping: {
        method: 'pickup',
        name: 'John Doe',
        phone: '081234567890',
        address: '',
      },
      paymentDetail: {
        fee,
        qrString: isQris ? 'https://mock-qris.example.com/qr' : undefined,
        bank: !isQris ? 'BCA' : undefined,
        accountNumber: !isQris ? '8808 1234 5678 9012' : undefined,
      },
    };
  },

  /**
   * GET /payment/{orderId}/status
   * Poll the current payment status.
   */
  async getPaymentStatus(_orderId: string): Promise<PaymentStatusResult> {
    await delay(100);

    if (shouldFail) {
      throw new ApiError('MOCK_ERROR', failMessage || 'Simulated error');
    }

    return {
      status: simulatedStatus,
    };
  },

  // ---------------------------------------------------------------------------
  // Mock helpers (not part of real API)
  // ---------------------------------------------------------------------------

  /**
   * [MOCK ONLY] Simulate payment success.
   * Call this to test the "lunas" state.
   */
  _simulatePaymentSuccess() {
    simulatedStatus = 'lunas';
  },

  /**
   * [MOCK ONLY] Simulate payment expiry.
   * Call this to test the "expired" state.
   */
  _simulatePaymentExpiry() {
    simulatedStatus = 'expired';
  },

  /**
   * [MOCK ONLY] Simulate order received (after handover).
   * Note: 'diterima' is only valid for PaymentStatusResponse, not PaymentDetailResponse.
   * Use this only with usePaymentStatus, not usePaymentDetail.
   */
  _simulateOrderReceived() {
    simulatedStatus = 'diterima';
  },

  /**
   * [MOCK ONLY] Simulate API error.
   * Call this to test error handling.
   */
  _simulateError(message = 'Simulated error') {
    shouldFail = true;
    failMessage = message;
  },

  /**
   * [MOCK ONLY] Reset to initial state.
   */
  _reset() {
    simulatedStatus = 'belum_bayar';
    shouldFail = false;
    failMessage = '';
  },
};
