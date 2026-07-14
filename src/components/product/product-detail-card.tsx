'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { ShoppingBagBroken, TagIcon2Broken } from 'vuesax-icon-pack';

import type { ProductDetail } from '@/api/types.gen';
import { Button } from '@/components/ui/button';
import { useAddToCart } from '@/domains/cart/cart.hooks';
import { useInitiateOrder } from '@/domains/order/order.hooks';
import { formatPrice } from '@/lib/utils';

import { BackButton } from './back-button';
import { ProductImageGallery } from './product-image-gallery';
import { QuantityControl } from './quantity-control';
import { VariantSelector } from './variant-selector';

interface ProductDetailCardProps {
  product: ProductDetail;
}

export function ProductDetailCard({ product }: ProductDetailCardProps) {
  const router = useRouter();
  const addToCart = useAddToCart();
  const initiateOrder = useInitiateOrder();

  const sizes = useMemo(
    () => Array.from(new Set(product.variants.map((v) => v.size).filter((s) => s !== 'none'))),
    [product.variants],
  );
  const colors = useMemo(
    () => Array.from(new Set(product.variants.map((v) => v.color).filter(Boolean))),
    [product.variants],
  );

  const hasSelectableVariants = sizes.length > 0 || colors.length > 0;

  const [selectedSize, setSelectedSize] = useState<string>(sizes[0] ?? '');
  const [selectedColor, setSelectedColor] = useState<string>(colors[0] ?? '');
  const [quantity, setQuantity] = useState(1);

  const selectedVariant = useMemo(() => {
    // If there are no selectable sizes/colors, use the first variant directly
    if (!hasSelectableVariants) {
      return product.variants[0] ?? null;
    }
    return product.variants.find((v) => v.size === selectedSize && v.color === selectedColor);
  }, [product.variants, selectedSize, selectedColor, hasSelectableVariants]);

  // Prefer the selected variant's own images (e.g. character keychains, faculty
  // stickers). Fall back to the product-level gallery when the variant has none
  // — which is also the case before the backend has seeded any variant images.
  const galleryImages = useMemo(() => {
    const variantImages = selectedVariant?.images ?? [];
    return variantImages.length > 0
      ? variantImages.map((i) => ({
          id: i.id,
          url: i.url,
          isPrimary: i.isPrimary,
          sortOrder: i.sortOrder,
        }))
      : product.images;
  }, [selectedVariant, product.images]);

  const subtotal = (selectedVariant?.finalPrice ?? product.basePrice) * quantity;

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addToCart.mutate({ variantId: selectedVariant.id, quantity });
  };

  const handleBuyNow = () => {
    if (!selectedVariant) return;
    addToCart.mutate(
      { variantId: selectedVariant.id, quantity },
      {
        onSuccess: (result) => {
          const serverId = result.item.id;
          initiateOrder.mutate(
            { cart_item_ids: [serverId] },
            {
              onSuccess: (orderResult) => {
                router.push(`/checkout/${orderResult.order_id}`);
              },
            },
          );
        },
      },
    );
  };

  return (
    <div className="mx-auto flex w-full flex-col gap-5">
      {/* Mobile + tablet: single stacked column. The two-column layout needs
          room for the fixed 550px gallery, so it only kicks in at lg (≥1024px);
          at md (768px) it would overflow the viewport. */}
      <div className="flex flex-col gap-5 lg:hidden">
        <div className="bg-powder rounded-[15px] px-5 py-3">
          <div className="flex flex-col gap-4">
            <h1 className="from-royal bg-gradient-to-r to-[#5e68a3] bg-clip-text font-['Redzone'] text-[30px] leading-none text-transparent">
              {product.name}
            </h1>
            <p className="font-['Redzone'] text-2xl text-[#774c26]">
              {formatPrice(selectedVariant?.finalPrice ?? product.basePrice)} /pcs
            </p>

            <ProductImageGallery
              key={selectedVariant?.id ?? 'base'}
              images={galleryImages}
              productName={product.name}
            />

            <div className="flex flex-col gap-2">
              <h2 className="text-royal font-['Redzone'] text-lg">Deskripsi</h2>
              <p className="text-ink font-['Geom'] text-sm leading-5">{product.description}</p>
            </div>

            {hasSelectableVariants && (
              <VariantSelector
                variants={product.variants}
                selectedSize={selectedSize}
                selectedColor={selectedColor}
                onSelectSize={setSelectedSize}
                onSelectColor={setSelectedColor}
              />
            )}
          </div>
        </div>

        <div className="bg-navy flex flex-col gap-4 rounded-[15px] border-4 border-white/50 p-5">
          <h3 className="text-cream font-['Redzone'] text-lg">Atur jumlah dan metode pembelian</h3>

          <div className="flex items-center justify-start gap-4">
            <QuantityControl quantity={quantity} onChange={setQuantity} />
          </div>

          <div className="text-cream flex items-center justify-between">
            <span className="font-['Redzone'] text-lg">Subtotal</span>
            <span className="font-['Geom'] text-xl font-bold">{formatPrice(subtotal)}</span>
          </div>

          <div className="flex flex-col gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleAddToCart}
              disabled={!selectedVariant || addToCart.isPending}
              className="border-gold text-gold hover:bg-gold/10 h-14 w-full gap-3 rounded-[15px] border-2 bg-transparent font-['Geom'] text-xl font-bold disabled:opacity-50"
            >
              {addToCart.isPending ? 'Menambahkan...' : 'Tambah ke Keranjang'}
              <ShoppingBagBroken className="size-5" />
            </Button>

            <Button
              type="button"
              onClick={handleBuyNow}
              disabled={!selectedVariant || addToCart.isPending || initiateOrder.isPending}
              className="border-gold bg-gold text-navy-deep hover:bg-gold/90 h-14 w-full gap-3 rounded-[15px] border-2 font-['Geom'] text-xl font-bold disabled:opacity-50"
            >
              {initiateOrder.isPending ? 'Memproses...' : 'Beli Langsung'}
              <TagIcon2Broken className="size-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop (lg+): back button + two columns inside powder card */}
      <div className="hidden lg:flex lg:flex-col">
        <div className="bg-powder flex flex-col gap-6 rounded-[15px] p-6">
          <BackButton />

          <div className="flex w-full gap-6">
            {/* Left column: Gallery */}
            <div className="w-[550px] shrink-0">
              <ProductImageGallery
                key={selectedVariant?.id ?? 'base'}
                images={galleryImages}
                productName={product.name}
              />
            </div>

            {/* Right column: Title, price, description, variants, actions */}
            <div className="flex min-w-0 flex-1 flex-col gap-8">
              <h1 className="from-royal bg-gradient-to-r to-[#5e68a3] bg-clip-text font-['Redzone'] text-[72px] leading-none text-transparent">
                {product.name}
              </h1>

              <p className="font-['Redzone'] text-5xl text-[#774c26]">
                {formatPrice(selectedVariant?.finalPrice ?? product.basePrice)} /pcs
              </p>

              <div className="flex flex-col gap-4">
                <h2 className="text-royal font-['Redzone'] text-2xl">Deskripsi</h2>
                <p className="text-ink font-['Geom'] text-xl leading-[1.5]">
                  {product.description}
                </p>
              </div>

              {hasSelectableVariants && (
                <VariantSelector
                  variants={product.variants}
                  selectedSize={selectedSize}
                  selectedColor={selectedColor}
                  onSelectSize={setSelectedSize}
                  onSelectColor={setSelectedColor}
                  className="text-2xl"
                />
              )}

              <div className="bg-navy flex flex-col gap-8 rounded-[15px] border-4 border-white/50 p-6">
                <div className="flex flex-col gap-4">
                  <h3 className="text-cream font-['Redzone'] text-2xl">
                    Atur jumlah dan metode pembelian
                  </h3>

                  <div className="flex items-center justify-start gap-4">
                    <QuantityControl quantity={quantity} onChange={setQuantity} />
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="text-cream flex items-center justify-between">
                    <span className="font-['Redzone'] text-2xl">Subtotal</span>
                    <span className="font-['Geom'] text-[28px] font-bold">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddToCart}
                      disabled={!selectedVariant || addToCart.isPending}
                      className="border-gold text-gold hover:bg-gold/10 h-[76px] flex-1 gap-5 rounded-[15px] border-2 bg-transparent font-['Geom'] text-xl font-bold disabled:opacity-50"
                    >
                      {addToCart.isPending ? 'Menambahkan...' : 'Tambah ke Keranjang'}
                      <ShoppingBagBroken className="size-5" />
                    </Button>

                    <Button
                      type="button"
                      onClick={handleBuyNow}
                      disabled={!selectedVariant || addToCart.isPending || initiateOrder.isPending}
                      className="border-gold bg-gold text-navy-deep hover:bg-gold/90 h-[76px] flex-1 gap-5 rounded-[15px] border-2 font-['Geom'] text-xl font-bold disabled:opacity-50"
                    >
                      {initiateOrder.isPending ? 'Memproses...' : 'Beli Langsung'}
                      <TagIcon2Broken className="size-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
