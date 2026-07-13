'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BoxSearchLinear } from 'vuesax-icon-pack';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useAdminTransactions } from '@/domains/admin/admin.hooks';
import type { AdminTransactionStatus } from '@/domains/admin/admin.api';
import { AdminTransactionFilter } from '@/components/admin/admin-transaction-filter';
import type { AdminTransactionFilters } from '@/components/admin/admin-transaction-filter';
import { DashboardTransactionTable } from '@/components/admin/dashboard-transaction-table';

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const geom: React.CSSProperties = { fontFamily: "'Geom', sans-serif" };
const redzone: React.CSSProperties = { fontFamily: "'Redzone', sans-serif" };

// ---------------------------------------------------------------------------
// Default filter state
// ---------------------------------------------------------------------------

const DEFAULT_FILTERS: AdminTransactionFilters = {
  status: [],
  date_from: '',
  date_to: '',
  sort_by: 'created_at',
  sort_order: 'desc',
};

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function AdminTransactionPage() {
  const router = useRouter();

  // Search
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Filters
  const [filters, setFilters] = useState<AdminTransactionFilters>(DEFAULT_FILTERS);

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 10;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filters]);

  // Fetch data
  const { data, isLoading } = useAdminTransactions({
    page,
    limit,
    search: debouncedSearch || undefined,
    status: filters.status.length > 0 ? (filters.status as AdminTransactionStatus[]) : undefined,
    date_from: filters.date_from || undefined,
    date_to: filters.date_to || undefined,
    sort_by: filters.sort_by,
    sort_order: filters.sort_order,
  });

  const transactions = data?.data ?? [];
  const meta = data?.meta;

  // Handlers
  function handleRowClick(orderId: string) {
    router.push(`/admin/dashboard-transaction/${orderId}`);
  }

  function handleFilterApply(newFilters: AdminTransactionFilters) {
    setFilters(newFilters);
  }

  function handleFilterReset() {
    setFilters(DEFAULT_FILTERS);
  }

  // Pagination helpers
  const totalPages = meta?.totalPages ?? 1;
  const total = meta?.total ?? 0;
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <main className="relative z-10 mx-auto max-w-6xl px-4 py-8">
      {/* Title */}
      <h1 className="mb-6" style={{ ...redzone, fontWeight: 900, fontSize: '40px', color: '#7A213D' }}>
        Transactions
      </h1>

      {/* Search + Filter row */}
      <div className="mb-6 flex items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <BoxSearchLinear className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#022C3F]/40" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 w-full rounded-xl border border-[#022C3F]/20 bg-white pr-4 pl-10 text-sm text-[#022C3F] placeholder:text-[#022C3F]/40 focus:border-[#022C3F]/40 focus:outline-none"
            style={geom}
          />
        </div>

        {/* Filter dropdown */}
        <AdminTransactionFilter
          filters={filters}
          onApply={handleFilterApply}
          onReset={handleFilterReset}
        />
      </div>

      {/* Table */}
      <DashboardTransactionTable
        transactions={transactions}
        isLoading={isLoading}
        onRowClick={handleRowClick}
      />

      {/* Pagination */}
      {!isLoading && total > 0 && (
        <div className="mt-6 flex flex-col items-center gap-2">
          <Pagination>
            <PaginationContent>
              {/* First */}
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(1);
                  }}
                  className="rounded-lg text-xs"
                  style={{ ...geom, color: '#133B79' }}
                  aria-disabled={page === 1}
                >
                  &laquo; First
                </PaginationLink>
              </PaginationItem>

              {/* Previous */}
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage((p) => Math.max(1, p - 1));
                  }}
                  className="rounded-lg text-xs"
                  style={{ ...geom, color: '#133B79' }}
                />
              </PaginationItem>

              {/* Page numbers */}
              {generatePageNumbers(page, totalPages).map((p, i) => (
                <PaginationItem key={`${p}-${i}`}>
                  {p === '...' ? (
                    <PaginationEllipsis className="text-[#022C3F]/40" />
                  ) : (
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(p as number);
                      }}
                      isActive={p === page}
                      className="rounded-lg text-xs"
                      style={
                        p === page
                          ? { ...geom, backgroundColor: '#133B79', color: '#FFF' }
                          : { ...geom, color: '#133B79' }
                      }
                    >
                      {p}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              {/* Next */}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage((p) => Math.min(totalPages, p + 1));
                  }}
                  className="rounded-lg text-xs"
                  style={{ ...geom, color: '#133B79' }}
                />
              </PaginationItem>

              {/* Last */}
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(totalPages);
                  }}
                  className="rounded-lg text-xs"
                  style={{ ...geom, color: '#133B79' }}
                  aria-disabled={page === totalPages}
                >
                  Last &raquo;
                </PaginationLink>
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          {/* Result count */}
          <p className="text-xs text-[#022C3F]/50" style={geom}>
            {from}-{to} of {total.toLocaleString('id-ID')}
          </p>
        </div>
      )}
    </main>
  );
}

// ---------------------------------------------------------------------------
// Pagination page number generator
// ---------------------------------------------------------------------------

function generatePageNumbers(current: number, totalPages: number): (number | string)[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | string)[] = [];

  // Always show first page
  pages.push(1);

  if (current > 3) {
    pages.push('...');
  }

  // Pages around current
  const start = Math.max(2, current - 1);
  const end = Math.min(totalPages - 1, current + 1);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < totalPages - 2) {
    pages.push('...');
  }

  // Always show last page
  pages.push(totalPages);

  return pages;
}
