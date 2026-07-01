'use client';

import { formatPrice } from '@/lib/utils';

interface MockCartItem {
  product: string;
  variant: { size: string; color: string };
  quantity: number;
  unitPrice: number;
}

const MOCK_ITEMS: MockCartItem[] = [
  { product: 'Kaos Angkatan', variant: { size: 'S', color: 'Putih' }, quantity: 2, unitPrice: 150_000 },
  { product: 'Kaos Angkatan', variant: { size: 'M', color: 'Putih' }, quantity: 2, unitPrice: 150_000 },
  { product: 'Kaos Angkatan', variant: { size: 'L', color: 'Putih' }, quantity: 1, unitPrice: 150_000 },
];

export function MockCartTable() {
  const totalQuantity = MOCK_ITEMS.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = MOCK_ITEMS.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  return (
    <section className="rounded-xl border border-[#022C3F] bg-powder p-4">
      <h2 className="mb-4 flex items-center gap-2 font-[Redzone] text-lg font-bold text-[#022C3F]">
        <svg
          className="size-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        Shopping Cart
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-[#022C3F]">
          <thead>
            <tr className="border-b border-[#022C3F]/20 font-[Redzone] text-xs uppercase tracking-wider text-[#022C3F]/70">
              <th className="pb-2 text-left font-medium">Produk</th>
              <th className="pb-2 text-left font-medium">Varian</th>
              <th className="pb-2 text-center font-medium">Kuantitas</th>
              <th className="pb-2 text-right font-medium">Total Harga</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_ITEMS.map((item, i) => (
              <tr key={i} className="border-b border-[#022C3F]/10 font-[Geom] last:border-b-0">
                <td className="py-3 pr-4 font-medium">{item.product}</td>
                <td className="py-3 pr-4 text-[#022C3F]/70">
                  {item.variant.size}, {item.variant.color}
                </td>
                <td className="py-3 text-center">{item.quantity}</td>
                <td className="py-3 pl-4 text-right">
                  {formatPrice(item.unitPrice * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[#022C3F]/20 pt-3 font-[Redzone] font-bold text-[#022C3F]">
        <span className="text-sm">Total ({totalQuantity} produk)</span>
        <span className="text-base">{formatPrice(totalPrice)}</span>
      </div>
    </section>
  );
}
