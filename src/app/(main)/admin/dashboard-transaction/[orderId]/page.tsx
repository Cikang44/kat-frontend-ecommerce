'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, ChevronUp, ChevronDown, ShoppingCart, User } from 'lucide-react';

import { Spinner } from '@/components/ui/spinner';
import { useOrderDetail } from '@/domains/order/order.hooks';
import type { OrderDetailResult } from '@/domains/order/order.api';

const geom: React.CSSProperties = { fontFamily: "'Geom', sans-serif" };
const redzone: React.CSSProperties = { fontFamily: "'Redzone', sans-serif" };

function fmtRp(n: number) {
  return 'Rp' + n.toLocaleString('id-ID');
}

function fmtDate(iso: string) {
  if (!iso) return '-';
  return (
    new Date(iso).toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }) + ' WIB'
  );
}

function variantLabel(snapshot: Record<string, unknown>): string {
  const parts: string[] = [];
  if (snapshot.size) parts.push(String(snapshot.size));
  if (snapshot.color) parts.push(String(snapshot.color));
  return parts.join(', ') || '-';
}

function FieldBox({
  label,
  value,
  required,
  className = '',
}: {
  label: string;
  value: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <p
        style={{
          ...geom,
          fontSize: '16px',
          fontWeight: 300,
          lineHeight: '24px',
          color: '#FFF',
          marginBottom: '4px',
        }}
      >
        {label}
        {required && <span style={{ color: '#EF4444' }}>*</span>}
      </p>
      <div
        className="w-full px-3 py-2"
        style={{
          ...geom,
          fontSize: '14px',
          fontWeight: 500,
          color: '#022C3F',
          backgroundColor: '#F1F7FC',
          borderRadius: '10px',
        }}
      >
        {value}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'lunas') {
    return (
      <span
        style={{
          ...geom,
          fontWeight: 700,
          fontSize: '16px',
          lineHeight: '24px',
          backgroundColor: '#169A87',
          color: '#F1F7FC',
          borderRadius: '5.542px',
          padding: '6px 16px',
          whiteSpace: 'nowrap',
        }}
      >
        LUNAS
      </span>
    );
  }
  if (status === 'diterima') {
    return (
      <span
        style={{
          ...geom,
          fontWeight: 700,
          fontSize: '16px',
          lineHeight: '24px',
          backgroundColor: '#133B79',
          color: '#F1F7FC',
          borderRadius: '8px',
          padding: '6px 16px',
          whiteSpace: 'nowrap',
        }}
      >
        SUDAH DIAMBIL
      </span>
    );
  }
  if (status === 'belum_bayar') {
    return (
      <span
        style={{
          ...geom,
          fontWeight: 700,
          fontSize: '16px',
          lineHeight: '24px',
          backgroundColor: '#7A213D',
          color: '#F1F7FC',
          borderRadius: '8px',
          padding: '6px 16px',
          whiteSpace: 'nowrap',
        }}
      >
        BELUM BAYAR
      </span>
    );
  }
  if (status === 'expired') {
    return (
      <span
        style={{
          ...geom,
          fontWeight: 700,
          fontSize: '16px',
          lineHeight: '24px',
          backgroundColor: '#555',
          color: '#F1F7FC',
          borderRadius: '8px',
          padding: '6px 16px',
          whiteSpace: 'nowrap',
        }}
      >
        KADALUARSA
      </span>
    );
  }
  return (
    <span
      style={{
        ...geom,
        fontWeight: 700,
        fontSize: '16px',
        backgroundColor: '#555',
        color: '#F1F7FC',
        borderRadius: '8px',
        padding: '6px 16px',
        whiteSpace: 'nowrap',
      }}
    >
      {status.toUpperCase()}
    </span>
  );
}

