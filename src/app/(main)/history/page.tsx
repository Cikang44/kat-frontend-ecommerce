'use client';

import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { useOrderHistory } from '@/domains/order/order.hooks';

const statusConfig: Record<
  string,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  draft: { label: 'Draft', variant: 'outline' },
  belum_bayar: { label: 'Belum Bayar', variant: 'secondary' },
  lunas: { label: 'Lunas', variant: 'default' },
  diterima: { label: 'Diterima', variant: 'default' },
  expired: { label: 'Kadaluarsa', variant: 'destructive' },
};

export default function HistoryPage() {
  const { data: orders, isLoading, error } = useOrderHistory();

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-destructive">{error.message}</p>
      </div>
    );
  }

  const draftOrders = orders?.filter((o) => o.status === 'draft') ?? [];
  const completedOrders = orders?.filter((o) => o.status !== 'draft') ?? [];

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-6 font-[redzone] text-4xl font-bold text-[#022C3F]">Riwayat Pesanan</h1>

      {/* Draft Orders */}
      {draftOrders.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-3 font-[redzone] text-lg font-bold text-[#022C3F]">
            Checkout Tertunda
          </h2>
          <div className="space-y-3">
            {draftOrders.map((order) => (
              <Link
                key={order.id}
                href={`/checkout/${order.id}`}
                className="block rounded-lg border-2 border-dashed border-[#FFE788] bg-[#FFFDF0] p-4 transition-colors hover:bg-[#FFF9D6]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">
                      {new Date(order.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="mt-1 font-medium">{order.itemCount} item</p>
                  </div>
                  <Badge variant={statusConfig[order.status]?.variant ?? 'outline'}>
                    Lanjutkan Checkout →
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Completed Orders */}
      {completedOrders.length > 0 && (
        <div>
          <h2 className="mb-3 font-[redzone] text-lg font-bold text-[#022C3F]">Pesanan Selesai</h2>
          <div className="space-y-3">
            {completedOrders.map((order) => (
              <div key={order.id} className="rounded-lg bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">
                      {new Date(order.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="mt-1 font-medium">{order.itemCount} item</p>
                    <p className="text-sm font-semibold">
                      Rp{order.totalBilled.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={statusConfig[order.status]?.variant ?? 'outline'}>
                      {statusConfig[order.status]?.label ?? order.status}
                    </Badge>
                    {(order.status === 'belum_bayar' || order.status === 'lunas') && (
                      <Link
                        href={`/payment/${order.id}`}
                        className="text-sm text-[#022C3F] underline"
                      >
                        Lihat Detail
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {orders && orders.length === 0 && (
        <div className="flex min-h-[30vh] flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground">Belum ada pesanan</p>
          <Link href="/products" className="rounded-lg bg-[#022C3F] px-4 py-2 text-white">
            Mulai Belanja
          </Link>
        </div>
      )}
    </div>
  );
}
