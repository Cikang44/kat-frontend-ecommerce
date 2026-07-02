'use client';

import { Input } from '@/components/ui/input';
import type {
  MockCheckoutUserPrefill,
  MockOrderReceiver,
} from '@/domains/order/order.api';
import type {
  OrderDeliveryMethod,
  OrderOption,
} from '@/domains/order/order.types';

interface DeliveryFormProps {
  deliveryOptions: OrderOption[];
  pickupLocations: OrderOption[];
  shippingOptions: OrderOption[];
  deliveryMethod: OrderDeliveryMethod | null;
  onDeliveryMethodChange: (method: OrderDeliveryMethod) => void;
  receiver: MockOrderReceiver;
  onReceiverChange: (receiver: MockOrderReceiver) => void;
  prefill: MockCheckoutUserPrefill;
  onSubmit: () => void;
  isSubmitted: boolean;
}

export function DeliveryForm({
  deliveryOptions,
  pickupLocations,
  shippingOptions,
  deliveryMethod,
  onDeliveryMethodChange,
  receiver,
  onReceiverChange,
  prefill,
  onSubmit,
  isSubmitted,
}: DeliveryFormProps) {
  const contactValid =
    receiver.name.trim() !== '' &&
    receiver.faculty.trim() !== '' &&
    receiver.major.trim() !== '' &&
    receiver.phone.trim() !== '' &&
    receiver.line.trim() !== '' &&
    receiver.email.trim() !== '';

  const deliveryValid =
    deliveryMethod === 'pickup'
      ? receiver.pickup_location.trim() !== ''
      : deliveryMethod === 'shipping'
        ? receiver.address.trim() !== '' && receiver.shipping_option.trim() !== ''
        : false;

  return (
    <section className="rounded-xl border-[5px] border-[#022C3F] bg-powder p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h2 className="font-[Redzone] text-lg font-bold text-[#022C3F]">Pengiriman</h2>
        <span className="font-[Geom] text-xs text-[#022C3F]/70">
          {isSubmitted ? 'Form tersimpan' : 'Isi lalu submit form'}
        </span>
      </div>

      <div className="space-y-3">
        <div className="space-y-3">
          <h3 className="font-[Geom] text-sm font-medium text-[#022C3F]">Contact Info</h3>

          <Field label="Nama">
            <Input
              value={receiver.name}
              onChange={(e) => onReceiverChange({ ...receiver, name: e.target.value })}
              placeholder={prefill.name || 'Nama'}
              required
            />
          </Field>

          <Field label="Fakultas">
            <Input
              value={receiver.faculty}
              onChange={(e) => onReceiverChange({ ...receiver, faculty: e.target.value })}
              placeholder={prefill.faculty || 'Fakultas'}
              required
            />
          </Field>

          <Field label="Jurusan">
            <Input
              value={receiver.major}
              onChange={(e) => onReceiverChange({ ...receiver, major: e.target.value })}
              placeholder={prefill.major || 'Jurusan'}
              required
            />
          </Field>

          <Field label="No. HP">
            <Input
              value={receiver.phone}
              onChange={(e) => onReceiverChange({ ...receiver, phone: e.target.value })}
              placeholder={prefill.phone || '08xxxxxxxxxx'}
              required
            />
          </Field>

          <Field label="ID Line">
            <Input
              value={receiver.line}
              onChange={(e) => onReceiverChange({ ...receiver, line: e.target.value })}
              placeholder={prefill.line || '@username'}
              required
            />
          </Field>

          <Field label="Email">
            <Input
              type="email"
              value={receiver.email}
              onChange={(e) => onReceiverChange({ ...receiver, email: e.target.value })}
              placeholder={prefill.email || 'nama@itb.ac.id'}
              required
            />
          </Field>
        </div>

        <fieldset className="space-y-2">
          <legend className="font-[Geom] text-sm font-medium text-[#022C3F]">Delivery Options</legend>
          {deliveryOptions.map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-start gap-3 rounded-lg border border-[#022C3F]/30 p-3 has-checked:border-[#022C3F] has-checked:bg-[#FFE788]/40"
            >
              <input
                type="radio"
                name="deliveryMethod"
                value={opt.value}
                checked={deliveryMethod === opt.value}
                onChange={() => onDeliveryMethodChange(opt.value as OrderDeliveryMethod)}
                className="mt-1 size-4 accent-[#022C3F]"
              />
              <span className="font-[Geom] text-sm font-medium text-[#022C3F]">{opt.label}</span>
            </label>
          ))}
        </fieldset>

        {deliveryMethod === 'pickup' && (
          <Field label="Pickup Location">
            <select
              value={receiver.pickup_location}
              onChange={(e) => onReceiverChange({ ...receiver, pickup_location: e.target.value })}
              className="w-full rounded-md border border-input bg-transparent px-2.5 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              required
            >
              <option value="">Pilih pickup location</option>
              {pickupLocations.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>
        )}

        {deliveryMethod === 'shipping' && (
          <div className="space-y-3">
            <Field label="Alamat">
              <textarea
                value={receiver.address}
                onChange={(e) => onReceiverChange({ ...receiver, address: e.target.value })}
                placeholder="Jl. Contoh No. 1, Kota, Kode Pos"
                required
                rows={3}
                className="w-full rounded-md border border-input bg-transparent px-2.5 py-1.5 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </Field>

            <Field label="Opsi Pengiriman">
              <select
                value={receiver.shipping_option}
                onChange={(e) => onReceiverChange({ ...receiver, shipping_option: e.target.value })}
                className="w-full rounded-md border border-input bg-transparent px-2.5 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                required
              >
                <option value="">Pilih opsi pengiriman</option>
                {shippingOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        )}

        <button
          type="button"
          disabled={!contactValid || !deliveryValid}
          onClick={onSubmit}
          className="w-full rounded-md bg-[#022C3F] px-4 py-2 font-[Redzone] text-sm text-[#FFE788] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Submit Form Pengiriman
        </button>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-[Geom] text-xs font-medium text-[#022C3F]/80">{label}</span>
      {children}
    </label>
  );
}
