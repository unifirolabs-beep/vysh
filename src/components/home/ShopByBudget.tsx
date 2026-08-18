"use client";

import React from "react";

interface ShopByBudgetProps {
  onSelectBudget?: (maxPrice: number) => void;
}

const BUDGET_TIERS = [
  { label: "UNDER", price: 1499, displayPrice: "₹1499" },
  { label: "UNDER", price: 2499, displayPrice: "₹2499" },
  { label: "UNDER", price: 4999, displayPrice: "₹4999" },
  { label: "UNDER", price: 7999, displayPrice: "₹7999" },
];

export const ShopByBudget: React.FC<ShopByBudgetProps> = ({ onSelectBudget }) => {
  return (
    <section className="py-8 sm:py-12 bg-[#FFF9F8]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        {/* Section Heading (Reference Screenshots Style) */}
        <div className="text-center mb-6 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1D1D1D]">
            Shop by Budget
          </h2>
        </div>

        {/* Horizontal Scroll Cards on Mobile, Grid on Tablet/Desktop (Reference Screenshots Style) */}
        <div className="flex overflow-x-auto sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6 pb-2 scrollbar-none snap-x snap-mandatory">
          {BUDGET_TIERS.map((tier) => (
            <div
              key={tier.price}
              onClick={() => onSelectBudget && onSelectBudget(tier.price)}
              className="flex-shrink-0 w-[140px] sm:w-auto bg-gradient-to-br from-[#5C061D] via-[#6D0822] to-[#7A0A28] border border-[#C9A227]/30 rounded-[20px] p-5 sm:p-7 text-white text-center cursor-pointer hover:scale-[1.03] hover:border-[#C9A227] transition-all duration-300 shadow-md hover:shadow-xl flex flex-col justify-center items-center snap-start group"
            >
              <span className="text-[10px] sm:text-xs font-semibold tracking-widest text-[#E5C358] uppercase">
                {tier.label}
              </span>
              <span className="text-2xl sm:text-3xl font-bold font-sans mt-1 group-hover:text-[#C9A227] transition-colors">
                {tier.displayPrice}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
