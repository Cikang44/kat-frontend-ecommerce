/**
 * Maps payment errors to user-friendly Indonesian messages.
 *
 * The backend surfaces raw gateway failures verbatim (e.g. a Midtrans
 * `401 "Unknown Merchant server_key/id"` JSON blob). We must never show that
 * to a buyer — it's confusing and leaks internal integration detail. Instead we
 * key off the stable `ApiError.code` and return a curated message, falling back
 * to a generic one for unknown codes. The raw `.message` is intentionally never
 * echoed.
 */

const MESSAGES: Record<string, string> = {
  // Gateway / infrastructure — hide the technical cause from the buyer.
  MIDTRANS_ERROR:
    'Pembayaran belum bisa diproses saat ini. Silakan coba beberapa saat lagi atau hubungi panitia.',
  NETWORK_ERROR: 'Koneksi bermasalah. Periksa jaringan internetmu lalu coba lagi.',

  // Order/payment state — actionable for the buyer.
  ORDER_NOT_FOUND: 'Pesanan tidak ditemukan.',
  ORDER_NOT_OWNED: 'Kamu tidak memiliki akses ke pesanan ini.',
  FORBIDDEN: 'Kamu tidak memiliki akses ke pesanan ini.',
  ORDER_NOT_CONFIRMED: 'Pesanan belum dikonfirmasi. Selesaikan proses checkout terlebih dahulu.',
  ORDER_ALREADY_PAID: 'Pesanan ini sudah dibayar.',
  PAYMENT_EXPIRED: 'Waktu pembayaran sudah habis. Silakan buat pesanan baru.',
  PAYMENT_METHOD_MISMATCH: 'Metode pembayaran tidak sesuai dengan pesanan.',
  PAYMENT_METHOD_NOT_FOUND: 'Metode pembayaran tidak tersedia.',
  PAYMENT_NOT_FOUND: 'Data pembayaran tidak ditemukan.',
  VALIDATION_ERROR: 'Data pembayaran tidak valid. Silakan periksa kembali.',
};

const DEFAULT_MESSAGE = 'Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.';

/** Read a string `code` off an ApiError-like object, if present. */
function getErrorCode(error: unknown): string | undefined {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as { code?: unknown }).code;
    return typeof code === 'string' ? code : undefined;
  }
  return undefined;
}

/**
 * Turn any payment error into a safe, friendly message.
 * @param fallback message for unknown/uncoded errors (defaults to a generic one).
 */
export function friendlyPaymentError(error: unknown, fallback: string = DEFAULT_MESSAGE): string {
  const code = getErrorCode(error);
  if (code && code in MESSAGES) return MESSAGES[code];
  return fallback;
}
