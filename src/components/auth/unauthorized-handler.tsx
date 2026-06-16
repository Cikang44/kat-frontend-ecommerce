'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { useRefreshToken } from '@/domains/auth/auth.hooks';
import { useAuthStore } from '@/lib/providers';

/**
 * Renders nothing.  Listens for the `auth:unauthorized` custom event
 * dispatched by the HTTP interceptor in `api-client.ts`.
 *
 * On 401:
 *  1. Attempts `POST /auth/refresh-token` using the HTTP-only cookie.
 *  2. On success → the new access token is stored by `useRefreshToken`,
 *     then stale queries are invalidated so they refetch with the fresh token.
 *  3. On failure → clears zustand auth state and all query caches
 *     (user is effectively logged out).
 *
 * A ref guard prevents concurrent refresh attempts if multiple 401s fire
 * before the first refresh completes.
 */
export function UnauthorizedHandler() {
  const queryClient = useQueryClient();
  const refreshToken = useRefreshToken();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const isRefreshing = useRef(false);

  useEffect(() => {
    const handleUnauthorized = async () => {
      if (isRefreshing.current) return;
      isRefreshing.current = true;

      try {
        await refreshToken.mutateAsync();

        // Token refreshed successfully — tell queries to refetch so they
        // pick up the new access token on the next request.
        queryClient.invalidateQueries();
      } catch {
        // Refresh failed (cookie expired, revoked, etc.) → full logout.
        clearAuth();
        queryClient.clear();
      } finally {
        isRefreshing.current = false;
      }
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [refreshToken, clearAuth, queryClient]);

  return null;
}
