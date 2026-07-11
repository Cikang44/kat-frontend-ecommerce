import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockFee = vi.fn();
const mockMethods = vi.fn();
const mockInitiate = vi.fn();
const mockDetail = vi.fn();
const mockStatus = vi.fn();

vi.mock('@/api/sdk.gen', () => ({
  getApiV1PaymentFee: (...a: unknown[]) => mockFee(...a),
  getApiV1PaymentMethods: (...a: unknown[]) => mockMethods(...a),
  postApiV1PaymentByOrderIdInitiate: (...a: unknown[]) => mockInitiate(...a),
  getApiV1PaymentByOrderId: (...a: unknown[]) => mockDetail(...a),
  getApiV1PaymentByOrderIdStatus: (...a: unknown[]) => mockStatus(...a),
}));

import { api } from './payment.api';

beforeEach(() => vi.clearAllMocks());

describe('payment.api', () => {
  it('getMethods unwraps the methods array (never hardcode payment methods)', async () => {
    const methods = [{ code: 'qris', name: 'QRIS', type: 'qris', feeType: 'percentage', feeValue: 0.7 }];
    mockMethods.mockResolvedValue({ data: { success: true, data: methods } });

    const result = await api.getMethods();

    expect(result).toEqual(methods);
  });

  it('initiatePayment sends { method } and unwraps the gateway payload', async () => {
    const gateway = { paymentId: 'p1', method: 'qris', qrString: '000201', expiredAt: 'x' };
    mockInitiate.mockResolvedValue({ data: { success: true, data: gateway } });

    const result = await api.initiatePayment('ord-1', 'qris');

    expect(result).toEqual(gateway);
    expect(mockInitiate).toHaveBeenCalledWith({ path: { orderId: 'ord-1' }, body: { method: 'qris' } });
  });

  it('getPaymentStatus unwraps the status payload for polling', async () => {
    mockStatus.mockResolvedValue({ data: { success: true, data: { status: 'lunas' } } });
    const result = await api.getPaymentStatus('ord-1');
    expect((result as { status: string }).status).toBe('lunas');
  });
});
