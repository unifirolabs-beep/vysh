import { create } from "zustand";

interface WishlistStore {
  wishlistIds: string[];
  isOpen: boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
  toggleWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
  getWishlistCount: () => number;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  wishlistIds: [],
  isOpen: false,

  openWishlist: () => set({ isOpen: true }),
  closeWishlist: () => set({ isOpen: false }),

  toggleWishlist: (productId) => {
    set((state) => {
      const exists = state.wishlistIds.includes(productId);
      if (exists) {
        return { wishlistIds: state.wishlistIds.filter((id) => id !== productId) };
      } else {
        return { wishlistIds: [...state.wishlistIds, productId] };
      }
    });
  },

  removeFromWishlist: (productId) => {
    set((state) => ({
      wishlistIds: state.wishlistIds.filter((id) => id !== productId),
    }));
  },

  clearWishlist: () => {
    set({ wishlistIds: [] });
  },

  isInWishlist: (productId) => {
    return get().wishlistIds.includes(productId);
  },

  getWishlistCount: () => {
    return get().wishlistIds.length;
  },
}));

