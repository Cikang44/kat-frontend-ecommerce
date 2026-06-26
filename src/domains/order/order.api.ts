/**
 * Order API layer — MOCKED
 *
 * Returns mock data for development without backend.
 * Uses SDK types to stay in sync with the API contract.
 * Replace with real SDK calls when backend is ready.
 */

import type {
  OrderDraft,
  CheckoutOrder,
  OrderDetail,
  OrderHistoryResponse,
  GenerateQrResponse,
  ConfirmOrderResponse,
  OrderPaymentMethod,
} from '@/api';

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

/** POST /order/initiate response data */
export type InitiateOrderResult = OrderDraft;

/** GET /order/{orderId}/checkout response data */
export type CheckoutDataResult = CheckoutOrder;

/** POST /order/confirm response data */
export type ConfirmOrderResult = ConfirmOrderResponse['data'];

/** GET /order/{orderId} response data */
export type OrderDetailResult = OrderDetail;

/** GET /order/history response data */
export type OrderHistoryResult = OrderHistoryResponse['data'];

/** POST /order/{orderId}/generate-qr response data */
export type GenerateQrResult = GenerateQrResponse['data'];

// ---------------------------------------------------------------------------
// Mock data — uses SDK types directly
// ---------------------------------------------------------------------------

// Simulated error for testing
let shouldFail = false;
let failMessage = '';

const MOCK_ITEMS: OrderDraft['items'] = [
  {
    product_id: 'prod-kaos-angkatan',
    product_name: 'Kaos Angkatan',
    image_url: '/mock/kaos-angkatan-black.jpg',
    variant: { id: 'var-xl-black', size: 'XL', color: 'Hitam', sleeve_type: '' },
    unit_price: 90000,
    quantity: 2,
    subtotal: 180000,
  },
  {
    product_id: 'prod-tas-kecil',
    product_name: 'Tas Kecil',
    image_url: '/mock/tas-kecil-merah.jpg',
    variant: { id: 'var-merah', size: '', color: 'Merah', sleeve_type: '' },
    unit_price: 75000,
    quantity: 1,
    subtotal: 75000,
  },
];

const MOCK_HISTORY: OrderHistoryResult = [
  {
    id: 'order-draft-001',
    status: 'draft',
    totalBilled: 255000,
    itemCount: 3,
    createdAt: new Date().toISOString(),
    paidAt: '',
  },
  {
    id: 'order-paid-001',
    status: 'lunas',
    totalBilled: 275000,
    itemCount: 2,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    paidAt: new Date(Date.now() - 86000000).toISOString(),
  },
  {
    id: 'order-received-001',
    status: 'diterima',
    totalBilled: 150000,
    itemCount: 1,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    paidAt: new Date(Date.now() - 172000000).toISOString(),
  },
];

