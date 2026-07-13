/**
 * Admin API layer — calls the generated SDK against the real backend.
 * Covers: transaction dashboard + detail, item dashboard + summary, hand-over.
 */

import type {
  AdminItemsSummaryResponse,
  AdminOrderDetailResponse,
  AdminProduct,
  AdminHandOverScanResponse,
  AdminHandOverConfirmResponse,
  AdminTransaction,
  PaginationMeta,
} from '@/api';

import {
  getApiV1AdminDashboardItems,
  getApiV1AdminDashboardItemsSummary,
  getApiV1AdminDashboardTransactions,
  getApiV1AdminDashboardTransactionsByOrderId,
  patchApiV1AdminHandOverConfirmByTransactionId,
  postApiV1AdminHandOverScan,
} from '@/api/sdk.gen';

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
// Types
// ---------------------------------------------------------------------------

export type AdminTransactionStatus = 'belum_bayar' | 'lunas' | 'diterima' | 'expired';

export interface AdminTransactionListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: AdminTransactionStatus[];
  date_from?: string;
  date_to?: string;
  sort_by?: 'created_at' | 'paid_at';
  sort_order?: 'asc' | 'desc';
}

export interface AdminTransactionListResult {
  data: AdminTransaction[];
  meta: PaginationMeta;
}

export type AdminTransactionDetail = AdminOrderDetailResponse['data'];

export interface AdminItemListParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: 'merchandise' | 'collaboration' | 'kit_panitia';
  category?: 'perhiasan' | 'baju' | 'peralatan_tulis' | 'aksesoris' | 'bundle';
  faculty?: string[];
  sortBy?: 'name' | 'totalSold' | 'totalRevenue' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface AdminItemListResult {
  data: AdminProduct[];
  meta: PaginationMeta;
}

export type AdminItemsSummary = AdminItemsSummaryResponse['data'];
export type AdminHandOverScanResult = AdminHandOverScanResponse['data'];
export type AdminHandOverConfirmResult = AdminHandOverConfirmResponse['data'];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type SdkResult = { data?: unknown; error?: unknown };

/** Unwrap the backend's `{ success, data }` envelope into just the payload. */
function unwrap<T>(response: SdkResult): T {
  const err = response.error;
  if (err == null) {
    const body = response.data as { success: boolean; data: T };
    return body.data;
  }
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
  /** GET /admin/dashboard/transactions */
  async listTransactions(
    params: AdminTransactionListParams,
  ): Promise<AdminTransactionListResult> {
    const query: Record<string, unknown> = {};
    if (params.page != null) query.page = params.page;
    if (params.limit != null) query.limit = params.limit;
    if (params.search) query.search = params.search;
    if (params.status && params.status.length > 0) query.status = params.status;
    if (params.date_from) query.date_from = params.date_from;
    if (params.date_to) query.date_to = params.date_to;
    if (params.sort_by) query.sort_by = params.sort_by;
    if (params.sort_order) query.sort_order = params.sort_order;

    return unwrap<AdminTransactionListResult>(
      await getApiV1AdminDashboardTransactions({ query }),
    );
  },

  /** GET /admin/dashboard/transactions/{orderId} */
  async transactionDetail(orderId: string): Promise<AdminTransactionDetail> {
    return unwrap<AdminTransactionDetail>(
      await getApiV1AdminDashboardTransactionsByOrderId({ path: { orderId } }),
    );
  },

  /** GET /admin/dashboard/items */
  async listItems(params: AdminItemListParams): Promise<AdminItemListResult> {
    const query: Record<string, unknown> = {};
    if (params.page != null) query.page = params.page;
    if (params.limit != null) query.limit = params.limit;
    if (params.search) query.search = params.search;
    if (params.type) query.type = params.type;
    if (params.category) query.category = params.category;
    if (params.faculty && params.faculty.length > 0) query.faculty = params.faculty;
    if (params.sortBy) query.sortBy = params.sortBy;
    if (params.sortOrder) query.sortOrder = params.sortOrder;

    return unwrap<AdminItemListResult>(
      await getApiV1AdminDashboardItems({ query }),
    );
  },

  /** GET /admin/dashboard/items/summary */
  async itemsSummary(): Promise<AdminItemsSummary> {
    return unwrap<AdminItemsSummary>(await getApiV1AdminDashboardItemsSummary());
  },

  /** POST /admin/hand-over/scan — validate a pickup QR and get the transaction. */
  async scanHandOver(qrToken: string): Promise<AdminHandOverScanResult> {
    return unwrap<AdminHandOverScanResult>(
      await postApiV1AdminHandOverScan({ body: { qrToken } }),
    );
  },

  /** PATCH /admin/hand-over/confirm/{transactionId} — mark order as received. */
  async confirmHandOver(transactionId: string): Promise<AdminHandOverConfirmResult> {
    return unwrap<AdminHandOverConfirmResult>(
      await patchApiV1AdminHandOverConfirmByTransactionId({
        path: { transactionId },
      }),
    );
  },
};
