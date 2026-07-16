import { describe, it, expect } from 'vitest';

import type { BundleImage } from '@/api/types.gen';

import { selectBundleGalleryImages } from './bundle-images';

function img(over: Partial<BundleImage> & { id: string }): BundleImage {
  return {
    url: `https://cdn/${over.id}.webp`,
    altText: null,
    variantKey: null,
    isPrimary: false,
    sortOrder: 0,
    ...over,
  };
}

describe('selectBundleGalleryImages', () => {
  it('leads with the image matching the division code', () => {
    const images = [
      img({ id: 'primary', isPrimary: true, sortOrder: 0 }),
      img({ id: 'acara', variantKey: 'ACR', sortOrder: 1 }),
      img({ id: 'other', variantKey: 'MED', sortOrder: 2 }),
    ];
    const result = selectBundleGalleryImages(images, 'ACR');
    expect(result[0].id).toBe('acara');
    expect(result).toHaveLength(3);
  });

  it('falls back to the primary image when no division match', () => {
    const images = [
      img({ id: 'gallery', sortOrder: 1 }),
      img({ id: 'primary', isPrimary: true, sortOrder: 2 }),
    ];
    expect(selectBundleGalleryImages(images, 'ACR')[0].id).toBe('primary');
    // No division code at all → same primary-first behaviour.
    expect(selectBundleGalleryImages(images)[0].id).toBe('primary');
  });

  it('falls back to the first (by sortOrder) when nothing is primary', () => {
    const images = [
      img({ id: 'b', sortOrder: 2 }),
      img({ id: 'a', sortOrder: 1 }),
    ];
    expect(selectBundleGalleryImages(images, 'ACR')[0].id).toBe('a');
  });

  it('returns an empty list for empty input', () => {
    expect(selectBundleGalleryImages([], 'ACR')).toEqual([]);
  });
});
