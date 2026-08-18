"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCartStore } from "@/store/useCartStore";
import { checkoutSchema, CheckoutFormValues } from "@/lib/validations/checkout";
import {
  createRazorpayOrderAction,
  createOrderAction,
} from "@/actions/order.actions";
import {
  ShieldCheck,
  Truck,
  MapPin,
  User,
  Phone,
  Mail,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  Lock,
  ChevronLeft,
  Award,
  Loader2,
  QrCode,
} from "lucide-react";
import { toast } from "sonner";
import { VyshLogo } from "@/components/common/VyshLogo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const INDIAN_STATES = [
  "Select State",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export function CheckoutClient() {
  const router = useRouter();
  const { items, getSubtotal, getDiscountAmount, getTotal, clearCart } =
    useCartStore();

  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const shipping = 99;
  const total = getTotal();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      address: "",
      landmark: "",
      city: "",
      state: "Select State",
      pincode: "",
      paymentMethod: "upi"
    },
  });

  const selectedState = watch("state");

  useEffect(() => {
    if (typeof window !== "undefined" && window.Razorpay) {
      setIsRazorpayLoaded(true);
    }
  }, []);

  const handleOrderSubmit = async (values: CheckoutFormValues) => {
  if (items.length === 0) {
    toast.error("Your cart is empty!");
    return;
  }

  try {
    setIsProcessing(true);

const orderItems = items.map((cartItem) => {
  const product = cartItem.product;
  const price = product.price || 0;
  const itemTotal = price * cartItem.quantity;

  return {
    productId: product._id || product.id,
    productCode: product.productCode || product.code || "",
    productName: product.name || "",
    productPrice: price,
    quantity: cartItem.quantity,
    imageUrl: product.images?.[0] || product.imageUrl || product.image || "",
    weight: typeof product.weight === "number" ? product.weight : parseFloat(String(product.weight || "0")) || 0,
    metalType: product.metalType || "",
    purity: product.purity || "",
    total: itemTotal,
    customName: cartItem.customName || "",
    customMessage: cartItem.customMessage || "",
    customPhotoUrl: cartItem.customPhotoUrl || "",
  };
});

    const totalQuantity = items.reduce(
      (acc, curr) => acc + curr.quantity,
      0
    );

    // Step 1: Create Razorpay Order
    const rzpRes = await createRazorpayOrderAction(total);

    if (!rzpRes.success || !rzpRes.razorpayOrderId) {
      toast.error("Unable to initialize payment.");
      return;
    }

    // Step 2: Open Razorpay Checkout
    const options = {
      key: rzpRes.keyId,
      amount: rzpRes.amount,
      currency: rzpRes.currency || "INR",

      name: "Vysh Pure 925 Silver",
      description: `Order Payment (${items.length} items)`,

      order_id: rzpRes.razorpayOrderId,

      // Only allow these payment methods
      config: {
        display: {
          blocks: {
            other: {
              name: "Other Payment Methods",
              instruments: [
                {
                  method: "upi",
                },
                {
                  method: "card",
                },
                {
                  method: "netbanking",
                },
                {
                  method: "wallet",
                },
              ],
            },
          },

          sequence: ["block.other"],

          preferences: {
            show_default_blocks: false,
          },
        },
      },

      handler: async function (response: any) {
        try {
          toast.loading("Verifying payment & confirming order...", {
            id: "payment-verify",
          });

          const saveRes = await createOrderAction({
            userName: values.fullName,
            userEmail: values.email,
            userPhone: values.phone,
            userAddress: values.address,
            userPincode: values.pincode,
            userCity: values.city,
            userState: values.state,
            userLandmark: values.landmark,

            items: orderItems,
            quantity: totalQuantity,
            total: total,

            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,

            paymentStatus: "pending",
            paymentMethod: "upi",
          });

          toast.dismiss("payment-verify");

          if (saveRes.success) {
            clearCart();

            toast.success("Payment verified! Order confirmed.");

            router.push(
              `/order/${saveRes.orderId || saveRes.customOrderId}`
            );
          } else {
            toast.error(
              saveRes.message || "Order saving failed."
            );
          }
        } catch (err) {
          console.error("Error saving paid order:", err);

          toast.dismiss("payment-verify");

          toast.error(
            "An error occurred while saving your order."
          );
        } finally {
          setIsProcessing(false);
        }
      },

      prefill: {
        name: values.fullName,
        email: values.email,
        contact: values.phone,
      },

      theme: {
        color: "#5C061D",
      },

      modal: {
        ondismiss: function () {
          setIsProcessing(false);
          toast.info("Payment cancelled.");
        },
      },
    };

    if (!window.Razorpay) {
      setIsProcessing(false);
      toast.error("Payment gateway failed to load.");
      return;
    }

    const razorpayInstance = new window.Razorpay(options);

    razorpayInstance.on(
      "payment.failed",
      function (response: any) {
        setIsProcessing(false);

        toast.error(
          `Payment Failed: ${
            response.error?.description ||
            "Transaction failed"
          }`
        );
      }
    );

    razorpayInstance.open();
  } catch (error: any) {
    console.error("Error during checkout:", error);

    toast.error(
      error?.message ||
        "An unexpected error occurred."
    );

    setIsProcessing(false);
  }
};

  return (
    <div className="min-h-screen bg-[#FDFBF7] selection:bg-[#5C061D] selection:text-[#C9A227]">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setIsRazorpayLoaded(true)}
      />

      {/* Top Header */}
      <header className="bg-white border-b border-[#E8D8D3] py-4 px-4 sm:px-8 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <VyshLogo size="sm" />
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#5C061D] hover:text-[#7A0A28] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Store</span>
          </Link>
        </div>
      </header>

      {/* Main Page Container */}
      <main className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Main Card Wrapper */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E8D8D3] shadow-luxury overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#4A0417] via-[#5C061D] to-[#3D0312] text-white p-5 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#7A0A28]">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#C9A227]/20 border border-[#C9A227]/40 flex items-center justify-center shrink-0">
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-[#C9A227]" />
              </div>
              <div>
                <h1 className="text-xl sm:text-3xl font-serif font-bold text-[#C9A227] tracking-wide">
                  Shipping & Payment Details
                </h1>
                <p className="text-xs sm:text-sm text-white/80 mt-0.5 font-sans">
                  Please enter your delivery details to complete your order via Razorpay.
                </p>
              </div>
            </div>

            {/* Secure Checkout Badge */}
            <div className="flex items-center gap-2 bg-white/10 px-3.5 py-2 rounded-xl border border-white/20 text-right self-stretch sm:self-auto justify-center sm:justify-end">
              <ShieldCheck className="w-5 h-5 text-[#C9A227] shrink-0" />
              <div className="text-left">
                <span className="text-xs font-bold text-[#C9A227] block leading-tight">
                  Secure Checkout
                </span>
                <span className="text-[10px] text-white/80 block leading-tight">
                  100% Encrypted & Safe
                </span>
              </div>
            </div>
          </div>

          {/* Form / Summary Content Body */}
          <div className="p-4 sm:p-8">
            {items.length === 0 ? (
              /* EMPTY CART WARNING */
              <div className="text-center py-16 space-y-4 max-w-md mx-auto">
                <ShoppingBag className="w-16 h-16 text-[#C9A227] mx-auto opacity-50" />
                <h2 className="text-2xl font-serif font-bold text-[#5C061D]">
                  Your Cart is Empty
                </h2>
                <p className="text-xs text-[#6E5D57]">
                  Please add items to your cart before proceeding to checkout.
                </p>
                <Link
                  href="/"
                  className="inline-block px-6 py-3 bg-[#5C061D] text-white text-xs font-bold rounded-xl hover:bg-[#7A0A28] transition-colors"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              /* DUAL COLUMN DESKTOP & SINGLE COLUMN MOBILE LAYOUT */
              <form
                onSubmit={handleSubmit(handleOrderSubmit, (onerror) => {
                  console.log(onerror);
                })}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
                  {/* LEFT COLUMN: Order Summary & Trust Card */}
                  <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
                    {/* Order Summary Card */}
                    <div className="bg-[#FFF9F8] rounded-2xl border border-[#F0E2DE] p-4 sm:p-5 space-y-4">
                      <div className="flex items-center justify-between border-b border-[#F0E2DE] pb-3">
                        <span className="text-xs font-serif font-bold text-[#5C061D] flex items-center gap-1.5 uppercase tracking-wider">
                          <Sparkles className="w-4 h-4 text-[#C9A227]" />
                          Order Summary ({items.length}{" "}
                          {items.length === 1 ? "item" : "items"})
                        </span>
                        <span className="text-sm font-bold text-[#5C061D]">
                          Total: ₹{total.toLocaleString("en-IN")}
                        </span>
                      </div>

                      {/* Items List */}
                      <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                        {items.map((item) => (
                          <div
                            key={item.product.id}
                            className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-[#F0E2DE]"
                          >
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-14 h-14 object-cover rounded-lg border border-[#F0E2DE] shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-semibold text-[#1D1D1D] truncate">
                                {item.product.name}
                              </h4>
                              <p className="text-[11px] text-[#6E5D57] mt-0.5">
                                Qty: {item.quantity} • ₹
                                {item.product.price.toLocaleString("en-IN")}
                              </p>
                              {item.customName && (
                                <span className="text-[10px] text-[#5C061D] font-bold bg-[#FFF9F8] px-1.5 py-0.5 rounded border border-[#E8D8D3] inline-block mt-1">
                                  Custom: {item.customName}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Calculations breakdown */}
                      <div className="border-t border-[#F0E2DE] pt-3 space-y-1.5 text-xs text-[#6E5D57]">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span className="font-semibold text-[#1D1D1D]">
                            ₹{subtotal.toLocaleString("en-IN")}
                          </span>
                        </div>
                        {discount > 0 && (
                          <div className="flex justify-between text-green-700 font-semibold">
                            <span>Discount</span>
                            <span>-₹{discount.toLocaleString("en-IN")}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Express Shipping</span>
                          <span className="font-semibold text-black">
                            ₹{shipping}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm font-bold text-[#5C061D] pt-2 border-t border-[#F0E2DE]">
                          <span>Grand Total</span>
                          <span className="text-base text-[#5C061D]">
                            ₹{total.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Trust & Safety Card */}
                    <div className="bg-[#FFF9F8]/60 rounded-2xl border border-[#F0E2DE] p-4 sm:p-5 space-y-3.5 text-xs text-[#6E5D57]">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-[#5C061D]/10 rounded-xl text-[#5C061D] shrink-0">
                          <ShieldCheck className="w-4 h-4 text-[#C9A227]" />
                        </div>
                        <div>
                          <strong className="text-[#1D1D1D] block">
                            Razorpay Secured (UPI/Cards)
                          </strong>
                          <span>Protected with 256-bit SSL encryption.</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-[#5C061D]/10 rounded-xl text-[#5C061D] shrink-0">
                          <Truck className="w-4 h-4 text-[#C9A227]" />
                        </div>
                        <div>
                          <strong className="text-[#1D1D1D] block">
                            Fast Doorstep Delivery
                          </strong>
                          <span>Dispatched within 24 hours of confirmation.</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-[#5C061D]/10 rounded-xl text-[#5C061D] shrink-0">
                          <Award className="w-4 h-4 text-[#C9A227]" />
                        </div>
                        <div>
                          <strong className="text-[#1D1D1D] block">
                            100% Authentic 925 Silver
                          </strong>
                          <span>Includes BIS Hallmark Certificate of Purity.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: Contact Info, Shipping Address, Payment Option */}
                  <div className="lg:col-span-8 space-y-6">
                    {/* 1. CONTACT INFORMATION */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#5C061D] flex items-center gap-1.5 font-serif">
                        <User className="w-4 h-4 text-[#C9A227]" />
                        1. CONTACT INFORMATION
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#1D1D1D] mb-1">
                            Full Name <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <User className="w-4 h-4 text-[#888888] absolute left-3 top-3" />
                            <Input
                              type="text"
                              {...register("fullName")}
                              placeholder="e.g. Ramesh Kumar"
                              className="pl-9 h-11 border-[#E8D8D3] focus-visible:ring-[#5C061D]"
                            />
                          </div>
                          {errors.fullName && (
                            <p className="text-[11px] text-red-500 mt-1 font-medium">
                              {errors.fullName.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[#1D1D1D] mb-1">
                            Mobile Number <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Phone className="w-4 h-4 text-[#888888] absolute left-3 top-3" />
                            <Input
                              type="tel"
                              maxLength={10}
                              {...register("phone")}
                              placeholder="10-digit mobile number"
                              className="pl-9 h-11 border-[#E8D8D3] focus-visible:ring-[#5C061D]"
                            />
                          </div>
                          {errors.phone && (
                            <p className="text-[11px] text-red-500 mt-1 font-medium">
                              {errors.phone.message}
                            </p>
                          )}
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-semibold text-[#1D1D1D] mb-1">
                            Email Address <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Mail className="w-4 h-4 text-[#888888] absolute left-3 top-3" />
                            <Input
                              type="email"
                              {...register("email")}
                              placeholder="name@example.com"
                              className="pl-9 h-11 border-[#E8D8D3] focus-visible:ring-[#5C061D]"
                            />
                          </div>
                          {errors.email && (
                            <p className="text-[11px] text-red-500 mt-1 font-medium">
                              {errors.email.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 2. DELIVERY ADDRESS */}
                    <div className="space-y-3 pt-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#5C061D] flex items-center gap-1.5 font-serif">
                        <MapPin className="w-4 h-4 text-[#C9A227]" />
                        2. DELIVERY ADDRESS
                      </h3>

                      <div className="space-y-3 sm:space-y-4">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#1D1D1D] mb-1">
                            Flat / House No. / Building / Street Address{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <Input
                            type="text"
                            {...register("address")}
                            placeholder="e.g. Flat 302, Royal Palms, Main Road"
                            className="h-11 border-[#E8D8D3] focus-visible:ring-[#5C061D]"
                          />
                          {errors.address && (
                            <p className="text-[11px] text-red-500 mt-1 font-medium">
                              {errors.address.message}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <label className="block text-[11px] font-semibold text-[#1D1D1D] mb-1">
                              Landmark (Optional)
                            </label>
                            <Input
                              type="text"
                              {...register("landmark")}
                              placeholder="e.g. Near Metro Station / Opp. City Park"
                              className="h-11 border-[#E8D8D3] focus-visible:ring-[#5C061D]"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-[#1D1D1D] mb-1">
                              City / Area <span className="text-red-500">*</span>
                            </label>
                            <Input
                              type="text"
                              {...register("city")}
                              placeholder="e.g. Bengaluru"
                              className="h-11 border-[#E8D8D3] focus-visible:ring-[#5C061D]"
                            />
                            {errors.city && (
                              <p className="text-[11px] text-red-500 mt-1 font-medium">
                                {errors.city.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <label className="block text-[11px] font-semibold text-[#1D1D1D] mb-1">
                              State <span className="text-red-500">*</span>
                            </label>
                            <select
                              {...register("state")}
                              className="w-full h-11 px-3 bg-white border border-[#E8D8D3] rounded-lg text-xs sm:text-sm text-[#1D1D1D] focus:outline-none focus:border-[#5C061D] focus:ring-1 focus:ring-[#5C061D]"
                            >
                              {INDIAN_STATES.map((state) => (
                                <option key={state} value={state}>
                                  {state}
                                </option>
                              ))}
                            </select>
                            {errors.state && (
                              <p className="text-[11px] text-red-500 mt-1 font-medium">
                                {errors.state.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-[#1D1D1D] mb-1">
                              Pincode <span className="text-red-500">*</span>
                            </label>
                            <Input
                              type="text"
                              maxLength={6}
                              {...register("pincode")}
                              placeholder="e.g. 560001"
                              className="h-11 border-[#E8D8D3] focus-visible:ring-[#5C061D]"
                            />
                            {errors.pincode && (
                              <p className="text-[11px] text-red-500 mt-1 font-medium">
                                {errors.pincode.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CONFIRM BOOKING BUTTON */}
                    <div className="pt-4 space-y-2">
                      <Button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full py-6 bg-[#5C061D] hover:bg-[#7A0A28] text-white text-sm sm:text-base font-bold tracking-wide rounded-2xl transition-colors shadow-luxury flex items-center justify-center gap-2 border border-[#C9A227]/40 cursor-pointer disabled:opacity-70"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin text-[#C9A227]" />
                            <span>Processing Razorpay Checkout...</span>
                          </>
                        ) : (
                          <>
                            <span>
                              Pay via Razorpay (₹{total.toLocaleString("en-IN")})
                            </span>
                            <ArrowRight className="w-5 h-5 text-[#C9A227]" />
                          </>
                        )}
                      </Button>

                      <p className="text-[11px] text-center text-[#6E5D57] flex items-center justify-center gap-1">
                        <Lock className="w-3.5 h-3.5 text-[#C9A227]" />
                        <span>
                          100% Encrypted & Insured Delivery with 925 Hallmark
                          Certificate
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
