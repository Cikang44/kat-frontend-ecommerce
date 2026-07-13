'use client';

import { useState } from 'react';
import { ArrowLeft, ChevronUp, ChevronDown, ShoppingCart, User } from 'lucide-react';
import Link from 'next/link';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { useHandOverScan, useConfirmHandOver } from '@/domains/admin/admin.hooks';
import type { AdminHandOverScanResult } from '@/domains/admin/admin.api';

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
        {value || '-'}
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
          fontSize: '14px',
          lineHeight: '20px',
          backgroundColor: '#169A87',
          color: '#F1F7FC',
          borderRadius: '5.542px',
          padding: '4px 12px',
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
          fontSize: '14px',
          lineHeight: '20px',
          backgroundColor: '#133B79',
          color: '#F1F7FC',
          borderRadius: '5.542px',
          padding: '4px 12px',
          whiteSpace: 'nowrap',
        }}
      >
        SUDAH DIAMBIL
      </span>
    );
  }
  return (
    <span
      style={{
        ...geom,
        fontWeight: 700,
        fontSize: '14px',
        backgroundColor: '#555',
        color: '#F1F7FC',
        borderRadius: '5.542px',
        padding: '4px 12px',
        whiteSpace: 'nowrap',
      }}
    >
      {status.toUpperCase()}
    </span>
  );
}

function ItemThumbnail({ name, large }: { name: string; large?: boolean }) {
  const sizeClass = large ? 'size-[90px]' : 'size-16';
  return (
    <div
      className={`flex ${sizeClass} shrink-0 items-center justify-center rounded-[15px]`}
      style={{ backgroundColor: '#FFF3B8', border: '1px solid #996537' }}
    >
      <span style={{ ...redzone, fontSize: large ? '30px' : '24px', fontWeight: 900, color: '#996537' }}>
        {name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}

function SummaryFooter({
  scan,
  totalQty,
  dateStr,
  onTriggerConfirmation,
}: {
  scan: AdminHandOverScanResult;
  totalQty: number;
  dateStr: string;
  onTriggerConfirmation: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div
        className="flex items-center justify-between gap-4 rounded-[15px] px-5 py-4"
        style={{ backgroundColor: '#FFF3B8' }}
      >
        <div>
          <p style={{ ...geom, fontWeight: 500, fontSize: '14px', color: '#022C3F' }}>
            Total ({totalQty} produk):
          </p>
          <p style={{ ...redzone, fontWeight: 900, fontSize: '24px', color: '#022C3F' }}>
            {fmtRp(scan.totalBilled)}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StatusBadge status={scan.status} />
          <p style={{ ...geom, fontWeight: 400, fontSize: '12px', color: '#022C3F', opacity: 0.7 }}>
            {dateStr}
          </p>
        </div>
      </div>

      {scan.status === 'lunas' && (
        <Button
          onClick={onTriggerConfirmation}
          className="w-full bg-[#F1F7FC] text-[#133B79] hover:bg-white font-bold py-3 rounded-xl transition-all shadow-md border border-[#133B79]/20 cursor-pointer"
          style={{ ...geom, fontSize: '16px' }}
        >
          Konfirmasi Pengambilan
        </Button>
      )}
    </div>
  );
}

function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  isMutating,
  errorMessage,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isMutating: boolean;
  errorMessage?: string | null;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in backdrop-blur-xs">
      <div className="bg-[#1e2d4a] text-white rounded-2xl p-6 w-full max-w-xs sm:max-w-sm text-center shadow-2xl relative border border-blue-900 overflow-hidden">
        <button
          onClick={onClose}
          disabled={isMutating}
          className="absolute top-4 right-4 text-white/70 hover:text-white text-xl z-10 cursor-pointer"
          style={geom}
        >
          ✕
        </button>
        <div className="w-16 h-16 bg-transparent border-4 border-[#FFF3B8] rounded-full flex items-center justify-center mx-auto mb-4 text-[#FFF3B8] text-3xl font-light relative z-10">
          ?
        </div>
        <h3 className="text-xl font-bold mb-2 px-2 relative z-10 text-[#FFF3B8]" style={{ ...redzone, color: '#FFF3B8' }}>
          Yakin Ingin Konfirmasi Pengambilan?
        </h3>
        <p className="text-sm text-white/80 mb-6 leading-relaxed px-4 relative z-10" style={geom}>
          Cek kembali apakah profil dan item yang dipesan sudah sesuai
        </p>
        {errorMessage && (
          <p className="text-sm text-red-300 mb-4 relative z-10" style={geom}>
            {errorMessage}
          </p>
        )}
        <div className="flex gap-3 justify-center relative z-10">
          <Button
            onClick={onClose}
            disabled={isMutating}
            className="bg-transparent border border-white text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-white/10 cursor-pointer"
            style={geom}
          >
            Batal
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isMutating}
            className="bg-[#FFF3B8] text-[#1e2d4a] px-6 py-2 rounded-xl text-sm font-semibold hover:bg-[#fde047] cursor-pointer"
            style={geom}
          >
            {isMutating ? 'Memproses...' : 'Konfirmasi'}
          </Button>
        </div>
        {/* Dekorasi pojok kiri bawah */}
        <div className="absolute top-30   right-40 pointer-events-none  w-[230px] h-[184px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/confirmation_decoration.webp"
            alt=""
            className="w-full h-full object-contain scale-x-[-1] rotate-5 translate-x-[-20%] translate-y-[20%]"
          />
        </div>
      </div>
    </div>
  );
}

