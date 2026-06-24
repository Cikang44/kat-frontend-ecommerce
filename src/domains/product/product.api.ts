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
// Mock data — Kaos Angkatan (matches Figma Product-Detail/Mobile)
// ---------------------------------------------------------------------------

const MOCK_VARIANTS: ProductVariant[] = [
  {
    id: 'var-s-black',
    sleeveType: 'none',
    color: 'Hitam',
    size: 'S',
    priceModifier: 0,
    stock: 50,
    sku: 'SKU-KAOS-S-BLK',
    finalPrice: 90000,
  },
  {
    id: 'var-m-black',
    sleeveType: 'none',
    color: 'Hitam',
    size: 'M',
    priceModifier: 0,
    stock: 50,
    sku: 'SKU-KAOS-M-BLK',
    finalPrice: 90000,
  },
  {
    id: 'var-l-black',
    sleeveType: 'none',
    color: 'Hitam',
    size: 'L',
    priceModifier: 0,
    stock: 50,
    sku: 'SKU-KAOS-L-BLK',
    finalPrice: 90000,
  },
  {
    id: 'var-xl-black',
    sleeveType: 'none',
    color: 'Hitam',
    size: 'XL',
    priceModifier: 0,
    stock: 50,
    sku: 'SKU-KAOS-XL-BLK',
    finalPrice: 90000,
  },
  {
    id: 'var-s-navy',
    sleeveType: 'none',
    color: 'Navy',
    size: 'S',
    priceModifier: 0,
    stock: 30,
    sku: 'SKU-KAOS-S-NVY',
    finalPrice: 90000,
  },
  {
    id: 'var-m-navy',
    sleeveType: 'none',
    color: 'Navy',
    size: 'M',
    priceModifier: 0,
    stock: 30,
    sku: 'SKU-KAOS-M-NVY',
    finalPrice: 90000,
  },
  {
    id: 'var-l-navy',
    sleeveType: 'none',
    color: 'Navy',
    size: 'L',
    priceModifier: 0,
    stock: 30,
    sku: 'SKU-KAOS-L-NVY',
    finalPrice: 90000,
  },
  {
    id: 'var-xl-navy',
    sleeveType: 'none',
    color: 'Navy',
    size: 'XL',
    priceModifier: 0,
    stock: 30,
    sku: 'SKU-KAOS-XL-NVY',
    finalPrice: 90000,
  },
  {
    id: 'var-s-white',
    sleeveType: 'none',
    color: 'Putih',
    size: 'S',
    priceModifier: 0,
    stock: 20,
    sku: 'SKU-KAOS-S-WHT',
    finalPrice: 90000,
  },
  {
    id: 'var-m-white',
    sleeveType: 'none',
    color: 'Putih',
    size: 'M',
    priceModifier: 0,
    stock: 20,
    sku: 'SKU-KAOS-M-WHT',
    finalPrice: 90000,
  },
  {
    id: 'var-l-white',
    sleeveType: 'none',
    color: 'Putih',
    size: 'L',
    priceModifier: 0,
    stock: 20,
    sku: 'SKU-KAOS-L-WHT',
    finalPrice: 90000,
  },
  {
    id: 'var-xl-white',
    sleeveType: 'none',
    color: 'Putih',
    size: 'XL',
    priceModifier: 0,
    stock: 20,
    sku: 'SKU-KAOS-XL-WHT',
    finalPrice: 90000,
  },
];

