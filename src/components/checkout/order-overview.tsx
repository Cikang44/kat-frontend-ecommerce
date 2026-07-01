'use client';

import Image from 'next/image';

import type { OrderItemSnapshot, OrderSummary } from '@/domains/order/order.types';
import { formatPrice } from '@/lib/utils';

interface OrderOverviewProps {
  items: OrderItemSnapshot[];
  summary: OrderSummary;
}

function variantLabel(variant: OrderItemSnapshot['variant']): string {
  const parts: string[] = [];
  if (variant.size) parts.push(variant.size);
  if (variant.color) parts.push(variant.color);
  if (variant.sleeve_type) parts.push(variant.sleeve_type.replace(/_/g, ' '));
  return parts.join(', ') || '-';
}

export function OrderOverview({ items, summary }: OrderOverviewProps) {
  return (
    <section className="rounded-xl border border-[#022C3F] bg-powder p-4">
      <h2 className="font-[Redzone] mb-3 text-lg font-bold text-[#022C3F]">Pesanan</h2>

      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.product_id} className="flex gap-3">
            <div className="size-16 shrink-0 overflow-hidden rounded-lg border border-[#7A213D] bg-[#FFE788]">
              {item.image_url ? (
                <Image
                  src={item.image_url}
                  alt={item.product_name}
                  width={64}
                  height={64}
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center text-xs">No img</div>
              )}
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="font-[Redzone] text-sm font-medium text-[#022C3F]">
                {item.product_name}
              </p>
              <p className="text-xs text-[#022C3F]/70">{variantLabel(item.variant)}</p>
              <p className="text-sm text-[#022C3F]">{formatPrice(item.unit_price)}</p>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-1">
              <span className="text-xs text-[#022C3F]/70">{item.quantity}×</span>
              <p className="text-sm font-medium text-[#022C3F]">{formatPrice(item.subtotal)}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4 space-y-1 border-t border-[#022C3F]/20 pt-3 text-sm text-[#022C3F]">
        <div className="flex justify-between font-bold">
          <span>Total ({summary.total_items} item)</span>
          <span>{formatPrice(summary.total_product_price)}</span>
        </div>
      </div>
    </section>
  );
}