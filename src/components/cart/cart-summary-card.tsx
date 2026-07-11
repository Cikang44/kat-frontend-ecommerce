'use client';

import { useRouter } from 'next/navigation';

import type { CartItem } from '@/api/types.gen';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  isAllSelected,
  selectedCount,
  selectedItemIds,
  selectedSubtotal,
} from '@/domains/cart/cart-selection';
import { useInitiateOrder } from '@/domains/order/order.hooks';
import { formatPrice } from '@/lib/utils';

interface CartSummaryCardProps {
  items: CartItem[];
  selected: Set<string>;
  onToggleAll: (all: boolean) => void;
}

export function CartSummaryCard({ items, selected, onToggleAll }: CartSummaryCardProps) {
  const router = useRouter();
  const initiateOrder = useInitiateOrder();

  const allChecked = isAllSelected(items, selected);
  const count = selectedCount(items, selected);
  const total = selectedSubtotal(items, selected);

  const handleCheckout = () => {
    const ids = selectedItemIds(items, selected);
    if (ids.length === 0) return;
    initiateOrder.mutate(
      { cart_item_ids: ids },
      { onSuccess: (result) => router.push(`/checkout/${result.order_id}`) },
    );
  };

  return (
    <div className="rounded-xl border-[#FFE788] bg-[#022C3F] shadow-lg">
      <div className="mx-auto flex items-center gap-2 p-2 sm:p-4">
        {/* Select all */}
        <div className="flex items-center gap-4">
          <Checkbox
            className="md:size-6 md:[&>span>svg]:size-4.5"
            checked={allChecked}
            onCheckedChange={(checked) => onToggleAll(checked === true)}
            aria-label={allChecked ? 'Hapus semua pilihan' : 'Pilih semua'}
          />
          <span className="font-[Geom] text-xs font-medium whitespace-nowrap text-white sm:text-sm">
            Pilih Semua
          </span>
        </div>

        <div className="flex-1" />

        <p className="font-[Geom] text-sm font-bold whitespace-nowrap text-white sm:text-base">
          {formatPrice(total)}
        </p>

        <Button
          disabled={count === 0 || initiateOrder.isPending}
          onClick={handleCheckout}
          className="bg-[#FFE788] px-4 py-1.5 font-[Redzone] text-xs text-[#022C3F] sm:px-6 sm:py-2 sm:text-base"
        >
          {initiateOrder.isPending ? 'Memproses...' : `Check Out${count > 0 ? ` (${count})` : ''}`}
        </Button>
      </div>

      {initiateOrder.isError && (
        <p className="px-4 pb-2 font-[Geom] text-xs text-red-300">
          {initiateOrder.error?.message}
        </p>
      )}
    </div>
  );
}
