'use client';

import { MinusIcon, PlusIcon } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import type { CartItem } from '@/domains/cart/cart.types';
import { useCartStore } from '@/lib/providers';
import { cn } from '@/lib/utils';

/** Build a compact, human-readable variant label from a cart item. */
function variantLabel(item: CartItem): string {
  const parts: string[] = [];
  if (item.sleeveType && item.sleeveType !== 'none') parts.push(item.sleeveType.replace(/_/g, ' '));
  if (item.size && item.size !== 'none') parts.push(item.size);
  if (item.color) parts.push(item.color);
  return parts.join(', ') || '';
}

export function CartItemRow({ item }: { item: CartItem }) {
  const toggleItemCheck = useCartStore((s) => s.toggleItemCheck);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  const cartItems = useCartStore((s) => s.items);
  const variantDesc = variantLabel(item);
  const atMaxQty = item.quantity >= item.stock;

  return (
    <div
      className={cn(
        'flex rounded-xl p-4 gap-2 md:gap-7 border border-[#022C3F] items-center bg-powder',
      )}
    >
      {/* Checkbox */}
      <div className="flex shrink-0 items-center px-1 md:size-9 md:px-2">
        <Checkbox
          className="data-checked:bg-navy-deep [&>span>svg]:text-cream border-[#022C3F] md:size-6 md:[&>span>svg]:size-4.5"
          checked={item.checked}
          onCheckedChange={() => toggleItemCheck(item.localId)}
          aria-label={item.checked ? 'Hapus dari pilihan checkout' : 'Pilih untuk checkout'}
        />
      </div>

      {/* Thumbnail */}
      <div className="size-16 shrink-0 overflow-hidden rounded-lg border border-[#7A213D] bg-[#FFE788] md:size-24">
        {item.productImage?.url ? (
          <Image
            src={item.productImage.url}
            alt={item.productName}
            width={96}
            height={96}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-xs">No img</div>
        )}
      </div>

      {/* Info */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="font-[Redzone] text-sm font-medium text-pretty text-[#7A213D] sm:text-xl">
          {item.productName}
        </p>

        {variantDesc && (
          <div>
            <p className="inline rounded-md bg-[#774C26] px-3 py-0.5 text-center font-[Geom] text-xs text-pretty text-white">
              {variantDesc}
            </p>
          </div>
        )}

        <p className="text-sm text-[#022C3F]">
          {Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(item.unitPrice)}
        </p>
      </div>

      {/*  Quantity controls + total  */}
      <div className="flex shrink-0 flex-col items-end gap-2">
        {/* Quantity stepper */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon-xs"
            className="cursor-pointer border-[#022C3F] bg-[#FFE788] hover:bg-[#FFE788] disabled:cursor-not-allowed md:size-8"
            onClick={() => {
              const current = cartItems.find((i) => i.localId === item.localId);
              if (current) updateQuantity(item.localId, current.quantity - 1);
            }}
            aria-label="Kurangi jumlah"
          >
            <MinusIcon />
          </Button>

          <span className="flex size-8 items-center justify-center text-sm font-medium tabular-nums">
            {item.quantity}
          </span>

          <Button
            type="button"
            variant="outline"
            size="icon-xs"
            disabled={atMaxQty}
            className="cursor-pointer border-[#022C3F] bg-[#FFE788] hover:bg-[#FFE788] disabled:cursor-not-allowed md:size-8"
            onClick={() => {
              const current = cartItems.find((i) => i.localId === item.localId);
              if (current) updateQuantity(item.localId, current.quantity + 1);
            }}
            aria-label="Tambah jumlah"
          >
            <PlusIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}
