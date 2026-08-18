"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, ShoppingBag, LogOut, MapPin, LayoutDashboard } from "lucide-react";

export const UserAccountMenu: React.FC = () => {
  const router = useRouter();
  const { isLoggedIn, openAuthModal, logout, userPhone } = useAuthStore();

  if (!isLoggedIn) {
    return (
      <button
        onClick={openAuthModal}
        className="p-1.5 sm:p-2 text-[#1D1D1D] hover:text-[#5C061D] transition-colors group cursor-pointer"
        aria-label="User Account Login"
      >
        <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="p-1.5 sm:p-2 text-[#5C061D] hover:text-[#7A0A28] transition-colors group cursor-pointer relative"
          aria-label="User Account Menu"
        >
          <div className="w-6 h-6 rounded-full bg-[#5C061D] text-[#C9A227] font-bold text-xs flex items-center justify-center border border-[#C9A227]/40 shadow-xs">
            U
          </div>
        </button>
      </DropdownMenuTrigger>

      {/* Image 3 Format Menu */}
      <DropdownMenuContent
        align="end"
        className="w-52 bg-white border border-[#E8D8D3] shadow-xl rounded-2xl p-2 z-50 space-y-1 animate-in fade-in-0 zoom-in-95"
      >
        <div className="px-3 py-2 border-b border-[#F0E2DE] mb-1">
          <p className="text-xs font-bold text-[#1D1D1D]">Logged In</p>
          <p className="text-[11px] text-[#6E5D57] truncate">+91 {userPhone || "919353393168"}</p>
        </div>

        <DropdownMenuItem asChild>
          <Link
            href="/account"
            className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-[#1D1D1D] hover:bg-[#FFF9F8] hover:text-[#5C061D] rounded-xl transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-[#5C061D]" />
            <span>Order History</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href="/account?tab=address"
            className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-[#1D1D1D] hover:bg-[#FFF9F8] hover:text-[#5C061D] rounded-xl transition-colors cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-[#5C061D]" />
            <span>My Addresses</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
