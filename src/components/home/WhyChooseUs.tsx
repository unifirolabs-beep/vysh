"use client";

import React from "react";
import { ShieldCheck, Award, Truck, RefreshCw } from "lucide-react";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "925 Pure Silver",
    description: "Every piece comes with BIS Hallmark & Authenticity Certificate.",
  },
  {
    icon: Award,
    title: "Handcrafted Luxury",
    description: "Meticulously hand-enameled by master artisans in Rajasthan.",
  },
  {
    icon: Truck,
    title: "Free Express Delivery",
    description: "Insured door-to-door delivery across India on orders above ₹999.",
  },
  {
    icon: RefreshCw,
    title: "Easy 15-Day Returns",
    description: "100% money-back guarantee or instant size exchange.",
  },
];

export const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-16 bg-[#FFF9F8] border-b border-[#F0E2DE]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 bg-white rounded-2xl border border-[#F0E2DE] hover:border-[#C9A227] hover:shadow-luxury transition-all duration-300 flex flex-col items-center text-center group"
              >
                {/* Gold Outlined Icon Box */}
                <div className="w-14 h-14 rounded-full border-2 border-[#C9A227] bg-[#FFF9F8] flex items-center justify-center mb-4 group-hover:bg-[#5C061D] transition-colors duration-300">
                  <Icon className="w-7 h-7 text-[#C9A227] group-hover:scale-110 transition-transform" />
                </div>

                <h3 className="text-lg font-serif font-bold text-[#5C061D] mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-[#6E5D57] leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
