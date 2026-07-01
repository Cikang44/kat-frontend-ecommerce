'use client';

import { ArrowDownLinear, BoxTickLinear } from 'vuesax-icon-pack';
import { useState } from 'react';

import type { MockOrderReceiver } from '@/domains/order/order.api';
import type {
  OrderDeliveryMethod,
  OrderOption,
} from '@/domains/order/order.types';
import { cn } from '@/lib/utils';

import { AccordionSection } from './accordion-section';

interface ShippingOptionsProps {
  deliveryMethod: OrderDeliveryMethod | null;
  onDeliveryMethodChange: (method: OrderDeliveryMethod) => void;
  pickupLocations: OrderOption[];
  shippingOptions: OrderOption[];
  receiver: MockOrderReceiver;
  onReceiverChange: (receiver: MockOrderReceiver) => void;
}

const deliveryLabels: Record<OrderDeliveryMethod, string> = {
  pickup: 'Ambil di ITB',
  shipping: 'Diantar',
};

const INPUT_CLASS =
  'w-full rounded-lg border border-[#FFF3B8]/50 bg-[#F1F7FC] px-3 py-2.5 text-sm text-[#022C3F] placeholder:text-[#022C3F]/40 outline-none focus:ring-2 focus:ring-[#FFF3B8]/60';

export function ShippingOptions({
  deliveryMethod,
  onDeliveryMethodChange,
  pickupLocations,
  shippingOptions,
  receiver,
  onReceiverChange,
}: ShippingOptionsProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const update = (patch: Partial<MockOrderReceiver>) =>
    onReceiverChange({ ...receiver, ...patch });

  return (
    <AccordionSection icon={<BoxTickLinear size={18} />} title="Opsi Pengiriman">
      <div className="space-y-3">
        {/* Dropdown — absolutely positioned above rest to avoid clipping */}
        <div className="relative z-20">
          <button
            type="button"
            onClick={() => setDropdownOpen((p) => !p)}
            className="flex w-full items-center justify-between rounded-lg border border-[#FFF3B8]/50 bg-[#F1F7FC] px-3 py-2.5 text-left text-sm text-[#022C3F]"
          >
            <span className="font-[Geom]">
              {deliveryMethod
                ? deliveryLabels[deliveryMethod]
                : 'Pilih metode pengiriman'}
            </span>
            <ArrowDownLinear
              size={14}
              className={cn(
                'text-[#022C3F]/60 transition-transform duration-200',
                dropdownOpen && 'rotate-180',
              )}
            />
          </button>

          <div
            className={cn(
              'absolute left-0 right-0 top-full mt-1 overflow-hidden rounded-lg border border-[#FFF3B8]/50 bg-white shadow-lg transition-all duration-150',
              dropdownOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0',
            )}
          >
            {(Object.keys(deliveryLabels) as OrderDeliveryMethod[]).map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => {
                  onDeliveryMethodChange(method);
                  setDropdownOpen(false);
                }}
                className={cn(
                  'w-full px-3 py-2.5 text-left text-sm transition-colors',
                  deliveryMethod === method
                    ? 'bg-[#FFF3B8]/30 font-semibold text-[#133B79]'
                    : 'text-[#022C3F]/70 hover:bg-[#F1F7FC]',
                )}
              >
                <span className="font-[Geom]">{deliveryLabels[method]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Pickup */}
        {deliveryMethod === 'pickup' && (
          <div className="space-y-2">
            <p className="font-[Geom] text-xs text-white/60">
              Silakan pilih lokasi pengambilan:
            </p>
            {pickupLocations.map((loc) => (
              <label
                key={loc.value}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#FFF3B8]/30 bg-white/10 px-3 py-2.5 text-sm has-checked:border-[#FFF3B8] has-checked:bg-[#FFF3B8]/20"
              >
                <input
                  type="radio"
                  name="pickup_location"
                  value={loc.value}
                  checked={receiver.pickup_location === loc.value}
                  onChange={(e) => update({ pickup_location: e.target.value })}
                  className="size-4 accent-[#FFF3B8]"
                />
                <span className="font-[Geom] text-white">{loc.label}</span>
              </label>
            ))}
          </div>
        )}

        {/* Shipping */}
        {deliveryMethod === 'shipping' && (
          <div className="space-y-3">
            <label className="flex flex-col gap-1.5">
              <span className="font-[Geom] text-xs font-semibold uppercase tracking-wide text-white">
                Alamat: <span className="text-red-400">*</span>
              </span>
              <textarea
                value={receiver.address}
                onChange={(e) => update({ address: e.target.value })}
                placeholder="Masukkan alamat lengkap..."
                rows={3}
                className={INPUT_CLASS + ' resize-none'}
              />
              <span className="font-[Geom] text-[10px] leading-relaxed text-white/40">
                *Note: beban ongkir akan diberitahukan oleh panitia via chat WhatsApp;
              </span>
            </label>

            <p className="font-[Geom] text-xs text-white/60">
              Silakan pilih opsi pengiriman:
            </p>
            {shippingOptions.map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#FFF3B8]/30 bg-white/10 px-3 py-2.5 text-sm has-checked:border-[#FFF3B8] has-checked:bg-[#FFF3B8]/20"
              >
                <input
                  type="radio"
                  name="shipping_option"
                  value={opt.value}
                  checked={receiver.shipping_option === opt.value}
                  onChange={(e) => update({ shipping_option: e.target.value })}
                  className="size-4 accent-[#FFF3B8]"
                />
                <span className="font-[Geom] text-white">{opt.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </AccordionSection>
  );
}
