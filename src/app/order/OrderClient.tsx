"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { getOrderDetailsAction } from "@/actions/order.actions";
import { VyshLogo } from "@/components/common/VyshLogo";
import {
  CheckCircle2,
  Clock,
  Truck,
  PackageCheck,
  XCircle,
  ChevronLeft,
  ShoppingBag,
  MapPin,
  CreditCard,
  User,
  Phone,
  Mail,
  Printer,
  Sparkles,
  Download
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { OrderInvoice } from "@/components/common/OrderInvoice";

interface OrderClientProps {
  orderId: string;
}

export function OrderClient({ orderId }: OrderClientProps) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getOrderDetailsAction(orderId);
      if (res.success && res.order) {
        setOrder(res.order);
      } else {
        setError(res.message || "Order not found");
      }
    } catch (err: any) {
      console.error("Error fetching order:", err);
      setError(err?.message || "Failed to load order details");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId, fetchOrder]);

  const getStatusStepIndex = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return 0;
      case "confirmed":
        return 1;
      case "shipped":
        return 2;
      case "delivered":
        return 3;
      case "cancelled":
        return -1;
      default:
        return 1;
    }
  };

  const steps = [
    { title: "Order Placed", icon: Clock },
    { title: "Confirmed", icon: CheckCircle2 },
    { title: "Shipped", icon: Truck },
    { title: "Delivered", icon: PackageCheck },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-[#5C061D] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-[#5C061D]">
            Fetching order details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between">
        <header className="bg-white border-b border-[#E8D8D3] py-4 px-4 sm:px-8">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <VyshLogo size="sm" />
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#5C061D]"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Store</span>
            </Link>
          </div>
        </header>

        <main className="max-w-md mx-auto my-auto p-6 text-center space-y-4">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto border border-red-200">
            <XCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#1D1D1D]">
            Order Not Found
          </h2>
          <p className="text-xs text-[#6E5D57]">
            {error || "We could not find an order matching the requested ID."}
          </p>
          <Link href="/">
            <Button className="mt-2 bg-[#5C061D] hover:bg-[#7A0A28] text-white text-xs font-bold px-6 py-2 rounded-xl">
              Return to Store
            </Button>
          </Link>
        </main>
      </div>
    );
  }

  const stepIndex = getStatusStepIndex(order.orderStatus);
  const isCancelled = order.orderStatus?.toLowerCase() === "cancelled";

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1D1D1D] selection:bg-[#5C061D] selection:text-[#C9A227]">
      {/* Top Header */}
      <header className="bg-white border-b border-[#E8D8D3] py-4 px-4 sm:px-8 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <VyshLogo size="sm" />
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#5C061D] hover:text-[#7A0A28] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Store</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
        {/* Banner Card */}
        <div className="bg-gradient-to-r from-[#4A0417] via-[#5C061D] to-[#3D0312] text-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-luxury border border-[#7A0A28] relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-[#C9A227]/20 text-[#C9A227] border border-[#C9A227]/40 font-mono text-xs px-3 py-1 font-bold"
                >
                  Order #{order.orderId || order._id}
                </Badge>
                <span className="text-xs text-white/70">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#C9A227]">
                Thank you for your order!
              </h1>
              <p className="text-xs sm:text-sm text-white/80">
                Your payment of ₹{order.total?.toLocaleString("en-IN")} via{" "}
                {order.paymentMethod} is confirmed.
              </p>
            </div>

            <div className="flex items-center gap-2">

              {/* Download PDF Link */}
              {isMounted ? (
                <PDFDownloadLink document={<OrderInvoice order={order} />} fileName={`vysh-order-${order.orderId || order._id}.pdf`}>
                  {({ blob, url, loading, error }) => (
                    <Button
                      variant="outline"
                      className="bg-white/10 hover:bg-white/20 border-white/30 text-white text-xs font-semibold rounded-xl gap-1.5 cursor-pointer"
                      disabled={loading || !!error}
                    >
                      <Download className="w-3.5 h-3.5" />
                      {loading ? "Generating..." : "Download PDF"}
                    </Button>
                  )}
                </PDFDownloadLink>
              ) : (
                <Button
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20 border-white/30 text-white text-xs font-semibold rounded-xl gap-1.5 cursor-pointer"
                  disabled
                >
                  <Download className="w-3.5 h-3.5" />
                  Download PDF
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Progress Tracker (If not cancelled) */}
        {!isCancelled ? (
          <div className="bg-white rounded-2xl border border-[#E8D8D3] p-5 sm:p-7 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#5C061D] font-serif flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#C9A227]" />
              Order Status Progress
            </h3>

            <div className="grid grid-cols-4 gap-2 pt-2 relative">
              {steps.map((step, idx) => {
                const IconComp = step.icon;
                const isCompleted = idx <= stepIndex;
                return (
                  <div
                    key={step.title}
                    className="flex flex-col items-center text-center space-y-2 relative z-10"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${isCompleted
                          ? "bg-[#5C061D] text-[#C9A227] border-[#C9A227]"
                          : "bg-gray-100 text-gray-400 border-gray-200"
                        }`}
                    >
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-xs font-semibold ${isCompleted ? "text-[#5C061D]" : "text-gray-400"
                        }`}
                    >
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-center text-red-700 font-semibold text-sm">
            This order has been cancelled.
          </div>
        )}

        {/* Dual Grid Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Order Items */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E8D8D3] p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#5C061D] font-serif flex items-center gap-1.5 border-b border-[#F0E2DE] pb-3">
              <ShoppingBag className="w-4 h-4 text-[#C9A227]" />
              Ordered Items ({order.quantity || 1})
            </h3>

            <div className="space-y-3">
              {Array.isArray(order.productId) && order.productId.length > 0 ? (
                order.productId.map((item: any, idx: number) => (
                  <div
                    key={item._id || idx}
                    className="flex items-center gap-4 bg-[#FFF9F8] p-3 rounded-xl border border-[#F0E2DE]"
                  >
                    <img
                      src={item.imageUrl || "/category-cards/necklaces.png"}
                      alt={item.name || "Silver Jewellery Product"}
                      className="w-16 h-16 object-cover rounded-lg border border-[#E8D8D3] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-[#1D1D1D] truncate">
                        {item.name || "Pure 925 Sterling Silver Item"}
                      </h4>
                      <p className="text-xs text-[#6E5D57] mt-0.5">
                        Category: {item.category || "Silver Jewellery"} • Purity:{" "}
                        {item.purity || "925"} Hallmark
                      </p>
                      <p className="text-xs font-bold text-[#5C061D] mt-1">
                        ₹{item.price?.toLocaleString("en-IN") || order.total}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-[#FFF9F8] p-4 rounded-xl border border-[#F0E2DE] text-xs text-[#6E5D57]">
                  <p className="font-semibold text-[#1D1D1D]">
                    Vysh Pure 925 Silver Product
                  </p>
                  <p className="mt-1">
                    Quantity: {order.quantity} | Total Paid: ₹
                    {order.total?.toLocaleString("en-IN")}
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-[#F0E2DE] pt-3 flex justify-between items-center text-sm font-bold text-[#5C061D]">
              <span>Total Amount Paid</span>
              <span className="text-base text-[#5C061D]">
                ₹{order.total?.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Delivery & Payment Info */}
          <div className="lg:col-span-5 space-y-4">
            {/* Delivery Address Card */}
            <div className="bg-white rounded-2xl border border-[#E8D8D3] p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#5C061D] font-serif flex items-center gap-1.5 border-b border-[#F0E2DE] pb-2.5">
                <MapPin className="w-4 h-4 text-[#C9A227]" />
                Shipping Details
              </h3>
              <div className="space-y-1.5 text-xs text-[#1D1D1D]">
                <p className="font-semibold text-sm flex items-center gap-1.5 text-[#1D1D1D]">
                  <User className="w-3.5 h-3.5 text-[#5C061D]" />
                  {order.userName}
                </p>
                <p className="text-[#6E5D57] flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#888888]" />
                  {order.userPhone}
                </p>
                <p className="text-[#6E5D57] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#888888]" />
                  {order.userEmail}
                </p>
                <div className="pt-2 text-[#6E5D57] border-t border-[#F0E2DE] mt-2">
                  <p>{order.userAddress}</p>
                  {order.userLandmark && <p>Landmark: {order.userLandmark}</p>}
                  <p>
                    {order.userCity}, {order.userState} - {order.userPincode}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Summary Card */}
            <div className="bg-white rounded-2xl border border-[#E8D8D3] p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#5C061D] font-serif flex items-center gap-1.5 border-b border-[#F0E2DE] pb-2.5">
                <CreditCard className="w-4 h-4 text-[#C9A227]" />
                Payment Summary
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[#6E5D57]">Payment Method:</span>
                  <span className="font-bold text-[#1D1D1D] uppercase">
                    {order.paymentMethod === "upi"
                      ? "UPI"
                      : order.paymentMethod === "card"
                        ? "Card"
                        : order.paymentMethod === "netbanking"
                          ? "Net Banking"
                          : order.paymentMethod === "wallet"
                            ? "Wallet"
                            : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6E5D57]">Payment Status:</span>
                  <Badge
                    variant="secondary"
                    className={`font-bold text-[10px] ${order.paymentStatus === "paid"
                      ? "bg-green-100 text-green-800 border-green-200"
                      : "bg-amber-100 text-amber-800 border-amber-200"
                      }`}
                  >
                    {order.paymentStatus}
                  </Badge>
                </div>
                {order.razorpayPaymentId && (
                  <div className="flex justify-between items-center pt-2 border-t border-[#F0E2DE] font-mono text-[10px] text-[#6E5D57]">
                    <span>Razorpay Payment ID:</span>
                    <span className="font-semibold text-[#1D1D1D]">
                      {order.razorpayPaymentId}
                    </span>
                  </div>
                )}
                {order.razorpayOrderId && (
                  <div className="flex justify-between items-center font-mono text-[10px] text-[#6E5D57]">
                    <span>Razorpay Order ID:</span>
                    <span className="font-semibold text-[#1D1D1D]">
                      {order.razorpayOrderId}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
