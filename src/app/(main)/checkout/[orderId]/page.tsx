'use client';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';

import { Spinner } from '@/components/ui/spinner';
import { useCheckoutData, useConfirmOrder } from '@/domains/order/order.hooks';

export default function CheckoutPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const router = useRouter();

  const { data: checkout, isLoading, error } = useCheckoutData(orderId);
  const confirmOrder = useConfirmOrder();

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error || !checkout) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4">
        <h1 className="font-[redzone] text-2xl font-bold text-[#022C3F]">
          Checkout Tidak Ditemukan
        </h1>
        <p className="text-muted-foreground">
          {error?.message || 'Checkout tidak ditemukan atau sudah dikonfirmasi.'}
        </p>
        <button
          onClick={() => router.push('/cart')}
          className="rounded-lg bg-[#022C3F] px-4 py-2 text-white"
        >
          Kembali ke Cart
        </button>
      </div>
    );
  }

  const handleConfirm = async () => {
    // TODO: collect delivery_method, receiver, payment_method from forms
    confirmOrder.mutate(
      {
        order_id: orderId,
        delivery_method: 'pickup',
        receiver: {
          name: checkout.user_prefill.name,
          phone: checkout.user_prefill.phone,
          line: checkout.user_prefill.line,
          address: '',
        },
        payment_method: 'qris',
      },
      {
        onSuccess: (result) => {
          router.push(result.redirect_url);
        },
      },
    );
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-6 font-[redzone] text-4xl font-bold text-[#022C3F]">Checkout</h1>

      {/* Order Items */}
      <div className="space-y-3">
        {checkout.items.map((item) => (
          <div key={item.product_id} className="flex gap-3 rounded-lg bg-white p-3 shadow-sm">
            <div className="h-16 w-16 shrink-0 rounded bg-gray-100">
              {item.image_url && (
                <Image
                  src={item.image_url}
                  alt={item.product_name}
                  width={64}
                  height={64}
                  className="h-full w-full rounded object-cover"
                />
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium">{item.product_name}</p>
              <p className="text-muted-foreground text-sm">
                {item.variant.size && `Size: ${item.variant.size}`}
                {item.variant.color && ` • ${item.variant.color}`}
              </p>
              <p className="text-sm">
                {item.quantity}x Rp{item.unit_price.toLocaleString('id-ID')}
              </p>
            </div>
            <p className="font-medium">Rp{item.subtotal.toLocaleString('id-ID')}</p>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 rounded-lg bg-white p-4 shadow-sm">
        <div className="flex justify-between">
          <span>Total Item</span>
          <span>{checkout.summary.total_items}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Total Harga</span>
          <span>Rp{checkout.summary.total_product_price.toLocaleString('id-ID')}</span>
        </div>
      </div>

      {/* TODO: Delivery Form, Payment Method Selector */}

      {/* Confirm Button */}
      <button
        onClick={handleConfirm}
        disabled={confirmOrder.isPending}
        className="mt-6 w-full rounded-lg bg-[#FFE788] py-3 font-[redzone] text-lg font-bold text-[#022C3F] disabled:opacity-50"
      >
        {confirmOrder.isPending ? 'Memproses...' : 'Konfirmasi Pesanan'}
      </button>
    </div>
  );
}
