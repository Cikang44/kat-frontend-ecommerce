import Link from 'next/link';

import type { CatalogItem } from '@/domains/product/product.hooks';

interface ProductCardProps {
  item: CatalogItem;
}

const BUNDLE_TYPE_LABEL: Record<string, string> = {
  merchandise_bundle: 'Paket Merch',
  kit_panitia_bundle: 'Paket Kit',
  kit_panitia_add_on: 'Add-on Kit',
  kit_panitia_ala_carte: 'Ala Carte',
};

export function ProductCard({ item }: ProductCardProps) {
  const isBundle = item.kind === 'bundle';

  const href = isBundle ? `/products/${item.bundle.id}?kind=bundle` : `/products/${item.product.id}`;
  const name = isBundle ? item.bundle.name : item.product.name;
  const price = isBundle ? item.bundle.price : item.product.basePrice;
  // Bundles carry no image; a product may still have a null primaryImage.
  const imageUrl = isBundle ? null : (item.product.primaryImage?.url ?? null);
  const typeLabel = isBundle
    ? (BUNDLE_TYPE_LABEL[item.bundle.type] ?? 'Paket')
    : item.product.type.replace('_', ' ');

  return (
    <Link
      href={href}
      className="block w-full cursor-pointer transition-transform hover:scale-[1.02] active:scale-95"
    >
      <div className="mx-auto flex w-full flex-col overflow-hidden rounded-[8px] border-[0.56px] border-gray-200 bg-[#FCD34D] shadow-sm md:h-[447px] md:rounded-[17.65px] md:border-[0.92px]">
        {/* Product image from the backend (R2). Falls back to a solid colour
            for bundles and products without a primaryImage. */}
        <div className="relative h-42.5 w-full shrink-0 md:h-72.5">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- dynamic R2 host, not in next/image remotePatterns
            <img
              src={imageUrl}
              alt={name}
              loading="lazy"
              className={`size-full object-contain p-3 ${isBundle ? 'bg-[#774C26]' : 'bg-gold'}`}
            />
          ) : (
            <div className={`size-full ${isBundle ? 'bg-[#774C26]' : 'bg-gold'}`} />
          )}
          {isBundle && (
            <span className="absolute top-2 left-2 rounded-md bg-[#FFE788] px-2 py-0.5 font-['Redzone'] text-[9px] font-bold text-[#022C3F] md:top-3 md:left-3 md:text-sm">
              PAKET
            </span>
          )}
        </div>

        <div className="bg-powder flex grow flex-col justify-between gap-1 p-2 md:gap-3 md:p-6">
          <div>
            <div className="truncate font-['Redzone'] text-xs font-bold text-[#7A213D] md:text-2xl">
              {name}
            </div>
            <div className="mt-0.5 font-['Geom'] text-[10px] text-black md:text-xl">
              Rp {price.toLocaleString('id-ID')}
            </div>
            {isBundle && (
              <div className="mt-0.5 font-['Geom'] text-[9px] text-[#022C3F]/70 md:text-sm">
                Berisi {item.bundle.itemCount} item
              </div>
            )}
          </div>

          <div className="flex w-full justify-end">
            <div className="rounded-sm bg-[#774C26] px-4 py-0.5 font-['Geom'] text-[8px] text-white capitalize md:text-xs">
              {typeLabel}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