let orderCounter = 0;
const generateOrderId = () => `mock-order-${Date.now()}-${++orderCounter}`;

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
   * POST /order/initiate
   * Create a draft checkout from selected cart items.
   */
  async initiateOrder(body: InitiateOrderBody): Promise<InitiateOrderResult> {
    await delay(500);

    if (shouldFail) {
      throw new ApiError('MOCK_ERROR', failMessage || 'Simulated error');
    }

    const orderId = generateOrderId();
    return {
      order_id: orderId,
      status: 'draft',
      items: MOCK_ITEMS.filter((_, i) => i < body.cart_item_ids.length),
      summary: {
        total_items: body.cart_item_ids.length,
        total_product_price: 255000,
      },
    };
  },

  /**
   * GET /order/{orderId}/checkout
   * Fetch the draft checkout data with prefill, options, and summary.
   */
  async getCheckoutData(orderId: string): Promise<CheckoutDataResult> {
    await delay(300);

    if (shouldFail) {
      throw new ApiError('MOCK_ERROR', failMessage || 'Simulated error');
    }

    return {
      order_id: orderId,
      status: 'draft',
      items: MOCK_ITEMS,
      user_prefill: {
        name: 'John Doe',
        phone: '081234567890',
        line: '@johndoe',
      },
      delivery_options: [
        { value: 'pickup', label: 'Ambil di Pickup Point' },
        { value: 'shipping', label: 'Dikirimkan' },
      ],
      payment_methods: [
        { value: 'qris', label: 'QRIS' },
        { value: 'bca_va', label: 'BCA Virtual Account' },
      ],
      summary: {
        total_items: 3,
        total_product_price: 255000,
      },
    };
  },

  /**
   * POST /order/confirm
   * Lock the draft order into a final "belum_bayar" order.
   */
  async confirmOrder(body: ConfirmOrderBody): Promise<ConfirmOrderResult> {
    await delay(500);

    if (shouldFail) {
      throw new ApiError('MOCK_ERROR', failMessage || 'Simulated error');
    }

    return {
      order_id: body.order_id,
      status: 'belum_bayar',
      delivery_method: body.delivery_method,
      payment_method: body.payment_method,
      payment_expired_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      redirect_url: `/payment/${body.order_id}`,
    };
  },

  /**
   * GET /order/{orderId}
   * Get full order detail including items and payment info.
   */
  async getOrderDetail(orderId: string): Promise<OrderDetailResult> {
    await delay(300);

    if (shouldFail) {
      throw new ApiError('MOCK_ERROR', failMessage || 'Simulated error');
    }

    const baseItems: OrderDetail['items'] = MOCK_ITEMS.map((item, i) => ({
      id: `item-${i}`,
      productName: item.product_name,
      productType: 'merchandise' as const,
      productCategory: 'baju' as const,
      variantSnapshot: item.variant,
      unitPrice: item.unit_price,
      quantity: item.quantity,
      subtotal: item.subtotal,
    }));

    // Return different data based on orderId pattern
    if (orderId.includes('draft')) {
      return {
        id: orderId,
        status: 'draft',
        deliveryMethod: 'pickup',
        deliveryAddress: '',
        contactName: 'John Doe',
        contactPhone: '081234567890',
        contactLineId: '@johndoe',
        paymentMethod: null as unknown as OrderDetail['paymentMethod'],
        totalAmount: 255000,
        gatewayFee: 0,
        totalBilled: 255000,
        paymentExpiredAt: '',
        paidAt: '',
        createdAt: new Date().toISOString(),
        items: baseItems,
      };
    }

    if (orderId.includes('paid')) {
      return {
        id: orderId,
        status: 'lunas',
        deliveryMethod: 'pickup',
        deliveryAddress: '',
        contactName: 'John Doe',
        contactPhone: '081234567890',
        contactLineId: '@johndoe',
        paymentMethod: 'qris',
        totalAmount: 255000,
        gatewayFee: 20000,
        totalBilled: 275000,
        paymentExpiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        paidAt: new Date(Date.now() - 86000000).toISOString(),
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        items: baseItems,
      };
    }

    // Default: received order
    return {
      id: orderId,
      status: 'diterima',
      deliveryMethod: 'pickup',
      deliveryAddress: '',
      contactName: 'John Doe',
      contactPhone: '081234567890',
      contactLineId: '@johndoe',
      paymentMethod: 'bca_va' as OrderPaymentMethod,
      totalAmount: 150000,
      gatewayFee: 0,
      totalBilled: 150000,
      paymentExpiredAt: '',
      paidAt: new Date(Date.now() - 172000000).toISOString(),
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      items: [
        {
          id: 'item-0',
          productName: 'Tas Kecil',
          productType: 'merchandise' as const,
          productCategory: 'aksesoris' as const,
          variantSnapshot: { id: 'var-merah', color: 'Merah' },
          unitPrice: 150000,
          quantity: 1,
          subtotal: 150000,
        },
      ],
    };
  },

  /**
   * GET /order/history
   * Get user's transaction history, newest first.
   */
  async getOrderHistory(): Promise<OrderHistoryResult> {
    await delay(300);

    if (shouldFail) {
      throw new ApiError('MOCK_ERROR', failMessage || 'Simulated error');
    }

    return MOCK_HISTORY;
  },

  /**
   * POST /order/{orderId}/generate-qr
   * Generate a pickup QR for a paid order.
   */
  async generateOrderQr(orderId: string): Promise<GenerateQrResult> {
    await delay(500);

    if (shouldFail) {
      throw new ApiError('MOCK_ERROR', failMessage || 'Simulated error');
    }

    // Generate a mock QR data URL (simple SVG placeholder)
    const qrDataUrl = `data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
        <rect width="200" height="200" fill="white"/>
        <rect x="20" y="20" width="60" height="60" fill="black"/>
        <rect x="120" y="20" width="60" height="60" fill="black"/>
        <rect x="20" y="120" width="60" height="60" fill="black"/>
        <rect x="40" y="40" width="20" height="20" fill="white"/>
        <rect x="140" y="40" width="20" height="20" fill="white"/>
        <rect x="40" y="140" width="20" height="20" fill="white"/>
        <text x="100" y="180" text-anchor="middle" font-size="10" fill="black">${orderId.slice(0, 12)}</text>
      </svg>`,
    )}`;

    return {
      qrDataUrl,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
  },

  // ---------------------------------------------------------------------------
  // Mock helpers (not part of real API)
  // ---------------------------------------------------------------------------

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
    shouldFail = false;
    failMessage = '';
  },
};
