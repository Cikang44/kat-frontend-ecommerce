'use client';

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';

import { useAuthStore } from '@/lib/providers';
import { queryKeys } from '@/lib/query-keys';

import {
  api,
  type AdminHandOverConfirmResult,
  type AdminHandOverScanResult,
  type AdminTransactionDetail,
  type AdminTransactionListParams,
  type AdminTransactionListResult,
} from './admin.api';
import {
  PAGE_SIZE,
  mapAdminProductToDashboardItem,
  type DashboardItem,
} from './dashboard-item.types';

// ---------------------------------------------------------------------------
// Transactions
// ---------------------------------------------------------------------------

/** GET /admin/dashboard/transactions — paginated list with filters. */
export function useAdminTransactions(
  params: AdminTransactionListParams,
): UseQueryResult<AdminTransactionListResult, Error> {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  return useQuery({
    queryKey: queryKeys.admin.transactions(params as Record<string, unknown>),
    queryFn: () => api.listTransactions(params),
    enabled: isLoggedIn,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}

/** GET /admin/dashboard/transactions/{orderId} — single-order admin detail. */
export function useAdminTransactionDetail(
  orderId: string,
): UseQueryResult<AdminTransactionDetail, Error> {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  return useQuery({
    queryKey: queryKeys.admin.transactionDetail(orderId),
    queryFn: () => api.transactionDetail(orderId),
    enabled: isLoggedIn && !!orderId,
    staleTime: 10_000,
  });
}

// ---------------------------------------------------------------------------
// Item dashboard
// ---------------------------------------------------------------------------

/**
 * GET /admin/dashboard/items — mapped into the dashboard's `DashboardItem`
 * rows. Note: the `category` argument carries the product *type* filter (the
 * UI dropdown writes it to the `type` URL param), and `faculty` is a
 * comma-separated string of faculty codes.
 */
export function useDashboardItems({
  search,
  faculty,
  category,
  page = 1,
  pageSize = PAGE_SIZE,
}: {
  search?: string;
  faculty?: string;
  category?: string;
  page?: number;
  pageSize?: number;
}): {
  items: DashboardItem[];
  totalRows: number;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: Error | null;
} {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const facultyList = faculty ? faculty.split(',').filter(Boolean) : undefined;

  const params = {
    page,
    limit: pageSize,
    search: search || undefined,
    type: category as
      | 'merchandise'
      | 'collaboration'
      | 'kit_panitia'
      | undefined,
    faculty: facultyList,
  };

  const query = useQuery({
    queryKey: queryKeys.admin.items(params as Record<string, unknown>),
    queryFn: () => api.listItems(params),
    enabled: isLoggedIn,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

  return {
    items: (query.data?.data ?? []).map(mapAdminProductToDashboardItem),
    totalRows: query.data?.meta?.total ?? 0,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
  };
}

/** GET /admin/dashboard/items/summary — the three stat-card totals. */
export function useDashboardStats(): {
  totalProduk: number;
  totalItemTerjual: number;
  totalPendapatan: number;
  isLoading: boolean;
  isError: boolean;
} {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const query = useQuery({
    queryKey: queryKeys.admin.stats,
    queryFn: () => api.itemsSummary(),
    enabled: isLoggedIn,
    staleTime: 60_000,
  });

  return {
    totalProduk: query.data?.totalProduk ?? 0,
    totalItemTerjual: query.data?.totalItemTerjual ?? 0,
    totalPendapatan: query.data?.totalPendapatan ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

// ---------------------------------------------------------------------------
// Hand-over
// ---------------------------------------------------------------------------

/**
 * POST /admin/hand-over/scan — validate a scanned pickup QR (or manual code)
 * and return the transaction to confirm. Modelled as a query because the
 * endpoint is read-only server-side (it only validates + reads).
 */
export function useHandOverScan(
  qrToken: string,
): UseQueryResult<AdminHandOverScanResult, Error> {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  return useQuery({
    queryKey: queryKeys.admin.handOverScan(qrToken),
    queryFn: () => api.scanHandOver(qrToken),
    enabled: isLoggedIn && !!qrToken,
    retry: false,
    staleTime: 0,
  });
}

/** PATCH /admin/hand-over/confirm/{transactionId} — mark order as received. */
export function useConfirmHandOver(): UseMutationResult<
  AdminHandOverConfirmResult,
  Error,
  string
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (transactionId: string) => api.confirmHandOver(transactionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
    },
  });
}
