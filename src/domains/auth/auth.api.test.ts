import { describe, it, expect } from 'vitest';

import { resolveLoginOutcome, type LoginResult } from './auth.api';

const baseUser = {
  id: 'u1',
  name: 'Nama Panitia',
  email: 'panitia@example.com',
  role: 'panitia' as const,
};

describe('resolveLoginOutcome', () => {
  it('routes an onboarding-required login to onboarding', () => {
    const data: LoginResult = {
      onboardingRequired: true,
      onboardingToken: 'temp-token',
      user: { ...baseUser, isOnboardingComplete: false },
    };
    expect(resolveLoginOutcome(data)).toBe('onboarding');
  });

  it('routes a completed login to authenticated', () => {
    const data: LoginResult = {
      onboardingRequired: false,
      accessToken: 'access-token',
      user: { ...baseUser, isOnboardingComplete: true },
    };
    expect(resolveLoginOutcome(data)).toBe('authenticated');
  });
});
