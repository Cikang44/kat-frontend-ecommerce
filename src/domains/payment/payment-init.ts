/**
 * Pure helpers for the payment-page initiation sequencing.
 *
 * Background: the backend does NOT create a payment record when an order is
 * confirmed — the FE must call `POST /payment/{orderId}/initiate` (idempotent)
 * to create it, BEFORE `GET /payment/{orderId}` (detail) will return 200.
 * Calling detail first returns 404 "Pembayaran tidak ditemukan".
 *
 * These helpers make the payment page self-healing: initiate only when the
 * order is still awaiting payment, and only enable the (heavy) detail query
 * once a payment record is guaranteed to exist.
 */

export type OrderStatus = 'draft' | 'belum_bayar' | 'lunas' | 'diterima' | 'expired';

/** A payment must be initiated only while the order is awaiting payment. */
export function shouldInitiatePayment(orderStatus: OrderStatus | undefined): boolean {
  return orderStatus === 'belum_bayar';
}

/**
 * The payment detail (`GET /payment/{orderId}`) may be fetched only once a
 * payment row is guaranteed to exist:
 *  - after our `initiate` call has succeeded, OR
 *  - when the order is already past `belum_bayar` (paid/received → a payment
 *    already exists server-side), so no initiate is needed.
 */
export function canLoadPaymentDetail(
  orderStatus: OrderStatus | undefined,
  initiateSucceeded: boolean,
): boolean {
  if (orderStatus === undefined || orderStatus === 'draft') return false;
  if (orderStatus === 'belum_bayar') return initiateSucceeded;
  // lunas | diterima | expired → a payment record already exists.
  return true;
}
