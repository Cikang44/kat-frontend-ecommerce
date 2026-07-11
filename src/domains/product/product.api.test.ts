import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockGetProduct = vi.fn();
const mockGetProductById = vi.fn();
const mockGetBundles = vi.fn();
const mockGetBundleById = vi.fn();

vi.mock('@/api/sdk.gen', () => ({
  getApiV1Product: (...a: unknown[]) => mockGetProduct(...a),
  getApiV1ProductById: (...a: unknown[]) => mockGetProductById(...a),
  getApiV1ProductBundles: (...a: unknown[]) => mockGetBundles(...a),
  getApiV1ProductBundlesById: (...a: unknown[]) => mockGetBundleById(...a),
}));

import { api } from './product.api';

beforeEach(() => vi.clearAllMocks());

describe('product.api list filters', () => {
  it('splits comma-separated type/category into arrays and clamps pagination', async () => {
    mockGetProduct.mockResolvedValue({ data: { success: true, data: [], meta: {} } });

    await api.list({ type: 'merchandise,kit_panitia', category: 'baju', page: '2', limit: '999' });

    const call = mockGetProduct.mock.calls[0][0] as { query: Record<string, unknown> };
    expect(call.query.type).toEqual(['merchandise', 'kit_panitia']);
    expect(call.query.category).toEqual(['baju']);
    expect(call.query.page).toBe(2);
    expect(call.query.limit).toBe(50); // clamped to max 50
  });
});

describe('product.api bundles', () => {
  it('listBundles returns { data, meta } from the envelope', async () => {
    const bundles = [{ id: 'b1', name: 'Starter', type: 'merchandise_bundle' }];
    const meta = { page: 1, limit: 20, total: 1, totalPages: 1 };
    mockGetBundles.mockResolvedValue({ data: { success: true, data: bundles, meta } });

    const result = await api.listBundles({ type: 'merchandise_bundle' });

    expect(result.data).toEqual(bundles);
    expect(result.meta).toEqual(meta);
    const call = mockGetBundles.mock.calls[0][0] as { query: Record<string, unknown> };
    expect(call.query.type).toEqual(['merchandise_bundle']);
  });

  it('bundleDetail unwraps the inner bundle detail', async () => {
    const detail = { id: 'b1', name: 'Kit', items: [] };
    mockGetBundleById.mockResolvedValue({ data: { success: true, data: detail } });

    const result = await api.bundleDetail('b1');

    expect(result).toEqual(detail);
    expect(mockGetBundleById).toHaveBeenCalledWith({ path: { id: 'b1' } });
  });
});
