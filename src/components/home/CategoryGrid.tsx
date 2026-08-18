"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CategoryGridProps {
  selectedCategory?: string | null;
  onSelectCategory?: (categoryName: string | null) => void;
}

export const CATEGORIES_LIST = [
  {
    id: "rakhis",
    name: "Rakhis",
    badge: "Special",
    image: "/category-cards/rakhi.png",
  },
  {
    id: "necklaces",
    name: "Necklaces",
    badge: "",
    image: "/category-cards/necklaces.png",
  },
  {
    id: "earrings",
    name: "Earrings",
    badge: "",
    image: "/category-cards/earrings.png",
  },
  {
    id: "rings",
    name: "Rings",
    badge: "",
    image: "/category-cards/rings.png",
  },
  {
    id: "pendants",
    name: "Pendants",
    badge: "",
    image: "/category-cards/pendants.png",
  },
  {
    id: "bangles",
    name: "Bangles",
    badge: "",
    image: "/category-cards/bangles.png",
  },
  {
    id: "bracelets",
    name: "Bracelets",
    badge: "",
    image: "/category-cards/bracelets.png",
  },
  {
    id: "anklets",
    name: "Anklets",
    badge: "",
    image: "/category-cards/anklets.png",
  },
];

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -350 : 350;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleCategoryClick = (catName: string) => {
    if (onSelectCategory) {
      if (selectedCategory === catName) {
        onSelectCategory(null);
      } else {
        onSelectCategory(catName);
      }
    }
    const element = document.getElementById("featured");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="categories" className="py-8 sm:py-14 bg-[#FFF9F8] relative group">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 relative">
        
        {/* Desktop Left Scroll Arrow Button */}
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex absolute -left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white text-[#5C061D] shadow-lg border border-[#F0E2DE] items-center justify-center hover:bg-[#5C061D] hover:text-white transition-all duration-300 z-20 focus:outline-none"
          aria-label="Scroll Left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Desktop Right Scroll Arrow Button */}
        <button
          onClick={() => scroll("right")}
          className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white text-[#5C061D] shadow-lg border border-[#F0E2DE] items-center justify-center hover:bg-[#5C061D] hover:text-white transition-all duration-300 z-20 focus:outline-none"
          aria-label="Scroll Right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* ALL 14 CATEGORIES IN A SINGLE HORIZONTAL SCROLLABLE ROW ON DESKTOP & MOBILE */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-3.5 sm:gap-5 pb-4 scrollbar-none snap-x snap-mandatory scroll-smooth"
        >
          {CATEGORIES_LIST.map((cat) => {
            const isSelected = selectedCategory?.toLowerCase() === cat.name.toLowerCase();

            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.name)}
                className="flex-shrink-0 w-[125px] sm:w-[155px] group flex flex-col items-center cursor-pointer snap-start"
              >
                {/* Card Container with Website Theme Royal Burgundy (#5C061D) Background */}
                <div
                  className={`relative w-full aspect-square rounded-[22px] overflow-hidden bg-gradient-to-br from-[#5C061D] via-[#6D0822] to-[#7A0A28] shadow-md transition-all duration-300 flex items-center justify-center p-1.5 ${
                    isSelected
                      ? "border-2 border-[#C9A227] ring-4 ring-[#C9A227]/30 scale-[1.05]"
                      : "border border-[#C9A227]/30 hover:border-[#C9A227] hover:scale-[1.03]"
                  }`}
                >
                  {/* Centered Category Image inside Website Theme Card */}
                  <div className="relative w-full h-full rounded-[18px] overflow-hidden flex items-center justify-center">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Special Tag Badge */}
                  {cat.badge === "Special" && (
                    <div className="absolute top-2 left-2 bg-[#7FD3C4] text-[#004D40] text-[9px] sm:text-xs font-bold px-2 py-0.5 rounded-md shadow-xs z-10">
                      {cat.badge}
                    </div>
                  )}

                  {/* Just Dropped Overlay */}
                  {cat.badge === "Just Dropped" && (
                    <div className="absolute inset-0 bg-[#5C061D]/40 backdrop-blur-[1px] flex flex-col items-center justify-center text-center p-1 z-10">
                      <span className="text-white font-serif font-bold text-xs sm:text-sm leading-tight drop-shadow-md">
                        Just
                      </span>
                      <span className="text-[#C9A227] font-serif font-bold text-xs sm:text-sm leading-tight drop-shadow-md">
                        Dropped
                      </span>
                    </div>
                  )}
                </div>

                {/* Category Name Below Card */}
                <span
                  className={`mt-2.5 text-xs sm:text-sm font-semibold transition-colors text-center ${
                    isSelected ? "text-[#5C061D] font-bold" : "text-[#1D1D1D] group-hover:text-[#5C061D]"
                  }`}
                >
                  {cat.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
