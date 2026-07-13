'use client';

import { useEffect, useRef, useState } from 'react';


import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import type { AdminTransactionStatus } from '@/domains/admin/admin.api';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AdminTransactionFilters {
  status: AdminTransactionStatus[];
  date_from: string;
  date_to: string;
  sort_by: 'created_at' | 'paid_at';
  sort_order: 'asc' | 'desc';
}

interface AdminTransactionFilterProps {
  filters: AdminTransactionFilters;
  onApply: (filters: AdminTransactionFilters) => void;
  onReset: () => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STATUS_OPTIONS: { value: AdminTransactionStatus; label: string }[] = [
  { value: 'belum_bayar', label: 'Belum Bayar' },
  { value: 'lunas', label: 'Lunas' },
  { value: 'diterima', label: 'Diterima' },
  { value: 'expired', label: 'Kadaluarsa' },
];

const SORT_FIELD_OPTIONS: { value: 'created_at' | 'paid_at'; label: string }[] = [
  { value: 'created_at', label: 'Tanggal Pembuatan' },
  { value: 'paid_at', label: 'Tanggal Pelunasan' },
];

const SORT_ORDER_OPTIONS: { value: 'asc' | 'desc'; label: string }[] = [
  { value: 'desc', label: 'Terbaru' },
  { value: 'asc', label: 'Terlama' },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function countActiveFilters(filters: AdminTransactionFilters): number {
  let count = 0;
  if (filters.status.length > 0) count++;
  if (filters.date_from) count++;
  if (filters.date_to) count++;
  if (filters.sort_by !== 'created_at') count++;
  if (filters.sort_order !== 'desc') count++;
  return count;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AdminTransactionFilter({
  filters,
  onApply,
  onReset,
}: AdminTransactionFilterProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Local draft state — only committed on "Terapkan"
  const [draft, setDraft] = useState<AdminTransactionFilters>({ ...filters });

  // Sync draft when external filters change
  useEffect(() => {
    setDraft({ ...filters });
  }, [filters]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setDraft({ ...filters }); // reset draft on close
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, filters]);

  const activeCount = countActiveFilters(filters);

  function toggleStatus(status: AdminTransactionStatus) {
    setDraft((prev) => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter((s) => s !== status)
        : [...prev.status, status],
    }));
  }

  function handleApply() {
    onApply(draft);
    setOpen(false);
  }

  function handleReset() {
    const empty: AdminTransactionFilters = {
      status: [],
      date_from: '',
      date_to: '',
      sort_by: 'created_at',
      sort_order: 'desc',
    };
    setDraft(empty);
    onApply(empty);
    onReset();
    setOpen(false);
  }

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-12 min-w-[120px] items-center justify-center gap-2 rounded-xl border border-[#022C3F]/20 bg-white px-4 text-sm font-semibold text-[#022C3F] transition-colors hover:bg-gray-50"
        style={{ fontFamily: "'Geom', sans-serif" }}
      >
        Filter
        {activeCount > 0 && (
          <span
            className="flex size-5 items-center justify-center rounded-full text-[11px] font-bold text-white"
            style={{ backgroundColor: '#7A213D' }}
          >
            {activeCount}
          </span>
        )}

      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          ref={panelRef}
          className="absolute right-0 top-full z-50 mt-2 w-[320px] rounded-xl border border-[#022C3F]/10 bg-white p-5 shadow-lg"
          style={{ fontFamily: "'Geom', sans-serif" }}
        >
          {/* Status */}
          <div className="mb-4">
            <p className="mb-2 text-sm font-bold text-[#022C3F]">Status</p>
            <div className="flex flex-col gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className="flex cursor-pointer items-center gap-2 text-sm text-[#022C3F]"
                >
                  <Checkbox
                    checked={draft.status.includes(opt.value)}
                    onCheckedChange={() => toggleStatus(opt.value)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {/* Date range */}
          <div className="mb-4">
            <p className="mb-2 text-sm font-bold text-[#022C3F]">Tanggal</p>
            <div className="flex gap-2">
              <div className="flex-1">
                <p className="mb-1 text-xs text-[#022C3F]/60">Dari</p>
                <input
                  type="date"
                  value={draft.date_from}
                  onChange={(e) =>
                    setDraft((prev) => ({ ...prev, date_from: e.target.value }))
                  }
                  className="h-9 w-full rounded-lg border border-[#022C3F]/20 px-2 text-sm text-[#022C3F] focus:border-[#022C3F]/40 focus:outline-none"
                />
              </div>
              <div className="flex-1">
                <p className="mb-1 text-xs text-[#022C3F]/60">Sampai</p>
                <input
                  type="date"
                  value={draft.date_to}
                  onChange={(e) =>
                    setDraft((prev) => ({ ...prev, date_to: e.target.value }))
                  }
                  className="h-9 w-full rounded-lg border border-[#022C3F]/20 px-2 text-sm text-[#022C3F] focus:border-[#022C3F]/40 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Sort */}
          <div className="mb-5">
            <p className="mb-2 text-sm font-bold text-[#022C3F]">Urutkan</p>
            <div className="flex gap-2">
              <select
                value={draft.sort_by}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    sort_by: e.target.value as AdminTransactionFilters['sort_by'],
                  }))
                }
                className="h-9 flex-1 rounded-lg border border-[#022C3F]/20 px-2 text-sm text-[#022C3F] focus:border-[#022C3F]/40 focus:outline-none"
              >
                {SORT_FIELD_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <select
                value={draft.sort_order}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    sort_order: e.target.value as AdminTransactionFilters['sort_order'],
                  }))
                }
                className="h-9 flex-1 rounded-lg border border-[#022C3F]/20 px-2 text-sm text-[#022C3F] focus:border-[#022C3F]/40 focus:outline-none"
              >
                {SORT_ORDER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleReset}
              className="h-9 flex-1 text-sm font-semibold"
            >
              Reset
            </Button>
            <Button
              onClick={handleApply}
              className="h-9 flex-1 text-sm font-semibold"
              style={{ backgroundColor: '#133B79', color: '#F9F6F3' }}
            >
              Terapkan
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
