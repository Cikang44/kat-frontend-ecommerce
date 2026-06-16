/**
 * Query key factory for TanStack Query.
 *
 * Every domain gets a namespace.  Keys are structured as flat arrays so
 * partial matching in `queryClient.invalidateQueries()` works predictably.
 *
 * Usage in hooks:
 *   queryKey: queryKeys.products.list('merch', { page: '1', limit: '20' })
 *
 * Usage in mutations (invalidate after success):
 *   queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
 */
export const queryKeys = {
  /** Auth / user profile endpoints */
  auth: {
    all: ['auth'] as const,
    profile: ['auth', 'profile'] as const,
    isAdmin: ['auth', 'is-admin'] as const,
  },

  /** Product catalog endpoints */
  products: {
    all: ['products'] as const,
    list: (type?: string, filters?: Record<string, unknown>) =>
      ['products', 'list', type, filters].filter((v) => v !== undefined) as readonly unknown[],
    detail: (id: string) => ['products', 'detail', id] as const,
    categories: (category?: string) =>
      ['products', 'categories', category].filter((v) => v !== undefined) as readonly unknown[],
  },

  /** Order / transaction endpoints */
  orders: {
    all: ['orders'] as const,
    history: ['orders', 'history'] as const,
    detail: (id: string) => ['orders', 'detail', id] as const,
  },

  /** Admin dashboard endpoints */
  admin: {
    all: ['admin'] as const,
    products: (filters?: Record<string, unknown>) =>
      ['admin', 'products', filters].filter((v) => v !== undefined) as readonly unknown[],
    categories: (category?: string) =>
      ['admin', 'categories', category].filter((v) => v !== undefined) as readonly unknown[],
  },
} as const;
