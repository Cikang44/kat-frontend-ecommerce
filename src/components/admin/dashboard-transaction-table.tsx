'use client';

import { ArrowRightLinear } from 'vuesax-icon-pack';

import { Spinner } from '@/components/ui/spinner';
import type { AdminTransaction } from '@/api';

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const geom: React.CSSProperties = { fontFamily: "'Geom', sans-serif" };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fmtRp(n: number) {
  return 'Rp' + n.toLocaleString('id-ID');
}

function fmtDate(iso: string) {
  if (!iso) return '-';
  return (
    new Date(iso).toLocaleString('en-EN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }) + ' WIB'
  );
}

// ---------------------------------------------------------------------------
// Status badge
// ---------------------------------------------------------------------------

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string }
> = {
  belum_bayar: { label: 'Belum Bayar', color: '#7A213D' },
  lunas: { label: 'Lunas', color: '#169A87' },
  diterima: { label: 'Diterima', color: '#133B79' },
  expired: { label: 'Kadaluarsa', color: '#555555' },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status.toUpperCase(), color: '#555555' };

  return (
    <span
      className="inline-flex items-center gap-1 rounded-[8px] px-4 py-1.5 text-sm font-bold whitespace-nowrap"
      style={{
        ...geom,
        backgroundColor: cfg.color,
        color: '#F1F7FC',
      }}
    >
      {cfg.label}
      {/* Chevron icon */}
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </span>
  );
}

// ---------------------------------------------------------------------------
// Table props
// ---------------------------------------------------------------------------

interface DashboardTransactionTableProps {
  transactions: AdminTransaction[];
  isLoading: boolean;
  onRowClick: (orderId: string) => void;
}

// ---------------------------------------------------------------------------
// Table component
// ---------------------------------------------------------------------------

export function DashboardTransactionTable({
  transactions,
  isLoading,
  onRowClick,
}: DashboardTransactionTableProps) {
  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Spinner className="size-6 text-[#133B79]" />
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div
        className="flex min-h-[300px] items-center justify-center rounded-2xl border border-[#022C3F]/10 bg-white"
        style={geom}
      >
        <p className="text-sm text-[#022C3F]/40">Tidak ada transaksi ditemukan</p>
      </div>
    );
  }

  return (
    <div
      className="overflow-x-auto rounded-2xl border border-[#022C3F]/10 bg-white"
      style={geom}
    >
      <table className="w-full border-collapse text-sm">
        {/* Header */}
        <thead>
          <tr style={{ backgroundColor: '#133B79' }}>
            {[
              { label: 'Transaction ID', width: '160px' },
              { label: 'Nama', width: undefined },
              { label: 'Item', width: '60px' },
              { label: 'Total Harga', width: '120px' },
              { label: 'Status', width: '150px' },
              { label: 'Tanggal Pelunasan', width: '210px' },
              { label: 'Aksi', width: '60px' },
            ].map((col) => (
              <th
                key={col.label}
                className="px-4 py-3 text-left text-sm font-bold"
                style={{
                  ...geom,
                  color: '#FFF3B8',
                  width: col.width,
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {transactions.map((tx) => (
            <tr
              key={tx.orderId}
              className="cursor-pointer border-b border-[#022C3F]/5 transition-colors hover:bg-[#E6EFF9]"
              onClick={() => onRowClick(tx.orderId)}
            >
              {/* Transaction ID */}
              <td className="px-4 py-3 font-medium text-[#022C3F]">{tx.orderId}</td>

              {/* Nama */}
              <td className="max-w-[200px] truncate px-4 py-3 font-medium text-[#022C3F]">
                {tx.buyerName}
              </td>

              {/* Item count */}
              <td className="px-4 py-3 text-center font-bold text-[#022C3F]">
                {tx.items.length}
              </td>

              {/* Total Harga */}
              <td className="px-4 py-3 font-bold text-[#022C3F]">{fmtRp(tx.totalBilled)}</td>

              {/* Status */}
              <td className="px-4 py-3">
                <StatusBadge status={tx.status} />
              </td>

              {/* Tanggal Pelunasan */}
              <td className="px-4 py-3 text-[#022C3F]">
                {fmtDate(tx.paidAt || tx.createdAt)}
              </td>

              {/* Aksi */}
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRowClick(tx.orderId);
                  }}
                  className="flex size-8 items-center justify-center rounded-lg border border-[#022C3F]/20 text-[#022C3F] transition-colors hover:bg-[#022C3F] hover:text-white"
                  aria-label={`Lihat detail transaksi ${tx.orderId}`}
                >
                  <ArrowRightLinear className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
