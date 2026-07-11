import { describe, it, expect } from 'vitest';

import {
  buildGroups,
  buildSelectedVariants,
  getMandatoryItems,
  isBundleSelectionValid,
  type BundleItem,
} from './bundle-selection';

// Mirrors the real "OOTD TIME" bundle from the Neon DB:
//  - Kaos: mandatory, 2 variants (choose size)
//  - Enamel Fakultas / Enamel Karakter: choose exactly one (optionGroup 'enamel_choice')
function ootdItems(): BundleItem[] {
  const variant = (id: string, size: string) =>
    ({ id, sleeveType: 'none', color: null, size, priceModifier: 0, stock: 100, sku: id, finalPrice: 0 }) as unknown as BundleItem['variants'][number];

  return [
    {
      productId: 'kaos',
      productName: 'Kaos',
      quantity: 1,
      isOptional: false,
      optionGroup: '',
      variants: [variant('kaos-M', 'M'), variant('kaos-L', 'L')],
    },
    {
      productId: 'enamel-fak',
      productName: 'Enamel Fakultas',
      quantity: 1,
      isOptional: true,
      optionGroup: 'enamel_choice',
      variants: [variant('enamel-fak-v', 'none')],
    },
    {
      productId: 'enamel-kar',
      productName: 'Enamel Karakter',
      quantity: 1,
      isOptional: true,
      optionGroup: 'enamel_choice',
      variants: [variant('enamel-kar-v', 'none')],
    },
  ] as unknown as BundleItem[];
}

describe('bundle-selection', () => {
  it('separates mandatory items from option-group items', () => {
    const items = ootdItems();
    expect(getMandatoryItems(items).map((i) => i.productId)).toEqual(['kaos']);
    const groups = buildGroups(items);
    expect([...groups.keys()]).toEqual(['enamel_choice']);
    expect(groups.get('enamel_choice')).toHaveLength(2);
  });

  it('builds selectedVariants = mandatory choice + the ONE chosen option', () => {
    const items = ootdItems();
    const variantByProduct = { kaos: 'kaos-L', 'enamel-fak': 'enamel-fak-v' };
    const groupChoice = { enamel_choice: 'enamel-fak' };

    const selected = buildSelectedVariants(items, variantByProduct, groupChoice);

    expect(selected).toEqual([
      { productId: 'kaos', variantId: 'kaos-L', quantity: 1 },
      { productId: 'enamel-fak', variantId: 'enamel-fak-v', quantity: 1 },
    ]);
    // The non-chosen option (Enamel Karakter) must NOT be included.
    expect(selected.find((s) => s.productId === 'enamel-kar')).toBeUndefined();
  });

  it('switching the option group swaps which product is sent', () => {
    const items = ootdItems();
    const selected = buildSelectedVariants(
      items,
      { kaos: 'kaos-M', 'enamel-kar': 'enamel-kar-v' },
      { enamel_choice: 'enamel-kar' },
    );
    expect(selected.map((s) => s.productId)).toEqual(['kaos', 'enamel-kar']);
  });

  it('is invalid until the mandatory variant AND the option group are resolved', () => {
    const items = ootdItems();
    // Nothing chosen for the group yet
    expect(isBundleSelectionValid(items, { kaos: 'kaos-M' }, {})).toBe(false);
    // Group chosen but its variant missing
    expect(isBundleSelectionValid(items, { kaos: 'kaos-M' }, { enamel_choice: 'enamel-fak' })).toBe(
      false,
    );
    // Fully resolved
    expect(
      isBundleSelectionValid(
        items,
        { kaos: 'kaos-M', 'enamel-fak': 'enamel-fak-v' },
        { enamel_choice: 'enamel-fak' },
      ),
    ).toBe(true);
  });
});
