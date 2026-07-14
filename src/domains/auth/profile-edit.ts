/**
 * Client-side validation for the "edit profile" form (No. HP + ID Line only).
 * Mirrors the backend rules (user.schema.ts PatchProfileBodySchema) so we can
 * give instant feedback; the backend stays authoritative.
 */

// Same pattern the backend enforces: +62 / 62 / 0 prefix, then 8–13 digits.
export const PHONE_REGEX = /^(\+62|62|0)[0-9]{8,13}$/;

export type FieldCheck = { ok: boolean; message?: string };

export function validatePhone(phone: string): FieldCheck {
  const v = phone.trim();
  if (v.length < 10 || v.length > 15) {
    return { ok: false, message: 'Nomor telepon harus 10–15 karakter.' };
  }
  if (!PHONE_REGEX.test(v)) {
    return { ok: false, message: 'Format nomor telepon tidak valid (contoh: 08123456789).' };
  }
  return { ok: true };
}

export function validateLineId(lineId: string): FieldCheck {
  if (lineId.trim().length < 1) {
    return { ok: false, message: 'ID Line tidak boleh kosong.' };
  }
  return { ok: true };
}

/** True when both fields are valid and the form can be submitted. */
export function profileEditReady(values: { phone: string; lineId: string }): boolean {
  return validatePhone(values.phone).ok && validateLineId(values.lineId).ok;
}
