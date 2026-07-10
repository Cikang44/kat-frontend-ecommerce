'use client';
import { ArrowDownLinear, ShoppingCartBroken } from 'vuesax-icon-pack';
import { useState } from 'react';
import type { OrderDeliveryMethod, OrderReceiver } from '@/domains/order/order.types';
import { cn } from '@/lib/utils';
import { AccordionSection } from './accordion-section';

interface ShippingOptionsProps {
  deliveryMethod: OrderDeliveryMethod | null;
  onDeliveryMethodChange: (method: OrderDeliveryMethod) => void;
  receiver: OrderReceiver;
  onReceiverChange: (receiver: OrderReceiver) => void;
  submitted?: boolean;
}

const deliveryLabels: Record<OrderDeliveryMethod, string> = {
  pickup: 'Ambil di ITB',
  shipping: 'Diantar',
};

const INPUT_CLASS =
  'w-full rounded-lg border bg-[#F1F7FC] px-3 py-2.5 text-sm text-[#022C3F] placeholder:text-[#022C3F]/40 outline-none focus:ring-2 focus:ring-[#FFF3B8]/60';

export function ShippingOptions({
  deliveryMethod,
  onDeliveryMethodChange,
  receiver,
  onReceiverChange,
  submitted = false,
}: ShippingOptionsProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const update = (patch: Partial<OrderReceiver>) =>
    onReceiverChange({ ...receiver, ...patch });

  return (
    <AccordionSection icon={<ShoppingCartBroken size={18} />} title="Opsi Pengiriman">
      <div className="space-y-3">
        <div className="relative z-20">
          <button
            type="button"
            onClick={() => setDropdownOpen((p) => !p)}
            className={`flex w-full items-center justify-between rounded-lg border bg-[#F1F7FC] px-3 py-2.5 text-left text-sm text-[#022C3F] ${
              submitted && !deliveryMethod ? 'border-red-400' : 'border-[#FFF3B8]/50'
            }`}
          >
            <span className="font-[Geom]">
              {deliveryMethod ? deliveryLabels[deliveryMethod] : 'Pilih metode pengiriman'}
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
          {submitted && !deliveryMethod && (
            <span className="font-[Geom] text-[10px] text-red-400">Pilih metode pengiriman</span>
          )}
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="font-[Geom] text-xs font-semibold uppercase tracking-wide text-white">
            {deliveryMethod === 'pickup' ? 'Titik Ambil' : 'Alamat'}:{' '}
            <span className="text-red-400">*</span>
          </span>
          <textarea
            value={receiver.address}
            onChange={(e) => update({ address: e.target.value })}
            placeholder={
              deliveryMethod === 'pickup'
                ? 'Masukkan titik pengambilan...'
                : 'Masukkan alamat lengkap...'
            }
            rows={3}
            className={`${INPUT_CLASS} resize-none ${
              submitted && receiver.address.trim() === '' ? 'border-red-400' : 'border-[#FFF3B8]/50'
            }`}
          />
          {submitted && receiver.address.trim() === '' && (
            <span className="font-[Geom] text-[10px] text-red-400">
              {deliveryMethod === 'pickup' ? 'Titik ambil wajib diisi' : 'Alamat wajib diisi'}
            </span>
          )}
          {deliveryMethod === 'shipping' && (
            <span className="font-[Geom] text-[10px] leading-relaxed text-white/40">
              *Note: beban ongkir akan diberitahukan oleh panitia via chat WhatsApp;
            </span>
          )}
        </label>
      </div>
    </AccordionSection>
  );
}
