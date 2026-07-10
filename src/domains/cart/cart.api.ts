/**
 * Cart domain — real SDK integration.
 */

import type {
  GetCartResponse,
  AddToCartResponse,
  UpdateCartItemResponse,
  DeleteCartItemResponse,
} from '@/api/types.gen';
import { getApiV1Cart, postApiV1Cart, patchApiV1CartByItemId, deleteApiV1CartByItemId } from '@/api/sdk.gen';

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

function unwrap<T>(response: SdkResult): T {
  const err = response.error;
  if (err == null) return response.data as T;
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
    return unwrap<GetCartResult>(await getApiV1Cart());
  },

  /** POST /cart — add an item (variant) to the cart. */
  async addToCart(variantId: string, quantity: number): Promise<AddToCartResult> {
    return unwrap<AddToCartResult>(
      await postApiV1Cart({ body: { variantId, quantity } }),
    );
  },

  /** PATCH /cart/{itemId} — update the quantity of a cart item. */
  async updateCartItem(itemId: string, quantity: number): Promise<UpdateCartItemResult> {
    return unwrap<UpdateCartItemResult>(
      await patchApiV1CartByItemId({ path: { itemId }, body: { quantity } }),
    );
  },

  /** DELETE /cart/{itemId} — remove a cart item. */
  async removeCartItem(itemId: string): Promise<DeleteCartItemResult> {
    return unwrap<DeleteCartItemResult>(
      await deleteApiV1CartByItemId({ path: { itemId } }),
    );
  },
};
