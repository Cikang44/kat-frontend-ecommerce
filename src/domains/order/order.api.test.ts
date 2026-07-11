import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockInitiate = vi.fn();
const mockConfirm = vi.fn();
const mockCheckout = vi.fn();
const mockDetail = vi.fn();
const mockHistory = vi.fn();
const mockGenerateQr = vi.fn();

vi.mock('@/api/sdk.gen', () => ({
  postApiV1OrderInitiate: (...a: unknown[]) => mockInitiate(...a),
  postApiV1OrderConfirm: (...a: unknown[]) => mockConfirm(...a),
  getApiV1OrderByOrderIdCheckout: (...a: unknown[]) => mockCheckout(...a),
  getApiV1OrderByOrderId: (...a: unknown[]) => mockDetail(...a),
  getApiV1OrderHistory: (...a: unknown[]) => mockHistory(...a),
  postApiV1OrderByOrderIdGenerateQr: (...a: unknown[]) => mockGenerateQr(...a),
}));

import { api } from './order.api';

beforeEach(() => vi.clearAllMocks());

describe('order.api envelope unwrapping', () => {
  it('initiateOrder unwraps the draft from { success, data }', async () => {
    const draft = { order_id: 'ord-1', status: 'draft', items: [], summary: { total_items: 0 } };
    mockInitiate.mockResolvedValue({ data: { success: true, data: draft } });

    const result = await api.initiateOrder({ cart_item_ids: ['ci-1'] });

    expect(result).toEqual(draft);
    expect((result as { order_id: string }).order_id).toBe('ord-1');
  });

  it('initiateOrder forwards the snake_case cart_item_ids body verbatim', async () => {
    mockInitiate.mockResolvedValue({ data: { success: true, data: { order_id: 'x' } } });
    await api.initiateOrder({ cart_item_ids: ['a', 'b'] });
    expect(mockInitiate).toHaveBeenCalledWith({ body: { cart_item_ids: ['a', 'b'] } });
  });

  it('confirmOrder unwraps the confirmation payload', async () => {
    const confirmed = { order_id: 'ord-1', status: 'belum_bayar', redirect_url: '/pay' };
    mockConfirm.mockResolvedValue({ data: { success: true, data: confirmed } });

    const result = await api.confirmOrder({
      order_id: 'ord-1',
      delivery_method: 'pickup',
      // Pickup orders carry no address; the backend only requires it for shipping.
      receiver: { name: 'A', phone: '08', line: 'a', address: '' },
      payment_method: 'qris',
    });

    expect(result).toEqual(confirmed);
  });

  it('getOrderHistory unwraps the history array', async () => {
    mockHistory.mockResolvedValue({ data: { success: true, data: [{ id: 'o1' }, { id: 'o2' }] } });
    const result = await api.getOrderHistory();
    expect(result).toHaveLength(2);
  });
});
