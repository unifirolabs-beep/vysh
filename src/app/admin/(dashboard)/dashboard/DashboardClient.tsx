"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  RealtimeOrder,
  DashboardStatsData,
} from "@/services/adminDataService";
import { useRealtimeAdmin } from "@/hooks/useRealtimeAdmin";
import { toast } from "sonner";
import { fetchLiveOrders, fetchDashboardStats } from "@/services/adminDataService";

export function DashboardClient() {
  const [stats, setStats] = useState<DashboardStatsData>({
    totalRevenue:0,
    totalOrders:0,
    totalProducts:0
  });
  const [recentOrders, setRecentOrders] = useState<RealtimeOrder[]>([]);

  const loadLiveDashboard = useCallback(async () => {
    try{
      const data = await fetchLiveOrders();
      const statsData = await fetchDashboardStats();
      console.log(statsData, "statsData");
      if(statsData && statsData){
        setStats(statsData);
      }
      if(data && data.length > 0){
        const mappedOrders = data.map((o:any) => ({
          mongoId: o._id,
          id: o.orderId || o._id,
          customer: o.userName || o.customerName || "Customer",
          email: o.userEmail || o.customerEmail || "",
          phone: o.userPhone || o.customerPhone || "",
          itemsCount: o.quantity || o.itemsCount || 1,
          amount: o.total || o.totalAmount || 0,
          payment: o.paymentMethod || "upi",
          paymentStatus: o.paymentStatus || "paid",
          status: o.orderStatus || "Confirmed",
          date: o.createdAt
            ? new Date(o.createdAt).toLocaleDateString()
            : new Date().toLocaleDateString(),
          userAddress: o.userAddress || "",
          userCity: o.userCity || "",
          userState: o.userState || "",
          userPincode: o.userPincode || "",
          userLandmark: o.userLandmark || "",
          razorpayPaymentId: o.razorpayPaymentId || null,
          razorpayOrderId: o.razorpayOrderId || null,
          products: Array.isArray(o.productId) ? o.productId : [],
        }));
        setRecentOrders(mappedOrders);
      }
    }catch(err){
      console.error("Error loading orders:", err);
    }
  }, []);

  useEffect(() => {
    loadLiveDashboard();
  }, [loadLiveDashboard]);

  useRealtimeAdmin(() => {
    toast.info("⚡ Live database update received!", { icon: "🔔" });
    loadLiveDashboard();
  }, ["products", "orders", "categories", "profiles"]);

  const statCards = [
    { title: "Total Revenue", value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`},
    { title: "Total Orders", value: stats.totalOrders.toString()},
    { title: "Total Products", value: stats.totalProducts.toString()},
  ];


  return (
    <div className="space-y-6">
      
      {/* ─── PAGE HEADER & REALTIME INDICATOR ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
            Dashboard
          </h1>
          <p className="text-xs text-white/70 mt-1 font-sans">
            Welcome back, Admin! Live store analytics synced with MongoDB.
          </p>
        </div>
      </div>

      {/* ─── STAT CARDS GRID (LIVE MongoDB DATA) ────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((stat, idx) => {
          return (
            <div
              key={idx}
              className="p-4 bg-[#24040E] border border-[#3A0212] rounded-2xl space-y-2 relative overflow-hidden group hover:border-[#D4AF37]/40 transition-colors shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-white/70">
                  {stat.title}
                </span>
              </div>

              <div className="text-lg sm:text-xl font-bold text-white font-serif">
                {stat.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── BOTTOM ROW: RECENT ORDERS + TOP PRODUCTS + STORE OVERVIEW ALERTS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        
        {/* Recent Orders Table (5 Cols) */}
        <div className="lg:col-span-5 bg-[#24040E] border border-[#3A0212] rounded-2xl p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-serif font-bold text-white">
              Recent Orders
            </h3>
            <Link href="/admin/orders" className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 font-semibold">
              View All Orders →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] uppercase font-bold text-white/50 border-b border-[#3A0212] pb-2">
                <tr>
                  <th className="pb-2">Order ID</th>
                  <th className="pb-2">Customer</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3A0212]">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#160408]/50 transition-colors">
                    <td className="py-2.5 font-bold text-[#D4AF37] font-mono">{ord.id}</td>
                    <td className="py-2.5 font-medium text-white">{ord.customer}</td>
                    <td className="py-2.5 font-semibold text-white">₹{ord.amount}</td>

                    <td className="py-2.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          ord.status === "delivered" || ord.status === "completed"
                            ? "bg-green-950 text-green-400 border border-green-800"
                            : ord.status === "processing" || ord.status === "shipped"
                            ? "bg-yellow-950 text-yellow-400 border border-yellow-800"
                            : ord.status === "pending"
                            ? "bg-blue-950 text-blue-400 border border-blue-800"
                            : "bg-red-950 text-red-400 border border-red-800"
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-right text-white/50 text-[10px]">
                      {ord.date}
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
