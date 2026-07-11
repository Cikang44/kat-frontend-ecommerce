'use client';
import Image from 'next/image';
import { ArrowDownLinear, WalletIcon2Linear } from 'vuesax-icon-pack';
import { useState } from 'react';
import type { OrderDeliveryMethod, OrderOption, OrderPaymentMethod } from '@/domains/order/order.types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PaymentSectionProps {
  paymentMethods: OrderOption[];
  paymentMethod: OrderPaymentMethod | null;
  onPaymentMethodChange: (method: OrderPaymentMethod) => void;
  submitted?: boolean;
  totalProductPrice: number;
  deliveryMethod: OrderDeliveryMethod | null;
  shippingCost: number | null;
  formatPrice: (price: number) => string;
  onBayarClick: () => void;
  isPending: boolean;
}

export function PaymentSection({
  paymentMethods,
  paymentMethod,
  onPaymentMethodChange,
  submitted = false,
  totalProductPrice,
  deliveryMethod,
  shippingCost,
  formatPrice,
  onBayarClick,
  isPending,
}: PaymentSectionProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isPickup = deliveryMethod === 'pickup';
  const effectiveShippingCost = isPickup ? 0 : shippingCost;
  const displayShippingCost =
    effectiveShippingCost !== null ? formatPrice(effectiveShippingCost) : '—';
  const totalTagihan =
    effectiveShippingCost !== null
      ? totalProductPrice + effectiveShippingCost
      : totalProductPrice;

  const selectedLabel = paymentMethod
    ? paymentMethods.find((m) => m.value === paymentMethod)?.label ?? 'Pilih metode'
    : 'Pilih metode pembayaran';

  return (
    <section className="rounded-xl outline-[5px] outline-white/50 bg-[#1B2F53] p-4 text-white">
      <h2 className="mb-3 flex items-center gap-2 font-[Redzone] text-base font-bold text-white">
        <span className="flex size-5 items-center justify-center">
          <WalletIcon2Linear size={18} />
        </span>
        Metode Pembayaran
      </h2>

      <div className="relative z-20">
        <button
          type="button"
          onClick={() => setDropdownOpen((p) => !p)}
          className={cn(
            'flex w-full items-center justify-between rounded-lg border bg-[#F1F7FC] px-3 py-2.5 text-left text-sm text-[#022C3F]',
            submitted && !paymentMethod ? 'border-red-400' : 'border-[#FFF3B8]/50',
          )}
        >
          <span className="flex items-center gap-2 font-[Geom]">
            {paymentMethod === 'qris' && (
              <Image src="/qris.png" alt="QRIS" width={24} height={24} className="h-6 w-auto object-contain" />
            )}
            {selectedLabel}
          </span>
          <ArrowDownLinear
            size={14}
            className={cn(
              'text-[#022C3F]/60 transition-transform duration-200',
              dropdownOpen && 'rotate-180',
            )}
          />
        </button>

        {dropdownOpen && (
          <div className="absolute left-0 right-0 top-full mt-1 overflow-hidden rounded-lg border border-[#FFF3B8]/50 bg-white shadow-lg">
            {paymentMethods.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onPaymentMethodChange(opt.value as OrderPaymentMethod);
                  setDropdownOpen(false);
                }}
                className={cn(
                  'w-full px-3 py-2.5 text-left text-sm transition-colors',
                  paymentMethod === opt.value
                    ? 'bg-[#FFF3B8]/30 font-semibold text-[#133B79]'
                    : 'text-[#022C3F]/70 hover:bg-[#F1F7FC]',
                )}
              >
                {opt.value === 'qris' && (
                  <Image
                    src="/qris.png"
                    alt="QRIS"
                    width={16}
                    height={16}
                    className="mr-2 inline h-4 w-auto object-contain"
                  />
                )}
                <span className="font-[Geom]">{opt.label}</span>
              </button>
            ))}
          </div>
        )}

        {submitted && !paymentMethod && (
          <p className="mt-1 font-[Geom] text-[10px] text-red-400">Pilih metode pembayaran</p>
        )}
      </div>

      <div className="my-4 " />

      <h3 className="font-[Geom] mb-3 text-base font-semibold">Ringkasan Transaksi</h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="font-[Geom]">Total Harga</span>
          <span className="font-[Redzone]">{formatPrice(totalProductPrice)}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-[Geom]">Total Ongkir</span>
          <span className="font-[Redzone]">{displayShippingCost}</span>
        </div>
        <div className="flex justify-between text-lg font-bold ">
          <span className="font-[Geom]">Total Tagihan</span>
          <span className="font-[Redzone]">{formatPrice(totalTagihan)}</span>
        </div>
      </div>

      <Button
        onClick={onBayarClick}
        disabled={isPending}
        className="mt-4 w-full bg-[#FFF3B8] font-[Redzone] text-[#022C3F] hover:bg-[#FFF3B8]/90"
      >
        {isPending ? 'Memproses...' : 'Bayar'}
      </Button>
    </section>
  );
}
