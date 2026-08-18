"use client";

import React, { useState, useEffect } from "react";
import { PRODUCTS, Product } from "@/data/products";
import { useCartStore } from "@/store/useCartStore";
import { Star, ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { ProductCard } from "@/components/common/ProductCard";

interface BestSellersSliderProps {
  onOpenQuickView?: (product: Product) => void;
}

export const BestSellersSlider: React.FC<BestSellersSliderProps> = ({ onOpenQuickView }) => {
  const { addItem } = useCartStore();
  const bestSellers = PRODUCTS.filter((p) => p.isBestseller || (p.rating ?? 0) >= 4.9);
  const [startIndex, setStartIndex] = useState(0);

  const visibleCount = 4;

  const handleNext = () => {
    setStartIndex((prev) => (prev + 1) % (bestSellers.length - visibleCount + 1));
  };

  const handlePrev = () => {
    setStartIndex((prev) => (prev === 0 ? 0 : prev - 1));
  };

  const visibleItems = bestSellers.slice(startIndex, startIndex + visibleCount);

  return (
    <section id="bestsellers" className="py-20 bg-white border-b border-[#F0E2DE]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227]">
              CUSTOMER FAVORITES
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#5C061D] mt-1">
              Best Sellers
            </h2>
            <p className="text-sm text-[#6E5D57] mt-2">
              Our highest-rated pure silver Rakhis and royal jewellery pieces.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={startIndex === 0}
              className="p-3 rounded-full border border-[#E8D8D3] text-[#5C061D] hover:bg-[#FFF9F8] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              aria-label="Previous Products"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              disabled={startIndex >= bestSellers.length - visibleCount}
              className="p-3 rounded-full border border-[#E8D8D3] text-[#5C061D] hover:bg-[#FFF9F8] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              aria-label="Next Products"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Product Slider Items */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
          {visibleItems.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenQuickView={onOpenQuickView}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
