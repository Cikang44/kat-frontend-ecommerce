'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useAllChecked, useCheckedCount, useCheckedTotalPrice } from '@/domains/cart/cart.hooks';
import { useCartStore } from '@/lib/providers';

export function CartSummaryCard() {
  const allChecked = useAllChecked();
  const checkedCount = useCheckedCount();
  const totalPrice = useCheckedTotalPrice();
  const toggleSelectAll = useCartStore((s) => s.toggleSelectAll);

  return (
    <div className="sticky inset-x-0 bottom-0 z-10 rounded-xl border-[#FFE788] bg-[#022C3F] shadow-lg">
      <div className="sm:grid-2 mx-auto flex items-center gap-2 p-2 sm:p-4">
        {/* Select all */}
        <div className="flex items-center gap-4">
          <Checkbox
            className="md:size-6 md:[&>span>svg]:size-4.5"
            checked={allChecked}
            onCheckedChange={(checked) => toggleSelectAll(checked === true)}
            aria-label={allChecked ? 'Hapus semua pilihan' : 'Pilih semua'}
          />
          <span className="font-[Geom] text-xs font-medium whitespace-nowrap text-white sm:text-sm">
            Pilih Semua
          </span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Total price */}
        <p className="font-[Geom] text-sm font-bold whitespace-nowrap text-white sm:text-base">
          {Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(totalPrice)}
        </p>

        {/* Checkout button */}
        <Button
          disabled
          className="bg-[#FFE788] px-4 py-1.5 font-[Redzone] text-xs text-[#022C3F] sm:px-6 sm:py-2 sm:text-base"
        >
          Check Out{checkedCount > 0 ? ` (${checkedCount})` : ''}
        </Button>
      </div>
    </div>
  );
}
