import Image from 'next/image';
import Link from 'next/link';

import { ProductListItem } from '@/api/types.gen';

interface ProductCardProps {
  product: ProductListItem;
}

export function ProductCard({ product }: ProductCardProps) {
  const formattedType = product.type.replace('_', ' ');

  return (
    <Link
      href={`/products/${product.id}`}
      className="block w-full cursor-pointer transition-transform hover:scale-[1.02] active:scale-95"
    >
      <div className="mx-auto flex w-full flex-col overflow-hidden rounded-[8px] border-[0.56px] border-gray-200 bg-[#FCD34D] shadow-sm md:h-[447px] md:rounded-[17.65px] md:border-[0.92px]">
        <div className="bg-gold relative h-42.5 w-full shrink-0 md:h-72.5">
          <Image
            src={product.primaryImage.url}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 423px"
          />
        </div>

        <div className="bg-powder flex grow flex-col justify-between gap-1 p-2 md:gap-3 md:p-6">
          <div>
            <div className="truncate font-['Redzone'] text-xs font-bold text-[#7A213D] md:text-2xl">
              {product.name}
            </div>
            <div className="mt-0.5 font-['Geom'] text-[10px] text-black md:text-xl">
              Rp {product.basePrice.toLocaleString('id-ID')}
            </div>
          </div>

          <div className="flex w-full justify-end">
            <div className="rounded-sm bg-[#774C26] px-4 py-0.5 font-['Geom'] text-[8px] text-white capitalize md:text-xs">
              {formattedType}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
