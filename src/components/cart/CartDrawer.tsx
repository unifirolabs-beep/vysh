"use client";

import React, { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ShoppingBag, Trash2, Plus, Minus, Tag, ShieldCheck, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";

import { useRouter } from "next/navigation";

export const CartDrawer: React.FC = () => {
  const router = useRouter();
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    appliedCoupon,
    discountPercentage,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getDiscountAmount,
    getTotal,
  } = useCartStore();

  const [couponCode, setCouponCode] = useState("");

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const shipping = 99;
  const total = getTotal();

  const handleProceedToCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    const success = applyCoupon(couponCode);
    if (success) {
      toast.success(`Coupon "${couponCode.toUpperCase()}" applied! Saved ${discountPercentage}%`);
      setCouponCode("");
    } else {
      toast.error("Invalid coupon code. Try RAKHI30 or WELCOME10");
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={closeCart}>
        <SheetContent className="w-full sm:max-w-[440px] bg-[#FFF9F8] p-0 flex flex-col border-l border-[#E8D8D3]">
          {/* Drawer Header */}
          <SheetHeader className="p-6 bg-[#5C061D] text-white border-b border-[#7A0A28]">
            <SheetTitle className="text-xl font-serif text-[#C9A227] flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#C9A227]" />
                Your Shopping Bag
              </span>
              <span className="text-xs font-mono font-normal text-white/80 bg-[#7A0A28] px-2.5 py-1 rounded-full">
                {items.length} {items.length === 1 ? "Item" : "Items"}
              </span>
            </SheetTitle>
          </SheetHeader>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <ShoppingBag className="w-16 h-16 text-[#C9A227] mx-auto opacity-40" />
                <h3 className="text-lg font-serif font-bold text-[#5C061D]">
                  Your Bag is Empty
                </h3>
                <p className="text-xs text-[#6E5D57] max-w-xs mx-auto">
                  Explore our hallmarked 925 Pure Silver Rakhis & royal jewelry collections to add items.
                </p>
                <button
                  onClick={closeCart}
                  className="mt-2 px-6 py-2.5 bg-[#5C061D] text-white text-xs font-bold rounded-xl"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="p-4 bg-white rounded-2xl border border-[#F0E2DE] shadow-xs flex gap-4 relative group"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-xl border border-[#F0E2DE]"
                  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-serif font-bold text-[#1D1D1D] truncate">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-[#6E5D57] hover:text-[#D32F2F] transition-colors p-1"
                          aria-label="Remove Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-xs text-[#6E5D57] mt-0.5">
                        ₹{item.product.price} each
                      </p>

                      {item.customName && (
                        <p className="text-[11px] font-medium text-[#5C061D] bg-[#FFF9F8] px-2 py-0.5 rounded border border-[#E8D8D3] mt-1.5 inline-block">
                          Customized: <strong>{item.customName}</strong>
                        </p>
                      )}
                    </div>

                    {/* Quantity Handlers */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F0E2DE]">
                      <div className="flex items-center gap-2 border border-[#E8D8D3] rounded-lg px-2 py-0.5 bg-[#FFF9F8]">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="text-[#5C061D] hover:text-[#A3183F]"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="text-[#5C061D] hover:text-[#A3183F]"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-sm font-bold text-[#5C061D]">
                        ₹{item.product.price * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Summary Footer */}
          {items.length > 0 && (
            <div className="p-6 bg-white border-t border-[#E8D8D3] space-y-4">
              {/* Coupon Code Input */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-[#FFF9F8] border border-[#C9A227]/50 rounded-xl text-xs">
                  <span className="flex items-center gap-1.5 text-[#5C061D] font-bold">
                    <Tag className="w-4 h-4 text-[#C9A227]" />
                    Coupon {appliedCoupon} ({discountPercentage}% OFF)
                  </span>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-[#D32F2F] font-bold underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon Code (e.g. RAKHI30)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-3 py-2 bg-[#FFF9F8] border border-[#E8D8D3] rounded-xl text-xs focus:outline-none focus:border-[#C9A227]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#5C061D] text-white text-xs font-bold rounded-xl hover:bg-[#7A0A28]"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Calculations Breakdown */}
              <div className="space-y-1.5 text-xs text-[#6E5D57]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1D1D1D]">₹{subtotal}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-700 font-semibold">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Insured Express Shipping</span>
                  <span className="font-semibold text-[#1D1D1D]">
                    <strong className="text-black">₹ {shipping}</strong>
                  </span>
                </div>

                <div className="flex justify-between text-sm font-bold text-[#5C061D] pt-2 border-t border-[#F0E2DE]">
                  <span>Total Amount</span>
                  <span className="text-base text-[#5C061D]">₹{total}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-4 bg-[#5C061D] text-white text-sm font-bold tracking-wide rounded-[12px] hover:bg-[#7A0A28] transition-colors shadow-luxury flex items-center justify-center gap-2 border border-[#C9A227]/40 cursor-pointer"
              >
                <span>Proceed to Checkout & Enter Address</span>
                <ArrowRight className="w-4 h-4 text-[#C9A227]" />
              </button>

              <p className="text-[10px] text-center text-[#6E5D57] flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>Includes 925 Pure Silver Authenticity Certificate</span>
              </p>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
