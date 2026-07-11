'use client';

import { UserLinear } from 'vuesax-icon-pack';

import type { CheckoutOrder, OrderReceiver } from '@/domains/order/order.types';

import { AccordionSection } from './accordion-section';

export interface ContactInfoFormProps {
  receiver: OrderReceiver;
  onReceiverChange: (receiver: OrderReceiver) => void;
  prefill: CheckoutOrder['user_prefill'];
  submitted?: boolean;
}

const FIELDS: {
  key: keyof OrderReceiver;
  label: string;
  placeholder: string;
  type?: string;
}[] = [
  { key: 'name', label: 'Nama', placeholder: 'Nama' },
  { key: 'phone', label: 'No. HP', placeholder: '08xxxxxxxxxx', type: 'tel' },
  { key: 'line', label: 'ID Line', placeholder: '@username' },
];

const ROW_LAYOUT = ['name', 'phone', 'line'] as const;

export function ContactInfoForm({
  receiver,
  onReceiverChange,
  prefill,
  submitted = false,
}: ContactInfoFormProps) {
  const update = (patch: Partial<OrderReceiver>) =>
    onReceiverChange({ ...receiver, ...patch });

  return (
    <AccordionSection icon={<UserLinear size={18} />} title="Kontak">
      <div className="space-y-4">
        {ROW_LAYOUT.map((key) => {
          const f = FIELDS.find((x) => x.key === key)!;
          const hasError = submitted && receiver[f.key].trim() === '';
          return (
            <InputRow key={f.key} label={f.label} error={hasError}>
              <input
                type={f.type ?? 'text'}
                value={receiver[f.key]}
                onChange={(e) => update({ [f.key]: e.target.value })}
                placeholder={prefill[f.key as keyof typeof prefill] || f.placeholder}
                className={`w-full rounded-lg border px-3 py-2.5 text-sm text-[#022C3F] placeholder:text-[#022C3F]/40 outline-none focus:ring-2 focus:ring-[#FFF3B8]/60 bg-[#F1F7FC] ${hasError ? 'border-red-400' : 'border-[#FFF3B8]/50'}`}
              />
            </InputRow>
          );
        })}
      </div>
    </AccordionSection>
  );
}

function InputRow({
  label,
  children,
  className,
  error,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  error?: boolean;
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${className ?? ''}`}>
      <span className="font-[Geom] text-xs font-semibold uppercase tracking-wide text-white">
        {label} <span className="text-red-400">*</span>
      </span>
      {children}
      {error && (
        <span className="font-[Geom] text-[10px] text-red-400">Wajib diisi</span>
      )}
    </label>
  );
}
