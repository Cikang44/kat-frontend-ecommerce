'use client';

import { useParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useOrderDetail, usePickupQr } from '@/domains/order/order.hooks';
import { friendlyPaymentError } from '@/domains/payment/payment-errors';
import { canLoadPaymentDetail, shouldInitiatePayment } from '@/domains/payment/payment-init';
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

  // 1) The order is the source of truth for status + chosen payment method.
  const order = useOrderDetail(orderId);
  const orderStatus = order.data?.status;

  // 2) Create the payment record (idempotent) — but only while the order is
  //    still awaiting payment. This is what makes the detail endpoint stop
  //    returning 404 "Pembayaran tidak ditemukan".
  const initiate = useInitiatePayment();
  const initiated = useRef(false);
  useEffect(() => {
    if (!orderId || !order.data || initiated.current) return;
    if (!shouldInitiatePayment(orderStatus) || !order.data.paymentMethod) return;
    initiated.current = true;
    initiate.mutate({ orderId, method: order.data.paymentMethod });
  }, [orderId, order.data, orderStatus, initiate]);

  // 3) Detail (QR/VA + summary) is only enabled once a payment row exists.
  const detailEnabled = canLoadPaymentDetail(orderStatus, initiate.isSuccess);
  const detail = usePaymentDetail(orderId, { enabled: detailEnabled });

  // 4) Live status polling (independent — never 404s).
  const status = usePaymentStatus(orderId);

  const [countdown, setCountdown] = useState<number | null>(null);
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

  const handleRetryInitiate = () => {
    if (!orderId || !order.data?.paymentMethod) return;
    initiate.reset();
    initiate.mutate({ orderId, method: order.data.paymentMethod });
  };

  // ── Loading / error gating ──────────────────────────────────────────────
  if (order.isPending) {
    return <CenteredSpinner />;
  }
  if (order.isError) {
    return <CenteredError message={friendlyPaymentError(order.error, 'Gagal memuat pesanan.')} />;
  }

  // While we still need to create the payment (awaiting-payment order).
  if (shouldInitiatePayment(orderStatus) && !initiate.isSuccess) {
    if (initiate.isError) {
      return (
        <CenteredError message={friendlyPaymentError(initiate.error)} onRetry={handleRetryInitiate} />
      );
    }
    return <CenteredSpinner label="Menyiapkan pembayaran..." />;
  }

  if (detail.isPending) {
    return <CenteredSpinner />;
  }
  if (detail.isError) {
    return (
      <CenteredError
        message={friendlyPaymentError(detail.error, 'Gagal memuat detail pembayaran.')}
      />
    );
  }

  const data = detail.data;
  if (!data) return null;

  // Poll result is the authoritative live status; fall back to the snapshot.
  const pollStatus = status.data?.status;
  const currentStatus: PaymentStatus = (pollStatus ?? data.status) as PaymentStatus;
  const isPaid = currentStatus === 'lunas' || currentStatus === 'diterima';
  const isExpired = currentStatus === 'expired';
  const isPickup = order.data?.deliveryMethod === 'pickup';

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

      {!isPaid && !isExpired && (
        <section className="mb-4 rounded-xl border border-[#FFF3B8]/40 bg-[#1B2F53] p-4 text-white">
          <h2 className="mb-3 font-[Redzone] text-lg font-bold">Metode Pembayaran</h2>
          <p className="font-[Geom] text-sm">Metode: {data.method.toUpperCase()}</p>
          <QrisOrVa detail={data.paymentDetail} />
        </section>
      )}

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
        <PaidSection orderId={orderId} isPickup={isPickup} />
      ) : null}
      {isExpired ? (
        <p className="font-[Geom] text-center text-red-400">Pembayaran kedaluwarsa.</p>
      ) : null}
    </main>
  );
}

/** After payment: thank-you + (for pickup orders) a pickup-QR generator. */
function PaidSection({ orderId, isPickup }: { orderId: string; isPickup: boolean }) {
  const pickup = usePickupQr(orderId);

  return (
    <section className="rounded-xl border border-[#FFF3B8]/40 bg-[#1B2F53] p-4 text-center text-white">
      <p className="font-[Geom] text-[#FFF3B8]">Pembayaran lunas. Terima kasih!</p>

      {isPickup && (
        <div className="mt-4 flex flex-col items-center gap-3">
          {pickup.qrDataUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={pickup.qrDataUrl}
                alt="QR Pengambilan"
                className="h-48 w-48 rounded bg-white p-2"
              />
              <p className="font-[Geom] text-xs text-[#FFF3B8]">
                Tunjukkan QR ini ke admin saat pengambilan. Berlaku sampai barang diambil.
              </p>
            </>
          ) : (
            <Button
              onClick={pickup.generate}
              disabled={pickup.isGenerating}
              className="rounded-[12px] bg-[#FFE788] font-[Geom] font-bold text-[#022C3F] hover:bg-[#FFE788]/90"
            >
              {pickup.isGenerating ? 'Membuat QR...' : 'Buat QR Pengambilan'}
            </Button>
          )}
          {pickup.error && (
            <p className="font-[Geom] text-xs text-red-300">{pickup.error.message}</p>
          )}
        </div>
      )}
    </section>
  );
}

/**
 * Renders the payment instruction: a QRIS QR (image from the gateway, or one
 * generated locally from the `qrString`), or a Virtual Account number.
 */
function QrisOrVa({
  detail,
}: {
  detail: { qrString?: string; qrImageUrl?: string; bank?: string; accountNumber?: string };
}) {
  if (detail.qrImageUrl || detail.qrString) {
    return (
      <div className="mt-3">
        <p className="mb-2 font-[Geom] text-xs">Scan QRIS:</p>
        {detail.qrImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={detail.qrImageUrl}
            alt="QRIS"
            className="h-48 w-48 rounded bg-white p-2"
          />
        ) : (
          // No image from the gateway (e.g. simulation mode) — render the QR
          // locally from the qr_string, per the backend contract.
          <QRCodeSVG value={detail.qrString!} size={192} className="rounded bg-white p-2" />
        )}
      </div>
    );
  }

  return (
    <div className="mt-3 font-[Geom] text-sm">
      <p>Bank: {detail.bank}</p>
      <p>No. Virtual Account: {detail.accountNumber}</p>
    </div>
  );
}

function CenteredSpinner({ label }: { label?: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3"
      style={{ minHeight: 'inherit' }}
    >
      <Spinner />
      {label && <p className="font-[Geom] text-sm text-white/70">{label}</p>}
    </div>
  );
}

function CenteredError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 px-6 text-center"
      style={{ minHeight: 'inherit' }}
    >
      <p className="font-[Geom] text-red-500">{message}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          className="rounded-[12px] bg-[#FFE788] font-[Geom] font-bold text-[#022C3F] hover:bg-[#FFE788]/90"
        >
          Coba Lagi
        </Button>
      )}
    </div>
  );
}
