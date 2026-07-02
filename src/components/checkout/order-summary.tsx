'use client';

import type { OrderDeliveryMethod } from '@/domains/order/order.types';

interface OrderSummaryProps {
  totalProductPrice: number;
  totalItems: number;
  deliveryMethod: OrderDeliveryMethod | null;
  shippingCost: number | null;
  formatPrice: (price: number) => string;
}

export function OrderSummary({
  totalProductPrice,
  deliveryMethod,
  shippingCost,
  formatPrice,
}: OrderSummaryProps) {
  const isPickup = deliveryMethod === 'pickup';
  const effectiveShippingCost = isPickup ? 0 : shippingCost;
  const displayShippingCost =
    effectiveShippingCost !== null ? formatPrice(effectiveShippingCost) : '—';

  const totalTagihan =
    effectiveShippingCost !== null
      ? totalProductPrice + effectiveShippingCost
      : totalProductPrice;

  return (
    <section className="rounded-xl border-[5px] border-[#022C3F] bg-[#022C3F] p-4 text-white">
      <h2 className="font-[Geom] mb-3 text-base font-semibold">Ringkasan Transaksi</h2>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="font-[Geom]">Total Harga</span>
          <span className="font-[Redzone]">{formatPrice(totalProductPrice)}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-[Geom]">Total Ongkir</span>
          <span className="font-[Redzone]">{displayShippingCost}</span>
        </div>

        <div className="flex justify-between border-t border-white/20 pt-2 text-base font-bold text-[#FFE788]">
          <span className="font-[Geom]">Total Tagihan</span>
          <span className="font-[Redzone]">{formatPrice(totalTagihan)}</span>
        </div>
      </div>
    </section>
  );
}
