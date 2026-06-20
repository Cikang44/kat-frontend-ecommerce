'use client';

import { useParams } from 'next/navigation';

import { ProductDetailCard } from '@/components/product/product-detail-card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useProductDetail } from '@/domains/product/product.hooks';

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data: product, isLoading, error, refetch } = useProductDetail(id);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="size-10 text-[#fff3b8]" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="font-['Redzone'] text-2xl text-[#fff3b8]">Produk tidak ditemukan</h1>
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
    <main className="relative min-h-screen w-full overflow-hidden px-4 py-6 md:px-8 lg:px-12">
      <ProductDetailCard product={product} />
    </main>
  );
}
