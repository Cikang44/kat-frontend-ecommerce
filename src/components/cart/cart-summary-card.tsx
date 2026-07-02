'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useAllChecked, useCheckedCount, useCheckedTotalPrice } from '@/domains/cart/cart.hooks';
import { useInitiateOrder } from '@/domains/order/order.hooks';
import { useCartStore } from '@/lib/providers';
import { formatPrice } from '@/lib/utils';

export function CartSummaryCard() {
  const router = useRouter();
  const allChecked = useAllChecked();
  const checkedCount = useCheckedCount();
  const checkedTotalPrice = useCheckedTotalPrice();
  const toggleSelectAll = useCartStore((s) => s.toggleSelectAll);
  const clearChecked = useCartStore((s) => s.clearChecked);
  // Subscribe to the stable `items` reference and derive checked ids in a memo;
  // subscribing directly to a filtered array (useCheckedItems) returns a new
  // reference on every snapshot and breaks useSyncExternalStore (infinite loop).
  const items = useCartStore((s) => s.items);
  const checkedItemIds = useMemo(
    () => items.filter((i) => i.checked).map((i) => i.localId),
    [items],
  );

  const initiateOrder = useInitiateOrder();

  const handleCheckout = () => {
    if (checkedItemIds.length === 0) return;

    initiateOrder.mutate(
      { cart_item_ids: checkedItemIds },
      {
        onSuccess: (result) => {
          // Remove the checked-out items once the draft order exists.
          router.push(`/checkout/${result.order_id}`);
        },
      },
    );
  };

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
          {formatPrice(checkedTotalPrice)}
        </p>

        {/* Checkout button */}
        <Button
          disabled={checkedCount === 0 || initiateOrder.isPending}
          onClick={handleCheckout}
          className="bg-[#FFE788] px-4 py-1.5 font-[Redzone] text-xs text-[#022C3F] sm:px-6 sm:py-2 sm:text-base"
        >
          {initiateOrder.isPending
            ? 'Memproses...'
            : `Check Out${checkedCount > 0 ? ` (${checkedCount})` : ''}`}
        </Button>
      </div>
    </div>
  );
}
