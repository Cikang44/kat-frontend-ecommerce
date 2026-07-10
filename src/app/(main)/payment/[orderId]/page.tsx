'use client';

import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { Spinner } from '@/components/ui/spinner';
import {
  useInitiatePayment,
  usePaymentDetail,
  usePaymentStatus,
} from '@/domains/payment/payment.hooks';

type PaymentStatus = 'belum_bayar' | 'lunas' | 'expired' | 'diterima';

function formatCountdown(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}j ${m}m ${s}s`;
}

export default function PaymentPage() {
  const { orderId } = useParams<{ orderId: string }>();

  const detail = usePaymentDetail(orderId);
  const status = usePaymentStatus(orderId);
  const initiatePayment = useInitiatePayment();

  const [countdown, setCountdown] = useState<number | null>(null);
  const initiated = useRef(false);

  // Create the gateway payment transaction once detail is available.
  // Initiate is idempotent per the SDK doc, so calling it here is safe.
  useEffect(() => {
    if (!orderId || !detail.data || initiated.current) return;
    initiated.current = true;
    initiatePayment.mutate({ orderId, method: detail.data.method });
  }, [orderId, detail.data, initiatePayment]);

  // Live countdown from detail.countdown (seconds).
  useEffect(() => {
    if (detail.data?.countdown == null) {
      setCountdown(null);
      return;
    }
    setCountdown(detail.data.countdown);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev == null || prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [detail.data?.countdown]);

  if (detail.isPending) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: 'inherit' }}>
        <Spinner />
      </div>
    );
  }

  if (detail.isError) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: 'inherit' }}>
        <p className="font-[Geom] text-red-500">
          {detail.error?.message ?? 'Gagal memuat detail pembayaran.'}
        </p>
      </div>
    );
  }

  const data = detail.data;
  if (!data) return null;

  // The status-poll query is the authoritative, live source of truth — it is the
  // only response that can report 'diterima'. Fall back to the (stale) detail
  // snapshot only while the poll hasn't resolved yet.
  const pollStatus = status.data?.status;
  const currentStatus: PaymentStatus = pollStatus ?? (data.status as PaymentStatus);
  const isPaid = currentStatus === 'lunas' || currentStatus === 'diterima';
  const isExpired = currentStatus === 'expired';

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6">
      <h1 className="mb-6 font-[Redzone] text-2xl font-black text-white">Pembayaran</h1>

      <div className="mb-4 rounded-xl border border-[#FFF3B8]/40 bg-[#1B2F53] p-4 text-white">
        <p className="font-[Geom] text-sm">
          Status: <span className="font-bold">{currentStatus.toUpperCase()}</span>
        </p>
        {!isPaid && !isExpired && countdown != null && (
          <p className="mt-1 font-[Geom] text-xs text-[#FFF3B8]">
            Sisa waktu: {formatCountdown(countdown)}
          </p>
        )}
      </div>

      <section className="mb-4 rounded-xl border border-[#FFF3B8]/40 bg-[#1B2F53] p-4 text-white">
        <h2 className="mb-3 font-[Redzone] text-lg font-bold">Metode Pembayaran</h2>
        <p className="font-[Geom] text-sm">Metode: {data.method.toUpperCase()}</p>
        {data.paymentDetail.qrImageUrl ? (
          <div className="mt-3">
            <p className="mb-2 font-[Geom] text-xs">Scan QRIS:</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.paymentDetail.qrImageUrl}
              alt="QRIS"
              className="h-48 w-48 rounded bg-white p-2"
            />
          </div>
        ) : (
          <div className="mt-3 font-[Geom] text-sm">
            <p>Bank: {data.paymentDetail.bank}</p>
            <p>No. Virtual Account: {data.paymentDetail.accountNumber}</p>
          </div>
        )}
      </section>

      <section className="mb-4 rounded-xl border border-[#FFF3B8]/40 bg-[#1B2F53] p-4 text-white">
        <h2 className="mb-3 font-[Redzone] text-lg font-bold">Pengiriman</h2>
        <p className="font-[Geom] text-sm">Metode: {data.shipping.method}</p>
        <p className="font-[Geom] text-sm">Nama: {data.shipping.name}</p>
        <p className="font-[Geom] text-sm">HP: {data.shipping.phone}</p>
        {data.shipping.address ? (
          <p className="font-[Geom] text-sm">Alamat: {data.shipping.address}</p>
        ) : null}
      </section>

      <section className="mb-4 rounded-xl border border-[#FFF3B8]/40 bg-[#1B2F53] p-4 text-white">
        <h2 className="mb-3 font-[Redzone] text-lg font-bold">Ringkasan Pesanan</h2>
        <div className="space-y-2 font-[Geom] text-sm">
          {data.orderSummary.items.map((item, i) => (
            <div key={i} className="flex justify-between border-b border-white/10 pb-2">
              <span>
                {item.productName}
                {item.variant && typeof item.variant === 'object' && item.variant.color
                  ? ` (${String(item.variant.color)})`
                  : ''}{' '}
                × {item.quantity}
              </span>
              <span>{item.subtotal}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 space-y-1 font-[Geom] text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{data.orderSummary.subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Fee</span>
            <span>{data.orderSummary.fee}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>{data.orderSummary.total}</span>
          </div>
        </div>
      </section>

      {isPaid ? (
        <p className="font-[Geom] text-center text-[#FFF3B8]">Pembayaran lunas. Terima kasih!</p>
      ) : null}
      {isExpired ? (
        <p className="font-[Geom] text-center text-red-400">Pembayaran kedaluwarsa.</p>
      ) : null}
    </main>
  );
}
