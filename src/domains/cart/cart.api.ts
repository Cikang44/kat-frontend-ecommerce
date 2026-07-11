/**
 * Cart domain — real SDK integration.
 */

import type {
  GetCartResponse,
  AddToCartResponse,
  UpdateCartItemResponse,
  DeleteCartItemResponse,
  AddToCartBody,
} from '@/api/types.gen';
import {
  getApiV1Cart,
  getApiV1CartCount,
  postApiV1Cart,
  patchApiV1CartByItemId,
  deleteApiV1CartByItemId,
} from '@/api/sdk.gen';

/** A single bundle-component variant choice, per AddToCartBody.selectedVariants. */
export type SelectedVariant = { productId: string; variantId: string; quantity: number };

// ---------------------------------------------------------------------------
// ApiError
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
// Helpers
// ---------------------------------------------------------------------------

type SdkResult = { data?: unknown; error?: unknown };

function unwrapError(err: unknown): never {
  if (err instanceof Error) {
    throw new ApiError('NETWORK_ERROR', err.message);
  }
  const e = err as { error?: { code?: string; message?: string }; message?: string };
  throw new ApiError(
    e.error?.code ?? 'UNKNOWN_ERROR',
    e.error?.message ?? e.message ?? 'Terjadi kesalahan',
  );
}

/**
 * Unwrap the backend's `{ success, data }` envelope.
 * The SDK's `response.data` IS the full response body; the payload we want is
 * nested one level deeper under `.data`.
 */
function unwrapEnvelope<T>(response: SdkResult): T {
  if (response.error != null) unwrapError(response.error);
  const body = response.data as { success: boolean; data: T };
  return body.data;
}

// ---------------------------------------------------------------------------
// Result types
// ---------------------------------------------------------------------------

export type GetCartResult = GetCartResponse['data'];
export type AddToCartResult = AddToCartResponse['data'];
export type UpdateCartItemResult = UpdateCartItemResponse['data'];
export type DeleteCartItemResult = DeleteCartItemResponse['data'];

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

export const api = {
  /** GET /cart — fetch the full cart for the current user. */
  async getCart(): Promise<GetCartResult> {
    return unwrapEnvelope<GetCartResult>(await getApiV1Cart());
  },

  /** GET /cart/count — total quantity across the cart (navbar badge). */
  async getCartCount(): Promise<number> {
    const data = unwrapEnvelope<{ count: number }>(await getApiV1CartCount());
    return data.count;
  },

  /** POST /cart — add a single product variant to the cart. */
  async addVariant(variantId: string, quantity: number): Promise<AddToCartResult> {
    return unwrapEnvelope<AddToCartResult>(
      await postApiV1Cart({ body: { variantId, quantity } }),
    );
  },

  /**
   * POST /cart — add a bundle to the cart.
   * `selectedVariants` provides the chosen variant for each bundle component
   * that requires one (and exactly-one choice for each `optionGroup`).
   */
  async addBundle(
    bundleId: string,
    selectedVariants: SelectedVariant[],
    quantity: number,
  ): Promise<AddToCartResult> {
    const body: AddToCartBody = { bundleId, selectedVariants, quantity };
    return unwrapEnvelope<AddToCartResult>(await postApiV1Cart({ body }));
  },

  /** PATCH /cart/{itemId} — update the quantity of a cart item. */
  async updateCartItem(itemId: string, quantity: number): Promise<UpdateCartItemResult> {
    return unwrapEnvelope<UpdateCartItemResult>(
      await patchApiV1CartByItemId({ path: { itemId }, body: { quantity } }),
    );
  },

  /** DELETE /cart/{itemId} — remove a cart item. */
  async removeCartItem(itemId: string): Promise<DeleteCartItemResult> {
    return unwrapEnvelope<DeleteCartItemResult>(
      await deleteApiV1CartByItemId({ path: { itemId } }),
    );
  },
};