function ItemCard({
  scan,
  totalQty,
  dateStr,
  onTriggerConfirmation,
}: {
  scan: AdminHandOverScanResult;
  totalQty: number;
  dateStr: string;
  onTriggerConfirmation: () => void;
}) {
  return (
    <div
      className="flex flex-col gap-4 rounded-[25px] px-[20px] py-[20px] md:rounded-[30px] md:px-[30px]"
      style={{ backgroundColor: '#133B79', border: '5px solid rgba(255,255,255,0.50)' }}
    >
      <div className="flex items-center gap-2">
        <ShoppingCart size={23} className="text-white" />
        <span style={{ ...geom, fontWeight: 700, fontSize: '20px', color: '#F9F6F3' }}>Item</span>
      </div>

      <div
        className="hidden grid-cols-3 rounded-xl border py-4 text-center font-bold md:grid"
        style={{ ...geom, borderColor: '#FFF3B8', color: '#FFF3B8' }}
      >
        <div>Produk</div>
        <div>Varian</div>
        <div>Kuantitas</div>
      </div>

      <div className="flex flex-col gap-4">
        {scan.items.map((item, index) => {
          const variant = variantLabel(item.variantSnapshot);
          return (
            <div
              key={index}
              className="flex rounded-xl border p-4 md:grid md:grid-cols-3 md:items-center"
              style={{ borderColor: '#FFF3B8' }}
            >
              {/* Mobile row */}
              <div className="flex w-full gap-3 md:hidden">
                <ItemThumbnail name={item.productName} />
                <div className="flex flex-1 flex-col justify-center gap-0.5">
                  <div className="flex w-full items-start justify-between">
                    <span
                      className="line-clamp-1"
                      style={{ ...geom, fontWeight: 700, fontSize: '14px', color: '#FFF3B8' }}
                    >
                      {item.productName}
                    </span>
                    <span
                      className="shrink-0"
                      style={{ ...geom, fontWeight: 500, fontSize: '12px', color: '#FFF3B8' }}
                    >
                      {item.quantity} pcs
                    </span>
                  </div>
                  <div className="flex w-full items-end justify-between">
                    <span style={{ ...geom, fontWeight: 500, fontSize: '12px', color: '#FFF3B8' }}>
                      {variant}
                    </span>
                  </div>
                </div>
              </div>

              {/* Desktop columns */}
              <div className="hidden flex-col items-center justify-center gap-3 md:flex">
                <ItemThumbnail name={item.productName} large />
                <span
                  className="text-center"
                  style={{ ...geom, fontWeight: 700, fontSize: '14px', color: '#FFF3B8' }}
                >
                  {item.productName}
                </span>
              </div>

              <div
                className="hidden items-center justify-center text-center md:flex"
                style={{ ...geom, fontWeight: 500, fontSize: '14px', color: '#FFF3B8' }}
              >
                {variant}
              </div>

              <div
                className="hidden items-center justify-center text-center md:flex"
                style={{ ...geom, fontWeight: 700, fontSize: '14px', color: '#FFF3B8' }}
              >
                {item.quantity}
              </div>
            </div>
          );
        })}
      </div>

      <SummaryFooter scan={scan} totalQty={totalQty} dateStr={dateStr} onTriggerConfirmation={onTriggerConfirmation} />
    </div>
  );
}

interface HandoverDetailViewProps {
  /** The raw scanned QR string (JSON payload or plain token) — or a manual code. */
  qrToken: string;
  onBack: () => void;
}

