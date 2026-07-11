'use client';

import { MinusIcon, PlusIcon, Trash2Icon } from 'lucide-react';

import type { CartItem } from '@/api/types.gen';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cartItemTitle, cartItemVariantLabel } from '@/domains/cart/cart-selection';
import { useRemoveCartItem, useUpdateCartItem } from '@/domains/cart/cart.hooks';
import { cn, formatPrice } from '@/lib/utils';

interface CartItemRowProps {
  item: CartItem;
  selected: boolean;
  onToggle: () => void;
}

export function CartItemRow({ item, selected, onToggle }: CartItemRowProps) {
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  const isBundle = item.itemType === 'bundle';
  const variantDesc = cartItemVariantLabel(item);
  const imageUrl = isBundle ? '' : item.product.imageUrl;
  // Only variant items expose stock; bundles are validated server-side.
  const atMaxQty = !isBundle && item.quantity >= item.variant.stock;
  const busy = updateItem.isPending || removeItem.isPending;

  const changeQty = (next: number) => {
    if (next < 1 || busy) return;
    updateItem.mutate({ itemId: item.id, quantity: next });
  };

  return (
    <div className="bg-powder flex items-center gap-2 rounded-xl border border-[#022C3F] p-4 md:gap-7">
      {/* Checkbox */}
      <div className="flex shrink-0 items-center px-1 md:size-9 md:px-2">
        <Checkbox
          className="data-checked:bg-navy-deep [&>span>svg]:text-cream border-[#022C3F] md:size-6 md:[&>span>svg]:size-4.5"
          checked={selected}
          onCheckedChange={onToggle}
          aria-label={selected ? 'Hapus dari pilihan checkout' : 'Pilih untuk checkout'}
        />
      </div>

      {/* Thumbnail */}
      <div className="size-16 shrink-0 overflow-hidden rounded-lg border border-[#7A213D] bg-[#FFE788] md:size-24">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={cartItemTitle(item)} className="size-full object-cover" />
        ) : (
          <div
            className={cn(
              'flex size-full items-center justify-center text-center text-[9px] md:text-xs',
              isBundle ? 'bg-[#774C26] text-white' : '',
            )}
          >
            {isBundle ? 'PAKET' : 'No img'}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-navy font-[Redzone] text-sm font-medium text-pretty sm:text-xl">
          {cartItemTitle(item)}
        </p>

        {isBundle ? (
          <p className="inline w-fit rounded-md bg-[#774C26] px-3 py-0.5 text-center font-[Geom] text-xs text-white">
            Paket · {item.bundle.items.length} item
          </p>
        ) : (
          variantDesc && (
            <p className="inline w-fit rounded-md bg-[#774C26] px-3 py-0.5 text-center font-[Geom] text-xs text-white">
              {variantDesc}
            </p>
          )
        )}

        <p className="text-sm text-[#022C3F]">{formatPrice(item.unitPrice)}</p>
      </div>

      {/* Quantity + remove */}
      <div className="flex shrink-0 flex-col items-end gap-2">
        <button
          type="button"
          onClick={() => removeItem.mutate(item.id)}
          disabled={busy}
          aria-label="Hapus item"
          className="text-[#7A213D] hover:text-[#022C3F] disabled:opacity-40"
        >
          <Trash2Icon className="size-4 md:size-5" />
        </button>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon-xs"
            disabled={busy || item.quantity <= 1}
            className="cursor-pointer border-[#022C3F] bg-[#FFE788] hover:bg-[#FFE788] disabled:cursor-not-allowed md:size-8"
            onClick={() => changeQty(item.quantity - 1)}
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
            disabled={busy || atMaxQty}
            className="cursor-pointer border-[#022C3F] bg-[#FFE788] hover:bg-[#FFE788] disabled:cursor-not-allowed md:size-8"
            onClick={() => changeQty(item.quantity + 1)}
            aria-label="Tambah jumlah"
          >
            <PlusIcon />
          </Button>
        </div>

        <span className="font-[Geom] text-xs font-bold text-[#022C3F]">
          {formatPrice(item.subtotal)}
        </span>
      </div>
    </div>
  );
}
