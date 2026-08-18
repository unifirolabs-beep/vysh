"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import {
  LayoutDashboard,
  ShoppingBag,
  PackageCheck,
  LogOut,
  ChevronDown,
  ChevronRight,
  Sparkles,
  PanelLeftClose,
  PanelLeft,
  X,
} from "lucide-react";
import { VyshLogo } from "@/components/common/VyshLogo";
import { toast } from "sonner";
import { logoutAdmin } from "@/actions/admin.actions";

interface MenuItem {
  title: string;
  href: string;
  icon: React.ElementType;
  subItems?: { title: string; href: string }[];
}

const MENU_ITEMS: MenuItem[] = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  {
    title: "Products",
    href: "/admin/products",
    icon: ShoppingBag,
    subItems: [
      { title: "All Products", href: "/admin/products" },
      { title: "Add New Product", href: "/admin/products/add" },
    ],
  },
  { title: "Orders", href: "/admin/orders", icon: PackageCheck },
];

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const {
    sidebarCollapsed,
    toggleSidebar,
    mobileSidebarOpen,
    setMobileSidebarOpen,
  } = useAdminAuthStore();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>("Products");

const handleLogout = async () => {
  try {
    setMobileSidebarOpen(false);

    await logoutAdmin();

    toast.success("Admin logged out successfully");

    router.push("/admin/login");
    router.refresh();
  } catch (error) {
    console.error("Logout failed:", error);

    toast.error("Failed to logout");
  }
};

  const handleNavClick = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <>
      {/* ─── MOBILE BACKDROP OVERLAY (< lg) ─────────────────────────── */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 bg-[#160408] border-r border-[#2C0812] text-white flex flex-col justify-between transition-all duration-300 shadow-2xl ${
          mobileSidebarOpen
            ? "translate-x-0 w-64 sm:w-72"
            : "-translate-x-full lg:translate-x-0"
        } ${sidebarCollapsed ? "lg:w-20" : "lg:w-64"}`}
      >
        {/* ─── SIDEBAR HEADER ─────────────────────────────────────────────────── */}
        <div>
          <div className="p-4 sm:p-5 flex items-center justify-between border-b border-[#2C0812]">
            {/* Logo area */}
            <div className="lg:block">
              {!sidebarCollapsed || mobileSidebarOpen ? (
                <VyshLogo variant="gold" size="sm" href="/admin" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-[#5C061D] text-[#D4AF37] font-serif font-bold text-xl flex items-center justify-center border border-[#D4AF37]/30 mx-auto">
                  V
                </div>
              )}
            </div>

            {/* Desktop toggle button */}
            <button
              onClick={toggleSidebar}
              className="hidden lg:flex p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-[#2C0812] transition-colors cursor-pointer"
              aria-label="Toggle Sidebar"
            >
              {sidebarCollapsed ? (
                <PanelLeft className="w-5 h-5 text-[#D4AF37]" />
              ) : (
                <PanelLeftClose className="w-5 h-5 text-white/60" />
              )}
            </button>

            {/* Mobile close button (< lg) */}
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden p-2 rounded-xl text-white/70 hover:text-white bg-[#2C0812] transition-colors cursor-pointer"
              aria-label="Close Mobile Sidebar"
            >
              <X className="w-5 h-5 text-[#D4AF37]" />
            </button>
          </div>

          {/* ─── NAVIGATION MENU ───────────────────────────────────────────────── */}
          <nav className="p-3 space-y-1 max-h-[calc(100vh-220px)] overflow-y-auto custom-scrollbar">
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));
              const hasSubmenu = !!item.subItems;
              const isSubOpen = openSubmenu === item.title;
              const showText = !sidebarCollapsed || mobileSidebarOpen;

              return (
                <div key={item.title}>
                  {hasSubmenu ? (
                    <div>
                      <button
                        onClick={() =>
                          setOpenSubmenu(isSubOpen ? null : item.title)
                        }
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isActive
                            ? "bg-[#5C061D] text-[#D4AF37] shadow-md border border-[#7A0A28]"
                            : "text-white/80 hover:bg-[#2C0812] hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 ${isActive ? "text-[#D4AF37]" : "text-white/70"}`} />
                          {showText && <span>{item.title}</span>}
                        </div>
                        {showText && (
                          isSubOpen ? (
                            <ChevronDown className="w-3.5 h-3.5 text-[#D4AF37]" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 text-white/50" />
                          )
                        )}
                      </button>

                      {/* Submenu Dropdown */}
                      {showText && isSubOpen && (
                        <div className="ml-7 mt-1 space-y-1 border-l border-[#2C0812] pl-3 py-1">
                          {item.subItems?.map((sub) => {
                            const isSubActive = pathname === sub.href;
                            return (
                              <Link
                                key={sub.title}
                                href={sub.href}
                                onClick={handleNavClick}
                                className={`block py-1.5 px-2.5 rounded-lg text-xs font-medium transition-colors ${
                                  isSubActive
                                    ? "text-[#D4AF37] font-bold bg-[#5C061D]/50"
                                    : "text-white/70 hover:text-white hover:bg-[#2C0812]"
                                }`}
                              >
                                {sub.title}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={handleNavClick}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-[#5C061D] text-[#D4AF37] shadow-md border border-[#7A0A28]"
                          : "text-white/80 hover:bg-[#2C0812] hover:text-white"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-[#D4AF37]" : "text-white/70"}`} />
                      {showText && <span>{item.title}</span>}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* ─── SIDEBAR FOOTER CARD & LOGOUT ───────────────────────────────────── */}
        <div className="p-3 border-t border-[#2C0812] space-y-3">
          {(!sidebarCollapsed || mobileSidebarOpen) && (
            <div className="relative rounded-2xl overflow-hidden p-3.5 bg-gradient-to-r from-[#5C061D] to-[#3A0212] border border-[#7A0A28] shadow-lg text-center space-y-1">
              <Sparkles className="w-5 h-5 text-[#D4AF37] mx-auto opacity-80" />
              <h4 className="text-xs font-serif font-bold text-[#D4AF37]">
                Vysh Jewellery
              </h4>
              <p className="text-[10px] text-white/70">
                Timeless Beauty. Eternal Bond.
              </p>
            </div>
          )}

          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-white/80 hover:text-red-400 hover:bg-[#3A0212] transition-colors cursor-pointer ${
              sidebarCollapsed && !mobileSidebarOpen ? "justify-center" : ""
            }`}
          >
            <LogOut className="w-4 h-4 text-red-400" />
            {(!sidebarCollapsed || mobileSidebarOpen) && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
