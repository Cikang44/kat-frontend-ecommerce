import { describe, it, expect } from 'vitest';

import { shouldInitiatePayment, canLoadPaymentDetail } from './payment-init';

describe('shouldInitiatePayment', () => {
  it('initiates only when the order is awaiting payment', () => {
    expect(shouldInitiatePayment('belum_bayar')).toBe(true);
  });

  it('never initiates for terminal / draft / unknown states', () => {
    expect(shouldInitiatePayment('draft')).toBe(false);
    expect(shouldInitiatePayment('lunas')).toBe(false);
    expect(shouldInitiatePayment('diterima')).toBe(false);
    expect(shouldInitiatePayment('expired')).toBe(false);
    expect(shouldInitiatePayment(undefined)).toBe(false);
  });
});

describe('canLoadPaymentDetail', () => {
  it('does NOT load detail before initiate succeeds while awaiting payment (fixes the 404 deadlock)', () => {
    expect(canLoadPaymentDetail('belum_bayar', false)).toBe(false);
    expect(canLoadPaymentDetail('belum_bayar', true)).toBe(true);
  });

  it('loads detail directly when a payment already exists (terminal states)', () => {
    expect(canLoadPaymentDetail('lunas', false)).toBe(true);
    expect(canLoadPaymentDetail('diterima', false)).toBe(true);
    expect(canLoadPaymentDetail('expired', false)).toBe(true);
  });

  it('never loads detail for draft / unknown order', () => {
    expect(canLoadPaymentDetail('draft', true)).toBe(false);
    expect(canLoadPaymentDetail(undefined, true)).toBe(false);
  });
});
