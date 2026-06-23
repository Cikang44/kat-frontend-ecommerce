'use client';

import Image from 'next/image';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

import { ProductCard } from '@/components/product/product-card';
import { useProducts } from '@/domains/product/product.hooks';

export function ProductGrid() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = {
    search: searchParams.get('search') || undefined,
    type: searchParams.get('type') || undefined,
    category: searchParams.get('category') || undefined,
    faculty: searchParams.get('faculty') || undefined,
    page: searchParams.get('page') || '1',
    limit: searchParams.get('limit') || '20',
  };

  const { data, isLoading, isError } = useProducts(filters);

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

  const products = data?.data || [];
  const meta = data?.meta;

  if (products.length === 0) {
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

  const handlePageChange = (newPage: number) => {
    if (!meta || newPage < 1 || newPage > meta.totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="grid w-full grid-cols-2 justify-items-center gap-6 md:grid-cols-3 md:gap-[30px]">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="mt-12 flex flex-col items-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-1 md:gap-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={meta.page === 1}
              className="cursor-pointer rounded-[6px] bg-[#133b79] px-3 py-1.5 font-['Geom'] text-xs text-white transition-opacity disabled:opacity-50 md:rounded-[8px] md:px-4 md:py-2 md:text-lg"
            >
              &laquo; First
            </button>
            <button
              onClick={() => handlePageChange(meta.page - 1)}
              disabled={meta.page === 1}
              className="cursor-pointer rounded-[6px] bg-[#133b79] px-3 py-1.5 font-['Geom'] text-xs text-white transition-opacity disabled:opacity-50 md:rounded-[8px] md:px-4 md:py-2 md:text-lg"
            >
              &lsaquo; Back
            </button>

            {/* Render Halaman Dinamis */}
            {(() => {
              const pages: (number | string)[] = [];
              const { page: c, totalPages: t } = meta;

              // 1. Masukkan halaman saat ini (selalu paling kiri)
              pages.push(c);

              // 2. Masukkan 1 halaman setelahnya (jika belum mentok akhir)
              if (c + 1 <= t) pages.push(c + 1);

              // 3. Cek apakah butuh titik-titik
              if (c + 1 < t - 2) {
                pages.push('...');
                pages.push(t - 1);
                pages.push(t);
              } else {
                // Jika sudah dekat dengan akhir, langsung render sisanya tanpa titik-titik
                for (let i = c + 2; i <= t; i++) {
                  pages.push(i);
                }
              }

              return pages.map((p, index) => {
                if (p === '...') {
                  return (
                    <span
                      key={`dots-${index}`}
                      className="px-1 py-1.5 font-['Geom'] text-xs font-bold text-[#133b79] md:px-2 md:py-2 md:text-lg"
                    >
                      ...
                    </span>
                  );
                }

                const isCurrent = p === c;
                return (
                  <button
                    key={`page-${p}`}
                    onClick={() => handlePageChange(p as number)}
                    className={`cursor-pointer rounded-[6px] px-3 py-1.5 font-['Geom'] text-xs transition-colors md:rounded-[8px] md:px-4 md:py-2 md:text-lg ${
                      isCurrent
                        ? 'bg-[#7A93C4] font-bold text-white' // Warna biru pudar untuk page aktif
                        : 'hover:bg-navy-deep bg-[#133b79] text-white'
                    }`}
                  >
                    {p}
                  </button>
                );
              });
            })()}

            <button
              onClick={() => handlePageChange(meta.page + 1)}
              disabled={meta.page === meta.totalPages}
              className="cursor-pointer rounded-[6px] bg-[#133b79] px-3 py-1.5 font-['Geom'] text-xs text-white transition-opacity disabled:opacity-50 md:rounded-[8px] md:px-4 md:py-2 md:text-lg"
            >
              Next &rsaquo;
            </button>
            <button
              onClick={() => handlePageChange(meta.totalPages)}
              disabled={meta.page === meta.totalPages}
              className="cursor-pointer rounded-[6px] bg-[#133b79] px-3 py-1.5 font-['Geom'] text-xs text-white transition-opacity disabled:opacity-50 md:rounded-[8px] md:px-4 md:py-2 md:text-lg"
            >
              Last &raquo;
            </button>
          </div>

          <div className="font-['Geom'] text-xs text-[#133b79]">
            {(meta.page - 1) * meta.limit + 1}-{Math.min(meta.page * meta.limit, meta.total)} of{' '}
            {meta.total}
          </div>
        </div>
      )}
    </div>
  );
}
