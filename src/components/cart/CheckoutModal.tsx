"use client";

import React, { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ShieldCheck,
  CheckCircle2,
  Truck,
  CreditCard,
  MapPin,
  User,
  Phone,
  Mail,
  Building,
  ArrowRight,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { items, getSubtotal, getDiscountAmount, getTotal, clearCart } =
    useCartStore();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    landmark: "",
    pincode: "",
    city: "",
    state: "",
    paymentMethod: "upi", // 
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderId, setOrderId] = useState("");

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const total = getTotal();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.fullName.trim()) {
      toast.error("Please enter your Full Name");
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      toast.error("Please enter a valid 10-digit Mobile Number");
      return;
    }
    if (!formData.address.trim()) {
      toast.error("Please enter your Delivery Address");
      return;
    }
    if (!formData.pincode.trim() || formData.pincode.length < 6) {
      toast.error("Please enter a valid 6-digit Pincode");
      return;
    }
    if (!formData.city.trim()) {
      toast.error("Please enter your City");
      return;
    }
    if (!formData.state.trim()) {
      toast.error("Please enter your State");
      return;
    }

    // Generate random Order ID
    const newOrderId = `VYSH-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(newOrderId);
    setIsSubmitted(true);

    toast.success("Order Placed Successfully!", {
      description: `Order ID: ${newOrderId} • Delivery to ${formData.city}`,
      icon: "🎉",
    });
  };

  const handleFinish = () => {
    clearCart();
    setIsSubmitted(false);
    setFormData({
      fullName: "",
      phone: "",
      email: "",
      address: "",
      landmark: "",
      pincode: "",
      city: "",
      state: "",
      paymentMethod: "upi",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-[#FFF9F8] border border-[#E8D8D3] p-0 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <DialogHeader className="p-5 sm:p-6 bg-[#5C061D] text-white border-b border-[#7A0A28]">
          <DialogTitle className="text-lg sm:text-2xl font-serif text-[#C9A227] flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-[#C9A227]" />
            {isSubmitted ? "Booking Confirmed!" : "Shipping & Booking Address"}
          </DialogTitle>
          <p className="text-xs text-white/80 mt-1">
            {isSubmitted
              ? "Thank you for your order with Vysh Pure 925 Silver."
              : "Please enter your delivery details to complete your order."}
          </p>
        </DialogHeader>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {isSubmitted ? (
            /* SUCCESS CONFIRMATION SCREEN */
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 bg-[#5C061D]/10 rounded-full flex items-center justify-center mx-auto border border-[#5C061D]/20">
                <CheckCircle2 className="w-10 h-10 text-[#5C061D]" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 bg-[#5C061D]/10 text-[#5C061D] text-xs font-mono font-bold rounded-full border border-[#5C061D]/20 mb-2">
                  Order ID: {orderId}
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#1D1D1D]">
                  Order Successfully Placed!
                </h3>
                <p className="text-xs sm:text-sm text-[#6E5D57] max-w-md mx-auto mt-1">
                  We have received your booking. You will receive an SMS and WhatsApp update with live tracking details shortly.
                </p>
              </div>

              {/* Delivery Details Card */}
              <div className="bg-white rounded-2xl border border-[#F0E2DE] p-4 text-left space-y-3 text-xs max-w-lg mx-auto">
                <div className="flex items-center gap-2 pb-2 border-b border-[#F0E2DE] font-bold text-[#5C061D]">
                  <Truck className="w-4 h-4 text-[#C9A227]" />
                  <span>Estimated Delivery: 3 to 5 Business Days</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#6E5D57]">
                  <div>
                    <span className="font-semibold text-[#1D1D1D] block">Delivering To:</span>
                    <p className="font-medium text-[#1D1D1D]">{formData.fullName}</p>
                    <p>{formData.phone}</p>
                    <p>{formData.email}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-[#1D1D1D] block">Shipping Address:</span>
                    <p>{formData.address}</p>
                    {formData.landmark && <p>Near: {formData.landmark}</p>}
                    <p>
                      {formData.city}, {formData.state} - {formData.pincode}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#F0E2DE] flex justify-between font-bold text-[#5C061D]">
                  <span>Payment Mode:</span>
                  <span className="uppercase">
                    {formData.paymentMethod === "upi"
                      ? "UPI"
                      : "UPI"}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleFinish}
                  className="px-8 py-3 bg-[#5C061D] text-white text-xs font-bold rounded-xl hover:bg-[#7A0A28] shadow-md transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            /* ADDRESS & BOOKING FORM */
            <form onSubmit={handleSubmitBooking} className="space-y-6">
              {/* Order Items Preview Pill */}
              <div className="bg-white rounded-2xl border border-[#F0E2DE] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-serif font-bold text-[#5C061D] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#C9A227]" />
                    Order Summary ({items.length} {items.length === 1 ? "item" : "items"})
                  </span>
                  <span className="text-sm font-bold text-[#5C061D]">
                    Total: ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex items-center gap-3 overflow-x-auto pt-1 pb-1">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center gap-2 bg-[#FFF9F8] p-1.5 pr-3 rounded-xl border border-[#F0E2DE] text-xs shrink-0"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-10 h-10 object-cover rounded-lg border border-[#F0E2DE]"
                      />
                      <div>
                        <p className="font-semibold text-[#1D1D1D] truncate max-w-[120px]">
                          {item.product.name}
                        </p>
                        <p className="text-[11px] text-[#6E5D57]">
                          Qty: {item.quantity} • ₹{item.product.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 1: Customer Contact Info */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#5C061D] flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#C9A227]" />
                  1. Contact Information
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#1D1D1D] mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#6E5D57] absolute left-3 top-3" />
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E8D8D3] rounded-xl text-xs text-[#1D1D1D] focus:outline-none focus:border-[#5C061D]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#1D1D1D] mb-1">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#6E5D57] absolute left-3 top-3" />
                      <input
                        type="tel"
                        name="phone"
                        required
                        maxLength={10}
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="10-digit mobile number"
                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E8D8D3] rounded-xl text-xs text-[#1D1D1D] focus:outline-none focus:border-[#5C061D]"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-[#1D1D1D] mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#6E5D57] absolute left-3 top-3" />
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="name@example.com"
                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E8D8D3] rounded-xl text-xs text-[#1D1D1D] focus:outline-none focus:border-[#5C061D]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Shipping Address */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#5C061D] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#C9A227]" />
                  2. Delivery Address
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#1D1D1D] mb-1">
                      Flat / House No. / Building / Street Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="e.g. Flat 302, Royal Palms, Main Road"
                      className="w-full px-3 py-2.5 bg-white border border-[#E8D8D3] rounded-xl text-xs text-[#1D1D1D] focus:outline-none focus:border-[#5C061D]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#1D1D1D] mb-1">
                        Pincode <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        required
                        maxLength={6}
                        value={formData.pincode}
                        onChange={handleChange}
                        placeholder="e.g. 560001"
                        className="w-full px-3 py-2.5 bg-white border border-[#E8D8D3] rounded-xl text-xs text-[#1D1D1D] focus:outline-none focus:border-[#5C061D]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#1D1D1D] mb-1">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="e.g. Mumbai"
                        className="w-full px-3 py-2.5 bg-white border border-[#E8D8D3] rounded-xl text-xs text-[#1D1D1D] focus:outline-none focus:border-[#5C061D]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#1D1D1D] mb-1">
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="state"
                        required
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="e.g. Maharashtra"
                        className="w-full px-3 py-2.5 bg-white border border-[#E8D8D3] rounded-xl text-xs text-[#1D1D1D] focus:outline-none focus:border-[#5C061D]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#1D1D1D] mb-1">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleChange}
                      placeholder="e.g. Near Metro Station / Opp. City Park"
                      className="w-full px-3 py-2.5 bg-white border border-[#E8D8D3] rounded-xl text-xs text-[#1D1D1D] focus:outline-none focus:border-[#5C061D]"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Payment Method */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#5C061D] flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-[#C9A227]" />
                  3. Select Payment Method
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* COD */}
                  <label
                    className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      formData.paymentMethod === "upi"
                        ? "bg-white border-[#5C061D] ring-2 ring-[#5C061D]/20 shadow-xs"
                        : "bg-white/60 border-[#E8D8D3] hover:border-[#5C061D]/40"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="upi"
                        checked={formData.paymentMethod === "upi"}
                        onChange={handleChange}
                        className="accent-[#5C061D]"
                      />
                      <div>
                        <span className="text-xs font-bold text-[#1D1D1D] block">
                          UPI
                        </span>
                        <span className="text-[10px] text-[#6E5D57]">
                          Pay with UPI
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
                      Popular
                    </span>
                  </label>

                  {/* Online Payment */}
                  <label
                    className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      formData.paymentMethod === "online"
                        ? "bg-white border-[#5C061D] ring-2 ring-[#5C061D]/20 shadow-xs"
                        : "bg-white/60 border-[#E8D8D3] hover:border-[#5C061D]/40"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="online"
                        checked={formData.paymentMethod === "online"}
                        onChange={handleChange}
                        className="accent-[#5C061D]"
                      />
                      <div>
                        <span className="text-xs font-bold text-[#1D1D1D] block">
                          UPI
                        </span>
                        <span className="text-[10px] text-[#6E5D57]">
                          GPay, PhonePe, Paytm, Cards
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-[#C9A227]/20 text-[#5C061D] rounded-full">
                      Instant
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-[#E8D8D3] space-y-2">
                <button
                  type="submit"
                  className="w-full py-4 bg-[#5C061D] text-white text-sm font-bold tracking-wide rounded-xl hover:bg-[#7A0A28] transition-colors shadow-lg flex items-center justify-center gap-2 border border-[#C9A227]/40 cursor-pointer"
                >
                  <span>Confirm & Place Booking (₹{total.toLocaleString("en-IN")})</span>
                  <ArrowRight className="w-4 h-4 text-[#C9A227]" />
                </button>

                <p className="text-[10px] text-center text-[#6E5D57] flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C9A227]" />
                  <span>100% Encrypted & Insured Delivery with 925 Hallmark Certificate</span>
                </p>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