const MOCK_IMAGES: ProductImage[] = [
  { id: 'img-1', url: '/mock/kaos-angkatan-black.jpg', isPrimary: true, sortOrder: 1 },
  { id: 'img-2', url: '/mock/kaos-angkatan-navy.jpg', isPrimary: false, sortOrder: 2 },
  { id: 'img-3', url: '/mock/kaos-angkatan-white.jpg', isPrimary: false, sortOrder: 3 },
  { id: 'img-4', url: '/mock/kaos-angkatan-black.jpg', isPrimary: false, sortOrder: 4 },
];
const MOCK_PRODUCTS: ProductListItem[] = [
  {
    id: 'm-1',
    name: 'Kaos Ganesha Goods',
    description: 'Kaos nyaman dipakai.',
    basePrice: 85000,
    type: 'merchandise',
    category: 'baju',
    faculty: '',
    primaryImage: MOCK_IMAGES[0],
    variantCount: 4,
    minPrice: 85000,
    maxPrice: 85000,
  },
  {
    id: 'm-2',
    name: 'Lanyard Logo Ganesha',
    description: 'Lanyard tebal dan kuat.',
    basePrice: 25000,
    type: 'merchandise',
    category: 'aksesoris',
    faculty: '',
    primaryImage: MOCK_IMAGES[1],
    variantCount: 1,
    minPrice: 25000,
    maxPrice: 25000,
  },
  {
    id: 'm-3',
    name: 'Mug Keramik ITB',
    description: 'Mug untuk ngopi pas nugas.',
    basePrice: 35000,
    type: 'merchandise',
    category: 'peralatan_tulis',
    faculty: '',
    primaryImage: MOCK_IMAGES[1],
    variantCount: 1,
    minPrice: 35000,
    maxPrice: 35000,
  },
  {
    id: 'm-4',
    name: 'Gantungan Kunci Kayu',
    description: 'Gantungan kunci estetik.',
    basePrice: 15000,
    type: 'merchandise',
    category: 'aksesoris',
    faculty: '',
    primaryImage: MOCK_IMAGES[1],
    variantCount: 1,
    minPrice: 15000,
    maxPrice: 15000,
  },
  {
    id: 'm-5',
    name: 'Notebook Premium',
    description: 'Buku catatan kertas tebal.',
    basePrice: 45000,
    type: 'merchandise',
    category: 'peralatan_tulis',
    faculty: '',
    primaryImage: MOCK_IMAGES[1],
    variantCount: 1,
    minPrice: 45000,
    maxPrice: 45000,
  },
  {
    id: 'm-6',
    name: 'Sticker Pack Lucu',
    description: 'Sticker anti air untuk laptop.',
    basePrice: 10000,
    type: 'merchandise',
    category: 'aksesoris',
    faculty: '',
    primaryImage: MOCK_IMAGES[1],
    variantCount: 1,
    minPrice: 10000,
    maxPrice: 10000,
  },
  {
    id: 'm-7',
    name: 'Hoodie Navy ITB',
    description: 'Hoodie hangat untuk begadang.',
    basePrice: 195000,
    type: 'merchandise',
    category: 'baju',
    faculty: '',
    primaryImage: MOCK_IMAGES[1],
    variantCount: 4,
    minPrice: 195000,
    maxPrice: 210000,
  },
  {
    id: 'm-8',
    name: 'Cincin Perak Ganesha',
    description: 'Perhiasan perak asli.',
    basePrice: 120000,
    type: 'merchandise',
    category: 'perhiasan',
    faculty: '',
    primaryImage: MOCK_IMAGES[1],
    variantCount: 2,
    minPrice: 120000,
    maxPrice: 120000,
  },

  // --- TYPE: COLLABORATION (DENGAN FACULTY) ---
  {
    id: 'c-5',
    name: 'Totebag SBM',
    description: 'Totebag kanvas SBM.',
    basePrice: 65000,
    type: 'collaboration',
    category: 'aksesoris',
    faculty: 'SBM',
    primaryImage: MOCK_IMAGES[1],
    variantCount: 1,
    minPrice: 65000,
    maxPrice: 65000,
  },
  {
    id: 'c-6',
    name: 'Gantungan Kunci FSRD',
    description: 'Desain nyentrik FSRD.',
    basePrice: 20000,
    type: 'collaboration',
    category: 'aksesoris',
    faculty: 'FSRD',
    primaryImage: MOCK_IMAGES[1],
    variantCount: 1,
    minPrice: 20000,
    maxPrice: 20000,
  },
  {
    id: 'c-7',
    name: 'Pulpen FTI',
    description: 'Pulpen ukir FTI.',
    basePrice: 25000,
    type: 'collaboration',
    category: 'peralatan_tulis',
    faculty: 'FTI',
    primaryImage: MOCK_IMAGES[1],
    variantCount: 1,
    minPrice: 25000,
    maxPrice: 25000,
  },
  {
    id: 'c-8',
    name: 'Kemeja FMIPA',
    description: 'Kemeja formal FMIPA.',
    basePrice: 150000,
    type: 'collaboration',
    category: 'baju',
    faculty: 'FMIPA',
    primaryImage: MOCK_IMAGES[1],
    variantCount: 4,
    minPrice: 150000,
    maxPrice: 150000,
  },

  // --- TYPE: KIT PANITIA ---
  {
    id: 'k-1',
    name: 'Kaos Panitia Pusat',
    description: 'Wajib dibeli seluruh panitia.',
    basePrice: 50000,
    type: 'kit_panitia',
    category: 'baju',
    faculty: '',
    primaryImage: MOCK_IMAGES[0],
    variantCount: 4,
    minPrice: 50000,
    maxPrice: 50000,
  },
  {
    id: 'k-2',
    name: 'Nametag Panitia',
    description: 'Nametag ID Card Panitia.',
    basePrice: 15000,
    type: 'kit_panitia',
    category: 'aksesoris',
    faculty: '',
    primaryImage: MOCK_IMAGES[1],
    variantCount: 1,
    minPrice: 15000,
    maxPrice: 15000,
  },
  {
    id: 'k-6',
    name: 'Kemeja Divisi Acara',
    description: 'Kemeja khusus acara.',
    basePrice: 110000,
    type: 'kit_panitia',
    category: 'baju',
    faculty: '',
    primaryImage: MOCK_IMAGES[1],
    variantCount: 4,
    minPrice: 110000,
    maxPrice: 110000,
  },
  {
    id: 'k-8',
    name: 'Pin Panitia',
    description: 'Pin panitia kebanggaan.',
    basePrice: 8000,
    type: 'kit_panitia',
    category: 'aksesoris',
    faculty: '',
    primaryImage: MOCK_IMAGES[1],
    variantCount: 1,
    minPrice: 8000,
    maxPrice: 8000,
  },
];

