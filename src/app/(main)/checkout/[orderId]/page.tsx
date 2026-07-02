'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { ConfirmPaymentDialog } from '@/components/checkout/confirm-payment-dialog';
import { ContactInfoForm } from '@/components/checkout/contact-info-form';
import { MockCartTable } from '@/components/checkout/mock-cart-table';
import { PaymentSection } from '@/components/checkout/payment-section';
import { ShippingOptions } from '@/components/checkout/shipping-options';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { formatPrice } from '@/lib/utils';
import type { MockOrderReceiver } from '@/domains/order/order.api';
import { useCheckoutData, useConfirmOrder } from '@/domains/order/order.hooks';
import type {
  OrderDeliveryMethod,
  OrderPaymentMethod,
} from '@/domains/order/order.types';

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
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

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
    deliveryValid;

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
  };

  const handleConfirm = () => {
    if (!canConfirm) return;
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
      <div className="flex items-center justify-center" style={{ minHeight: 'inherit' }}>
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: 'inherit' }}>
        <p className="font-[Geom] text-red-500">
          {error?.message ?? 'Gagal memuat data checkout.'}
        </p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="flex flex-col px-4 py-6" style={{ minHeight: 'inherit' }}>
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-2 text-sm font-[Geom] text-[#022C3F]/60">
        <span>Keranjang</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M4.5 2.5L7.5 6L4.5 9.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="font-medium text-[#022C3F]">Checkout</span>
      </nav>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 lg:grid lg:grid-cols-[1.2fr_0.8fr]">
        {/* Left column — MockCartTable */}
        <div className="min-w-0">
          <MockCartTable />
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <ContactInfoForm
            receiver={receiver}
            onReceiverChange={handleReceiverChange}
            submitted={isDeliverySubmitted}
            prefill={data.user_prefill}
          />
          <ShippingOptions
            deliveryMethod={deliveryMethod}
            onDeliveryMethodChange={handleDeliveryMethodChange}
            pickupLocations={data.pickup_locations}
            shippingOptions={data.shipping_options}
            receiver={receiver}
            onReceiverChange={handleReceiverChange}
            submitted={isDeliverySubmitted}
          />
          <PaymentSection
            paymentMethods={data.payment_methods}
            paymentMethod={paymentMethod}
            onPaymentMethodChange={setPaymentMethod}
            submitted={isDeliverySubmitted}
            totalProductPrice={data.summary.total_product_price}
            deliveryMethod={deliveryMethod}
            shippingCost={null}
            formatPrice={formatPrice}
            onBayarClick={() => {
              setIsDeliverySubmitted(true);
              if (!canConfirm) return;
              setShowConfirmDialog(true);
            }}
            isPending={confirmOrder.isPending}
          />
        </div>
      </div>

      <ConfirmPaymentDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
