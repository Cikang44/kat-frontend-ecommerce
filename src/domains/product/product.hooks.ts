'use client';

import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import type {
  ProductDetail,
  BundleDetail,
  ProductListItem,
  BundleListItem,
} from '@/api/types.gen';
import { queryKeys } from '@/lib/query-keys';

import { api, type ProductListResult, type BundleListResult } from './product.api';

/**
 * A single card in the unified catalog: either a normal product or a bundle
 * ("paket"). Discriminated by `kind` so the grid + detail page can branch.
 */
export type CatalogItem =
  | { kind: 'product'; product: ProductListItem }
  | { kind: 'bundle'; bundle: BundleListItem };

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/**
 * Product list — matches the single GET /product endpoint.
 *
 * Filters: type, category, faculty (comma-separated multi), search, page, limit.
 */
export function useProducts(filters?: {
  type?: string;
  category?: string;
  faculty?: string;
  search?: string;
  page?: string;
  limit?: string;
}): UseQueryResult<ProductListResult, Error> {
  return useQuery({
    queryKey: queryKeys.products.list('all', filters),
    queryFn: () => api.list(filters),
  });
}

/**
 * Product detail by ID.
 */
export function useProductDetail(id: string | undefined): UseQueryResult<ProductDetail, Error> {
  return useQuery({
    queryKey: queryKeys.products.detail(id ?? ''),
    queryFn: () => api.detail(id!),
    enabled: !!id,
  });
}

/**
 * Bundle list — GET /product/bundles. Role-aware (panitia bundles need token).
 * Filters: type (comma-separated multi), search, page, limit.
 */
export function useBundles(filters?: {
  type?: string;
  search?: string;
  page?: string;
  limit?: string;
}): UseQueryResult<BundleListResult, Error> {
  return useQuery({
    queryKey: queryKeys.products.bundleList(filters),
    queryFn: () => api.listBundles(filters),
  });
}

/**
 * Bundle detail by ID — includes items + selectable variants per component.
 */
export function useBundleDetail(id: string | undefined): UseQueryResult<BundleDetail, Error> {
  return useQuery({
    queryKey: queryKeys.products.bundleDetail(id ?? ''),
    queryFn: () => api.bundleDetail(id!),
    enabled: !!id,
  });
}

/**
 * Unified catalog — merges products and bundles into a single list of
 * {@link CatalogItem}. Bundles ("paket") are shown alongside products.
 *
 * Bundles are hidden when a product-specific filter (category/faculty) is
 * active, since bundles don't carry those dimensions; `search` still applies.
 * Everything fits on one page (≤34 products + ≤40 bundles), so no pagination.
 */
export function useCatalog(filters?: {
  type?: string;
  category?: string;
  faculty?: string;
  search?: string;
}): { items: CatalogItem[]; isLoading: boolean; isError: boolean } {
  const products = useProducts({ ...filters, limit: '50' });

  const showBundles = !filters?.category && !filters?.faculty;
  const bundles = useBundles({ search: filters?.search, limit: '50' });

  const items: CatalogItem[] = [
    ...(showBundles ? (bundles.data?.data ?? []) : []).map(
      (bundle): CatalogItem => ({ kind: 'bundle', bundle }),
    ),
    ...(products.data?.data ?? []).map((product): CatalogItem => ({ kind: 'product', product })),
  ];

  return {
    items,
    isLoading: products.isLoading || (showBundles && bundles.isLoading),
    isError: products.isError || (showBundles && bundles.isError),
  };
}
