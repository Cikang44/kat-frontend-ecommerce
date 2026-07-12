import { describe, it, expect } from 'vitest';

import { validateNewPassword, passwordChangeReady } from './password-policy';

describe('validateNewPassword', () => {
  it('accepts a password meeting all rules', () => {
    expect(validateNewPassword('User@1234').ok).toBe(true);
    expect(validateNewPassword('Abcdef12').ok).toBe(true);
  });

  it('rejects passwords that are too short', () => {
    const r = validateNewPassword('Ab1');
    expect(r.ok).toBe(false);
    expect(r.message).toMatch(/8 karakter/);
  });

  it('rejects passwords missing an uppercase letter', () => {
    expect(validateNewPassword('abcdef12').ok).toBe(false);
  });

  it('rejects passwords missing a lowercase letter', () => {
    expect(validateNewPassword('ABCDEF12').ok).toBe(false);
  });

  it('rejects passwords missing a digit', () => {
    expect(validateNewPassword('Abcdefgh').ok).toBe(false);
  });
});

describe('passwordChangeReady', () => {
  it('is ready when current password is present, new is valid, and confirm matches', () => {
    expect(
      passwordChangeReady({
        oldPassword: 'Old@1234',
        newPassword: 'New@1234',
        confirmPassword: 'New@1234',
      }),
    ).toBe(true);
  });

  it('is not ready without the current password', () => {
    expect(
      passwordChangeReady({
        oldPassword: '',
        newPassword: 'New@1234',
        confirmPassword: 'New@1234',
      }),
    ).toBe(false);
  });

  it('is not ready when confirmation does not match', () => {
    expect(
      passwordChangeReady({
        oldPassword: 'Old@1234',
        newPassword: 'New@1234',
        confirmPassword: 'New@12345',
      }),
    ).toBe(false);
  });

  it('is not ready when the new password is weak', () => {
    expect(
      passwordChangeReady({
        oldPassword: 'Old@1234',
        newPassword: 'weak',
        confirmPassword: 'weak',
      }),
    ).toBe(false);
  });
});
