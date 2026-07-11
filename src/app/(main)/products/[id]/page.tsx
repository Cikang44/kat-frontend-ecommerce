import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { api } from '@/domains/product/product.api';
import { getQueryClient } from '@/lib/query-client';
import { queryKeys } from '@/lib/query-keys';

import { BundleDetailClient } from './bundle.client';
import { ProductDetailClient } from './page.client';

export default async function ProductDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ kind?: string }>;
}) {
  const { id } = await params;
  const { kind } = await searchParams;

  const queryClient = getQueryClient();

  // Bundle branch — same route, different rendering + selection UI.
  if (kind === 'bundle') {
    await queryClient
      .prefetchQuery({
        queryKey: queryKeys.products.bundleDetail(id),
        queryFn: () => api.bundleDetail(id),
      })
      .catch((error) => {
        console.error('[ProductDetailPage] Failed to prefetch bundle', id, error);
      });

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <BundleDetailClient id={id} />
      </HydrationBoundary>
    );
  }

  await queryClient
    .prefetchQuery({
      queryKey: queryKeys.products.detail(id),
      queryFn: () => api.detail(id),
    })
    .catch((error) => {
      console.error('[ProductDetailPage] Failed to prefetch product', id, error);
    });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductDetailClient id={id} />
    </HydrationBoundary>
  );
}
