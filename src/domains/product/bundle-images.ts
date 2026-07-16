import type { BundleImage, ProductImage } from '@/api/types.gen';

/**
 * Build the gallery image list for a bundle detail page.
 *
 * Per docs/penyesuaian_2.md: for panitia, the artwork whose `variantKey` matches
 * their division code should lead the gallery; otherwise fall back to the
 * `isPrimary` image, then the first. We surface a full ordered list (division
 * matches first, then the rest by `sortOrder`) and map to the `ProductImage`
 * shape that `ProductImageGallery` consumes. Empty input → empty list (caller
 * renders a placeholder).
 */
export function selectBundleGalleryImages(
  images: BundleImage[],
  divisionCode?: string | null,
): ProductImage[] {
  const bySortOrder = [...images].sort((a, b) => a.sortOrder - b.sortOrder);

  const divisionMatches = divisionCode
    ? bySortOrder.filter((img) => img.variantKey === divisionCode)
    : [];
  const rest = bySortOrder.filter((img) => !divisionMatches.includes(img));

  // When there's no division match, keep the primary image first so it becomes
  // the gallery's default view.
  if (divisionMatches.length === 0) {
    rest.sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));
  }

  return [...divisionMatches, ...rest].map((img) => ({
    id: img.id,
    url: img.url,
    isPrimary: img.isPrimary,
    sortOrder: img.sortOrder,
  }));
}
