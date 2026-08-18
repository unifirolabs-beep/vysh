export interface CategoryEntity {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  imageUrl: string;
  badgeText: string | null;
  displayOrder: number;
  createdAt: string;
}

export interface ProductEntity {
  id: string;
  sku: string;
  name: string;
  subtitle: string | null;
  categoryId: string;
  material: string;
  purity: string;
  description: string | null;
  isFeatured: boolean;
  isBestSeller: boolean;
  rating: number;
  reviewsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariantEntity {
  id: string;
  productId: string;
  variantSku: string;
  sizeOption: string | null;
  price: number;
  originalPrice: number | null;
  stockQuantity: number;
  isDefault: boolean;
  createdAt: string;
}

export interface ProductImageEntity {
  id: string;
  productId: string;
  variantId: string | null;
  imageUrl: string;
  thumbnailUrl: string | null;
  sortOrder: number;
  isPrimary: boolean;
  createdAt: string;
}

export interface InventoryLedgerEntity {
  id: string;
  variantId: string;
  changeQuantity: number;
  reason: "INITIAL" | "RESTOCK" | "ORDER_DEDUCTION" | "RETURN" | "CORRECTION";
  referenceId: string | null;
  createdAt: string;
}

export interface UserAddressEntity {
  id: string;
  userId: string;
  firstName: string;
  lastName: string | null;
  mobile: string;
  pincode: string;
  flatNo: string | null;
  completeAddress: string;
  landmark: string | null;
  city: string;
  state: string;
  isDefault: boolean;
  createdAt: string;
}

export interface OrderEntity {
  id: string;
  orderNumber: string;
  userId: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  shippingAddress: Record<string, any>;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: "upi" | "card" | "netbanking" | "wallet";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  razorpayOrderId: string | null;
  orderStatus: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  trackingNumber: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemEntity {
  id: string;
  orderId: string;
  productId: string | null;
  variantId: string | null;
  productName: string;
  variantSize: string | null;
  productImage: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface HeroBannerEntity {
  id: string;
  title: string;
  subtitle: string | null;
  badge: string | null;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
}

export interface OfferEntity {
  id: string;
  code: string;
  discountPercentage: number;
  minOrderValue: number;
  maxDiscountAmount: number | null;
  isActive: boolean;
  expiresAt: string | null;
}

export interface WishlistEntity {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
}

export interface ReviewEntity {
  id: string;
  productId: string;
  userId: string | null;
  authorName: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

export interface NotificationEntity {
  id: string;
  type: "NEW_ORDER" | "LOW_STOCK" | "PAYMENT_FAILED" | "GENERAL";
  title: string;
  message: string;
  linkUrl: string | null;
  isRead: boolean;
  createdAt: string;
}
