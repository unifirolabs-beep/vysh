"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

interface Admin {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Admin" | "Editor";
}

interface AdminShellProps {
  children: React.ReactNode;
  admin: Admin;
}

export default function AdminShell({
  children,
  admin,
}: AdminShellProps) {
  const pathname = usePathname();

  const { sidebarCollapsed } = useAdminAuthStore();

  // Login page should not show admin shell
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const isDashboardPage =
    pathname === "/admin" ||
    pathname === "/admin/dashboard";

  return (
    <div
      className={`min-h-screen selection:bg-[#5C061D] selection:text-[#D4AF37] ${
        isDashboardPage
          ? "bg-[#100306] text-white"
          : "bg-[#FAF8F6] text-[#1D1D1D]"
      }`}
    >
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Container */}
      <div
        className={`transition-all duration-300 min-h-screen flex flex-col ${
          sidebarCollapsed
            ? "lg:pl-20"
            : "lg:pl-64"
        }`}
      >
        {/* Topbar */}
        <AdminTopbar admin={admin} />

        {/* Content */}
        <main
          className={`flex-1 p-3 sm:p-5 lg:p-8 transition-colors ${
            isDashboardPage
              ? "bg-[#1A030A] text-white"
              : "bg-[#FAF8F6] text-[#1D1D1D]"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}