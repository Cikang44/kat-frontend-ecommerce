'use client';
import { ShoppingCartBroken } from 'vuesax-icon-pack';

import { AccordionSection } from './accordion-section';

interface ShippingOptionsProps {
  /** Fixed pickup point shown to the user (shipping is disabled for now). */
  pickupAddress: string;
}

/**
 * Shipping ("Diantar") is temporarily disabled — the only option is pickup at a
 * fixed point. This renders a locked, read-only view instead of the previous
 * interactive method dropdown + address field.
 */
export function ShippingOptions({ pickupAddress }: ShippingOptionsProps) {
  return (
    <AccordionSection icon={<ShoppingCartBroken size={18} />} title="Opsi Pengiriman">
      <div className="space-y-3">
        <div>
          <span className="font-[Geom] text-xs font-semibold uppercase tracking-wide text-white">
            Metode
          </span>
          <div className="mt-1.5 flex w-full items-center justify-between rounded-lg border border-[#FFF3B8]/50 bg-[#F1F7FC] px-3 py-2.5 text-sm text-[#022C3F]">
            <span className="font-[Geom]">Ambil di ITB</span>
            <span className="rounded-md bg-[#133B79] px-2 py-0.5 text-[10px] font-semibold text-white">
              Default
            </span>
          </div>
        </div>

        <div>
          <span className="font-[Geom] text-xs font-semibold uppercase tracking-wide text-white">
            Titik Ambil
          </span>
          <div className="mt-1.5 w-full rounded-lg border border-[#FFF3B8]/50 bg-[#F1F7FC] px-3 py-2.5 text-sm text-[#022C3F]">
            <span className="font-[Geom]">{pickupAddress}</span>
          </div>
        </div>

        <p className="font-[Geom] text-[10px] leading-relaxed text-white/40">
          *Sementara hanya tersedia pengambilan di tempat (Kampus ITB).
        </p>
      </div>
    </AccordionSection>
  );
}
