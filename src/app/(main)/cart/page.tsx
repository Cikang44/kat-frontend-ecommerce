'use client';

import { useEffect, useRef, useState } from 'react';

import { CartItemRow } from '@/components/cart/cart-item-row';
import { CartSummaryCard } from '@/components/cart/cart-summary-card';
import { Spinner } from '@/components/ui/spinner';
import { setAllSelection, toggleSelection } from '@/domains/cart/cart-selection';
import { useCartQuery } from '@/domains/cart/cart.hooks';

export default function CartPage() {
  const { data, isPending, isError, error } = useCartQuery();
  const items = data?.items ?? [];

  // "Checked for checkout" is ephemeral UI state (backend doesn't track it).
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const initialized = useRef(false);
  useEffect(() => {
    if (!data) return;
    if (!initialized.current) {
      initialized.current = true;
      setSelected(setAllSelection(data.items, true)); // default: all selected
      return;
    }
    // Prune ids that no longer exist (e.g. after a delete).
    setSelected((prev) => {
      const ids = new Set(data.items.map((i) => i.id));
      const next = new Set([...prev].filter((id) => ids.has(id)));
      return next.size === prev.size ? prev : next;
    });
  }, [data]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: 'inherit' }}>
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-4 py-6">
        <p className="font-[Geom] text-red-500">
          {error?.message ?? 'Gagal memuat keranjang. Silakan coba lagi.'}
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <h1 className="mb-6 px-2 font-[redzone] text-4xl font-bold text-[#022C3F]"> Cart Kosong </h1>
    );
  }

  return (
    <div className="flex flex-col px-4 py-6" style={{ minHeight: 'inherit' }}>
      <h1 className="mb-6 px-2 font-[redzone] text-4xl font-bold text-[#022C3F]">
        Cart ({items.length})
      </h1>

      <div className="flex-1 space-y-3 overflow-y-auto pb-24">
        {items.map((item) => (
          <CartItemRow
            key={item.id}
            item={item}
            selected={selected.has(item.id)}
            onToggle={() => setSelected((prev) => toggleSelection(prev, item.id))}
          />
        ))}
      </div>

      <div className="sticky bottom-6 z-10">
        <CartSummaryCard
          items={items}
          selected={selected}
          onToggleAll={(all) => setSelected(setAllSelection(items, all))}
        />
      </div>
    </div>
  );
}
