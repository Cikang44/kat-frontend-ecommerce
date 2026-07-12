/**
 * Pure helpers for the change-password form.
 *
 * These mirror the backend `PasswordSchema` (min 8 chars + at least one
 * uppercase, one lowercase, and one digit) so the UI can gate the submit
 * button and show a helpful message BEFORE hitting the network. The backend
 * remains the source of truth — this is UX only, never a security boundary.
 */

/** Human-readable rule shown in the change-password modal. */
export const PASSWORD_RULE_HINT =
  'Minimal 8 karakter, mengandung huruf besar, huruf kecil, dan angka.';

export type PasswordCheck = { ok: boolean; message?: string };

/** Validate a candidate new password against the backend policy. */
export function validateNewPassword(pw: string): PasswordCheck {
  if (pw.length < 8) {
    return { ok: false, message: 'Password minimal 8 karakter.' };
  }
  if (!/[A-Z]/.test(pw)) {
    return { ok: false, message: 'Password harus mengandung huruf besar.' };
  }
  if (!/[a-z]/.test(pw)) {
    return { ok: false, message: 'Password harus mengandung huruf kecil.' };
  }
  if (!/[0-9]/.test(pw)) {
    return { ok: false, message: 'Password harus mengandung angka.' };
  }
  return { ok: true };
}

export type ChangePasswordInput = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

/**
 * Whether the change-password form is ready to submit: current password
 * present, new password meets policy, and confirmation matches.
 */
export function passwordChangeReady({
  oldPassword,
  newPassword,
  confirmPassword,
}: ChangePasswordInput): boolean {
  if (oldPassword.trim() === '') return false;
  if (!validateNewPassword(newPassword).ok) return false;
  return newPassword === confirmPassword;
}
