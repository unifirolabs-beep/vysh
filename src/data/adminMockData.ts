export interface AdminProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  collection: string;
  price: number;
  salePrice: number;
  stock: number;
  status: "Active" | "Draft" | "Out of Stock" | "Low Stock" | "In Stock";
  tags: string[];
  image: string;
  badge?: string;
  lastUpdated?: string;
}

export interface AdminOrder {
  id: string;
  customer: string;
  customerAvatar?: string;
  email: string;
  phone: string;
  products: { name: string; qty: number; image: string }[];
  amount: number;
  payment: "Razorpay" | "UPI" | "COD" | "PhonePe";
  paymentStatus: "Paid" | "Unpaid";
  status: "Delivered" | "Processing" | "Pending" | "Cancelled" | "Shipped";
  date: string;
  trackingId: string;
  totalItems: number;
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  productsCount: number;
  displayOrder?: number;
  status: "Active" | "Inactive";
  image: string;
}



export interface AdminBanner {
  id: string;
  title: string;
  subtitle?: string;
  location: string;
  device: "desktop" | "mobile" | "both";
  status: "Active" | "Inactive";
  priority: number;
  dateAdded: string;
  image: string;
}

export interface AdminOffer {
  id: string;
  name: string;
  subtitle?: string;
  code: string;
  type: "Percentage" | "Fixed" | "Shipping";
  discount: string;
  discountSubtext?: string;
  minSpend?: number;
  usageCount: number;
  maxUsage: number | string;
  startDate: string;
  endDate: string;
  status: "Active" | "Expired" | "Scheduled";
  badgeBg?: string;
  badgeText?: string;
}

export interface AdminReview {
  id: string;
  title: string;
  comment: string;
  rating: number;
  productName: string;
  productPrice: number;
  productImage: string;
  customerName: string;
  customerPhone: string;
  customerInitials: string;
  verifiedPurchase: boolean;
  date: string;
  status: "Published" | "Pending" | "Rejected";
}

export interface AdminCustomer {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  valueTier: "High Value" | "Medium Value" | "Low Value";
  lastOrderDate: string;
  status: "Active" | "Inactive";
  group: "VIP" | "Regular" | "New";
  location?: string;
  joinDate?: string;
}

// ─── DASHBOARD STATS ────────────────────────────────────────────────────────
export const ADMIN_DASHBOARD_STATS = [
  { title: "Total Revenue", value: "₹24,58,750", change: "+18.6%", period: "vs last 7 days", isPositive: true },
  { title: "Total Orders", value: "1,258", change: "+12.4%", period: "vs last 7 days", isPositive: true },
  { title: "Today's Orders", value: "86", change: "+8.2%", period: "vs yesterday", isPositive: true },
  { title: "Total Customers", value: "2,354", change: "+14.5%", period: "vs last 7 days", isPositive: true },
  { title: "Total Products", value: "842", change: "+5.7%", period: "vs last 7 days", isPositive: true },
  { title: "Out of Stock", value: "23", change: "+2", period: "vs yesterday", isPositive: false },
];

// ─── REVENUE & SALES CHARTS DATA ─────────────────────────────────────────────
export const REVENUE_CHART_DATA = [
  { date: "01 May", revenue: 280000, orders: 42 },
  { date: "06 May", revenue: 420000, orders: 68 },
  { date: "11 May", revenue: 390000, orders: 54 },
  { date: "16 May", revenue: 580000, orders: 89 },
  { date: "21 May", revenue: 458750, orders: 86 },
  { date: "26 May", revenue: 620000, orders: 110 },
  { date: "31 May", revenue: 710000, orders: 125 },
];

export const ORDER_STATUS_DONUT = [
  { name: "Delivered", value: 685, percentage: "54.5%", color: "#16A34A" },
  { name: "Processing", value: 320, percentage: "25.4%", color: "#F59E0B" },
  { name: "Pending", value: 158, percentage: "12.6%", color: "#2563EB" },
  { name: "Cancelled", value: 95, percentage: "7.5%", color: "#DC2626" },
];


// ─── REAL MongoDB DATABASE DATA COLLECTIONS ─────────────────────────────
export const ADMIN_PRODUCTS: AdminProduct[] = [];
export const ADMIN_ORDERS: AdminOrder[] = [];
export const ADMIN_CATEGORIES: AdminCategory[] = [];
export const ADMIN_COLLECTIONS: any[] = [];
export const ADMIN_OFFERS: AdminOffer[] = [];
export const ADMIN_REVIEWS: AdminReview[] = [];
export const ADMIN_CUSTOMERS: AdminCustomer[] = [];
export const ADMIN_BANNERS: AdminBanner[] = [];

