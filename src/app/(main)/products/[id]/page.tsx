import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { api } from '@/domains/product/product.api';
import { getQueryClient } from '@/lib/query-client';
import { queryKeys } from '@/lib/query-keys';

import { ProductDetailClient } from './page.client';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const queryClient = getQueryClient();
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
