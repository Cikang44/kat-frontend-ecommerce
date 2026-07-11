/**
 * Product domain — real SDK integration.
 *
 * Replaces the previous mock implementation with calls to the generated SDK.
 * The backend handles filtering, search, and pagination server-side.
 */

import type {
  ProductListItem,
  ProductDetail,
  PaginationMeta,
  BundleListItem,
  BundleDetail,
} from '@/api/types.gen';

import {
  getApiV1Product,
  getApiV1ProductById,
  getApiV1ProductBundles,
  getApiV1ProductBundlesById,
} from '@/api/sdk.gen';

type BundleType =
  | 'merchandise_bundle'
  | 'kit_panitia_bundle'
  | 'kit_panitia_add_on'
  | 'kit_panitia_ala_carte';

// ---------------------------------------------------------------------------
// ApiError  —  mirrors the backend's ErrorResponse shape
// ---------------------------------------------------------------------------

export class ApiError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = 'ApiError';
  }
}

// ---------------------------------------------------------------------------
// Result types
// ---------------------------------------------------------------------------

export interface ProductListResult {
  data: ProductListItem[];
  meta: PaginationMeta;
}

export interface BundleListResult {
  data: BundleListItem[];
  meta: PaginationMeta;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type SdkResult = { data?: unknown; error?: unknown };

function unwrap<T>(response: SdkResult): T {
  const err = response.error;
  if (err == null) return response.data as T;
  if (err instanceof Error) {
    throw new ApiError('NETWORK_ERROR', err.message);
  }
  const e = err as { error?: { code?: string; message?: string }; message?: string };
  throw new ApiError(
    e.error?.code ?? 'UNKNOWN_ERROR',
    e.error?.message ?? e.message ?? 'Terjadi kesalahan',
  );
}

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

export const api = {
  /**
   * Product list — GET /api/v1/product.
   *
   * Filters: type, category, faculty (comma-separated multi), search, page, limit.
   * The backend expects arrays; comma-separated strings are split and converted.
   */
  async list(filters?: {
    type?: string;
    category?: string;
    faculty?: string;
    search?: string;
    page?: string;
    limit?: string;
  }): Promise<ProductListResult> {
    const page = Math.max(1, Number(filters?.page) || 1);
    const limit = Math.min(Math.max(1, Number(filters?.limit) || 20), 50);

    // Convert comma-separated strings → arrays for the backend
    const typeArray = filters?.type
      ? (filters.type.split(',').map((t) => t.trim()) as Array<
          'merchandise' | 'collaboration' | 'kit_panitia'
        >)
      : undefined;
    const categoryArray = filters?.category
      ? (filters.category.split(',').map((c) => c.trim()) as Array<
          'perhiasan' | 'baju' | 'peralatan_tulis' | 'aksesoris'
        >)
      : undefined;
    const facultyArray = filters?.faculty
      ? filters.faculty.split(',').map((f) => f.trim())
      : undefined;

    return unwrap<ProductListResult>(
      await getApiV1Product({
        query: {
          page,
          limit,
          search: filters?.search || undefined,
          type: typeArray,
          category: categoryArray,
          faculty: facultyArray,
        },
      }),
    );
  },

  /**
   * Product detail — GET /api/v1/product/{id}.
   *
   * Extracts the inner `data` from the `{ success, data }` envelope.
   */
  async detail(id: string): Promise<ProductDetail> {
    const response = await getApiV1ProductById({ path: { id } });

    // Error handling (mirrors unwrap)
    const err = response.error;
    if (err != null) {
      if (err instanceof Error) {
        throw new ApiError('NETWORK_ERROR', err.message);
      }
      const e = err as { error?: { code?: string; message?: string }; message?: string };
      throw new ApiError(
        e.error?.code ?? 'UNKNOWN_ERROR',
        e.error?.message ?? e.message ?? 'Terjadi kesalahan',
      );
    }

    // Extract inner data from { success: true; data: ProductDetail }
    const body = response.data as { success: boolean; data: ProductDetail };
    return body.data;
  },

  /**
   * Bundle list — GET /api/v1/product/bundles.
   *
   * Role-aware: bundles targeted at panitia only appear with a panitia/admin token.
   * Filters: type (comma-separated multi), search, page, limit.
   */
  async listBundles(filters?: {
    type?: string;
    search?: string;
    page?: string;
    limit?: string;
  }): Promise<BundleListResult> {
    const page = Math.max(1, Number(filters?.page) || 1);
    const limit = Math.min(Math.max(1, Number(filters?.limit) || 20), 50);

    const typeArray = filters?.type
      ? (filters.type.split(',').map((t) => t.trim()) as BundleType[])
      : undefined;

    const response = await getApiV1ProductBundles({
      query: {
        page,
        limit,
        search: filters?.search || undefined,
        type: typeArray,
      },
    });
    const body = unwrap<{ success: boolean; data: BundleListItem[]; meta: PaginationMeta }>(
      response,
    );
    return { data: body.data, meta: body.meta };
  },

  /**
   * Bundle detail — GET /api/v1/product/bundles/{id}.
   * Returns bundle composition (items + selectable variants per component).
   */
  async bundleDetail(id: string): Promise<BundleDetail> {
    const response = await getApiV1ProductBundlesById({ path: { id } });
    const body = unwrap<{ success: boolean; data: BundleDetail }>(response);
    return body.data;
  },
};
