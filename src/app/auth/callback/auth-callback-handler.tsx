'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import type { UserProfile } from '@/api/types.gen';
import { getApiV1UserProfile } from '@/api/sdk.gen';
import { Spinner } from '@/components/ui/spinner';
import { setStoredToken } from '@/lib/api-client';
import { useAuthStore } from '@/lib/providers';

/**
 * Client component that handles the Google OAuth callback.
 * Separated from the page to allow wrapping in Suspense boundary.
 */
export function AuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((s) => s.setUser);
  const setOnboardingToken = useAuthStore((s) => s.setOnboardingToken);

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const onboardingToken = searchParams.get('onboardingToken');
    const error = searchParams.get('error');

    if (error) {
      // OAuth failed — redirect to login with error
      router.replace(`/login?error=${encodeURIComponent(error)}`);
      return;
    }

    if (accessToken) {
      // User is already onboarded — store token, then hydrate the auth store.
      // The token is picked up by the SDK request interceptor (see api-client),
      // which sends it through the same-origin `/api/v1/*` proxy.
      setStoredToken(accessToken);

      getApiV1UserProfile()
        .then((res) => {
          const body = res.data as { success: boolean; data: UserProfile } | undefined;
          if (body?.success && body.data) {
            const p = body.data;
            setUser({
              id: p.id,
              name: p.name,
              email: p.email,
              role: p.role,
              // Reaching this branch means the backend issued a full access
              // token, which only happens after onboarding is complete.
              isOnboardingComplete: true,
            });
          }
          router.replace('/products');
        })
        .catch(() => {
          // Even if profile hydration fails, the token is stored — proceed.
          router.replace('/products');
        });
      return;
    }

    if (onboardingToken) {
      // User needs to complete onboarding
      setOnboardingToken(onboardingToken);
      router.replace('/onboarding');
      return;
    }

    // No tokens — redirect to login
    router.replace('/login');
  }, [searchParams, router, setUser, setOnboardingToken]);

  return (
    <div className="flex flex-col items-center gap-4">
      <Spinner />
      <p className="text-sm text-white/60">Memproses login Google...</p>
    </div>
  );
}
