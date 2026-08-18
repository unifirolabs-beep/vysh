"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeroNavigationProps {
  onPrev: () => void;
  onNext: () => void;
}

export const HeroNavigation: React.FC<HeroNavigationProps> = ({ onPrev, onNext }) => {
  return (
    <>
      {/* Left Arrow Button (Hidden on Mobile, Visible on Tablet/Desktop) */}
      <button
        onClick={onPrev}
        className="hero-prev-btn hidden md:flex absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/90 text-[#5C061D] shadow-lg items-center justify-center hover:bg-[#5C061D] hover:text-white transition-all duration-300 z-30 cursor-pointer group focus:outline-none backdrop-blur-xs"
        aria-label="Previous Banner"
      >
        <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6 transition-transform group-hover:-translate-x-0.5" />
      </button>

      {/* Right Arrow Button (Hidden on Mobile, Visible on Tablet/Desktop) */}
      <button
        onClick={onNext}
        className="hero-next-btn hidden md:flex absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/90 text-[#5C061D] shadow-lg items-center justify-center hover:bg-[#5C061D] hover:text-white transition-all duration-300 z-30 cursor-pointer group focus:outline-none backdrop-blur-xs"
        aria-label="Next Banner"
      >
        <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6 transition-transform group-hover:translate-x-0.5" />
      </button>
    </>
  );
};
