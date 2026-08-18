import { apiFetch } from "./apiClient";

export interface FrontendCartItem {
  id: string;
  cart_id: string;
  variant_id: string;
  quantity: number;
  added_at: string;
  variant?: {
    id: string;
    product_id: string;
    variant_sku: string;
    size_option?: string;
    price: number;
    original_price?: number;
    stock_quantity: number;
    is_in_stock: boolean;
    product?: {
      id: string;
      name: string;
      slug: string;
      sku: string;
      material: string;
      metal_color: string;
    };
    image_url?: string;
  };
}

export interface FrontendCart {
  id: string;
  items: FrontendCartItem[];
  subtotal: number;
  total_items: number;
  has_out_of_stock_items: boolean;
}

export const cartService = {
  async getCart(): Promise<FrontendCart | null> {
    const res = await apiFetch<FrontendCart>("/cart");
    return res.success && res.data ? res.data : null;
  },

  async addToCart(variantId: string, quantity = 1): Promise<{ success: boolean; data?: FrontendCart; message?: string }> {
    return apiFetch<FrontendCart>("/cart/items", {
      method: "POST",
      body: JSON.stringify({ variant_id: variantId, quantity }),
    });
  },

  async updateQuantity(itemId: string, quantity: number): Promise<{ success: boolean; data?: FrontendCart; message?: string }> {
    return apiFetch<FrontendCart>(`/cart/items/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
    });
  },

  async removeItem(itemId: string): Promise<{ success: boolean; data?: FrontendCart; message?: string }> {
    return apiFetch<FrontendCart>(`/cart/items/${itemId}`, {
      method: "DELETE",
    });
  },

  async clearCart(): Promise<{ success: boolean; data?: FrontendCart; message?: string }> {
    return apiFetch<FrontendCart>("/cart", {
      method: "DELETE",
    });
  },

  async mergeCart(sessionToken: string): Promise<{ success: boolean; data?: FrontendCart; message?: string }> {
    return apiFetch<FrontendCart>("/cart/merge", {
      method: "POST",
      body: JSON.stringify({ session_token: sessionToken }),
    });
  },
};
