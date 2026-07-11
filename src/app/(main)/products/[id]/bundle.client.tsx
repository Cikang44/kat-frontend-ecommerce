'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ShoppingBagBroken, TagIcon2Broken } from 'vuesax-icon-pack';

import type { BundleDetail, ProductVariant } from '@/api/types.gen';
import { BackButton } from '@/components/product/back-button';
import { QuantityControl } from '@/components/product/quantity-control';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useAddBundleToCart } from '@/domains/cart/cart.hooks';
import { useInitiateOrder } from '@/domains/order/order.hooks';
import {
  buildGroups,
  buildSelectedVariants,
  getMandatoryItems,
  isBundleSelectionValid,
} from '@/domains/product/bundle-selection';
import { useBundleDetail } from '@/domains/product/product.hooks';
import { formatPrice } from '@/lib/utils';

/** Human-readable label for a variant (size / color / sleeve). */
function variantLabel(v: ProductVariant): string {
  const parts: string[] = [];
  if (v.sleeveType && v.sleeveType !== 'none') parts.push(v.sleeveType.replace(/_/g, ' '));
  if (v.size && v.size !== 'none') parts.push(v.size);
  if (v.color) parts.push(v.color);
  return parts.join(' · ') || 'Standar';
}

export function BundleDetailClient({ id }: { id: string }) {
  const { data: bundle, isLoading, error, refetch } = useBundleDetail(id);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="size-10 text-[#fff3b8]" />
      </div>
    );
  }

  if (error || !bundle) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 pt-6 text-center md:pt-10.5">
        <h1 className="font-['Redzone'] text-2xl text-[#fff3b8]">Bundle tidak ditemukan</h1>
        <p className="font-['Geom'] text-[#fff3b8]/80">
          {error?.message ?? 'Coba muat ulang halaman ini.'}
        </p>
        <Button
          onClick={() => refetch()}
          className="rounded-[15px] bg-[#ffe788] font-['Geom'] font-bold text-[#022c3f] hover:bg-[#ffe788]/90"
        >
          Coba Lagi
        </Button>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden px-4 py-6 pt-6 md:px-8 md:pt-10.5 lg:px-12">
      <BundleDetailCard bundle={bundle} />
    </main>
  );
}

