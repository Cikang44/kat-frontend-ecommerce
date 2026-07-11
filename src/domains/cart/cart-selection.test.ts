import { describe, it, expect } from 'vitest';

import type { CartItem } from '@/api/types.gen';
import {
  selectedSubtotal,
  selectedItemIds,
  selectedCount,
  isAllSelected,
  toggleSelection,
  setAllSelection,
  cartItemTitle,
  cartItemVariantLabel,
} from './cart-selection';

function variantItem(id: string, subtotal: number, over: Partial<CartItem> = {}): CartItem {
  return {
    id,
    quantity: 1,
    unitPrice: subtotal,
    subtotal,
    itemType: 'variant',
    variant: {
      id: 'v-' + id,
      sleeveType: 'none',
      color: 'Hitam',
      size: 'M',
      priceModifier: 0,
      stock: 10,
      sku: 'SKU',
    },
    product: {
      id: 'p-' + id,
      name: 'Kaos ' + id,
      description: '',
      basePrice: subtotal,
      type: 'merchandise',
      category: 'baju',
      imageUrl: '',
    },
    bundle: undefined as unknown as CartItem['bundle'],
    createdAt: '',
    updatedAt: '',
    ...over,
  } as CartItem;
}

function bundleItem(id: string, subtotal: number): CartItem {
  return {
    ...variantItem(id, subtotal),
    itemType: 'bundle',
    bundle: { id: 'b-' + id, name: 'Paket ' + id, description: '', type: 'merchandise_bundle', items: [] },
  } as CartItem;
}

describe('cart-selection', () => {
  const items = [variantItem('a', 1000), variantItem('b', 2000), bundleItem('c', 5000)];

  it('sums only the selected subtotals', () => {
    expect(selectedSubtotal(items, new Set(['a', 'c']))).toBe(6000);
    expect(selectedSubtotal(items, new Set())).toBe(0);
    expect(selectedSubtotal(items, new Set(['a', 'b', 'c']))).toBe(8000);
  });

  it('returns selected ids and ignores stale ids not in the cart', () => {
    expect(selectedItemIds(items, new Set(['a', 'zzz']))).toEqual(['a']);
    expect(selectedCount(items, new Set(['a', 'b', 'zzz']))).toBe(2);
  });

  it('isAllSelected is true only when every present item is selected', () => {
    expect(isAllSelected(items, new Set(['a', 'b', 'c']))).toBe(true);
    expect(isAllSelected(items, new Set(['a', 'b']))).toBe(false);
    expect(isAllSelected([], new Set())).toBe(false);
  });

  it('toggle / setAll produce new immutable sets', () => {
    const base = new Set(['a']);
    const added = toggleSelection(base, 'b');
    expect([...added].sort()).toEqual(['a', 'b']);
    expect(base.has('b')).toBe(false); // original untouched

    expect([...setAllSelection(items, true)].sort()).toEqual(['a', 'b', 'c']);
    expect(setAllSelection(items, false).size).toBe(0);
  });

  it('titles + variant labels differ for variant vs bundle lines', () => {
    expect(cartItemTitle(items[0])).toBe('Kaos a');
    expect(cartItemTitle(items[2])).toBe('Paket c');
    expect(cartItemVariantLabel(items[0])).toBe('M · Hitam');
    expect(cartItemVariantLabel(items[2])).toBeNull(); // bundle line has no variant label
  });
});
