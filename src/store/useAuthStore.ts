import { create } from "zustand";

export interface SavedAddress {
  id: string;
  pincode: string;
  flatNo?: string;
  completeAddress: string;
  firstName: string;
  lastName?: string;
  mobile: string;
  isDefault?: boolean;
}

export interface UserOrder {
  id: string;
  date: string;
  itemsCount: number;
  totalAmount: number;
  status: string;
  deliveryDate: string;
}

interface AuthStore {
  isLoggedIn: boolean;
  userPhone: string | null;
  userName: string;
  isAuthModalOpen: boolean;
  authStep: "phone" | "otp" | "success";
  savedAddresses: SavedAddress[];
  orders: UserOrder[];

  openAuthModal: () => void;
  closeAuthModal: () => void;
  setAuthStep: (step: "phone" | "otp" | "success") => void;
  loginWithPhone: (phone: string) => void;
  verifyOtpAndLogin: (otp: string) => boolean;
  logout: () => void;
  addAddress: (address: Omit<SavedAddress, "id">) => void;
  removeAddress: (id: string) => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  isLoggedIn: false,
  userPhone: null,
  userName: "User",
  isAuthModalOpen: false,
  authStep: "phone",
  savedAddresses: [],
  orders: [],

  openAuthModal: () => set({ isAuthModalOpen: true, authStep: "phone" }),
  closeAuthModal: () => set({ isAuthModalOpen: false, authStep: "phone" }),
  setAuthStep: (step) => set({ authStep: step }),

  loginWithPhone: (phone) => {
    set({ userPhone: phone, authStep: "otp" });
  },

  verifyOtpAndLogin: (otp) => {
    // Accepts any 4 or 6 digit OTP for demo
    if (otp.length >= 4) {
      set({ authStep: "success", isLoggedIn: true });
      return true;
    }
    return false;
  },

  logout: () => {
    set({
      isLoggedIn: false,
      userPhone: null,
      userName: "User",
      isAuthModalOpen: false,
      authStep: "phone",
    });
  },

  addAddress: (newAddr) => {
    const addressWithId: SavedAddress = {
      ...newAddr,
      id: `addr-${Date.now()}`,
    };
    set((state) => {
      const updated = newAddr.isDefault
        ? state.savedAddresses.map((a) => ({ ...a, isDefault: false }))
        : [...state.savedAddresses];
      return { savedAddresses: [...updated, addressWithId] };
    });
  },

  removeAddress: (id) => {
    set((state) => ({
      savedAddresses: state.savedAddresses.filter((a) => a.id !== id),
    }));
  },
}));
