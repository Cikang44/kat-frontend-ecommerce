'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowRightLinear } from 'vuesax-icon-pack';

import { Spinner } from '@/components/ui/spinner';
import { useOrderHistoryWithDetails } from '@/domains/order/order.hooks';

// ---------------------------------------------------------------------------
// Status config
// ---------------------------------------------------------------------------

const STATUS_CONFIG: Record<string, { label: string; buttonLabel: string }> = {
  draft: { label: 'Draft', buttonLabel: 'Lanjutkan Checkout' },
  belum_bayar: { label: 'Belum Bayar', buttonLabel: 'Bayar Sekarang' },
  cicilan_1: { label: 'Cicilan 1', buttonLabel: 'Bayar Cicilan 1' },
  lunas: { label: 'Lunas', buttonLabel: 'Ambil Barang' },
  diterima: { label: 'Selesai', buttonLabel: 'Transaksi Selesai' },
  expired: { label: 'Kadaluarsa', buttonLabel: '' },
};

const FILTER_OPTIONS = [
  { value: 'all', label: 'Semua' },
  { value: 'belum_bayar', label: 'Belum Bayar' },
  { value: 'cicilan_1', label: 'Cicilan 1' },
  { value: 'lunas', label: 'Lunas' },
  { value: 'diterima', label: 'Selesai' },
  { value: 'expired', label: 'Kadaluarsa' },
];

// ---------------------------------------------------------------------------
// Item image box — shows the image if available, otherwise the product initial
// ---------------------------------------------------------------------------

