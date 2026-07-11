import Image from 'next/image';

import { OrderItemSnapshot } from '@/domains/order/order.types';

interface OrderOverviewProps {
  orderItems: OrderItemSnapshot[];
}

export function OrderOverview({ orderItems }: OrderOverviewProps) {
  const totalPrice = orderItems.reduce((acc, item) => acc + item.subtotal, 0);
  const totalQuantity = orderItems.reduce((acc, item) => acc + item.quantity, 0);

  const formatRupiah = (value: number) => {
    return value.toLocaleString('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  return (
    <div className="mx-auto flex w-full flex-col gap-[20px] rounded-[20px] border border-[5px] border-[#FFFFFF80] bg-[#133B79] p-[20px] font-sans text-white md:max-w-[859px] md:gap-[30px] md:rounded-[30px] md:p-[40px]">
      <div className="font-heading flex items-center gap-3 text-2xl font-black tracking-wide text-white md:text-3xl">
        <Image src="/icons/shopping-cart.svg" alt="Shopping Cart" width={32} height={32} />
        Shopping Cart
      </div>

      <div className="hidden grid-cols-4 rounded-xl border border-[#FFF3B8] py-4 text-center font-bold text-[#FFF3B8] md:grid">
        <div>Produk</div>
        <div>Varian</div>
        <div>Kuantitas</div>
        <div>Total Harga</div>
      </div>

      <div className="flex flex-col gap-4">
        {orderItems.map((item) => {
          const variantText =
            [item.variant?.size, item.variant?.color].filter(Boolean).join(', ') || '-';

          return (
            <div
              key={item.product_id}
              className="flex rounded-xl border border-[#FFF3B8] p-4 md:grid md:grid-cols-4 md:items-center"
            >
              <div className="flex w-full gap-2 md:hidden">
                <div className="flex shrink-0 items-center justify-center rounded-lg bg-white/5 p-1">
                  {/* eslint-disable-next-line @next/next/no-img-element -- dynamic backend host, not in next/image remotePatterns */}
                  <img
                    src={item.image_url}
                    alt={item.product_name}
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                </div>

                <div className="flex flex-3 flex-col justify-center">
                  <div className="flex w-full items-start justify-between">
                    <span className="line-clamp-1 font-bold text-[#FFF3B8]">
                      {item.product_name}
                    </span>
                    <span className="shrink-0 text-sm text-[#FFF3B8]">{item.quantity} pcs</span>
                  </div>
                  <div className="flex w-full items-end justify-between">
                    <span className="text-sm text-[#FFF3B8]">{variantText}</span>
                    <span className="text-lg font-bold text-[#FFF3B8]">
                      {formatRupiah(item.subtotal)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="hidden flex-col items-center justify-center gap-3 md:flex">
                {/* eslint-disable-next-line @next/next/no-img-element -- dynamic backend host, not in next/image remotePatterns */}
                <img
                  src={item.image_url}
                  alt={item.product_name}
                  width={90}
                  height={90}
                  className="object-contain"
                />
                <span className="text-center font-medium text-[#FFF3B8]">{item.product_name}</span>
              </div>

              <div className="hidden items-center justify-center text-center font-medium text-[#FFF3B8] md:flex">
                {variantText}
              </div>

              <div className="hidden items-center justify-center text-center font-medium text-[#FFF3B8] md:flex">
                {item.quantity}
              </div>

              <div className="hidden items-center justify-center text-center font-bold text-[#FFF3B8] md:flex">
                {formatRupiah(item.subtotal)}
              </div>
            </div>
          );
        })}
      </div>

      <div className="font-heading mt-2 flex items-center justify-between rounded-xl bg-[#FFF3B8] px-5 py-4 text-[#133B79] md:px-8 md:py-5">
        <span className="font-['Geom'] text-[#022C3F] md:text-xl">
          Total ({totalQuantity} produk):
        </span>
        <span className="text-xl text-[#022C3F] md:text-3xl">{formatRupiah(totalPrice)}</span>
      </div>
    </div>
  );
}
