"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AuthModal } from "@/components/auth/AuthModal";
import {
  User,
  ShoppingBag,
  MapPin,
  LogOut,
  ChevronRight,
  Plus,
  Package,
  CheckCircle,
  Home,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";

export function AccountClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    isLoggedIn,
    userPhone,
    userName,
    savedAddresses,
    orders,
    logout,
    addAddress,
    removeAddress,
    openAuthModal,
  } = useAuthStore();

  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "address" | "add-address">("overview");

  // Sync tab with query params if present (e.g. ?tab=address)
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "address") setActiveTab("address");
    else if (tabParam === "orders") setActiveTab("orders");
    else if (tabParam === "add-address") setActiveTab("add-address");
  }, [searchParams]);

  // New Address Form state
  const [addressForm, setAddressForm] = useState({
    pincode: "",
    flatNo: "",
    completeAddress: "",
    firstName: "",
    lastName: "",
    mobile: "",
    isDefault: true,
  });

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressForm.pincode || addressForm.pincode.length < 6) {
      toast.error("Please enter a valid 6-digit PIN Code");
      return;
    }
    if (!addressForm.completeAddress.trim()) {
      toast.error("Please enter your Complete Address");
      return;
    }
    if (!addressForm.firstName.trim()) {
      toast.error("Please enter your First Name");
      return;
    }
    if (!addressForm.mobile || addressForm.mobile.length < 10) {
      toast.error("Please enter a valid 10-digit Mobile Number");
      return;
    }

    addAddress(addressForm);
    toast.success("Address Saved Successfully!");
    setAddressForm({
      pincode: "",
      flatNo: "",
      completeAddress: "",
      firstName: "",
      lastName: "",
      mobile: "",
      isDefault: true,
    });
    setActiveTab("overview");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F7F5] selection:bg-[#5C061D] selection:text-[#C9A227]">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        
        {/* Main Grid: Left Sidebar (Image 4 Left) + Right Content (Image 4 & 5 Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* LEFT SIDEBAR PANEL (Matches Image 4 & Image 5 Left Panel) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* User Profile Card */}
            <div className="bg-white rounded-2xl border border-[#E8D8D3] p-5 shadow-xs">
              <div className="flex items-center gap-3.5 pb-4 border-b border-[#F0E2DE]">
                <div className="w-12 h-12 rounded-full bg-[#5C061D] text-[#C9A227] text-xl font-bold flex items-center justify-center border-2 border-[#C9A227]/40 shadow-xs shrink-0">
                  {userName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-bold text-[#1D1D1D] flex items-center gap-1">
                    <span>Hey, {userName}</span>
                    <ChevronRight className="w-4 h-4 text-[#888888]" />
                  </h2>
                  <p className="text-xs text-[#6E5D57] truncate mt-0.5">
                    Logged with +91{userPhone || "919353393168"}
                  </p>
                </div>
              </div>

              {/* Total Orders Metric Box */}
              <div className="mt-4 p-3.5 bg-[#FFF9F8] rounded-xl border border-[#E8D8D3] text-center">
                <span className="text-lg font-bold text-[#5C061D] block">
                  {orders.length}
                </span>
                <span className="text-[11px] text-[#6E5D57] uppercase font-semibold tracking-wider">
                  Total Orders
                </span>
              </div>
            </div>

            {/* Account Navigation List (Matches Image 4 Menu) */}
            <div className="bg-white rounded-2xl border border-[#E8D8D3] overflow-hidden shadow-xs">
              <div className="p-3 bg-[#FFF9F8] border-b border-[#E8D8D3]">
                <span className="text-xs font-bold text-[#5C061D] uppercase tracking-wider">
                  Account Menu
                </span>
              </div>

              <div className="p-2 space-y-1">
                {/* 1. Overview */}
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === "overview"
                      ? "bg-[#5C061D]/10 text-[#5C061D] font-bold"
                      : "text-[#1D1D1D] hover:bg-[#FFF9F8]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Home className="w-4 h-4 text-[#5C061D]" />
                    <div className="text-left">
                      <span className="block leading-tight">Overview</span>
                      <span className="text-[10px] font-normal text-[#6E5D57] block">
                        All details at one place, easy to access
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#888888]" />
                </button>

                {/* 2. My Orders */}
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === "orders"
                      ? "bg-[#5C061D]/10 text-[#5C061D] font-bold"
                      : "text-[#1D1D1D] hover:bg-[#FFF9F8]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-4 h-4 text-[#5C061D]" />
                    <div className="text-left">
                      <span className="block leading-tight">My Orders</span>
                      <span className="text-[10px] font-normal text-[#6E5D57] block">
                        Track your recent purchases
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#888888]" />
                </button>

                {/* 3. My Address */}
                <button
                  onClick={() => setActiveTab("address")}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    activeTab === "address" || activeTab === "add-address"
                      ? "bg-[#5C061D]/10 text-[#5C061D] font-bold"
                      : "text-[#1D1D1D] hover:bg-[#FFF9F8]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-[#5C061D]" />
                    <div className="text-left">
                      <span className="block leading-tight">My Address</span>
                      <span className="text-[10px] font-normal text-[#6E5D57] block">
                        Manage shipping addresses
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#888888]" />
                </button>

                {/* 4. Logout */}
                <button
                  onClick={() => {
                    logout();
                    toast.success("Logged out successfully");
                    router.push("/");
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer pt-3 mt-1 border-t border-[#F0E2DE]"
                >
                  <LogOut className="w-4 h-4 text-red-600" />
                  <span>Logout</span>
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT MAIN CONTENT PANEL (Matches Image 4 Overview & Image 5 Address Form) */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl border border-[#E8D8D3] p-5 sm:p-8 shadow-xs">
              
              {/* TAB 1: OVERVIEW (Matches Image 4) */}
              {activeTab === "overview" && (
                <div className="space-y-8">
                  <h2 className="text-xl font-serif font-bold text-[#1D1D1D] pb-3 border-b border-[#F0E2DE]">
                    Overview
                  </h2>

                  {/* Section 1: My Orders */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-serif font-bold text-[#5C061D]">
                      My Orders
                    </h3>

                    {orders.length === 0 ? (
                      <div className="bg-[#FFF9F8] rounded-2xl border border-[#F0E2DE] p-6 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                        <div className="w-20 h-20 bg-white rounded-2xl border border-[#E8D8D3] flex items-center justify-center shrink-0 shadow-xs">
                          <Package className="w-10 h-10 text-[#C9A227]" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <h4 className="text-sm font-bold text-[#1D1D1D]">
                            No Past Orders Yet
                          </h4>
                          <p className="text-xs text-[#6E5D57]">
                            Start your first order to see it here.{" "}
                            <Link
                              href="/"
                              className="text-[#5C061D] font-bold underline ml-1 cursor-pointer"
                            >
                              Shop Now
                            </Link>
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {orders.map((order) => (
                          <div
                            key={order.id}
                            className="p-4 bg-[#FFF9F8] rounded-2xl border border-[#F0E2DE] flex justify-between items-center text-xs"
                          >
                            <div>
                              <span className="font-bold text-[#5C061D]">{order.id}</span>
                              <p className="text-[#6E5D57]">{order.date} • {order.itemsCount} items</p>
                            </div>
                            <span className="font-bold text-[#1D1D1D]">₹{order.totalAmount}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Section 2: Saved Addresses */}
                  <div className="space-y-4 pt-2">
                    <h3 className="text-sm font-serif font-bold text-[#5C061D]">
                      Saved Addresses
                    </h3>

                    {savedAddresses.length === 0 ? (
                      <div className="bg-[#FFF9F8] rounded-2xl border border-[#F0E2DE] p-6 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                        <div className="w-20 h-20 bg-white rounded-2xl border border-[#E8D8D3] flex items-center justify-center shrink-0 shadow-xs">
                          <MapPin className="w-10 h-10 text-[#C9A227]" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <h4 className="text-sm font-bold text-[#1D1D1D]">
                            No Address Saved Yet
                          </h4>
                          <p className="text-xs text-[#6E5D57]">
                            Tap to add and shop faster{" "}
                            <button
                              onClick={() => setActiveTab("add-address")}
                              className="text-[#5C061D] font-bold underline ml-1 cursor-pointer"
                            >
                              Add New Address Now
                            </button>
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {savedAddresses.map((addr) => (
                          <div
                            key={addr.id}
                            className="p-4 bg-[#FFF9F8] rounded-2xl border border-[#F0E2DE] space-y-2 text-xs relative"
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-[#1D1D1D]">
                                {addr.firstName} {addr.lastName}
                              </span>
                              {addr.isDefault && (
                                <span className="px-2 py-0.5 bg-[#5C061D] text-white text-[9px] font-bold rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-[#6E5D57]">
                              {addr.flatNo ? `${addr.flatNo}, ` : ""}{addr.completeAddress}
                            </p>
                            <p className="text-[#6E5D57]">PIN: {addr.pincode} • Mob: {addr.mobile}</p>
                            <button
                              onClick={() => removeAddress(addr.id)}
                              className="text-red-600 font-bold underline text-[11px] pt-1"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* TAB 2: MY ORDERS LIST */}
              {activeTab === "orders" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-serif font-bold text-[#1D1D1D] pb-3 border-b border-[#F0E2DE]">
                    My Orders
                  </h2>

                  {orders.length === 0 ? (
                    <div className="text-center py-12 space-y-3 bg-[#FFF9F8] rounded-2xl border border-[#F0E2DE] max-w-md mx-auto">
                      <Package className="w-12 h-12 text-[#C9A227] mx-auto opacity-60" />
                      <h3 className="text-base font-bold text-[#1D1D1D]">No Orders Placed Yet</h3>
                      <p className="text-xs text-[#6E5D57]">
                        Once you order pure 925 silver items, they will appear here.
                      </p>
                      <Link
                        href="/"
                        className="inline-block px-5 py-2.5 bg-[#5C061D] text-white text-xs font-bold rounded-xl"
                      >
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="p-5 bg-[#FFF9F8] rounded-2xl border border-[#F0E2DE] space-y-3 text-xs"
                        >
                          <div className="flex justify-between items-center border-b border-[#E8D8D3] pb-3">
                            <span className="font-bold text-[#5C061D] text-sm">{order.id}</span>
                            <span className="px-3 py-1 bg-green-100 text-green-800 font-bold rounded-full text-[10px]">
                              {order.status}
                            </span>
                          </div>
                          <div className="flex justify-between text-[#6E5D57]">
                            <span>Date: {order.date}</span>
                            <span>Total: ₹{order.totalAmount}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: MY ADDRESS LIST */}
              {activeTab === "address" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-3 border-b border-[#F0E2DE]">
                    <h2 className="text-xl font-serif font-bold text-[#1D1D1D]">
                      My Addresses
                    </h2>
                    <button
                      onClick={() => setActiveTab("add-address")}
                      className="px-4 py-2 bg-[#5C061D] text-white text-xs font-bold rounded-xl hover:bg-[#7A0A28] flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-[#C9A227]" />
                      <span>Add New Address</span>
                    </button>
                  </div>

                  {savedAddresses.length === 0 ? (
                    <div className="text-center py-12 space-y-3 bg-[#FFF9F8] rounded-2xl border border-[#F0E2DE] max-w-md mx-auto">
                      <MapPin className="w-12 h-12 text-[#C9A227] mx-auto opacity-60" />
                      <h3 className="text-base font-bold text-[#1D1D1D]">No Address Saved</h3>
                      <p className="text-xs text-[#6E5D57]">
                        Save your delivery address to checkout quickly.
                      </p>
                      <button
                        onClick={() => setActiveTab("add-address")}
                        className="px-5 py-2.5 bg-[#5C061D] text-white text-xs font-bold rounded-xl cursor-pointer"
                      >
                        Add Address
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {savedAddresses.map((addr) => (
                        <div
                          key={addr.id}
                          className="p-5 bg-[#FFF9F8] rounded-2xl border border-[#F0E2DE] space-y-2 text-xs"
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-[#1D1D1D] text-sm">
                              {addr.firstName} {addr.lastName}
                            </span>
                            {addr.isDefault && (
                              <span className="px-2.5 py-0.5 bg-[#5C061D] text-white text-[10px] font-bold rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-[#6E5D57]">
                            {addr.flatNo ? `${addr.flatNo}, ` : ""}{addr.completeAddress}
                          </p>
                          <p className="text-[#6E5D57]">PIN: {addr.pincode} • Phone: {addr.mobile}</p>
                          <button
                            onClick={() => removeAddress(addr.id)}
                            className="text-red-600 font-bold underline text-xs pt-2"
                          >
                            Delete Address
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: ADD NEW ADDRESS FORM (Matches Image 5 Form Exactly) */}
              {activeTab === "add-address" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 pb-3 border-b border-[#F0E2DE]">
                    <button
                      onClick={() => setActiveTab("address")}
                      className="p-1 hover:bg-[#FFF9F8] rounded-lg text-[#5C061D] cursor-pointer"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-xl font-serif font-bold text-[#1D1D1D]">
                      My Address
                    </h2>
                  </div>

                  <form onSubmit={handleAddressSubmit} className="space-y-4 max-w-xl">
                    {/* PIN Code */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1D1D1D] mb-1">
                        PIN Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={addressForm.pincode}
                        onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                        placeholder="Eg: 110001"
                        className="w-full px-4 py-3 bg-[#FFF9F8] border border-[#E8D8D3] rounded-xl text-xs text-[#1D1D1D] focus:outline-none focus:border-[#5C061D]"
                      />
                    </div>

                    {/* Flat/Building Number */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1D1D1D] mb-1">
                        Flat/Building Number (Optional)
                      </label>
                      <input
                        type="text"
                        value={addressForm.flatNo}
                        onChange={(e) => setAddressForm({ ...addressForm, flatNo: e.target.value })}
                        placeholder="Eg: A1, Block D"
                        className="w-full px-4 py-3 bg-[#FFF9F8] border border-[#E8D8D3] rounded-xl text-xs text-[#1D1D1D] focus:outline-none focus:border-[#5C061D]"
                      />
                    </div>

                    {/* Complete Address */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1D1D1D] mb-1">
                        Complete Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.completeAddress}
                        onChange={(e) => setAddressForm({ ...addressForm, completeAddress: e.target.value })}
                        placeholder="Eg: Plot no. 401"
                        className="w-full px-4 py-3 bg-[#FFF9F8] border border-[#E8D8D3] rounded-xl text-xs text-[#1D1D1D] focus:outline-none focus:border-[#5C061D]"
                      />
                    </div>

                    {/* First Name */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1D1D1D] mb-1">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.firstName}
                        onChange={(e) => setAddressForm({ ...addressForm, firstName: e.target.value })}
                        placeholder="Eg: Joe"
                        className="w-full px-4 py-3 bg-[#FFF9F8] border border-[#E8D8D3] rounded-xl text-xs text-[#1D1D1D] focus:outline-none focus:border-[#5C061D]"
                      />
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1D1D1D] mb-1">
                        Last Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={addressForm.lastName}
                        onChange={(e) => setAddressForm({ ...addressForm, lastName: e.target.value })}
                        placeholder="Eg: Harrison"
                        className="w-full px-4 py-3 bg-[#FFF9F8] border border-[#E8D8D3] rounded-xl text-xs text-[#1D1D1D] focus:outline-none focus:border-[#5C061D]"
                      />
                    </div>

                    {/* Mobile Number */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1D1D1D] mb-1">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        maxLength={10}
                        required
                        value={addressForm.mobile}
                        onChange={(e) => setAddressForm({ ...addressForm, mobile: e.target.value })}
                        placeholder="Eg: 9876543210"
                        className="w-full px-4 py-3 bg-[#FFF9F8] border border-[#E8D8D3] rounded-xl text-xs text-[#1D1D1D] focus:outline-none focus:border-[#5C061D]"
                      />
                    </div>

                    {/* Checkbox: Mark as default */}
                    <label className="flex items-center gap-2 text-xs text-[#6E5D57] cursor-pointer pt-2">
                      <input
                        type="checkbox"
                        checked={addressForm.isDefault}
                        onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                        className="accent-[#5C061D] w-4 h-4 rounded"
                      />
                      <span>Mark as my default address</span>
                    </label>

                    {/* Save Address Button (Image 5 Button) */}
                    <div className="pt-4 flex justify-end">
                      <button
                        type="submit"
                        className="px-8 py-3.5 bg-[#5C061D] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#7A0A28] shadow-md transition-colors cursor-pointer"
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          </div>

        </div>

      </main>

      <Footer />
      <CartDrawer />
      <AuthModal />
    </div>
  );
}
