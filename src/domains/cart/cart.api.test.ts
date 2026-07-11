import { describe, it, expect, vi, beforeEach } from 'vitest';

// --- Mock the generated SDK before importing the module under test ----------
const mockGetCart = vi.fn();
const mockGetCartCount = vi.fn();
const mockPostCart = vi.fn();
const mockPatchCart = vi.fn();
const mockDeleteCart = vi.fn();

vi.mock('@/api/sdk.gen', () => ({
  getApiV1Cart: (...a: unknown[]) => mockGetCart(...a),
  getApiV1CartCount: (...a: unknown[]) => mockGetCartCount(...a),
  postApiV1Cart: (...a: unknown[]) => mockPostCart(...a),
  patchApiV1CartByItemId: (...a: unknown[]) => mockPatchCart(...a),
  deleteApiV1CartByItemId: (...a: unknown[]) => mockDeleteCart(...a),
}));

import { api, ApiError } from './cart.api';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('cart.api envelope unwrapping', () => {
  it('getCart returns the INNER data (items/summary), not the full { success, data } body', async () => {
    const inner = { items: [{ id: 'ci-1', quantity: 2 }], summary: { totalItems: 2 } };
    mockGetCart.mockResolvedValue({ data: { success: true, data: inner } });

    const result = await api.getCart();

    // Regression guard: the old code returned the whole body, so `.items`
    // would have been undefined. It must be the unwrapped inner object.
    expect(result).toEqual(inner);
    expect((result as { items: unknown[] }).items).toHaveLength(1);
  });

  it('getCartCount returns the numeric count from the envelope', async () => {
    mockGetCartCount.mockResolvedValue({ data: { success: true, data: { count: 5 } } });
    await expect(api.getCartCount()).resolves.toBe(5);
  });
});

describe('cart.api add-to-cart payload building', () => {
  it('addVariant sends { variantId, quantity }', async () => {
    mockPostCart.mockResolvedValue({ data: { success: true, data: { item: {}, summary: {} } } });

    await api.addVariant('var-123', 3);

    expect(mockPostCart).toHaveBeenCalledWith({ body: { variantId: 'var-123', quantity: 3 } });
  });

  it('addBundle sends { bundleId, selectedVariants, quantity } (no variantId)', async () => {
    mockPostCart.mockResolvedValue({ data: { success: true, data: { item: {}, summary: {} } } });
    const selected = [{ productId: 'p-1', variantId: 'v-1', quantity: 1 }];

    await api.addBundle('bundle-9', selected, 1);

    expect(mockPostCart).toHaveBeenCalledWith({
      body: { bundleId: 'bundle-9', selectedVariants: selected, quantity: 1 },
    });
    // Must not leak a variantId into a bundle request (backend rejects both).
    const sent = mockPostCart.mock.calls[0][0] as { body: Record<string, unknown> };
    expect(sent.body).not.toHaveProperty('variantId');
  });
});

describe('cart.api error normalization', () => {
  it('maps a backend { error: { code, message } } into ApiError', async () => {
    mockGetCart.mockResolvedValue({
      error: { success: false, error: { code: 'INSUFFICIENT_STOCK', message: 'Stok habis' } },
    });

    await expect(api.getCart()).rejects.toMatchObject({
      name: 'ApiError',
      code: 'INSUFFICIENT_STOCK',
      message: 'Stok habis',
    });
  });

  it('maps a network Error into ApiError(NETWORK_ERROR)', async () => {
    mockGetCart.mockResolvedValue({ error: new Error('Failed to fetch') });
    await expect(api.getCart()).rejects.toBeInstanceOf(ApiError);
    await expect(api.getCart()).rejects.toMatchObject({ code: 'NETWORK_ERROR' });
  });
});
