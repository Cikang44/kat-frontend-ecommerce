import { Suspense } from 'react';

import { Spinner } from '@/components/ui/spinner';
import { AuthCallbackHandler } from './auth-callback-handler';

/**
 * Google OAuth callback page.
 *
 * After the backend completes the Google OAuth flow, it redirects here with:
 * - `accessToken` — if the user is already onboarded
 * - `onboardingToken` — if the user needs to complete onboarding
 *
 * The page parses the tokens, stores them, and redirects to the appropriate page.
 */
export default function AuthCallbackPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-4">
            <Spinner />
            <p className="text-sm text-white/60">Memproses login Google...</p>
          </div>
        }
      >
        <AuthCallbackHandler />
      </Suspense>
    </div>
  );
}
