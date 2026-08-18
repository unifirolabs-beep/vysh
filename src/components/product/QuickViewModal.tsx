"use client";

import React, { useState } from "react";
import { Product } from "@/data/products";
import { useCartStore } from "@/store/useCartStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Star, ShieldCheck, Heart, ShoppingBag, Truck, Award, Check } from "lucide-react";
import { toast } from "sonner";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

import { useRouter } from "next/navigation";

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;


  const handleIncreaseQuantity = () => {
    setQuantity((prev) => {
      if ((product.stock || 0) <= 0) {
        toast.error(`Only ${product.stock || 0} item${(product.stock || 0) > 1 ? "s" : ""} available.`);
        return prev;
      }

      return prev + 1;
    });
  };

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleAddToCart = () => {
    if ((product.stock || 0) <= 0) {
      toast.error("This product is out of stock.");
      return;
    }

    addItem(product, quantity);

    setIsAdded(true);

    toast.success(
      `${quantity} × ${product.name} added to cart!`,
      {
        icon: "🛍️",
      }
    );

    setTimeout(() => setIsAdded(false), 2000);
    onClose();
  };

 const handleBuyNow = () => {
  if ((product.stock || 0) <= 0) {
    toast.error("This product is out of stock.");
    return;
  }

  addItem(product, quantity);
  router.push("/checkout");
  onClose();
};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] p-0 bg-[#FFF9F8] border-[#E8D8D3] rounded-[28px] overflow-x-hidden max-h-[90vh] overflow-y-auto [&>button]:z-50
    [&>button]:bg-white
    [&>button]:text-[#5C061D]
    [&>button]:opacity-100
    [&>button]:rounded-full
    [&>button]:border
    [&>button]:border-[#E8D8D3]
    [&>button]:shadow-md">
        <DialogHeader className="p-4 bg-[#5C061D] text-white border-b border-[#7A0A28]">
          <DialogTitle className="font-serif text-[#C9A227] flex items-center justify-between">
            <span>Quick View - Vysh Collection</span>
            <span className="text-xs font-mono font-normal text-white/80 bg-[#7A0A28] px-2.5 py-0.5 rounded-full">
              925 Pure Silver
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Left Product Image */}
          <div className="relative w-full h-[300px] bg-white rounded-2xl overflow-hidden border border-[#F0E2DE] shadow-inner">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Product Details */}
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-[#C9A227] tracking-wider uppercase">
                {product.category}
              </span>
              <h3 className="text-xl font-serif font-bold text-[#5C061D] mt-0.5">
                {product.name}
              </h3>
              <p className="text-xs text-[#6E5D57] mt-1">{product.subtitle}</p>

              {/* Rating */}
              <div className="flex items-center gap-1 mt-2">
                <div className="flex text-[#C9A227]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-bold text-[#1D1D1D] ml-1">
                  {product.rating}
                </span>
                <span className="text-[11px] text-[#6E5D57]">
                  ({product.reviewsCount} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-[#5C061D]">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-[#6E5D57] line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-[#1D1D1D]/80 leading-relaxed border-t border-b border-[#E8D8D3] py-3">
              {product.description}
            </p>

            {/* Material info */}
            <div className="text-xs text-[#6E5D57]">
              <strong>Material:</strong> {product.material}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-[#E8D8D3] rounded-xl px-3 py-2 bg-white">
                  <button
                    onClick={handleDecreaseQuantity}
                    disabled={quantity <= 1}
                    className="text-[#5C061D] font-bold px-1 disabled:opacity-30"
                  >
                    -
                  </button>

                  <span className="text-xs font-bold px-3">
                    {quantity}
                  </span>

                  <button
                    onClick={handleIncreaseQuantity}
                    disabled={quantity >= (product.stock || 0)}
                    className="text-[#5C061D] font-bold px-1 disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={(product.stock || 0) <= 0}
                  className={`flex-1 py-3 px-4 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${(product.stock || 0) <= 0
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : isAdded
                      ? "bg-green-700 text-white"
                      : "bg-[#FFF9F8] text-[#5C061D] border border-[#5C061D] hover:bg-[#5C061D] hover:text-white"
                    }`}
                >
                  {(product.stock || 0) <= 0 ? (
                    <span>Out of Stock</span>
                  ) : isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Cart</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-[#C9A227]" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
              </div>
              {/* Direct Buy Now Button */}
              <button
                onClick={handleBuyNow}
                disabled={(product.stock || 0) <= 0}
                className="w-full py-3 px-4 bg-[#5C061D] text-white text-xs font-bold tracking-wide rounded-xl hover:bg-[#7A0A28] transition-colors shadow-md flex items-center justify-center gap-2 border border-[#C9A227]/40 cursor-pointer disabled:bg-gray-300 disabled:text-gray-500 disabled:border-gray-300 disabled:cursor-not-allowed"
              >
                <span>
                  {(product.stock || 0) <= 0
                    ? "Out of Stock"
                    : `Buy Now & Enter Address (₹${product.price * quantity})`}
                </span>
              </button>
            </div>
            <div className="flex items-center gap-4 text-[10px] text-[#6E5D57] pt-2">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C9A227]" /> 925 BIS Hallmark
              </span>
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-[#C9A227]" />Shipping Available ₹99
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
