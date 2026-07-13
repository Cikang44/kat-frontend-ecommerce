/**
 * Types + pure mappers for the admin item dashboard.
 * Replaces the old mock-data module: the UI keeps consuming `DashboardItem`
 * / `ItemVariantRow`, now fed from the real `AdminProduct` SDK shape.
 */

import type { AdminProduct } from '@/api';

export const PAGE_SIZE = 20;

export type ProductCategory = 'merchandise' | 'collaboration' | 'kit_panitia';

export interface ItemVariantRow {
  id: string;
  varian: string;
  terjual: number;
  pendapatan: number;
}

export interface DashboardItem {
  id: string;
  name: string;
  category: ProductCategory;
  imageUrl?: string;
  variants: ItemVariantRow[];
}

export interface DashboardStats {
  totalProduk: number;
  totalItemTerjual: number;
  totalPendapatan: number;
}

const SLEEVE_LABEL: Record<string, string> = {
  lengan_panjang: 'Lengan Panjang',
  lengan_pendek: 'Lengan Pendek',
};

/** Build a human-readable variant label from a variant's attributes. */
export function composeVariantLabel(variant: {
  color: string | null;
  size: 'S' | 'M' | 'L' | 'XL' | 'XXL' | '3XL' | '4XL' | 'none';
  sleeveType: 'lengan_panjang' | 'lengan_pendek' | 'none';
  sku?: string | null;
}): string {
  const parts: string[] = [];
  if (variant.color) parts.push(variant.color);
  if (variant.size && variant.size !== 'none') parts.push(variant.size);
  if (variant.sleeveType && variant.sleeveType !== 'none') {
    parts.push(SLEEVE_LABEL[variant.sleeveType] ?? variant.sleeveType);
  }
  if (parts.length > 0) return parts.join(' · ');
  return variant.sku ?? 'Default';
}

/** Map a backend `AdminProduct` into the dashboard's `DashboardItem` shape. */
export function mapAdminProductToDashboardItem(product: AdminProduct): DashboardItem {
  return {
    id: product.id,
    name: product.name,
    category: product.type,
    imageUrl: product.primaryImage?.url ?? undefined,
    variants: product.salesStats.variantStats.map((v) => ({
      id: v.variantId,
      varian: composeVariantLabel(v),
      terjual: v.totalSold,
      pendapatan: v.totalRevenue,
    })),
  };
}
