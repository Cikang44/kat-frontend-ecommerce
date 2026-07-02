'use client';

import { UserLinear } from 'vuesax-icon-pack';

import type {
  MockCheckoutUserPrefill,
  MockOrderReceiver,
} from '@/domains/order/order.api';

import { AccordionSection } from './accordion-section';

export interface ContactInfoFormProps {
  receiver: MockOrderReceiver;
  onReceiverChange: (receiver: MockOrderReceiver) => void;
  prefill: MockCheckoutUserPrefill;
  submitted?: boolean;
}

const FIELDS: {
  key: keyof MockOrderReceiver;
  label: string;
  placeholder: string;
  type?: string;
}[] = [
  { key: 'name', label: 'Nama', placeholder: 'Nama' },
  { key: 'faculty', label: 'F/S', placeholder: 'Fakultas/Sekolah' },
  { key: 'major', label: 'Jurusan', placeholder: 'Jurusan' },
  { key: 'phone', label: 'No. HP', placeholder: '08xxxxxxxxxx', type: 'tel' },
  { key: 'line', label: 'ID Line', placeholder: '@username' },
  { key: 'email', label: 'Email', placeholder: 'nama@itb.ac.id', type: 'email' },
];

const ROW_LAYOUT = ['name', ['faculty', 'major'], 'phone', 'line', 'email'] as const;
export function ContactInfoForm({
  receiver,
  onReceiverChange,
  prefill,
  submitted = false,
}: ContactInfoFormProps) {
  const update = (patch: Partial<MockOrderReceiver>) =>
    onReceiverChange({ ...receiver, ...patch });

  return (
    <AccordionSection icon={<UserLinear size={18} />} title="Kontak">
      <div className="space-y-4">
        {ROW_LAYOUT.map((row) => {
          if (typeof row === 'string') {
            const f = FIELDS.find((x) => x.key === row)!;
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
          }
          const left = FIELDS.find((x) => x.key === row[0])!;
          const right = FIELDS.find((x) => x.key === row[1])!;
          const leftError = submitted && receiver[left.key].trim() === '';
          const rightError = submitted && receiver[right.key].trim() === '';
          return (
            <div key={row.join('-')} className="flex flex-col gap-4 sm:flex-row">
              <InputRow label={left.label} error={leftError} className="flex-1">
                <input
                  value={receiver[left.key]}
                  onChange={(e) => update({ [left.key]: e.target.value })}
                  placeholder={prefill[left.key as keyof typeof prefill] || left.placeholder}
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm text-[#022C3F] placeholder:text-[#022C3F]/40 outline-none focus:ring-2 focus:ring-[#FFF3B8]/60 bg-[#F1F7FC] ${leftError ? 'border-red-400' : 'border-[#FFF3B8]/50'}`}
                />
              </InputRow>
              <InputRow label={right.label} error={rightError} className="flex-1">
                <input
                  value={receiver[right.key]}
                  onChange={(e) => update({ [right.key]: e.target.value })}
                  placeholder={prefill[right.key as keyof typeof prefill] || right.placeholder}
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm text-[#022C3F] placeholder:text-[#022C3F]/40 outline-none focus:ring-2 focus:ring-[#FFF3B8]/60 bg-[#F1F7FC] ${rightError ? 'border-red-400' : 'border-[#FFF3B8]/50'}`}
                />
              </InputRow>
            </div>
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