function ItemImageBox({
  imageUrl,
  productName,
}: {
  imageUrl: string | undefined;
  productName: string;
}) {
  if (imageUrl) {
    return (
      <div className="h-[72px] w-[72px] shrink-0 overflow-hidden rounded-lg border border-[#996537] bg-[#FFF3B8] md:h-[96px] md:w-[96px] md:rounded-xl">
        <Image src={imageUrl} alt={productName} className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-lg border border-[#996537] bg-[#FFF3B8] md:h-[96px] md:w-[96px] md:rounded-xl">
      <span className="text-xl font-bold text-[#996537]/60 md:text-4xl">
        {productName.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Action button
// ---------------------------------------------------------------------------

function ActionButton({
  status,
  deliveryMethod,
  orderId,
}: {
  status: string;
  deliveryMethod: string | undefined;
  orderId: string;
}) {
  if (status === 'draft') {
    return (
      <Link
        href={`/checkout/${orderId}`}
        className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-[#1B2F53] bg-[#1B2F53] px-2 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#1B2F53]/90 md:inline-flex md:w-full"
      >
        Lanjutkan Checkout
        <ArrowRightLinear className="h-4 w-4" />
      </Link>
    );
  }

  if (status === 'belum_bayar') {
    return (
      <Link
        href={`/payment/${orderId}`}
        className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-[#1B2F53] bg-[#1B2F53] px-2 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#1B2F53]/90 md:inline-flex md:w-full"
      >
        Bayar Sekarang
        <ArrowRightLinear className="h-4 w-4" />
      </Link>
    );
  }

  if (status === 'cicilan_1') {
    return (
      <Link
        href={`/payment/${orderId}`}
        className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-[#1B2F53] bg-[#1B2F53] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#1B2F53]/90 md:inline-flex md:w-full"
      >
        Bayar Cicilan 1
        <ArrowRightLinear className="h-4 w-4" />
      </Link>
    );
  }

  if (status === 'lunas') {
    const isKurir = deliveryMethod === 'kurir' || deliveryMethod === 'shipping';
    return (
      <button
        type="button"
        onClick={() => {
          console.log(`${isKurir ? 'Barang Diantar' : 'Ambil Barang'} — order`, orderId);
        }}
        className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-[#1B2F53] bg-[#1B2F53] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#1B2F53]/90 md:inline-flex md:w-full"
      >
        {isKurir ? 'Barang Diantar' : 'Ambil Barang'}
        <ArrowRightLinear className="h-4 w-4" />
      </button>
    );
  }

  if (status === 'diterima') {
    return (
      <span className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-[#1B2F53] bg-[#1B2F53] px-5 py-2.5 text-sm font-bold text-white md:inline-flex md:w-full">
        Transaksi Selesai
      </span>
    );
  }

  return null;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function HistoryPage() {
  const { data: orders, isLoading, error } = useOrderHistoryWithDetails();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-destructive">{error.message}</p>
      </div>
    );
  }

  const filteredOrders = orders?.filter((order) => {
    if (filter !== 'all' && order.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      const matches = order.items?.some((item) => item.productName.toLowerCase().includes(q));
      if (!matches) return false;
    }
    return true;
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      {/* Breadcrumb */}
      <nav className="mb-2 flex items-center gap-2 text-sm text-[#022C3F]/60">
        <Link href="/profile" className="hover:text-[#022C3F]">
          Profile
        </Link>
        <svg
          className="h-3 w-3"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
        <span className="text-[#022C3F]">Riwayat Transaksi</span>
      </nav>

      {/* Title with back arrow */}
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/profile"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[#022C3F]/20 text-[#022C3F] transition-colors hover:bg-gray-50"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <h1 className="font-[redzone] text-2xl font-bold text-[#022C3F] md:text-4xl">
          Transactions History
        </h1>
      </div>

      {/* Search and filter */}
      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1">
          <svg
            className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#022C3F]/40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 w-full rounded-xl border border-[#022C3F]/20 bg-white pr-4 pl-10 text-sm text-[#022C3F] placeholder:text-[#022C3F]/40 focus:border-[#022C3F]/40 focus:outline-none"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="h-12 min-w-[140px] rounded-xl border border-[#022C3F]/20 bg-white px-4 text-sm font-semibold text-[#022C3F] focus:border-[#022C3F]/40 focus:outline-none"
        >
          {FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Transaction cards */}
      {filteredOrders && filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const firstItem = order.items?.[0];
            const status = STATUS_CONFIG[order.status];
            const deliveryMethod = order.deliveryMethod ?? 'pickup';
            const color =
              ((firstItem?.variantSnapshot as Record<string, unknown>)?.color as string) ?? '';
            const size =
              ((firstItem?.variantSnapshot as Record<string, unknown>)?.size as string) ?? '';

            return (
              <div
                key={order.id}
                className="flex flex-col gap-3 rounded-[10px] border border-[#022C3F] bg-[#E6EFF9] p-3 md:flex-row md:items-center md:gap-5"
              >
                {/* Image + info on same row for mobile */}
                <div className="flex flex-row gap-3 md:items-center md:gap-5">
                  {/* Image box */}
                  {firstItem && (
                    <ItemImageBox
                      imageUrl={(firstItem as { imageUrl?: string }).imageUrl}
                      productName={firstItem.productName}
                    />
                  )}

                  {/* Product info — flexes on mobile, fixed on desktop */}
                  <div className="flex min-w-0 flex-1 flex-col gap-1 md:w-[160px] md:flex-none">
                    {/* Name + quantity + status badge (mobile) */}
                    <div className="flex items-center gap-2">
                      <p className="truncate font-bold text-[#133B79]">
                        {firstItem?.productName ?? 'Produk'}
                      </p>
                      <p className="shrink-0 text-sm text-[#022C3F]/60">
                        x{firstItem?.quantity ?? order.itemCount}
                      </p>
                      {/* Status badge — mobile only */}
                      <span className="ml-auto inline-flex min-w-[90px] shrink-0 items-center justify-center rounded-lg bg-[#133B79] px-3 py-1.5 text-xs font-bold text-white md:hidden">
                        {status?.label ?? order.status}
                      </span>
                    </div>

                    {/* Color, Size */}
                    <p className="truncate text-sm text-[#022C3F]">
                      {[color, size].filter(Boolean).join(', ')}
                    </p>

                    {/* Total */}
                    <p className="text-sm font-bold text-[#022C3F]">
                      Total: Rp{order.totalBilled.toLocaleString('id-ID')}
                    </p>
                  </div>

                  {/* Desktop: color column — fixed width */}
                  <div className="hidden w-[80px] md:block">
                    <p className="text-sm font-medium text-[#022C3F]">{color}</p>
                  </div>

                  {/* Desktop: size column — fixed width */}
                  <div className="hidden w-[60px] md:block">
                    <p className="text-sm font-medium text-[#022C3F]">{size}</p>
                  </div>

                  {/* Desktop: total column — fixed width */}
                  <div className="hidden w-[120px] md:block">
                    <p className="text-xs text-[#022C3F]/60">Total Pesanan:</p>
                    <p className="text-sm font-bold text-[#022C3F]">
                      Rp{order.totalBilled.toLocaleString('id-ID')}
                    </p>
                  </div>

                  {/* Status badge — desktop only, fixed width */}
                  <span className="hidden w-[100px] items-center justify-center rounded-lg bg-[#133B79] px-4 py-2.5 text-sm font-bold text-white md:inline-flex">
                    {status?.label ?? order.status}
                  </span>

                  {/* Desktop action button — fixed width for consistent alignment */}
                  {status?.buttonLabel && (
                    <div className="hidden w-[200px] md:block">
                      <ActionButton
                        status={order.status}
                        deliveryMethod={deliveryMethod}
                        orderId={order.id}
                      />
                    </div>
                  )}
                </div>

                {/* Mobile action button — full width below */}
                {status?.buttonLabel && (
                  <div className="w-full md:hidden">
                    <ActionButton
                      status={order.status}
                      deliveryMethod={deliveryMethod}
                      orderId={order.id}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex min-h-[30vh] flex-col items-center justify-center gap-4">
          <p className="text-[#022C3F]/40">Belum ada pesanan</p>
          <Link
            href="/products"
            className="rounded-lg bg-[#022C3F] px-4 py-2 text-white transition-colors hover:bg-[#022C3F]/90"
          >
            Mulai Belanja
          </Link>
        </div>
      )}
    </div>
  );
}
