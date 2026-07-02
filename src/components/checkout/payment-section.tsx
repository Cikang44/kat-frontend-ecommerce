'use client';
import { ArrowDownLinear, WalletIcon2Linear } from 'vuesax-icon-pack';
import { useState } from 'react';
import type { OrderOption, OrderPaymentMethod } from '@/domains/order/order.types';
import { cn } from '@/lib/utils';
import { AccordionSection } from './accordion-section';

interface PaymentSectionProps {
  paymentMethods: OrderOption[];
  paymentMethod: OrderPaymentMethod | null;
  onPaymentMethodChange: (method: OrderPaymentMethod) => void;
}

export function PaymentSection({
  paymentMethods,
  paymentMethod,
  onPaymentMethodChange,
}: PaymentSectionProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selectedLabel = paymentMethod
    ? paymentMethods.find((m) => m.value === paymentMethod)?.label ?? 'Pilih metode'
    : 'Pilih metode pembayaran';

  return (
    <AccordionSection icon={<WalletIcon2Linear size={18} />} title="Metode Pembayaran">
      <div className="relative z-20">
        <button
          type="button"
          onClick={() => setDropdownOpen((p) => !p)}
          className="flex w-full items-center justify-between rounded-lg border border-[#FFF3B8]/50 bg-[#F1F7FC] px-3 py-2.5 text-left text-sm"
        >
          <span className="flex items-center gap-2 font-[Geom] text-[#022C3F]">
            {paymentMethod === 'qris' && (
              <img src="/qris.png" alt="QRIS" className="h-6 object-contain" />
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

        <div
          className={cn(
            'absolute left-0 right-0 top-full mt-1 overflow-hidden rounded-lg border border-[#FFF3B8]/50 bg-white shadow-lg transition-all duration-150',
            dropdownOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
          )}
        >
          {paymentMethods.map((opt) => (
            <button
              key={opt.value}
              type="button"
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
              <span className="flex items-center gap-2">
                {opt.value === 'qris' && (
                  <img src="/qris.png" alt="QRIS" className="h-5 object-contain" />
                )}
                <span className="font-[Geom]">{opt.label}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </AccordionSection>
  );
}
