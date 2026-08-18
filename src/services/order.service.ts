import { apiFetch } from "./apiClient";

export interface AddressSnapshot {
  full_name: string;
  phone_number: string;
  address_line1: string;
  address_line2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface CheckoutPayload {
  address_id?: string;
  shipping_address?: AddressSnapshot;
  billing_address?: AddressSnapshot;
  coupon_code?: string;
  notes?: string;
}

export interface FrontendOrder {
  id: string;
  order_number: string;
  user_id: string;
  status: string;
  payment_status: string;
  fulfillment_status: string;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  shipping_amount: number;
  total_amount: number;
  coupon_code?: string;
  shipping_address: AddressSnapshot;
  created_at: string;
  items: {
    id: string;
    product_name: string;
    variant_sku: string;
    price: number;
    quantity: number;
    total_price: number;
    image_url?: string;
  }[];
}

export const orderService = {
  async checkout(payload: CheckoutPayload): Promise<{ success: boolean; data?: FrontendOrder; message?: string }> {
    return apiFetch<FrontendOrder>("/orders/checkout", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async getMyOrders(): Promise<FrontendOrder[]> {
    const res = await apiFetch<FrontendOrder[]>("/orders/my-orders");
    return res.success && res.data ? res.data : [];
  },

  async getOrderById(id: string): Promise<FrontendOrder | null> {
    const res = await apiFetch<FrontendOrder>(`/orders/${id}`);
    return res.success && res.data ? res.data : null;
  },

  async cancelOrder(id: string, reason?: string): Promise<{ success: boolean; data?: FrontendOrder; message?: string }> {
    return apiFetch<FrontendOrder>(`/orders/${id}/cancel`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
  },
};
