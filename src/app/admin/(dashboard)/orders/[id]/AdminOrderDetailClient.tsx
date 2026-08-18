"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getOrderDetailsAction, updateOrderStatusAction } from "@/actions/order.actions";
import { ADMIN_ORDERS } from "@/data/adminMockData";
import { OrderInvoice } from "@/components/common/OrderInvoice";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { toast } from "sonner";
import {
  ArrowLeft,
  RotateCcw,
  Printer,
  Copy,
  CheckCircle2,
  Clock,
  Truck,
  PackageCheck,
  XCircle,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AdminOrderDetailClientProps {
  orderId: string;
}

export function AdminOrderDetailClient({ orderId }: AdminOrderDetailClientProps) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const loadOrderDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getOrderDetailsAction(orderId);
      if (res.success && res.order) {
        const o = res.order;
        setOrder({
          ...o,
          mongoId: o._id,
          id: o.orderId || o._id || o.id,
          customer: o.userName || o.customerName || "Customer",
          email: o.userEmail || o.customerEmail || "",
          phone: o.userPhone || o.customerPhone || "",
          amount: o.total || o.totalAmount || 0,
          payment: o.paymentMethod || "upi",
          status: o.orderStatus || "Confirmed",
          date: o.createdAt
            ? new Date(o.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : new Date().toLocaleDateString(),
        });
      } else {
        // Fallback to mock data if not found in MongoDB
        const mockMatch = ADMIN_ORDERS.find(
          (m) => m.id === orderId || m.trackingId === orderId
        );
        if (mockMatch) {
          setOrder({
            ...mockMatch,
            mongoId: mockMatch.id,
            orderId: mockMatch.id,
            userName: mockMatch.customer,
            userEmail: mockMatch.email,
            userPhone: mockMatch.phone,
            total: mockMatch.amount,
            paymentMethod: mockMatch.payment,
            orderStatus: mockMatch.status,
            items: mockMatch.products || [],
          });
        } else {
          setError(res.message || "Order not found in database.");
        }
      }
    } catch (err: any) {
      console.error("Error fetching admin order details:", err);
      setError(err?.message || "Failed to load order details.");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (orderId) {
      loadOrderDetails();
    }
  }, [orderId, loadOrderDetails]);

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;
    try {
      setIsUpdating(true);
      const targetId = order.mongoId || order.id || orderId;
      const res = await updateOrderStatusAction(targetId, newStatus);
      if (res.success) {
        toast.success(`Order status updated to "${newStatus}"`);
        setOrder((prev: any) => ({
          ...prev,
          status: newStatus,
          orderStatus: newStatus,
          paymentStatus: newStatus === "Delivered" ? "Paid" : prev.paymentStatus,
        }));
      } else {
        toast.error(res.message || "Failed to update status.");
      }
    } catch (err: any) {
      console.error("Error updating status:", err);
      toast.error(err?.message || "Failed to update order status.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${label}: ${text}`);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#5C061D] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-[#5C061D]">
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-4">
        <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto border border-red-200 shadow-2xs">
          <XCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-serif font-bold text-[#1D1D1D]">
          Order Not Found
        </h2>
        <p className="text-xs text-[#6E5D57]">
          {error || "Could not find an order matching the requested ID."}
        </p>
        <Link href="/admin/orders">
          <Button variant="outline" className="border-[#E8D8D3] text-[#5C061D] text-xs font-bold gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Orders List
          </Button>
        </Link>
      </div>
    );
  }

  const itemsList = Array.isArray(order.items) && order.items.length > 0
    ? order.items
    : Array.isArray(order.products)
    ? order.products
    : Array.isArray(order.productId)
    ? order.productId
    : [];

  const displayOrderId = order.orderId || order.id || order._id;
  const currentStatus = order.orderStatus || order.status || "Pending";
  const isCancelled = currentStatus.toLowerCase() === "cancelled";

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* ─── TOP BAR / BREADCRUMB ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-[#E8D8D3] shadow-2xs">
        <div className="flex items-center gap-3">
          <Link href="/admin/orders">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-xl border-[#E8D8D3] text-[#5C061D] hover:bg-[#FFF9F8]"
              title="Back to Orders"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#1D1D1D]">
                Order #{displayOrderId}
              </h1>
              <Badge
                className={`text-xs font-bold px-2.5 py-0.5 rounded-lg ${
                  currentStatus === "Delivered"
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : currentStatus === "Shipped"
                    ? "bg-blue-100 text-blue-800 border border-blue-200"
                    : currentStatus === "Confirmed"
                    ? "bg-sky-100 text-sky-800 border border-sky-200"
                    : currentStatus === "Pending"
                    ? "bg-amber-100 text-amber-800 border border-amber-200"
                    : "bg-red-100 text-red-800 border border-red-200"
                }`}
              >
                {currentStatus}
              </Badge>
            </div>

            <p className="text-xs text-[#6E5D57] mt-0.5 font-sans">
              Placed on {order.date}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={loadOrderDetails}
            variant="outline"
            className="border-[#E8D8D3] hover:bg-[#FFF9F8] text-xs font-semibold text-[#5C061D] rounded-xl h-9"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Refresh
          </Button>

          {isMounted ? (
            <PDFDownloadLink
              document={<OrderInvoice order={order} />}
              fileName={`vysh-order-${displayOrderId}.pdf`}
            >
              {({ loading: pdfLoading, error: pdfErr }) => (
                <Button
                  variant="outline"
                  className="border-[#5C061D] bg-[#5C061D] hover:bg-[#7A0A28] text-white text-xs font-bold rounded-xl gap-1.5 cursor-pointer h-9"
                  disabled={pdfLoading || !!pdfErr}
                >
                  <Printer className="w-3.5 h-3.5 text-white" />
                  {pdfLoading ? "Generating Invoice..." : "Download Invoice PDF"}
                </Button>
              )}
            </PDFDownloadLink>
          ) : (
            <Button
              variant="outline"
              className="border-[#5C061D] bg-[#5C061D] text-white text-xs font-bold rounded-xl gap-1.5 h-9"
              disabled
            >
              <Printer className="w-3.5 h-3.5 text-white" />
              Download Invoice PDF
            </Button>
          )}
        </div>
      </div>

      {/* ─── QUICK METRICS SUMMARY CARDS ────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white border border-[#E8D8D3] rounded-2xl p-4 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-[#6E5D57] block">
            Order Total
          </span>
          <div className="text-xl font-bold font-serif text-[#5C061D]">
            ₹{Number(order.total || order.amount || 0).toLocaleString("en-IN")}
          </div>
          <span className="text-[10px] text-[#6E5D57] block">
            {itemsList.length} line item(s)
          </span>
        </div>

        <div className="bg-white border border-[#E8D8D3] rounded-2xl p-4 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-[#6E5D57] block">
            Payment Status
          </span>
          <div
            className={`text-base font-bold font-serif ${
              String(order.paymentStatus).toLowerCase() === "paid"
                ? "text-green-600"
                : "text-amber-600"
            }`}
          >
            {String(order.paymentStatus || "Pending").toUpperCase()}
          </div>
          <span className="text-[10px] text-[#6E5D57] block uppercase">
            {order.paymentMethod || order.payment || "UPI"}
          </span>
        </div>

        <div className="bg-white border border-[#E8D8D3] rounded-2xl p-4 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-[#6E5D57] block">
            Customer
          </span>
          <div className="text-sm font-bold text-[#1D1D1D] truncate">
            {order.userName || order.customer || "Customer"}
          </div>
          <span className="text-[10px] text-[#6E5D57] block truncate">
            {order.userPhone || order.phone || "No phone"}
          </span>
        </div>

        <div className="bg-white border border-[#E8D8D3] rounded-2xl p-4 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-[#6E5D57] block">
            Update Status
          </span>
          <select
            value={currentStatus}
            disabled={isUpdating}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="w-full px-2.5 py-1 bg-white border border-[#5C061D] rounded-xl font-bold text-xs text-[#5C061D] outline-none cursor-pointer"
          >
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* ─── DUAL COLUMN DETAILS VIEW ────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: PRODUCTS & SUMMARY (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Ordered Products Card */}
          <div className="bg-white rounded-2xl border border-[#E8D8D3] p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0E2DE] pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#5C061D] font-serif flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#C9A227]" />
                Products Ordered ({itemsList.length})
              </h3>
            </div>

            {itemsList.length > 0 ? (
              <div className="space-y-3">
                {itemsList.map((item: any, index: number) => {
                  const name = item.productName || item.name || "Vysh Silver Jewellery Product";
                  const code = item.productCode || item.code || item.sku || "N/A";
                  const price = Number(item.productPrice || item.price || 0);
                  const qty = Number(item.quantity || item.qty || 1);
                  const total = Number(item.total || price * qty);
                  const img = item.imageUrl || item.image || "/category-cards/necklaces.png";
                  const metal = item.metalType || "925 Sterling Silver";
                  const purity = item.purity || "925 Hallmark";

                  return (
                    <div
                      key={item._id || index}
                      className="flex items-center gap-4 bg-[#FFF9F8] p-3.5 rounded-xl border border-[#F0E2DE]"
                    >
                      <img
                        src={img}
                        alt={name}
                        className="w-16 h-16 object-cover rounded-lg border border-[#E8D8D3] shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-[#1D1D1D] truncate">
                          {name}
                        </h4>
                        <p className="text-xs text-[#6E5D57] mt-0.5 font-mono">
                          Code: {code}
                        </p>
                        <p className="text-xs text-[#6E5D57] mt-0.5">
                          {metal} {purity ? `• ${purity}` : ""}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="font-bold text-sm text-[#5C061D]">
                          ₹{total.toLocaleString("en-IN")}
                        </p>
                        <p className="text-xs text-[#6E5D57] mt-0.5">
                          Qty: {qty} × ₹{price.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-[#FFF9F8] p-4 rounded-xl border border-[#F0E2DE] text-xs text-[#6E5D57]">
                No specific items breakdown available.
              </div>
            )}

            {/* Financial Breakdown */}
            <div className="border-t border-[#F0E2DE] pt-3 space-y-2 text-xs">
              <div className="flex justify-between items-center text-[#6E5D57]">
                <span>Shipping & Delivery</span>
                <span className="font-medium text-[#5C061D]">₹ 99</span>
              </div>
              <div className="flex justify-between items-center border-t border-[#F0E2DE] pt-2 text-sm font-bold text-[#5C061D]">
                <span>Grand Total</span>
                <span className="text-base text-[#5C061D]">
                  ₹{Number(order.total || order.amount || 0).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Admin Actions Card */}
          <div className="bg-white rounded-2xl border border-[#E8D8D3] p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#5C061D] font-serif flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C9A227]" />
              Manage Order Status
            </h3>

            <p className="text-xs text-[#6E5D57]">
              Changing the status will automatically update MongoDB and trigger customer notifications.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <select
                value={currentStatus}
                disabled={isUpdating}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="flex-1 px-3 py-2 bg-[#FFF9F8] border border-[#5C061D] rounded-xl font-bold text-xs text-[#5C061D] outline-none cursor-pointer"
              >
                <option value="Pending">Pending (Awaiting Confirmation)</option>
                <option value="Confirmed">Confirmed (Processing Order)</option>
                <option value="Shipped">Shipped (In Transit)</option>
                <option value="Delivered">Delivered (Completed)</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <Button
                onClick={() => handleStatusChange(currentStatus)}
                disabled={isUpdating}
                className="bg-[#5C061D] hover:bg-[#7A0A28] text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                {isUpdating ? "Saving..." : "Save Status"}
              </Button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CUSTOMER, ADDRESS & PAYMENT (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Customer Details Card */}
          <div className="bg-white rounded-2xl border border-[#E8D8D3] p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#5C061D] font-serif flex items-center gap-2 border-b border-[#F0E2DE] pb-2.5">
              <User className="w-4 h-4 text-[#C9A227]" />
              Customer Information
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#1D1D1D]">
                  {order.userName || order.customer || "Customer"}
                </span>
              </div>

              <div className="text-[#6E5D57] flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#888888]" />
                <span>{order.userPhone || order.phone || "N/A"}</span>
                {order.userPhone || order.phone ? (
                  <button
                    onClick={() => handleCopy(order.userPhone || order.phone, "Phone Number")}
                    className="p-1 hover:text-[#5C061D] transition-colors cursor-pointer"
                    title="Copy Phone"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                ) : null}
              </div>

              <div className="text-[#6E5D57] flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#888888]" />
                <span>{order.userEmail || order.email || "N/A"}</span>
                {order.userEmail || order.email ? (
                  <button
                    onClick={() => handleCopy(order.userEmail || order.email, "Email Address")}
                    className="p-1 hover:text-[#5C061D] transition-colors cursor-pointer"
                    title="Copy Email"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          {/* Shipping Address Card */}
          <div className="bg-white rounded-2xl border border-[#E8D8D3] p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#5C061D] font-serif flex items-center gap-2 border-b border-[#F0E2DE] pb-2.5">
              <MapPin className="w-4 h-4 text-[#C9A227]" />
              Shipping Address
            </h3>

            <div className="space-y-1 text-xs text-[#6E5D57]">
              <p className="font-semibold text-[#1D1D1D]">
                {order.userName || order.customer}
              </p>
              {order.userAddress ? (
                <>
                  <p>{order.userAddress}</p>
                  {order.userLandmark && <p>Landmark: {order.userLandmark}</p>}
                  <p>
                    {order.userCity}{order.userCity && order.userState ? ", " : ""}{order.userState}
                    {order.userPincode ? ` - ${order.userPincode}` : ""}
                  </p>
                </>
              ) : (
                <p className="italic text-[#888888]">No full shipping address available.</p>
              )}
            </div>
          </div>

          {/* Payment Information Card */}
          <div className="bg-white rounded-2xl border border-[#E8D8D3] p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#5C061D] font-serif flex items-center gap-2 border-b border-[#F0E2DE] pb-2.5">
              <CreditCard className="w-4 h-4 text-[#C9A227]" />
              Payment Information
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#6E5D57]">Method:</span>
                <span className="font-bold text-[#1D1D1D] uppercase">
                  {order.paymentMethod || order.payment || "UPI"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#6E5D57]">Status:</span>
                <Badge
                  variant="secondary"
                  className={`font-bold text-[10px] ${
                    String(order.paymentStatus).toLowerCase() === "paid"
                      ? "bg-green-100 text-green-800 border-green-200"
                      : "bg-amber-100 text-amber-800 border-amber-200"
                  }`}
                >
                  {String(order.paymentStatus || "pending").toUpperCase()}
                </Badge>
              </div>

              {order.razorpayPaymentId && (
                <div className="pt-2 border-t border-[#F0E2DE] space-y-1">
                  <span className="text-[#6E5D57] block">Razorpay Payment ID:</span>
                  <div className="flex items-center justify-between font-mono text-[11px] bg-[#FFF9F8] p-2 rounded-lg border border-[#F0E2DE]">
                    <span className="truncate text-[#1D1D1D]">{order.razorpayPaymentId}</span>
                    <button
                      onClick={() => handleCopy(order.razorpayPaymentId, "Razorpay Payment ID")}
                      className="p-1 text-[#6E5D57] hover:text-[#5C061D] cursor-pointer shrink-0"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {order.razorpayOrderId && (
                <div className="space-y-1">
                  <span className="text-[#6E5D57] block">Razorpay Order ID:</span>
                  <div className="flex items-center justify-between font-mono text-[11px] bg-[#FFF9F8] p-2 rounded-lg border border-[#F0E2DE]">
                    <span className="truncate text-[#1D1D1D]">{order.razorpayOrderId}</span>
                    <button
                      onClick={() => handleCopy(order.razorpayOrderId, "Razorpay Order ID")}
                      className="p-1 text-[#6E5D57] hover:text-[#5C061D] cursor-pointer shrink-0"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
