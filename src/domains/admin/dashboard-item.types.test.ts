import { describe, it, expect } from 'vitest';

import { composeVariantLabel, mapAdminProductToDashboardItem } from './dashboard-item.types';
import type { AdminProduct } from '@/api';

describe('composeVariantLabel', () => {
  it('joins color, size, and sleeve into a readable label', () => {
    expect(
      composeVariantLabel({ color: 'Merah', size: 'M', sleeveType: 'lengan_pendek' }),
    ).toBe('Merah · M · Lengan Pendek');
  });

  it('omits "none" size/sleeve and null color', () => {
    expect(
      composeVariantLabel({ color: null, size: 'none', sleeveType: 'none', sku: 'SKU-1' }),
    ).toBe('SKU-1');
    expect(composeVariantLabel({ color: 'Biru', size: 'none', sleeveType: 'none' })).toBe('Biru');
  });
});

describe('mapAdminProductToDashboardItem', () => {
  it('maps an AdminProduct into the dashboard item shape', () => {
    const product = {
      id: 'p1',
      name: 'Kaos OSKM',
      type: 'merchandise',
      category: 'baju',
      primaryImage: { id: 'img1', url: 'http://x/img.webp', isPrimary: true, sortOrder: 0 },
      salesStats: {
        totalSold: 5,
        totalRevenue: 600000,
        variantStats: [
          {
            variantId: 'v1',
            sleeveType: 'lengan_pendek',
            color: 'Putih',
            size: 'M',
            sku: 'K-W-M',
            unitPrice: 120000,
            totalSold: 5,
            totalRevenue: 600000,
          },
        ],
      },
    } as unknown as AdminProduct;

    const item = mapAdminProductToDashboardItem(product);
    expect(item).toEqual({
      id: 'p1',
      name: 'Kaos OSKM',
      category: 'merchandise',
      imageUrl: 'http://x/img.webp',
      variants: [{ id: 'v1', varian: 'Putih · M · Lengan Pendek', terjual: 5, pendapatan: 600000 }],
    });
  });

  it('falls back to undefined image when there is no primary image', () => {
    const product = {
      id: 'p2',
      name: 'Tumbler',
      type: 'merchandise',
      category: 'aksesoris',
      primaryImage: null,
      salesStats: { totalSold: 0, totalRevenue: 0, variantStats: [] },
    } as unknown as AdminProduct;

    expect(mapAdminProductToDashboardItem(product).imageUrl).toBeUndefined();
  });
});
