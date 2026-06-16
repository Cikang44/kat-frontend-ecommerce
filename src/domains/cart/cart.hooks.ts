import { useCartStore } from '@/lib/providers';

import type { CartItem } from './cart.types';

/** All items currently in the cart. */
export function useCartItems(): CartItem[] {
  return useCartStore((s) => s.items);
}

/** Total quantity across every entry (for the navbar badge). */
export function useCartTotalQuantity(): number {
  return useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
}

/** Items that are checked and ready for checkout. */
export function useCheckedItems(): CartItem[] {
  return useCartStore((s) => s.items.filter((i) => i.checked));
}

/** Number of checked items. */
export function useCheckedCount(): number {
  return useCartStore((s) => s.items.filter((i) => i.checked).length);
}

/** Total price of all checked items (unit × quantity). */
export function useCheckedTotalPrice(): number {
  return useCartStore((s) =>
    s.items.filter((i) => i.checked).reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
  );
}

/** Whether every item is checked (for "select all"). */
export function useAllChecked(): boolean {
  return useCartStore((s) => s.items.length > 0 && s.items.every((i) => i.checked));
}

/**
 * Aggregate quantity of a specific product across all its variants.
 * Used by product cards on the Product List page to display the shortcut
 * counter that stays in sync with the cart.
 */
export function useProductCartQuantity(productId: string): number {
  return useCartStore((s) =>
    s.items.filter((i) => i.productId === productId).reduce((sum, i) => sum + i.quantity, 0),
  );
}

/**
 * Aggregate quantity of a specific variant across all matching entries.
 * Useful on the product detail page.
 */
export function useVariantCartQuantity(variantId: string): number {
  return useCartStore((s) =>
    s.items.filter((i) => i.variantId === variantId).reduce((sum, i) => sum + i.quantity, 0),
  );
}