const _MOCK_DETAIL: ProductDetail = {
  id: 'prod-kaos-angkatan',
  name: 'Kaos Angkatan',
  description: 'Kualitas bagus rekomen banget, ayo beli.',
  basePrice: 90000,
  type: 'merchandise',
  category: 'baju',
  faculty: '',
  images: MOCK_IMAGES,
  variants: MOCK_VARIANTS,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const _delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function matchMulti(
  items: ProductListItem[],
  values: string[],
  key: keyof ProductListItem,
): ProductListItem[] {
  const validValues = values.filter((v) => v.trim() !== '');

  if (validValues.length === 0) return items;

  return items.filter((p) => validValues.includes(String(p[key])));
}

function searchProducts(items: ProductListItem[], query?: string): ProductListItem[] {
  if (!query || query.trim() === '') return items;
  const q = query.toLowerCase().trim();
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
// API Object Realisasi
// ---------------------------------------------------------------------------

export const api = {
  async list(filters?: {
    type?: string;
    category?: string;
    faculty?: string;
    search?: string;
    page?: string;
    limit?: string;
  }): Promise<ProductListResult> {
    // Simulasi delay jaringan kecil
    await new Promise((r) => setTimeout(r, 400));

    const page = Math.max(1, Number(filters?.page) || 1);
    const limit = Math.min(Math.max(1, Number(filters?.limit) || 20), 50);

    // Ambil basis data dari array 24 mock produk yang telah dibuat sebelumnya
    let items = [...MOCK_PRODUCTS];

    // Jalankan filter 'type' (Merchandise, Collaboration, Kit Panitia)
    if (filters?.type) {
      const types = filters.type.split(',').map((t) => t.trim());
      items = matchMulti(items, types, 'type');
    }

    // Jalankan filter 'category' (Baju, Aksesoris, Peralatan Tulis, Perhiasan)
    if (filters?.category) {
      const cats = filters.category.split(',').map((c) => c.trim());
      items = matchMulti(items, cats, 'category');
    }

    // Jalankan filter 'faculty' (STEI, FTSL, dll.)
    if (filters?.faculty) {
      const facs = filters.faculty.split(',').map((f) => f.trim());
      items = matchMulti(items, facs, 'faculty');
    }

    // Jalankan filter pencarian kata kunci nama/deskripsi
    items = searchProducts(items, filters?.search);

    // Kembalikan data berupa potongan halaman yang sesuai
    return paginate(items, page, limit);
  },

  async detail(id: string): Promise<ProductDetail> {
    await new Promise((r) => setTimeout(r, 300));
    const found = MOCK_PRODUCTS.find((p) => p.id === id);
    if (!found) throw new Error('Produk tidak ditemukan');

    // Mengembalikan detail produk struktural (Varian disesuaikan ID produk)
    return {
      id: found.id,
      name: found.name,
      description: found.description,
      basePrice: found.basePrice,
      type: found.type,
      category: found.category,
      faculty: found.faculty,
      images: [found.primaryImage],
      variants: MOCK_VARIANTS, // Menggunakan array struktur varian global sebagai sampel
    };
  },
};