function ItemThumbnail({ name, imageUrl }: { name: string; imageUrl?: string }) {
  if (imageUrl) {
    return (
      <div
        className="size-16 shrink-0 overflow-hidden rounded-lg"
        style={{ border: '1px solid #996537' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- dynamic backend host */}
        <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
      </div>
    );
  }
  return (
    <div
      className="flex size-16 shrink-0 items-center justify-center rounded-lg"
      style={{ backgroundColor: '#FFF3B8', border: '1px solid #996537' }}
    >
      <span style={{ ...redzone, fontSize: '24px', fontWeight: 900, color: '#996537' }}>
        {name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}

function SummaryFooter({
  order,
  totalQty,
  dateStr,
}: {
  order: OrderDetailResult;
  totalQty: number;
  dateStr: string;
}) {
  return (
    <div
      className="flex items-center justify-between gap-4 rounded-[15px] px-5 py-4"
      style={{ backgroundColor: '#FFF3B8' }}
    >
      <div>
        <p style={{ ...geom, fontWeight: 500, fontSize: '14px', color: '#022C3F' }}>
          Total ({totalQty} produk):
        </p>
        <p style={{ ...redzone, fontWeight: 900, fontSize: '24px', color: '#022C3F' }}>
          {fmtRp(order.totalBilled)}
        </p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <StatusBadge status={order.status} />
        <p style={{ ...geom, fontWeight: 400, fontSize: '12px', color: '#022C3F', opacity: 0.7 }}>
          {dateStr}
        </p>
      </div>
    </div>
  );
}

function ItemCardDesktop({
  order,
  totalQty,
  dateStr,
}: {
  order: OrderDetailResult;
  totalQty: number;
  dateStr: string;
}) {
  return (
    <div
      className="flex flex-col gap-4 rounded-[30px] px-[30px] py-[20px]"
      style={{ backgroundColor: '#133B79', border: '5px solid rgba(255,255,255,0.50)' }}
    >
      <div className="flex items-center gap-2">
        <ShoppingCart size={23} className="text-white" />
        <span style={{ ...geom, fontWeight: 700, fontSize: '24px', color: '#F9F6F3' }}>Item</span>
      </div>

      {/* Table header */}
      <div
        className="grid items-center rounded-[10px] px-4 py-3"
        style={{
          gridTemplateColumns: '1fr 120px 80px 120px',
          backgroundColor: '#133B79',
          border: '1px solid #FFF3B8',
        }}
      >
        {['Produk', 'Varian', 'Kuantitas', 'Total Harga'].map((col) => (
          <span
            key={col}
            style={{ ...geom, fontWeight: 700, fontSize: '14px', color: '#FFF3B8' }}
          >
            {col}
          </span>
        ))}
      </div>

      {/* Item rows */}
      <div className="flex flex-col gap-3">
        {order.items.map((item) => {
          const variant = variantLabel(item.variantSnapshot);
          return (
            <div
              key={item.id}
              className="grid items-center rounded-[10px] px-4 py-3"
              style={{
                gridTemplateColumns: '1fr 120px 80px 120px',
                backgroundColor: '#133B79',
                border: '1px solid #FFF3B8',
              }}
            >
              {/* Produk */}
              <div className="flex items-center gap-3 pr-3">
                <ItemThumbnail name={item.productName} imageUrl={(item as { imageUrl?: string }).imageUrl} />
                <span
                  style={{ ...geom, fontWeight: 700, fontSize: '14px', color: '#FFF3B8' }}
                >
                  {item.productName}
                </span>
              </div>

              {/* Varian */}
              <span style={{ ...geom, fontWeight: 500, fontSize: '14px', color: '#FFF3B8' }}>
                {variant}
              </span>

              {/* Kuantitas */}
              <span style={{ ...geom, fontWeight: 700, fontSize: '14px', color: '#FFF3B8' }}>
                {item.quantity}
              </span>

              {/* Total Harga */}
              <span style={{ ...geom, fontWeight: 700, fontSize: '14px', color: '#FFF3B8' }}>
                {fmtRp(item.subtotal)}
              </span>
            </div>
          );
        })}
      </div>

      <SummaryFooter order={order} totalQty={totalQty} dateStr={dateStr} />
    </div>
  );
}

function ItemCardMobile({
  order,
  totalQty,
  dateStr,
}: {
  order: OrderDetailResult;
  totalQty: number;
  dateStr: string;
}) {
  return (
    <div
      className="flex flex-col gap-4 rounded-[30px] px-[30px] py-[20px]"
      style={{ backgroundColor: '#133B79', border: '5px solid rgba(255,255,255,0.50)' }}
    >
      <div className="flex items-center gap-2">
        <ShoppingCart size={23} className="text-white" />
        <span style={{ ...geom, fontWeight: 700, fontSize: '20px', color: '#F9F6F3' }}>Item</span>
      </div>

      <div className="flex flex-col gap-3">
        {order.items.map((item) => {
          const variant = variantLabel(item.variantSnapshot);
          return (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-[10px] px-3 py-3"
              style={{
                backgroundColor: '#133B79',
                border: '1px solid #FFF3B8',
              }}
            >
              <ItemThumbnail name={item.productName} imageUrl={(item as { imageUrl?: string }).imageUrl} />
              <div className="flex flex-1 flex-col gap-0.5">
                <p style={{ ...geom, fontWeight: 700, fontSize: '14px', color: '#FFF3B8' }}>
                  {item.productName}
                </p>
                <p style={{ ...geom, fontWeight: 500, fontSize: '12px', color: '#FFF3B8' }}>
                  {variant}
                </p>
              </div>
              <div className="flex flex-col items-end gap-0.5">
                <p style={{ ...geom, fontWeight: 500, fontSize: '12px', color: '#FFF3B8' }}>
                  {item.quantity} pcs
                </p>
                <p style={{ ...geom, fontWeight: 700, fontSize: '13px', color: '#FFF3B8' }}>
                  {fmtRp(item.subtotal)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <SummaryFooter order={order} totalQty={totalQty} dateStr={dateStr} />
    </div>
  );
}

export default function TransactionDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { data: order, isLoading, error } = useOrderDetail(orderId);
  const [profileOpen, setProfileOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p style={{ ...geom, color: '#7A213D' }}>{error?.message ?? 'Data tidak ditemukan.'}</p>
      </div>
    );
  }

  const totalQty = order.items.reduce((s, i) => s + i.quantity, 0);
  const dateStr = order.paidAt ? fmtDate(order.paidAt) : fmtDate(order.createdAt);

  const kontakFields = (
    <div className="space-y-3">
      <FieldBox label="Nama" value={order.contactName} required />
      <div className="flex gap-2">
        <FieldBox label="F/S" value="-" required className="w-20 shrink-0" />
        <FieldBox label="Jurusan" value="-" required className="flex-1" />
      </div>
      <div className="flex flex-col gap-3 md:flex-row md:gap-2">
        <FieldBox label="No. HP" value={order.contactPhone} required className="flex-1" />
        <FieldBox label="ID Line" value={order.contactLineId} required className="flex-1" />
      </div>
      <FieldBox label="Email" value="-" required />
    </div>
  );

  return (
    <main className="relative z-10 mx-auto max-w-6xl px-4 py-8">
      <nav className="mb-3 flex items-center gap-1" style={{ ...geom, fontSize: '13px' }}>
        <Link href="/admin/dashboard-transaction" style={{ color: '#1B2F53' }} className="hover:underline">
          Transactions
        </Link>
        <span style={{ color: '#1B2F53', opacity: 0.5 }}>›</span>
        <span style={{ color: '#7A213D' }}>Transaction Detail</span>
      </nav>

      <h1 className="mb-6 flex items-end gap-2">
        <Link
          href="/admin/dashboard-transaction"
          className="mb-2 flex size-8 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: '#7A213D' }}
        >
          <ArrowLeft size={16} color="white" strokeWidth={1.5} />
        </Link>
        <span style={{ ...redzone, fontWeight: 900, fontSize: '40px', color: '#7A213D' }}>
          Transaction Detail
        </span>
      </h1>

      {/* Mobile */}
      <div className="flex flex-col gap-4 md:hidden">
        <div
          className="flex flex-col gap-5 rounded-[30px] px-[30px] py-[20px]"
          style={{ backgroundColor: '#133B79', border: '5px solid rgba(255,255,255,0.50)' }}
        >
          <button
            type="button"
            className="flex w-full items-center justify-between"
            onClick={() => setProfileOpen((p) => !p)}
          >
            <div className="flex items-center gap-2">
              <User size={23} className="text-white" />
              <span
                style={{
                  ...geom,
                  fontWeight: 700,
                  fontSize: '20px',
                  lineHeight: '30px',
                  color: '#F9F6F3',
                }}
              >
                Profil
              </span>
            </div>
            {profileOpen ? (
              <ChevronUp size={20} className="text-white/60" />
            ) : (
              <ChevronDown size={20} className="text-white/60" />
            )}
          </button>
          {profileOpen && kontakFields}
        </div>

        <ItemCardMobile order={order} totalQty={totalQty} dateStr={dateStr} />
      </div>

      {/* Desktop */}
      <div className="hidden gap-6 md:grid md:grid-cols-[2fr_3fr]">
        <div
          className="flex flex-col gap-5 rounded-[30px] px-[30px] py-[20px]"
          style={{ backgroundColor: '#133B79', border: '5px solid rgba(255,255,255,0.50)' }}
        >
          <div className="flex items-center gap-2">
            <User size={23} className="text-white" />
            <span
              style={{
                ...geom,
                fontWeight: 700,
                fontSize: '24px',
                lineHeight: '30px',
                color: '#F9F6F3',
              }}
            >
              Kontak
            </span>
          </div>
          {kontakFields}
        </div>

        <ItemCardDesktop order={order} totalQty={totalQty} dateStr={dateStr} />
      </div>
    </main>
  );
}