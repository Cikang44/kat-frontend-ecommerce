'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { Spinner } from '@/components/ui/spinner';
import { useIsAdmin } from '@/domains/auth/auth.hooks';
import { useAuthStore } from '@/lib/providers';

/**
 * Client-side guard for every `/admin/*` route. The backend already enforces
 * admin-only access (401/403), but this prevents non-admins from ever seeing
 * the admin shell and redirects them away — defense-in-depth + clean UX.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const { data, isLoading, isError } = useIsAdmin();
  const isAdmin = data?.isAdmin ?? false;

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/login');
      return;
    }
    if (!isLoading && (isError || !isAdmin)) {
      router.replace('/products');
    }
  }, [isLoggedIn, isLoading, isError, isAdmin, router]);

  if (!isLoggedIn || isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!isAdmin) {
    // Redirect is in flight; render nothing to avoid flashing admin UI.
    return null;
  }

  return <>{children}</>;
}
