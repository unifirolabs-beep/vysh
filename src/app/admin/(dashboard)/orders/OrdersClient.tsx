"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ADMIN_ORDERS } from "@/data/adminMockData";
import { fetchLiveOrders } from "@/services/adminDataService";
import { updateOrderStatusAction } from "@/actions/order.actions";
import { useRealtimeAdmin } from "@/hooks/useRealtimeAdmin";
import {
  Search,
  RotateCcw,
  Eye,
  Copy,
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Printer,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { OrderInvoice } from "@/components/common/OrderInvoice";

export function OrdersClient() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [paymentFilter, setPaymentFilter] = useState("All Payment Status");
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const loadOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchLiveOrders();
      if (data && data.length > 0) {
        const mappedOrders = data.map((o: any) => ({
          mongoId: o._id,
          id: o.orderId || o._id || o.id,
          orderId: o.orderId || o._id || o.id,
          customer: o.userName || o.customerName || o.customer || "Customer",
          userName: o.userName || o.customerName || o.customer || "Customer",
          email: o.userEmail || o.customerEmail || o.email || "",
          userEmail: o.userEmail || o.customerEmail || o.email || "",
          phone: o.userPhone || o.customerPhone || o.phone || "",
          userPhone: o.userPhone || o.customerPhone || o.phone || "",
          itemsCount: o.quantity || o.itemsCount || (o.items?.length) || 1,
          amount: o.total || o.totalAmount || o.amount || 0,
          total: o.total || o.totalAmount || o.amount || 0,
          payment: o.paymentMethod || o.payment || "upi",
          paymentMethod: o.paymentMethod || o.payment || "upi",
          paymentStatus: o.paymentStatus || "paid",
          status: o.orderStatus || o.status || "Confirmed",
          orderStatus: o.orderStatus || o.status || "Confirmed",
          createdAt: o.createdAt || o.date,
          date: o.createdAt
            ? new Date(o.createdAt).toLocaleDateString()
            : (o.date || new Date().toLocaleDateString()),
          userAddress: o.userAddress || "",
          userCity: o.userCity || "",
          userState: o.userState || "",
          userPincode: o.userPincode || "",
          userLandmark: o.userLandmark || "",
          razorpayPaymentId: o.razorpayPaymentId || null,
          razorpayOrderId: o.razorpayOrderId || null,
          items: o.items || o.products || [],
          products: o.products || o.items || [],
          rawOrder: o,
        }));
        console.log(mappedOrders);
        setOrdersList(mappedOrders);
      } else {
        const mappedMock = ADMIN_ORDERS.map((o: any) => ({
          mongoId: o.id,
          id: o.id,
          orderId: o.id,
          customer: o.customer || "Customer",
          userName: o.customer || "Customer",
          email: o.email || "",
          userEmail: o.email || "",
          phone: o.phone || "",
          userPhone: o.phone || "",
          itemsCount: o.totalItems || o.products?.length || 1,
          amount: o.amount || 0,
          total: o.amount || 0,
          payment: o.payment || "Razorpay",
          paymentMethod: o.payment || "Razorpay",
          paymentStatus: o.paymentStatus || "Paid",
          status: o.status || "Delivered",
          orderStatus: o.status || "Delivered",
          createdAt: o.date,
          date: o.date || new Date().toLocaleDateString(),
          userAddress: "",
          userCity: "",
          userState: "",
          userPincode: "",
          userLandmark: "",
          razorpayPaymentId: null,
          razorpayOrderId: null,
          items: o.products || [],
          products: o.products || [],
          rawOrder: o,
        }));
        setOrdersList(mappedMock);
      }
    } catch (err) {
      console.error("Error loading orders:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  useRealtimeAdmin(() => {
    toast.info("⚡ Live orders database updated!", { icon: "🛍️" });
    loadOrders();
  }, ["orders"]);

  const handleStatusChange = async (mongoId: string, newStatus: string) => {
    try {
      setIsUpdatingStatus(mongoId);
      const res = await updateOrderStatusAction(mongoId, newStatus);
      if (res.success) {
        toast.success(`Order status updated to "${newStatus}" in MongoDB!`);
        setOrdersList((prev) =>
          prev.map((ord) =>
            ord.mongoId === mongoId || ord.id === mongoId
              ? {
                ...ord,
                status: newStatus,
                paymentStatus:
                  newStatus === "Delivered" ? "Paid" : ord.paymentStatus,
              }
              : ord
          )
        );
      } else {
        toast.error(res.message || "Failed to update order status");
      }
    } catch (err: any) {
      console.error("Error updating status:", err);
      toast.error(err?.message || "Failed to update status");
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  const filteredOrders = ordersList.filter((o) => {
    const matchesSearch =
      (o.id || o.orderId || "").toLowerCase().includes(search.toLowerCase()) ||
      (o.customer || "").toLowerCase().includes(search.toLowerCase()) ||
      (o.phone && o.phone.includes(search));
    const matchesStatus =
      statusFilter === "All Status" ||
      (o.status || "").toLowerCase() === statusFilter.toLowerCase();
    const matchesPayment =
      paymentFilter === "All Payment Status" ||
      (o.paymentStatus || "").toLowerCase() === paymentFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const totalOrdersCount = ordersList.length;
  const pendingCount = ordersList.filter(
    (o) => o.status.toLowerCase() === "pending"
  ).length;
  const confirmedCount = ordersList.filter(
    (o) =>
      o.status.toLowerCase() === "confirmed" ||
      o.status.toLowerCase() === "processing"
  ).length;
  const deliveredCount = ordersList.filter(
    (o) => o.status.toLowerCase() === "delivered"
  ).length;
  const cancelledCount = ordersList.filter(
    (o) => o.status.toLowerCase() === "cancelled"
  ).length;

  const handleCopyOrderId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success(`Copied Order ID: ${id}`);
  };

  return (
    <div className="space-y-6">
      {/* ─── HEADER BAR ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1D1D1D] tracking-wide">
            Orders Management
          </h1>
          <p className="text-xs text-[#6E5D57] mt-1 font-sans">
            Manage, track, and update customer order status in MongoDB.
          </p>
        </div>

        <Button
          onClick={loadOrders}
          variant="outline"
          className="border-[#E8D8D3] hover:bg-[#FFF9F8] text-xs font-semibold text-[#5C061D]"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Refresh Database
        </Button>
      </div>

      {/* ─── TOP STAT METRIC CARDS ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white border border-[#E8D8D3] rounded-2xl p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#6E5D57]">
              Total Orders
            </span>
            <div className="w-7 h-7 rounded-xl bg-[#F5F0FF] text-purple-600 flex items-center justify-center">
              <ShoppingBag className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-[#1D1D1D]">
            {totalOrdersCount}
          </div>
          <span className="text-[10px] text-[#6E5D57]">MongoDB Orders</span>
        </div>

        <div className="bg-white border border-[#E8D8D3] rounded-2xl p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#6E5D57]">
              Pending Orders
            </span>
            <div className="w-7 h-7 rounded-xl bg-[#FFF7ED] text-amber-600 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-[#1D1D1D]">
            {pendingCount}
          </div>
          <span className="text-[10px] text-amber-600 font-semibold">
            Awaiting Confirmation
          </span>
        </div>

        <div className="bg-white border border-[#E8D8D3] rounded-2xl p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#6E5D57]">
              Confirmed / Shipped
            </span>
            <div className="w-7 h-7 rounded-xl bg-[#EFF6FF] text-blue-600 flex items-center justify-center">
              <Truck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-[#1D1D1D]">
            {confirmedCount}
          </div>
          <span className="text-[10px] text-blue-600 font-semibold">
            In Transit / Processing
          </span>
        </div>

        <div className="bg-white border border-[#E8D8D3] rounded-2xl p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#6E5D57]">
              Delivered
            </span>
            <div className="w-7 h-7 rounded-xl bg-[#F0FDF4] text-green-600 flex items-center justify-center">
              <CheckCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-[#1D1D1D]">
            {deliveredCount}
          </div>
          <span className="text-[10px] text-green-600 font-semibold">
            Successfully Delivered
          </span>
        </div>

        <div className="bg-white border border-[#E8D8D3] rounded-2xl p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#6E5D57]">
              Cancelled
            </span>
            <div className="w-7 h-7 rounded-xl bg-[#FEE2E2] text-red-600 flex items-center justify-center">
              <XCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-[#1D1D1D]">
            {cancelledCount}
          </div>
          <span className="text-[10px] text-red-600 font-semibold">
            Cancelled Orders
          </span>
        </div>
      </div>

      {/* ─── SEARCH & FILTER TOOLBAR ────────────────────────────────────────── */}
      <div className="bg-white border border-[#E8D8D3] rounded-2xl p-3.5 sm:p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative min-w-[220px] flex-1">
            <Search className="w-4 h-4 text-[#888888] absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Order ID, Customer, Phone..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-[#E8D8D3] rounded-xl text-xs text-[#1D1D1D] placeholder:text-[#888888] focus:outline-none focus:border-[#5C061D]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-[#E8D8D3] rounded-xl text-xs font-medium text-[#1D1D1D] outline-none cursor-pointer"
          >
            <option>All Status</option>
            <option>Pending</option>
            <option>Confirmed</option>
            <option>Shipped</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-[#E8D8D3] rounded-xl text-xs font-medium text-[#1D1D1D] outline-none cursor-pointer"
          >
            <option>All Payment Status</option>
            <option>Paid</option>
            <option>Pending</option>
            <option>Failed</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSearch("");
              setStatusFilter("All Status");
              setPaymentFilter("All Payment Status");
            }}
            className="px-3 py-2 text-xs font-semibold text-[#6E5D57] hover:text-[#5C061D] flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* ─── DATA TABLE VIEW ────────────────────────────────────────── */}
      <div className="bg-white border border-[#E8D8D3] rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F6] text-[10px] uppercase font-bold text-[#6E5D57] border-b border-[#E8D8D3]">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Editable Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E2DE]">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#6E5D57]">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-[#5C061D] border-t-transparent rounded-full animate-spin" />
                      <span>Loading orders from MongoDB...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#6E5D57]">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr
                    key={ord.mongoId || ord.id}
                    className="hover:bg-[#FFF9F8] transition-colors group"
                  >
                    {/* Order ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-[#1D1D1D]">
                      <Link
                        href={`/admin/orders/${ord.mongoId || ord.id}`}
                        className="hover:text-[#5C061D] hover:underline text-left cursor-pointer"
                      >
                        {ord.id}
                      </Link>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div>
                        <h4 className="font-bold text-[#1D1D1D] text-xs">
                          {ord.customer}
                        </h4>
                        <p className="text-[10px] text-[#6E5D57] font-mono">
                          {ord.phone} {ord.email ? `• ${ord.email}` : ""}
                        </p>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-[#6E5D57] text-[11px]">
                      {ord.date}
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 font-bold text-[#1D1D1D] text-xs font-sans tabular-nums">
                      ₹{ord.amount.toLocaleString("en-IN")}
                    </td>

                    {/* Payment */}
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-semibold text-[#1D1D1D] text-xs block">
                          {ord.payment}
                        </span>
                        <span
                          className={`text-[10px] font-bold block ${ord.paymentStatus === "Paid"
                            ? "text-green-600"
                            : "text-amber-600"
                            }`}
                        >
                          {ord.paymentStatus}
                        </span>
                      </div>
                    </td>

                    {/* EDITABLE STATUS DROPDOWN */}
                    <td className="py-3.5 px-4">
                      <div className="relative inline-block">
                        <select
                          value={ord.status}
                          disabled={isUpdatingStatus === (ord.mongoId || ord.id)}
                          onChange={(e) =>
                            handleStatusChange(
                              ord.mongoId || ord.id,
                              e.target.value
                            )
                          }
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors outline-none cursor-pointer ${ord.status === "Delivered"
                            ? "bg-[#DCFCE7] text-[#15803D] border-[#86EFAC]"
                            : ord.status === "Shipped"
                              ? "bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]"
                              : ord.status === "Confirmed"
                                ? "bg-[#DBEAFE] text-[#1E40AF] border-[#BFDBFE]"
                                : ord.status === "Pending"
                                  ? "bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]"
                                  : "bg-[#FEE2E2] text-[#B91C1C] border-[#FCA5A5]"
                            }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/orders/${ord.mongoId || ord.id}`}
                          className="p-1.5 rounded-lg text-[#6E5D57] hover:text-[#5C061D] hover:bg-[#FAF8F6] border border-transparent hover:border-[#E8D8D3] transition-colors cursor-pointer inline-flex items-center justify-center"
                          title="View Details Page"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleCopyOrderId(ord.id)}
                          className="p-1.5 rounded-lg text-[#6E5D57] hover:text-[#5C061D] hover:bg-[#FAF8F6] border border-transparent hover:border-[#E8D8D3] transition-colors cursor-pointer"
                          title="Copy ID"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        {isMounted ? (
                          <PDFDownloadLink
                            document={<OrderInvoice order={ord} />}
                            fileName={`vysh-order-${ord.orderId || ord.id}.pdf`}
                          >
                            {({ loading, error }) => (
                              <Button
                                variant="outline"
                                className="border-[#E8D8D3] hover:bg-[#FFF9F8] text-black text-xs font-semibold rounded-xl gap-1.5 cursor-pointer p-2 h-8"
                                disabled={loading || !!error}
                                title="Download Invoice PDF"
                              >
                                <Printer className="w-3.5 h-3.5 text-[#5C061D]" />
                              </Button>
                            )}
                          </PDFDownloadLink>
                        ) : (
                          <Button
                            variant="outline"
                            className="border-[#E8D8D3] hover:bg-[#FFF9F8] text-black text-xs font-semibold rounded-xl gap-1.5 cursor-pointer p-2 h-8"
                            disabled
                            title="Download Invoice PDF"
                          >
                            <Printer className="w-3.5 h-3.5 text-[#5C061D]" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
