import { describe, it, expect } from 'vitest';

import { validatePhone, validateLineId, profileEditReady } from './profile-edit';

describe('validatePhone', () => {
  it('accepts valid Indonesian numbers', () => {
    expect(validatePhone('081234567890').ok).toBe(true);
    expect(validatePhone('+6281234567890').ok).toBe(true);
    expect(validatePhone('6281234567').ok).toBe(true);
  });

  it('rejects too-short / too-long / malformed numbers', () => {
    expect(validatePhone('0812').ok).toBe(false); // too short
    expect(validatePhone('12345678901').ok).toBe(false); // wrong prefix
    expect(validatePhone('08123456789012345').ok).toBe(false); // too long
    expect(validatePhone('0812-3456-7890').ok).toBe(false); // non-digits
  });
});

describe('validateLineId', () => {
  it('requires a non-empty value', () => {
    expect(validateLineId('budi_line').ok).toBe(true);
    expect(validateLineId('   ').ok).toBe(false);
    expect(validateLineId('').ok).toBe(false);
  });
});

describe('profileEditReady', () => {
  it('is true only when both fields are valid', () => {
    expect(profileEditReady({ phone: '081234567890', lineId: 'budi' })).toBe(true);
    expect(profileEditReady({ phone: '0812', lineId: 'budi' })).toBe(false);
    expect(profileEditReady({ phone: '081234567890', lineId: '' })).toBe(false);
  });
});
