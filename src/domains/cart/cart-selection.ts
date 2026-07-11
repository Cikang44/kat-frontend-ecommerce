/**
 * Pure helpers for the cart page's partial-checkout selection.
 *
 * The backend cart is the source of truth (items come from `GET /cart`).
 * "Which items are checked" is ephemeral UI state (the backend doesn't track
 * it), so it lives as a `Set<cartItemId>` in the page and is derived here.
 */
import type { CartItem } from '@/api/types.gen';

/** Sum the subtotal of the currently-selected cart items. */
export function selectedSubtotal(items: CartItem[], selected: Set<string>): number {
  return items.reduce((sum, it) => (selected.has(it.id) ? sum + it.subtotal : sum), 0);
}

/** Selected cart-item ids that still exist in the cart (guards against stale ids). */
export function selectedItemIds(items: CartItem[], selected: Set<string>): string[] {
  return items.filter((it) => selected.has(it.id)).map((it) => it.id);
}

/** Number of selected items still present in the cart. */
export function selectedCount(items: CartItem[], selected: Set<string>): number {
  return selectedItemIds(items, selected).length;
}

/** True when there is at least one item and every item is selected. */
export function isAllSelected(items: CartItem[], selected: Set<string>): boolean {
  return items.length > 0 && items.every((it) => selected.has(it.id));
}

/** Toggle a single id, returning a NEW set (immutable for React state). */
export function toggleSelection(selected: Set<string>, id: string): Set<string> {
  const next = new Set(selected);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
}

/** Select all / none, returning a NEW set. */
export function setAllSelection(items: CartItem[], all: boolean): Set<string> {
  return all ? new Set(items.map((it) => it.id)) : new Set();
}

/** Human-readable title for a cart line (bundle name or product name). */
export function cartItemTitle(item: CartItem): string {
  return item.itemType === 'bundle' ? item.bundle.name : item.product.name;
}

/** Compact variant label for a variant cart line (size · color · sleeve), or null. */
export function cartItemVariantLabel(item: CartItem): string | null {
  if (item.itemType !== 'variant') return null;
  const v = item.variant;
  const parts: string[] = [];
  if (v.sleeveType && v.sleeveType !== 'none') parts.push(v.sleeveType.replace(/_/g, ' '));
  if (v.size && v.size !== 'none') parts.push(v.size);
  if (v.color) parts.push(v.color);
  return parts.join(' · ') || null;
}
