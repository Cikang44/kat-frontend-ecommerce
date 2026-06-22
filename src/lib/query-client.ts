import { QueryClient } from '@tanstack/react-query';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Product data is stable within a session — avoid immediate refetch
        // after SSR hydration. Individual queries can override.
        staleTime: 5 * 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/**
 * Returns a stable QueryClient:
 * - On the server: a **new** instance per request (no cache bleed between users)
 * - On the browser: a **shared** singleton across renders
 *
 * Use in both Server Components (for prefetching) and `'use client'`
 * Providers (for the context value).
 */
export function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server — every request gets a fresh client
    return makeQueryClient();
  }
  // Browser — reuse across renders
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}
