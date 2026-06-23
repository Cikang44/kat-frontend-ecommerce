import { Suspense } from 'react';

import { ProductGrid } from '@/components/product/product-grid';
import { SearchFilterPanel } from '@/components/product/search-filter-panel';

export const metadata = {
  title: 'Product List | Ganesha Goods',
  description: 'Daftar produk merchandise dan kit panitia Ganesha Goods',
};
export default function ProductsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center px-5 pt-24 pb-16 md:px-20">
      <div className="w-full">
        {' '}
        <div className="mb-6 flex items-center font-['Geom'] text-sm text-gray-500 md:text-base">
          <span>Product List</span>
          <span className="mx-2">&gt;</span>
          <span className="text-[#363636]">Nama Produk</span>
        </div>
        <Suspense fallback={<div className="mb-8 h-20 animate-pulse rounded-lg bg-gray-200" />}>
          <SearchFilterPanel />
        </Suspense>
        <Suspense fallback={<div className="h-screen animate-pulse rounded-lg bg-gray-200" />}>
          <ProductGrid />
        </Suspense>
      </div>
    </main>
  );
}
