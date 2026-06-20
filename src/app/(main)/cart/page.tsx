'use client';

import { CartItemRow } from '@/components/cart/cart-item-row';
import { CartSummaryCard } from '@/components/cart/cart-summary-card';
import { useCartItems } from '@/domains/cart/cart.hooks';

export default function CartPage() {
  const items = useCartItems();

  if (items.length === 0) {
    return (
      <h1 className="mb-6 px-2 font-[redzone] text-4xl font-bold text-[#022C3F]"> Cart Kosong </h1>
    );
  }

  return (
    <div className="px-4 py-6">
      <h1 className="mb-6 px-2 font-[redzone] text-4xl font-bold text-[#022C3F]">
        Cart ({items.length})
      </h1>

      <div className="space-y-3 pb-28">
        {items.map((item) => (
          <CartItemRow key={item.localId} item={item} />
        ))}
      </div>

      <CartSummaryCard />
    </div>
  );
}
