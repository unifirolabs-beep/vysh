"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, Sparkles } from "lucide-react";

const NAV_ITEMS = [
  { label: "New Arrival", href: "#featured", badge: "NEW" },
  { label: "Rakhi", href: "#categories" },
  { label: "Customized Rakhi", href: "#personalized", badge: "HOT" },
  { label: "Bracelets", href: "#categories" },
  { label: "Rings", href: "#categories" },
  { label: "Necklaces", href: "#categories" },
  { label: "Gift Hampers", href: "#bestsellers" },
  { label: "More", href: "#footer" },
];

export const Navbar: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Rakhi");

  return (
    <nav className="bg-white border-b border-[#F0E2DE] shadow-xs hidden md:block z-30 relative">
      <div className="max-w-[1440px] mx-auto px-8">
        <ul className="flex items-center justify-center gap-8 py-3">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.label;
            return (
              <li key={item.label} className="relative group">
                <Link
                  href={item.href}
                  onClick={() => setActiveTab(item.label)}
                  className={`flex items-center gap-1.5 text-xs lg:text-sm font-medium tracking-wide uppercase py-1.5 transition-colors duration-200 ${
                    isActive ? "text-[#5C061D] font-bold" : "text-[#1D1D1D]/80 hover:text-[#5C061D]"
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#5C061D] text-[#C9A227] tracking-wider leading-none shadow-xs">
                      {item.badge}
                    </span>
                  )}
                  {item.label === "More" && <ChevronDown className="w-3.5 h-3.5 text-[#6E5D57]" />}
                </Link>

                {/* Animated Bottom Burgundy Underline */}
                <span
                  className={`absolute bottom-0 left-0 w-full h-[2.5px] bg-[#5C061D] rounded-full transition-all duration-300 transform origin-left ${
                    isActive ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100"
                  }`}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};