export default function HandoverDetailView({ qrToken, onBack }: HandoverDetailViewProps) {
  const { data: scan, isLoading, error } = useHandOverScan(qrToken);
  const confirm = useConfirmHandOver();
  const [profileOpen, setProfileOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error || !scan) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <p style={{ ...geom, color: '#7A213D' }}>{error?.message ?? 'QR pickup tidak ditemukan.'}</p>
        <Button
          onClick={onBack}
          className="bg-[#133B79] text-white hover:bg-[#0f2f61] font-bold py-2 px-4 rounded-xl"
          style={geom}
        >
          Scan Ulang
        </Button>
      </div>
    );
  }

  const handleConfirmHandover = () => {
    confirm.mutate(scan.transactionId, {
      onSuccess: () => setIsModalOpen(false),
    });
  };

  const totalQty = scan.items.reduce((s, i) => s + i.quantity, 0);
  const dateStr = scan.paidAt ? fmtDate(scan.paidAt) : '-';

  const kontakFields = (
    <div className="space-y-3">
      <FieldBox label="Nama" value={scan.buyerName} required />
      <div className="flex md:flex-col gap-3 flex-row md:gap-2">
        <FieldBox label="No. HP" value={scan.buyerPhone ?? '-'} required className="flex-1" />
        <FieldBox label="ID Line" value={scan.buyerLineId ?? '-'} required className="flex-1" />
      </div>
      <FieldBox label="Email" value={scan.buyerEmail} required />
    </div>
  );

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
           <nav className=" flex items-center gap-1" style={{ ...geom, fontSize: '13px' }}>
        <Link href="/admin/hand-over" style={{ color: '#1B2F53' }} className="hover:underline">
          Scan QR
        </Link>
        <span style={{ color: '#1B2F53', opacity: 0.5 }}>›</span>
        <span style={{ color: '#7A213D' }}>Pengambilan</span>
      </nav>

      <h1 className="mb-6 flex items-center gap-3">
        <button
          onClick={onBack}
          type="button"
          className="flex size-8 shrink-0 items-center justify-center rounded-full hover:opacity-90 transition-opacity cursor-pointer"
          style={{ backgroundColor: '#7A213D' }}
        >
          <ArrowLeft size={16} color="white" strokeWidth={2} />
        </button>
        <span style={{ ...redzone, fontWeight: 900, fontSize: '40px', color: '#7A213D' }}>
          Detail Pengambilan
        </span>
      </h1>

      {/* Mobile view */}
      <div className="flex flex-col gap-4 md:hidden">
        <div
          className="flex flex-col gap-4 rounded-[25px] px-[20px] py-[20px]"
          style={{ backgroundColor: '#133B79', border: '4px solid rgba(255,255,255,0.40)' }}
        >
          <button
            type="button"
            className="flex w-full items-center justify-between"
            onClick={() => setProfileOpen((p) => !p)}
          >
            <div className="flex items-center gap-2">
              <User size={20} className="text-white" />
              <span style={{ ...geom, fontWeight: 700, fontSize: '18px', color: '#F9F6F3' }}>
                Profil
              </span>
            </div>
            {profileOpen ? (
              <ChevronUp size={20} className="text-white/70" />
            ) : (
              <ChevronDown size={20} className="text-white/70" />
            )}
          </button>
          {profileOpen && kontakFields}
        </div>
      </div>

      {/* Desktop view */}
      <div className="hidden gap-6 md:grid md:grid-cols-[1fr_1.4fr]">
        <div
          className="flex flex-col gap-4 rounded-[25px] px-[25px] py-[20px] h-fit"
          style={{ backgroundColor: '#133B79', border: '4px solid rgba(255,255,255,0.40)' }}
        >
          <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-1">
            <User size={20} className="text-white" />
            <span style={{ ...geom, fontWeight: 700, fontSize: '20px', color: '#F9F6F3' }}>
              Profil
            </span>
          </div>
          {kontakFields}
        </div>

        <ItemCard scan={scan} totalQty={totalQty} dateStr={dateStr} onTriggerConfirmation={() => setIsModalOpen(true)} />
      </div>

      {/* Item card (mobile) */}
      <div className="mt-4 md:hidden">
        <ItemCard scan={scan} totalQty={totalQty} dateStr={dateStr} onTriggerConfirmation={() => setIsModalOpen(true)} />
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmHandover}
        isMutating={confirm.isPending}
        errorMessage={confirm.error?.message ?? null}
      />
    </div>
  );
}
