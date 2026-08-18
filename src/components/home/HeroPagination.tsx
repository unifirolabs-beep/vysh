"use client";

import React from "react";

interface HeroPaginationProps {
  total: number;
  activeIndex: number;
  onSelect: (index: number) => void;
}

export const HeroPagination: React.FC<HeroPaginationProps> = ({
  total,
  activeIndex,
  onSelect,
}) => {
  return (
    <div className="absolute bottom-2.5 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2.5 z-30 pointer-events-auto">
      {Array.from({ length: total }).map((_, index) => {
        const isActive = activeIndex === index;
        return (
          <button
            key={index}
            onClick={() => onSelect(index)}
            className={`h-1.5 sm:h-3 rounded-full transition-all duration-300 cursor-pointer focus:outline-none ${
              isActive
                ? "w-6 sm:w-10 bg-[#5C061D] border sm:border-2 border-white shadow-sm"
                : "w-1.5 sm:w-3 bg-white/70 hover:bg-white border border-black/20"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        );
      })}
    </div>
  );
};
