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
      <div className="mx-auto flex h-[273px] w-full flex-col overflow-hidden rounded-[10.8px] border-[0.56px] border-gray-200 bg-[#FCD34D] shadow-sm md:h-[447px] md:rounded-[17.65px] md:border-[0.92px]">
        <div className="bg-gold relative h-[140px] w-full flex-shrink-0 md:h-[260px]">
          <Image
            src={product.primaryImage.url}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 423px"
          />
        </div>

        <div className="flex flex-grow flex-col justify-between gap-[6px] bg-white p-3 md:gap-[12px] md:p-6">
          <div>
            <div className="truncate font-['Redzone'] text-sm font-bold text-[#7A213D] md:text-2xl">
              {product.name}
            </div>
            <div className="mt-1 font-['Geom'] text-xs text-black md:text-xl">
              Rp {product.basePrice.toLocaleString('id-ID')}
            </div>
          </div>

          <div className="flex h-[16px] w-[60px] items-center justify-center self-end rounded-sm bg-gray-200 md:h-[26px] md:w-[105px]">
            <div className="font-['Geom'] text-[8px] text-black capitalize md:text-xs">
              {formattedType}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
