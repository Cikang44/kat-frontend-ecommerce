import { describe, it, expect } from 'vitest';

import { ApiError } from './payment.api';
import { friendlyPaymentError } from './payment-errors';

describe('friendlyPaymentError', () => {
  it('maps a gateway failure to a safe message and never leaks the raw text', () => {
    const raw = new ApiError(
      'MIDTRANS_ERROR',
      'Gagal membuat transaksi pembayaran: Midtrans charge gagal (401): {"status_code":"401"}',
    );
    const msg = friendlyPaymentError(raw);
    expect(msg).toBe(
      'Pembayaran belum bisa diproses saat ini. Silakan coba beberapa saat lagi atau hubungi panitia.',
    );
    expect(msg).not.toMatch(/Midtrans|401|server_key/i);
  });

  it('maps known order/payment codes', () => {
    expect(friendlyPaymentError(new ApiError('PAYMENT_EXPIRED', 'x'))).toMatch(/waktu pembayaran/i);
    expect(friendlyPaymentError(new ApiError('ORDER_ALREADY_PAID', 'x'))).toMatch(/sudah dibayar/i);
    expect(friendlyPaymentError(new ApiError('NETWORK_ERROR', 'x'))).toMatch(/koneksi/i);
  });

  it('uses the provided fallback for unknown/uncoded codes', () => {
    expect(friendlyPaymentError(new ApiError('UNKNOWN_ERROR', 'x'), 'Gagal memuat pesanan.')).toBe(
      'Gagal memuat pesanan.',
    );
    expect(friendlyPaymentError(new Error('boom'))).toMatch(/terjadi kesalahan/i);
    expect(friendlyPaymentError(undefined)).toMatch(/terjadi kesalahan/i);
  });
});
