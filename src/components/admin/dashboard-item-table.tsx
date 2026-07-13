"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useDashboardItems } from "@/domains/admin/admin.hooks";
import { PAGE_SIZE, type DashboardItem } from "@/domains/admin/dashboard-item.types";

export interface DashboardItemTableProps {
  search?: string;
  faculty?: string;
  category?: string;
  pageSize?: number;
  emptyLabel?: string;
}

function formatRupiah(value: number) {
  return `Rp${value.toLocaleString("id-ID")}`;
}

function totalTerjual(item: DashboardItem) {
  return item.variants.reduce((sum, v) => sum + v.terjual, 0);
}

const navButtonClass = "rounded-sm bg-[#38578D] px-3 py-3 text-sm font-medium text-white disabled:opacity-40";

const pageNumberButtonClass =
  "flex py-3 w-10 shrink-0 items-center justify-center rounded-sm bg-[#7A94D4] text-sm font-medium text-white transition hover:brightness-95";

const activePageNumberButtonClass =
  "flex py-3 w-10 shrink-0 items-center justify-center rounded-sm bg-white text-sm font-semibold text-[#133B79] ring-1 ring-[#133B79]/30";

type PageToken = number | "ellipsis";

/**
 * Builds a compact page list like [1, 2, 3, "ellipsis", 8, 9] so we never
 * render a full run of buttons for large result sets. Always keeps the
 * first page, the last page, and a window of `delta` pages around the
 * current one.
 */
function getPageNumbers(current: number, total: number, delta = 1): PageToken[] {
  const pages: PageToken[] = [];
  const windowStart = Math.max(2, current - delta);
  const windowEnd = Math.min(total - 1, current + delta);

  pages.push(1);
  if (windowStart > 2) pages.push("ellipsis");
  for (let i = windowStart; i <= windowEnd; i++) pages.push(i);
  if (windowEnd < total - 1) pages.push("ellipsis");
  if (total > 1) pages.push(total);

  return pages;
}

function EmptyState({ emptyLabel }: { emptyLabel: string }) {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-3 px-6 py-14 text-center sm:py-20">
      <Image
        src="/search-not-found.webp"
        alt=""
        width={240}
        height={180}
        aria-hidden
        className="h-auto w-48 sm:w-56"
      />
      <p className="font-['Redzone',sans-serif] text-2xl text-[#133B79] sm:text-3xl">No Result Found</p>
      <p className="text-sm text-[#0B1F3A]/60">{emptyLabel}</p>
    </div>
  );
}

