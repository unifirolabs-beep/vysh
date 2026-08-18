import { apiFetch } from "@/services/apiClient";
import { getProductsAction } from "@/actions/products.actions";
import { getAdminOrdersAction } from "@/actions/order.actions";
import { getDashboardStatsAction } from "@/actions/dashboard.actions";

export interface DashboardStatsData {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
}

export interface RealtimeOrder {
  id: string;
  orderNumber: string;
  customer: string;
  customerEmail: string;
  customerPhone?: string;
  amount: number;
  paymentStatus: string;
  status: string;
  paymentMethod?: string;
  itemsCount: number;
  date: string;
  products?: any[];
}

export interface RealtimeProduct {
  id: string;
  name: string;
  sku: string;
  categoryName: string;
  price: number;
  stock: number;
  status: string;
  imageUrl: string;
  createdAt: string;
}

export async function fetchDashboardStats() {
  const res = await getDashboardStatsAction();
  if (res.success && res.stats) {
    return res.stats;
  }
  return {
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
  };
}

export async function fetchLiveProducts() {
  const res = await getProductsAction();
  if (res.success && res.products) {
    return res.products;
  }
  return [];
}

export async function fetchLiveCategories() {

}

export async function fetchLiveOrders() {
  const res = await getAdminOrdersAction();
  if (res.success && res.orders) {
    return res.orders;
  }
  return [];
}

export async function fetchLiveBanners() {

}

export async function fetchLiveOffers() {

}

export async function fetchLiveCustomers() {

}
