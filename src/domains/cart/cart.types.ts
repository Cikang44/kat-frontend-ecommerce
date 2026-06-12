import type { ProductImage } from '@/api/types.gen';

/**
 * A single entry in the shopping cart.
 *
 * Maps to the `cart_items` table in the backend DB, plus client-only
 * fields for UI state (checked, localId).
 *
 * Backend constraints (from `backend-ecommerce/src/database/schema/`):
 * - `cart_items.variant_id` is **NOT NULL** — every entry always references a
 *   variant.  Products without meaningful variations still get a variant row
 *   with `sleeveType: 'none'`, `size: 'none'`, `color: null`.
 * - `cart_items.user_id` is omitted here because the store is scoped to the
 *   current user and the backend infers the user from the auth token.
 */
export interface CartItem {
  /** Client-side unique identifier for optimistic UI updates. */
  localId: string;

  /**
   * Backend `cart_items.id` (uuid).
   * Set only after the item has been persisted on the server.
   * `undefined` for items that exist only in the local store.
   */
  serverId?: string;

  /** Product ID — reachable via `variant → product` in the DB. */
  productId: string;

  /** Denormalized product name (cached at add-to-cart time). */
  productName: string;

  /** Primary product image metadata. */
  productImage: ProductImage;

  /** Base price of the product (before variant modifier). */
  basePrice: number;

  /** Product type — affects visibility by user role. */
  productType: 'merchandise' | 'collaboration' | 'kit_panitia';

  /** Variant ID */
  variantId: string;

  sleeveType: 'lengan_panjang' | 'lengan_pendek' | 'none';

  /** Nullable in the DB (`text('color')`). */
  color: string | null;

  size: 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'none';

  /** Price modifier from the selected variant. */
  priceModifier: number;

  /** Current stock of the selected variant. */
  stock: number;

  // ── Derived / client-only ──────────────────────────────────────────────

  /** Final unit price = basePrice + priceModifier. */
  unitPrice: number;

  /** Quantity in cart. */
  quantity: number;

  /** Selected for partial checkout (client-only, not persisted to DB). */
  checked: boolean;
}
