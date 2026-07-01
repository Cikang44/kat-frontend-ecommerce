'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { DeliveryForm } from '@/components/checkout/delivery-form';
import { PaymentMethodSelector } from '@/components/checkout/payment-method-selector';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import type { MockOrderReceiver } from '@/domains/order/order.api';
import { useCheckoutData, useConfirmOrder } from '@/domains/order/order.hooks';
import type {
  OrderDeliveryMethod,
  OrderPaymentMethod,
} from '@/domains/order/order.types';
import { formatPrice } from '@/lib/utils';

const EMPTY_RECEIVER: MockOrderReceiver = {
  name: '',
  faculty: '',
  major: '',
  phone: '',
  line: '',
  email: '',
  address: '',
  pickup_location: '',
  shipping_option: '',
};

export default function CheckoutPage() {
  const router = useRouter();
  const { orderId } = useParams<{ orderId: string }>();

  const { data, isPending, isError, error } = useCheckoutData(orderId);
  const confirmOrder = useConfirmOrder();

  const [deliveryMethod, setDeliveryMethod] = useState<OrderDeliveryMethod | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<OrderPaymentMethod | null>(null);
  const [receiver, setReceiver] = useState<MockOrderReceiver>(EMPTY_RECEIVER);
  const [isDeliverySubmitted, setIsDeliverySubmitted] = useState(false);

  useEffect(() => {
    if (!data) return;

    setReceiver({
      name: data.user_prefill.name,
      faculty: data.user_prefill.faculty,
      major: data.user_prefill.major,
      phone: data.user_prefill.phone,
      line: data.user_prefill.line,
      email: data.user_prefill.email,
      address: '',
      pickup_location: '',
      shipping_option: '',
    });
    setIsDeliverySubmitted(false);
  }, [data]);

  const contactValid = useMemo(
    () =>
      receiver.name.trim() !== '' &&
      receiver.faculty.trim() !== '' &&
      receiver.major.trim() !== '' &&
      receiver.phone.trim() !== '' &&
      receiver.line.trim() !== '' &&
      receiver.email.trim() !== '',
    [receiver],
  );

  const deliveryValid = useMemo(() => {
    if (deliveryMethod === 'pickup') {
      return receiver.pickup_location.trim() !== '';
    }

    if (deliveryMethod === 'shipping') {
      return receiver.address.trim() !== '' && receiver.shipping_option.trim() !== '';
    }

    return false;
  }, [deliveryMethod, receiver]);

  const canConfirm =
    deliveryMethod !== null &&
    paymentMethod !== null &&
    contactValid &&
    deliveryValid &&
    isDeliverySubmitted;

  const handleReceiverChange = (nextReceiver: MockOrderReceiver) => {
    setReceiver(nextReceiver);
    setIsDeliverySubmitted(false);
  };

  const handleDeliveryMethodChange = (method: OrderDeliveryMethod) => {
    setDeliveryMethod(method);
    setReceiver({
      ...receiver,
      address: '',
      pickup_location: '',
      shipping_option: '',
    });
    setIsDeliverySubmitted(false);
  };

  const handleConfirm = () => {
    if (!orderId || !deliveryMethod || !paymentMethod || !contactValid || !deliveryValid) return;

    confirmOrder.mutate(
      {
        order_id: orderId,
        delivery_method: deliveryMethod,
        payment_method: paymentMethod,
        receiver,
      },
      {
        onSuccess: ({ redirect_url }) => {
          router.push(redirect_url);
        },
      },
    );
  };

  if (isPending) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner className="text-[#FFE788]" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-4 text-center text-white">
        <p className="font-[Redzone] text-lg">Checkout gagal dimuat</p>
        <p className="max-w-md text-sm text-white/80">{error.message}</p>
        <Button
          onClick={() => router.push('/cart')}
          className="bg-[#FFE788] font-[Redzone] text-[#022C3F]"
        >
          Kembali ke Keranjang
        </Button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="flex flex-col px-4 py-6" style={{ minHeight: 'inherit' }}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 lg:grid lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <DeliveryForm
            deliveryOptions={data.delivery_options}
            pickupLocations={data.pickup_locations}
            shippingOptions={data.shipping_options}
            deliveryMethod={deliveryMethod}
            onDeliveryMethodChange={handleDeliveryMethodChange}
            receiver={receiver}
            onReceiverChange={handleReceiverChange}
            prefill={data.user_prefill}
            onSubmit={() => setIsDeliverySubmitted(true)}
            isSubmitted={isDeliverySubmitted}
          />

          <PaymentMethodSelector
            paymentMethods={data.payment_methods}
            paymentMethod={paymentMethod}
            onPaymentMethodChange={setPaymentMethod}
          />
        </div>

        <div className="space-y-4">
          <section className="rounded-xl border border-[#022C3F] bg-[#022C3F] p-4 text-white shadow-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="font-[Geom] text-white/80">Total ({data.summary.total_items} item)</span>
              <span className="font-[Redzone] text-lg text-[#FFE788]">
                {formatPrice(data.summary.total_product_price)}
              </span>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={() => router.push('/cart')}
                variant="outline"
                className="flex-1 border-[#FFE788] bg-transparent font-[Geom] text-white hover:bg-white/10"
              >
                Kembali ke Keranjang
              </Button>

              <Button
                disabled={!canConfirm || confirmOrder.isPending}
                onClick={handleConfirm}
                className="flex-1 bg-[#FFE788] font-[Redzone] text-[#022C3F]"
              >
                {confirmOrder.isPending ? 'Memproses...' : 'Konfirmasi Pesanan'}
              </Button>
            </div>

            {confirmOrder.isError && (
              <p className="mt-2 text-center text-xs text-[#FF8888]">
                {confirmOrder.error instanceof Error
                  ? confirmOrder.error.message
                  : 'Gagal konfirmasi'}
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
