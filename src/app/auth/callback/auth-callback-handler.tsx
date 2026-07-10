'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

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
      // User is already onboarded — store token and fetch profile
      setStoredToken(accessToken);

      // Fetch user profile to populate the auth store
      fetch('/api/v1/user/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            setUser(data.data);
          }
          router.replace('/products');
        })
        .catch(() => {
          // Even if profile fetch fails, redirect to products
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
