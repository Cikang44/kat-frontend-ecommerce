'use client';

import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import type { ProductDetail } from '@/api/types.gen';
import { queryKeys } from '@/lib/query-keys';

import { api, type ProductListResult } from './product.api';

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
