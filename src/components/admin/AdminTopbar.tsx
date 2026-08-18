"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import {
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  LogOut,
  User,
  Shield,
  ExternalLink,
  Sparkles,
  Menu,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { logoutAdmin } from "@/actions/admin.actions";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Admin" | "Editor";
}

interface AdminTopbarProps {
  title?: string;
  admin: AdminUser
}

export const AdminTopbar: React.FC<AdminTopbarProps> = ({ title, admin }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { toggleMobileSidebar } = useAdminAuthStore();
  const [isDark, setIsDark] = useState(true);

  // Format breadcrumb title from pathname
  const pathParts = pathname.split("/").filter(Boolean);
  const currentSegment = pathParts[pathParts.length - 1] || "dashboard";
  const formattedTitle =
    title ||
    currentSegment.charAt(0).toUpperCase() + currentSegment.slice(1).replace(/-/g, " ");

  const handleLogout = async () => {
    try{
    await logoutAdmin();
    toast.success("Logged out successfully");
    router.push("/admin/login");
  }
  catch (error) {
    console.error("Logout failed:", error);
    toast.error("Failed to logout admin");
  }
  };

  return (
    <header className="h-16 bg-[#160408] border-b border-[#2C0812] px-3 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 text-white shadow-md">
      
      {/* ─── LEFT: HAMBURGER (< lg) & BREADCRUMB & TITLE ─────────────────────── */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Mobile Menu Toggle Button */}
        <button
          onClick={toggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-white/80 hover:text-white bg-[#2C0812] border border-[#3A0212] hover:bg-[#5C061D] transition-colors cursor-pointer"
          aria-label="Toggle Mobile Menu"
        >
          <Menu className="w-5 h-5 text-[#D4AF37]" />
        </button>

        <div className="text-xs font-semibold text-white/60 flex items-center gap-1.5 sm:gap-2">
          <span className="hidden sm:inline">‹</span>
          <span className="capitalize text-white font-serif font-bold text-sm sm:text-base lg:text-lg tracking-wide truncate max-w-[140px] sm:max-w-none">
            {formattedTitle}
          </span>
        </div>
      </div>

      {/* ─── CENTER: SEARCH BAR ────────────────────────────────────────────── */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search anything... ⌘K"
            className="w-full pl-10 pr-4 py-1.5 bg-[#2C0812] border border-[#3A0212] rounded-xl text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
          />
        </div>
      </div>

      {/* ─── RIGHT: UTILITY ICONS & ADMIN PROFILE ──────────────────────────── */}
      <div className="flex items-center gap-2 sm:gap-4">
        
        {/* Store Live View Shortcut */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2C0812] text-[#D4AF37] text-xs font-semibold hover:bg-[#5C061D] transition-colors border border-[#3A0212]"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Live Store</span>
        </a>

        {/* Theme Toggle */}
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-[#2C0812] transition-colors cursor-pointer"
          aria-label="Toggle Theme"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-[#D4AF37]" />
          ) : (
            <Moon className="w-4 h-4 text-white/80" />
          )}
        </button>

        {/* Admin Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 p-1 sm:p-1.5 rounded-xl hover:bg-[#2C0812] transition-colors cursor-pointer outline-none">
              <img
                src={"/category-cards/necklaces.png"}
                alt="Admin Avatar"
                className="w-8 h-8 rounded-full object-cover border border-[#D4AF37]/50"
              />
              <div className="hidden sm:block text-left">
                <span className="text-xs font-bold text-white block leading-tight">
                  {admin?.name || "Admin"}
                </span>
                <span className="text-[10px] text-[#D4AF37] block leading-tight font-mono">
                  {admin?.role || "Super Admin"}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-white/60" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-56 bg-[#160408] border border-[#2C0812] text-white shadow-2xl rounded-2xl p-2 z-50 space-y-1"
          >
            <div className="p-3 border-b border-[#2C0812] space-y-0.5">
              <p className="text-xs font-bold text-white">{admin?.name}</p>
              <p className="text-[11px] text-white/60 truncate">{admin?.email}</p>
            </div>


            <DropdownMenuItem
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-[#3A0212] rounded-xl cursor-pointer pt-2 border-t border-[#2C0812]"
            >
              <LogOut className="w-4 h-4 text-red-400" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  );
};
