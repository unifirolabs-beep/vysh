import { apiFetch } from "./apiClient";

export interface FrontendCategory {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  badge_text?: string;
  description?: string;
}

export interface FrontendCollection {
  id: string;
  name: string;
  slug: string;
  banner_url?: string;
  image_url?: string;
}

export interface FrontendProductVariant {
  id: string;
  variant_sku: string;
  size_option?: string;
  price: number;
  original_price?: number;
  stock_quantity: number;
}

export interface FrontendProduct {
  id: string;
  sku: string;
  slug: string;
  name: string;
  subtitle?: string;
  category_id: string;
  material: string;
  metal_color: string;
  purity: string;
  description?: string;
  status: string;
  is_featured: boolean;
  is_best_seller: boolean;
  rating: number;
  reviews_count: number;
  variants: FrontendProductVariant[];
  images: { id: string; image_url: string; is_primary: boolean }[];
  category?: FrontendCategory;
}

export const productService = {
  async getCategories(): Promise<FrontendCategory[]> {
    const res = await apiFetch<FrontendCategory[]>("/categories");
    return res.success && res.data ? res.data : [];
  },

  async getCollections(): Promise<FrontendCollection[]> {
    const res = await apiFetch<FrontendCollection[]>("/collections");
    return res.success && res.data ? res.data : [];
  },

  async getProducts(params?: Record<string, any>): Promise<{ products: FrontendProduct[]; total: number }> {
    const queryString = params ? "?" + new URLSearchParams(params).toString() : "";
    const res = await apiFetch<{ products: FrontendProduct[]; total: number }>("/products" + queryString);
    if (res.success && res.products) {
      return { products: res.products, total: res.total };
    }
    return { products: [], total: 0 };
  },

  async getProductBySlug(slug: string): Promise<FrontendProduct | null> {
    const res = await apiFetch<FrontendProduct>(`/products/slug/${slug}`);
    return res.success && res.data ? res.data : null;
  },
};
