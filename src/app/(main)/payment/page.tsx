import { OrderOverview } from '@/components/checkout/order-overview';
import { api } from '@/domains/order/order.api';

export default async function MockPaymentPage() {
  const checkoutData = await api.getCheckoutData('mock-visual-test');

  return (
    <main className="">
      <div className="text-center">
        <h1 className="font-heading text-2xl font-black tracking-wider text-white md:text-3xl">
          VISUAL PREVIEW MODE
        </h1>
        <p className="mt-1 text-sm font-medium text-amber-200">
          Menampilkan komponen OrderOverview menggunakan data dari order.api.ts
        </p>
      </div>

      <OrderOverview orderItems={checkoutData.items} />
    </main>
  );
}
