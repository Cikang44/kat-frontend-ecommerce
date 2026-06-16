/**
 * MOCK API — Product domain
 *
 * Simulates backend responses for product endpoints.
 * Replace each function body with the real SDK call when the backend is ready.
 */

import type {
  ProductListItem,
  ProductDetail,
  ProductImage,
  ProductVariant,
  PaginationMeta,
} from '@/api/types.gen';

export interface ProductListResult {
  data: ProductListItem[];
  meta: PaginationMeta;
}

// ---------------------------------------------------------------------------
// Mock data — single product, kaos OSKM, variants 1-5
// ---------------------------------------------------------------------------

const MOCK_VARIANTS: ProductVariant[] = [1, 2, 3, 4, 5].map((n) => ({
  id: `var-${n}`,
  sleeveType: 'none' as const,
  color: '',
  size: 'none' as const,
  priceModifier: 0,
  stock: 50,
  sku: `SKU-KAOS-${n}`,
  finalPrice: 85000,
}));

const MOCK_PRIMARY_IMAGE: ProductImage = {
  id: 'img-1',
  url: '/mock/kaos-oskm.jpg',
  isPrimary: true,
  sortOrder: 1,
};

const MOCK_PRODUCTS: ProductListItem[] = [
  {
    id: 'prod-kaos-oskm',
    name: 'Kaos OSKM 2026',
    description: 'Kaos resmi OSKM ITB 2026.',
    basePrice: 85000,
    type: 'merchandise',
    category: 'baju',
    faculty: '',
    primaryImage: MOCK_PRIMARY_IMAGE,
    variantCount: MOCK_VARIANTS.length,
    minPrice: 85000,
    maxPrice: 85000,
  },
];

const MOCK_DETAIL: ProductDetail = {
  id: 'prod-kaos-oskm',
  name: 'Kaos OSKM 2026',
  description: 'Kaos resmi OSKM ITB 2026.',
  basePrice: 85000,
  type: 'merchandise',
  category: 'baju',
  faculty: '',
  images: [MOCK_PRIMARY_IMAGE],
  variants: MOCK_VARIANTS,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function matchMulti(
  items: ProductListItem[],
  values: string[],
  key: keyof ProductListItem,
): ProductListItem[] {
  if (!values.length) return items;
  return items.filter((p) => values.includes(String(p[key])));
}

function searchProducts(items: ProductListItem[], query?: string): ProductListItem[] {
  if (!query) return items;
  const q = query.toLowerCase();
  return items.filter(
    (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
  );
}

function paginate(items: ProductListItem[], page: number, limit: number): ProductListResult {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  return {
    data: items.slice(start, start + limit),
    meta: { page, limit, total, totalPages },
  };
}

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

export const api = {
  /**
   * GET /product — product list with filters & pagination.
   *
   * type, category, faculty accept comma-separated multi-values.
   */
  async list(filters?: {
    /** merchandise, collaboration, kit_panitia (comma-separated multi) */
    type?: string;
    /** perhiasan, baju, peralatan_tulis, aksesoris (comma-separated multi) */
    category?: string;
    /** faculty name (comma-separated multi) */
    faculty?: string;
    /** keyword search (case-insensitive) */
    search?: string;
    /** page number (default: 1) */
    page?: string;
    /** items per page (default: 20, max: 50) */
    limit?: string;
  }): Promise<ProductListResult> {
    await delay(400);

    const page = Math.max(1, Number(filters?.page) || 1);
    const limit = Math.min(Math.max(1, Number(filters?.limit) || 20), 50);

    let items = MOCK_PRODUCTS;

    if (filters?.type) {
      const types = filters.type.split(',').map((t) => t.trim());
      items = matchMulti(items, types, 'type');
    }
    if (filters?.category) {
      const cats = filters.category.split(',').map((c) => c.trim());
      items = matchMulti(items, cats, 'category');
    }
    if (filters?.faculty) {
      const facs = filters.faculty.split(',').map((f) => f.trim());
      items = matchMulti(items, facs, 'faculty');
    }

    items = searchProducts(items, filters?.search);
    return paginate(items, page, limit);
  },

  /** GET /product/:id — product detail */
  async detail(id: string): Promise<ProductDetail> {
    await delay(300);
    if (id !== MOCK_DETAIL.id) throw new Error('Produk tidak ditemukan');
    return MOCK_DETAIL;
  },
};
