"use client";

import React, { useState } from "react";
import { Product } from "@/data/products";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  onOpenQuickView?: (product: Product) => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenQuickView,
  className = "",
}) => {
  const { addItem } = useCartStore();
  const [isAdded, setIsAdded] = useState(false);

  const isOutOfStock = (product.stock ?? 0) <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Extra safety check
    if (isOutOfStock) return;

    addItem(product, 1);
    setIsAdded(true);

    toast.success(`Added "${product.name}" to cart!`, {
      description: `Rs. ${product.price.toLocaleString("en-IN")}.00 • Pure 925 Silver`,
      icon: "🛍️",
    });

    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
      <div
    onClick={() => {
      if (!isOutOfStock) {
        onOpenQuickView?.(product);
      }
    }}
    className={`group flex flex-col justify-between ${
      isOutOfStock ? "cursor-default" : "cursor-pointer"
    } ${className}`}
  >
      {/* Product Image */}
     <div
      className={`relative w-full aspect-square rounded-[18px] sm:rounded-[22px] overflow-hidden bg-[#F7F4F2] border border-[#EFE8E4] shadow-xs transition-all duration-300 ${
        isOutOfStock
          ? "opacity-75 grayscale-[20%]"
          : "group-hover:shadow-md"
      }`}
    >
      <img
        src={product.image}
        alt={product.name}
        className={`w-full h-full object-cover transition-transform duration-500 ease-out ${
          !isOutOfStock && "group-hover:scale-105"
        }`}
      />

      {isOutOfStock && (
        <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
          <span className="px-4 py-2 bg-white/95 backdrop-blur-sm text-[#5C061D] text-xs sm:text-sm font-bold tracking-wide rounded-full shadow-md">
            Out of Stock
          </span>
        </div>
      )}

      {!isOutOfStock && (
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="px-3.5 py-1.5 bg-white/95 backdrop-blur-md text-[#5C061D] text-[10px] sm:text-xs font-semibold rounded-full shadow-md">
            Quick View
          </span>
        </div>
      )}
    </div>
      {/* Title & Pricing */}
      <div className="pt-2.5 pb-1 text-left space-y-0.5">
        <h3
          className={`text-xs sm:text-sm font-medium line-clamp-1 transition-colors ${
            isOutOfStock
              ? "text-[#888888]"
              : "text-[#1D1D1D] group-hover:text-[#5C061D]"
          }`}
        >
          {product.name}
        </h3>

        <div className="flex flex-wrap items-baseline gap-1.5 text-[11px] sm:text-xs">
          <span
            className={`font-bold ${
              isOutOfStock ? "text-[#888888]" : "text-[#5C061D]"
            }`}
          >
            Rs. {product.price.toLocaleString("en-IN")}.00
          </span>

          {product.originalPrice && (
            <span className="text-[#888888] line-through text-[10px] sm:text-xs">
              Rs. {product.originalPrice.toLocaleString("en-IN")}.00
            </span>
          )}
        </div>

        {/* Stock status */}
        {isOutOfStock && (
          <p className="text-[10px] sm:text-xs text-[#888888] pt-0.5">
            Currently unavailable
          </p>
        )}
      </div>

      {/* Add to Cart */}
      <div className="pt-1.5">
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full py-2.5 px-3 text-[11px] sm:text-xs font-bold tracking-wide rounded-[8px] sm:rounded-[10px] transition-all duration-200 shadow-xs ${
            isOutOfStock
              ? "bg-[#E5E2E0] text-[#999999] cursor-not-allowed"
              : isAdded
              ? "bg-green-700 text-white cursor-default"
              : "bg-[#5C061D] text-white hover:bg-[#7A0A28] active:scale-[0.98] cursor-pointer"
          }`}
        >
          {isOutOfStock
            ? "Out of Stock"
            : isAdded
            ? "Added to cart"
            : "Add to cart"}
        </button>
      </div>
    </div>
  );
};