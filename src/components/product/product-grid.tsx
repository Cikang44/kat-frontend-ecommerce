'use client';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

import { ProductCard } from '@/components/product/product-card';
import { useCatalog } from '@/domains/product/product.hooks';

export function ProductGrid() {
  const searchParams = useSearchParams();

  const filters = {
    search: searchParams.get('search') || undefined,
    type: searchParams.get('type') || undefined,
    category: searchParams.get('category') || undefined,
    faculty: searchParams.get('faculty') || undefined,
  };

  const { items, isLoading, isError } = useCatalog(filters);

  if (isLoading) {
    return (
      <div className="grid w-full animate-pulse grid-cols-2 justify-items-center gap-2 md:grid-cols-3 md:gap-[30px]">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-[210px] w-[155px] rounded-[12px] bg-gray-200 md:h-[447px] md:w-full"
          ></div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mt-10 text-center text-red-500">Gagal memuat produk. Silakan coba lagi.</div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mt-16 flex w-full flex-col items-center justify-center text-center md:mt-24">
        <div className="relative h-[250px] w-[200px] md:h-[350px] md:w-[300px]">
          <Image
            src="/search-empty.png"
            alt="No Result Found"
            fill
            className="ml-10 object-contain"
          />
        </div>
        <h2 className="mt-6 font-['Redzone'] text-3xl tracking-wide text-[#133b79] uppercase md:text-5xl">
          No Result Found
        </h2>
        <p className="mx-auto mt-2 max-w-md font-['Geom'] text-sm text-[#133b79] md:text-lg">
          We couldn't find what you searched for. Try searching again.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="grid w-full grid-cols-2 justify-items-center gap-6 md:grid-cols-3 md:gap-[30px]">
        {items.map((item) => (
          <ProductCard key={item.kind === 'bundle' ? item.bundle.id : item.product.id} item={item} />
        ))}
      </div>
    </div>
  );
}
