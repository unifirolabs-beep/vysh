import { create } from "zustand";
import { Product } from "@/data/products";

export interface CartItem {
  product: Product;
  quantity: number;
  customName?: string;
  customMessage?: string;
  customPhotoUrl?: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  isCheckoutOpen: boolean;
  appliedCoupon: string | null;
  discountPercentage: number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  addItem: (product: Product, quantity?: number, customOptions?: { name?: string; message?: string; photoUrl?: string }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,
  isCheckoutOpen: false,
  appliedCoupon: null,
  discountPercentage: 0,

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

  openCheckout: () => set({ isCheckoutOpen: true, isOpen: false }),
  closeCheckout: () => set({ isCheckoutOpen: false }),

  addItem: (product, quantity = 1, customOptions) => {
    set((state) => {
      const existingIndex = state.items.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const newQuantity = Math.min(state.items[existingIndex].quantity + quantity, product.stock || Infinity);
        const updatedItems = [...state.items];
        updatedItems[existingIndex].quantity = newQuantity;
        if (customOptions?.name) updatedItems[existingIndex].customName = customOptions.name;
        if (customOptions?.message) updatedItems[existingIndex].customMessage = customOptions.message;
        if (customOptions?.photoUrl) updatedItems[existingIndex].customPhotoUrl = customOptions.photoUrl;
        return { items: updatedItems, isOpen: true };
      }

      if ((product.stock || 0) < 1) {
        return state;
      }
      return {
        items: [
          ...state.items,
          {
            product,
            quantity,
            customName: customOptions?.name,
            customMessage: customOptions?.message,
            customPhotoUrl: customOptions?.photoUrl,
          },
        ],
        isOpen: true,
      };
    });
  },

  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.product.id !== productId),
    }));
  },

  updateQuantity: (productId, quantity) => {
  if (quantity <= 0) {
    get().removeItem(productId);
    return;
  }

  set((state) => ({
    items: state.items.map((item) => {
      if (item.product.id !== productId) {
        return item;
      }

      const maxQuantity = item.product.stock ?? Infinity;
      const updatedQuantity = Math.min(quantity, maxQuantity);

      return {
        ...item,
        quantity: updatedQuantity,
      };
    }),
  }));
},

  applyCoupon: (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === "RAKHI30" || cleanCode === "VYSH30") {
      set({ appliedCoupon: cleanCode, discountPercentage: 30 });
      return true;
    } else if (cleanCode === "WELCOME10") {
      set({ appliedCoupon: cleanCode, discountPercentage: 10 });
      return true;
    }
    return false;
  },

  removeCoupon: () => set({ appliedCoupon: null, discountPercentage: 0 }),

  clearCart: () => set({ items: [], appliedCoupon: null, discountPercentage: 0 }),

  getSubtotal: () => {
    return get().items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  },

  getDiscountAmount: () => {
    const subtotal = get().getSubtotal();
    return Math.round((subtotal * get().discountPercentage) / 100);
  },

  getTotal: () => {
    const subtotal = get().getSubtotal();
    const discount = get().getDiscountAmount();
    const shipping = 99;
    return subtotal - discount + shipping;
  },

  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  },
}));