function BundleDetailCard({ bundle }: { bundle: BundleDetail }) {
  const router = useRouter();
  const addBundle = useAddBundleToCart();
  const initiateOrder = useInitiateOrder();

  const [quantity, setQuantity] = useState(1);

  // Mandatory components: everything that isn't part of a choose-one group.
  const mandatory = getMandatoryItems(bundle.items);
  const groups = buildGroups(bundle.items);

  // Chosen variant per product, and chosen product per option group.
  const [variantByProduct, setVariantByProduct] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const it of bundle.items) if (it.variants[0]) init[it.productId] = it.variants[0].id;
    return init;
  });
  const [groupChoice, setGroupChoice] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const [g, arr] of buildGroups(bundle.items)) init[g] = arr[0]?.productId ?? '';
    return init;
  });

  const setVariant = (productId: string, variantId: string) =>
    setVariantByProduct((prev) => ({ ...prev, [productId]: variantId }));

  const isValid = isBundleSelectionValid(bundle.items, variantByProduct, groupChoice);
  const subtotal = bundle.price * quantity;

  const handleAddToCart = () => {
    if (!isValid) return;
    addBundle.mutate({
      bundleId: bundle.id,
      selectedVariants: buildSelectedVariants(bundle.items, variantByProduct, groupChoice),
      quantity,
    });
  };

  const handleBuyNow = () => {
    if (!isValid) return;
    addBundle.mutate(
      {
        bundleId: bundle.id,
        selectedVariants: buildSelectedVariants(bundle.items, variantByProduct, groupChoice),
        quantity,
      },
      {
        onSuccess: (result) => {
          initiateOrder.mutate(
            { cart_item_ids: [result.item.id] },
            { onSuccess: (order) => router.push(`/checkout/${order.order_id}`) },
          );
        },
      },
    );
  };

  const pending = addBundle.isPending || initiateOrder.isPending;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">
      <div className="bg-powder flex flex-col gap-6 rounded-[15px] p-5 md:p-6">
        <BackButton />

        <div className="flex flex-col gap-2">
          <span className="w-fit rounded-md bg-[#774C26] px-3 py-0.5 font-['Geom'] text-xs text-white">
            PAKET · berisi {bundle.itemCount} item
          </span>
          <h1 className="from-royal bg-gradient-to-r to-[#5e68a3] bg-clip-text font-['Redzone'] text-[36px] leading-none text-transparent md:text-[56px]">
            {bundle.name}
          </h1>
          <p className="font-['Redzone'] text-3xl text-[#774c26] md:text-4xl">
            {formatPrice(bundle.price)}
          </p>
          {bundle.description && (
            <p className="text-ink font-['Geom'] text-sm leading-5">{bundle.description}</p>
          )}
        </div>

        {/* Mandatory components */}
        <div className="flex flex-col gap-4">
          <h2 className="text-royal font-['Redzone'] text-xl">Isi paket</h2>
          {mandatory.map((it) => (
            <ComponentPicker
              key={it.productId}
              title={it.productName}
              subtitle={it.quantity > 1 ? `${it.quantity}x` : undefined}
              variants={it.variants}
              selectedVariantId={variantByProduct[it.productId]}
              onSelect={(vid) => setVariant(it.productId, vid)}
            />
          ))}
        </div>

        {/* Choose-one option groups */}
        {[...groups.entries()].map(([group, arr]) => {
          const chosenPid = groupChoice[group];
          const chosen = arr.find((a) => a.productId === chosenPid);
          return (
            <div key={group} className="flex flex-col gap-3">
              <h2 className="text-royal font-['Redzone'] text-xl">Pilih salah satu</h2>
              <div className="flex flex-wrap gap-2">
                {arr.map((opt) => (
                  <button
                    key={opt.productId}
                    type="button"
                    onClick={() => setGroupChoice((p) => ({ ...p, [group]: opt.productId }))}
                    className={`rounded-lg border-2 px-4 py-2 font-['Geom'] text-sm transition-colors ${
                      opt.productId === chosenPid
                        ? 'border-royal bg-royal text-white'
                        : 'border-royal/40 text-royal hover:border-royal'
                    }`}
                  >
                    {opt.productName}
                  </button>
                ))}
              </div>
              {chosen && chosen.variants.length > 1 && (
                <ComponentPicker
                  title={`Varian ${chosen.productName}`}
                  variants={chosen.variants}
                  selectedVariantId={variantByProduct[chosen.productId]}
                  onSelect={(vid) => setVariant(chosen.productId, vid)}
                />
              )}
            </div>
          );
        })}

        {/* Action box */}
        <div className="bg-navy flex flex-col gap-5 rounded-[15px] border-4 border-white/50 p-5">
          <h3 className="text-cream font-['Redzone'] text-lg">Atur jumlah dan metode pembelian</h3>
          <QuantityControl quantity={quantity} onChange={setQuantity} />

          <div className="text-cream flex items-center justify-between">
            <span className="font-['Redzone'] text-lg">Subtotal</span>
            <span className="font-['Geom'] text-xl font-bold">{formatPrice(subtotal)}</span>
          </div>

          <div className="flex flex-col gap-4 md:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={handleAddToCart}
              disabled={!isValid || pending}
              className="border-gold text-gold hover:bg-gold/10 h-14 flex-1 gap-3 rounded-[15px] border-2 bg-transparent font-['Geom'] text-lg font-bold disabled:opacity-50"
            >
              {addBundle.isPending ? 'Menambahkan...' : 'Tambah ke Keranjang'}
              <ShoppingBagBroken className="size-5" />
            </Button>
            <Button
              type="button"
              onClick={handleBuyNow}
              disabled={!isValid || pending}
              className="border-gold bg-gold text-navy-deep hover:bg-gold/90 h-14 flex-1 gap-3 rounded-[15px] border-2 font-['Geom'] text-lg font-bold disabled:opacity-50"
            >
              {initiateOrder.isPending ? 'Memproses...' : 'Beli Langsung'}
              <TagIcon2Broken className="size-5" />
            </Button>
          </div>

          {addBundle.isError && (
            <p className="font-['Geom'] text-sm text-red-300">{addBundle.error?.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function ComponentPicker({
  title,
  subtitle,
  variants,
  selectedVariantId,
  onSelect,
}: {
  title: string;
  subtitle?: string;
  variants: ProductVariant[];
  selectedVariantId: string | undefined;
  onSelect: (variantId: string) => void;
}) {
  const single = variants.length <= 1;
  return (
    <div className="bg-cream/40 flex flex-col gap-2 rounded-lg p-3">
      <div className="flex items-center gap-2">
        <span className="text-royal font-['Geom'] font-bold">{title}</span>
        {subtitle && <span className="text-royal/60 font-['Geom'] text-sm">{subtitle}</span>}
      </div>
      {single ? (
        <span className="text-ink/70 font-['Geom'] text-sm">{variants[0] ? variantLabel(variants[0]) : '—'}</span>
      ) : (
        <div className="flex flex-wrap gap-2">
          {variants.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => onSelect(v.id)}
              className={`rounded-md border px-3 py-1 font-['Geom'] text-sm transition-colors ${
                v.id === selectedVariantId
                  ? 'border-royal bg-royal text-white'
                  : 'border-royal/40 text-royal hover:border-royal'
              }`}
            >
              {variantLabel(v)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
