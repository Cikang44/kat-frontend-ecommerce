'use client';

import type {
  OrderOption,
  OrderPaymentMethod,
} from '@/domains/order/order.types';

interface PaymentMethodSelectorProps {
  paymentMethods: OrderOption[];
  paymentMethod: OrderPaymentMethod | null;
  onPaymentMethodChange: (method: OrderPaymentMethod) => void;
}

export function PaymentMethodSelector({
  paymentMethods,
  paymentMethod,
  onPaymentMethodChange,
}: PaymentMethodSelectorProps) {
  return (
    <section className="rounded-xl border-[5px] border-[#022C3F] bg-powder p-4">
      <h2 className="font-[Redzone] mb-3 text-lg font-bold text-[#022C3F]">Metode Pembayaran</h2>

      <fieldset className="space-y-2">
        <legend className="sr-only">Metode pembayaran</legend>
        {paymentMethods.map((opt) => (
          <label
            key={opt.value}
            className="flex cursor-pointer items-start gap-3 rounded-lg border border-[#022C3F]/30 p-3 has-checked:border-[#022C3F] has-checked:bg-[#FFE788]/40"
          >
            <input
              type="radio"
              name="paymentMethod"
              value={opt.value}
              checked={paymentMethod === opt.value}
              onChange={() => onPaymentMethodChange(opt.value as OrderPaymentMethod)}
              className="mt-1 size-4 accent-[#022C3F]"
            />
            <span className="font-[Geom] text-sm font-medium text-[#022C3F]">{opt.label}</span>
          </label>
        ))}
      </fieldset>
    </section>
  );
}