export function DashboardItemTable({
  search = "",
  faculty,
  category,
  pageSize = PAGE_SIZE,
  emptyLabel = "We couldn't find what you searched for. Try searching again.",
}: DashboardItemTableProps) {
  const [page, setPage] = useState(1);

  // Jump back to page 1 whenever the search query or any filter changes
  // so we don't end up stranded on a page that no longer has matching rows.
  useEffect(() => {
    setPage(1);
  }, [search, faculty, category]);

  const { items, totalRows, isLoading, isFetching } = useDashboardItems({
    search,
    faculty,
    category,
    page,
    pageSize,
  });

  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const rangeStart = totalRows === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, totalRows);

  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <div>
      {/* Desktop / tablet: single table with a rowspan'd item column */}
      <div className="hidden w-full overflow-hidden rounded-2xl border border-white bg-white/90 shadow-sm md:block">
        {!isLoading && items.length === 0 ? (
          <EmptyState emptyLabel={emptyLabel} />
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="bg-[#133B79] font-['Redzone',sans-serif] text-sm tracking-wide text-white">
                <th scope="col" className="px-6 py-4 font-medium">
                  Item
                </th>
                <th scope="col" className="px-6 py-4 font-medium">
                  Varian
                </th>
                <th scope="col" className="px-6 py-4 font-medium">
                  Terjual
                </th>
                <th scope="col" className="px-6 py-4 font-medium">
                  Pendapatan
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading &&
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={`skeleton-${i}`} className="border-b border-white">
                    <td className="px-6 py-4" colSpan={4}>
                      <div className="h-4 w-full animate-pulse rounded bg-[#0F2A4A]/10" />
                    </td>
                  </tr>
                ))}

              {!isLoading &&
                items.map((item) =>
                  item.variants.map((variant, variantIndex) => {
                    const isFirstRow = variantIndex === 0;
                    return (
                      <tr key={variant.id} className="border-b border-white last:border-b-0">
                        {isFirstRow && (
                          <td rowSpan={item.variants.length} className="align-middle bg-[#D2E1F3] px-6 py-4">
                            <div className="flex items-start gap-3">
                              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-[#0B1F3A]">
                                {item.imageUrl && (
                                  <Image
                                    src={item.imageUrl}
                                    alt={item.name}
                                    fill
                                    sizes="44px"
                                    className="object-cover"
                                  />
                                )}
                              </div>
                              <div>
                                <p className="font-semibold text-[#0B1F3A]">{item.name}</p>
                                <p className="text-xs text-[#0B1F3A]">
                                  {item.variants.length} Varian &middot; {totalTerjual(item)} Terjual
                                </p>
                              </div>
                            </div>
                          </td>
                        )}
                        <td className="px-6 py-4 text-sm text-[#022C3F] bg-[#E6EFF9]">{variant.varian}</td>
                        <td className="px-6 py-4 text-sm text-[#022C3F] bg-[#E6EFF9]">{variant.terjual}</td>
                        <td className="px-6 py-4 text-sm font-medium text-[#022C3F] bg-[#E6EFF9]">
                          {formatRupiah(variant.pendapatan)}
                        </td>
                      </tr>
                    );
                  }),
                )}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {/* Mobile: one stacked card per item, each with its own mini variant table */}
      <div className="flex flex-col gap-4 md:hidden">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={`skeleton-mobile-${i}`}
              className="h-24 w-full animate-pulse rounded-2xl border border-white bg-white/70"
            />
          ))}

        {!isLoading && items.length === 0 && (
          <div className="w-full overflow-hidden rounded-2xl border border-white bg-white/90 shadow-sm">
            <EmptyState emptyLabel={emptyLabel} />
          </div>
        )}

        {!isLoading &&
          items.map((item) => (
            <div key={item.id} className="w-full overflow-hidden rounded-lg sm:rounded-2xl border border-white shadow-sm">
              <div className="bg-[#133B79] px-4 py-2.5 text-sm tracking-wide text-white sm:text-base">
                Item
              </div>

              <div className="flex items-start gap-3 bg-[#D2E1F3] px-4 py-3">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-[#0B1F3A]">
                  {item.imageUrl && (
                    <Image src={item.imageUrl} alt={item.name} fill sizes="44px" className="object-cover" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-[#0B1F3A]">{item.name}</p>
                  <p className="text-xs text-[#0B1F3A]">
                    {item.variants.length} Varian &middot; {totalTerjual(item)} Terjual
                  </p>
                </div>
              </div>

              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-[#38578D] text-xs text-white">
                    <th scope="col" className="px-4 py-2 font-medium">
                      Varian
                    </th>
                    <th scope="col" className="px-4 py-2 font-medium">
                      Terjual
                    </th>
                    <th scope="col" className="px-4 py-2 font-medium">
                      Pendapatan
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {item.variants.map((variant) => (
                    <tr key={variant.id} className="border-t border-white bg-[#E6EFF9]">
                      <td className="px-4 py-2 text-xs md:text-sm text-[#022C3F]">{variant.varian}</td>
                      <td className="px-4 py-2 text-xs md:text-sm text-[#022C3F]">{variant.terjual}</td>
                      <td className="px-4 py-2 text-xs md:text-sm font-medium text-[#022C3F]">
                        {formatRupiah(variant.pendapatan)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
      </div>

      <div className="mt-6 flex flex-col items-center gap-3">
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          <button type="button" onClick={() => setPage(1)} disabled={page === 1} className={navButtonClass}>
            &laquo; First
          </button>
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={navButtonClass}
          >
            &lsaquo; Back
          </button>

          {pageNumbers.map((token, idx) =>
            token === "ellipsis" ? (
              <span key={`ellipsis-${idx}`} className="px-1 text-sm text-[#0B1F3A]/40">
                &hellip;
              </span>
            ) : (
              <button
                key={token}
                type="button"
                onClick={() => setPage(token)}
                aria-current={token === page ? "page" : undefined}
                className={token === page ? activePageNumberButtonClass : pageNumberButtonClass}
              >
                {token}
              </button>
            ),
          )}

          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={navButtonClass}
          >
            Next &rsaquo;
          </button>
          <button
            type="button"
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
            className={navButtonClass}
          >
            Last &raquo;
          </button>
        </div>

        <p className="w-full text-center text-sm text-[#0B1F3A]/60">
          {rangeStart}-{rangeEnd} of {totalRows.toLocaleString("id-ID")}
          {isFetching && !isLoading && <span className="ml-2 text-[#0B1F3A]/40">Memuat...</span>}
        </p>
      </div>
    </div>
  );
}