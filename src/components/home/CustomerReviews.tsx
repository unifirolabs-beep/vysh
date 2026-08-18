"use client";

import React from "react";
import { REVIEWS } from "@/data/products";
import { Star, CheckCircle, Quote } from "lucide-react";

export const CustomerReviews: React.FC = () => {
  return (
    <section className="py-20 bg-white border-b border-[#F0E2DE]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227]">
            REAL SIBLING STORIES
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#5C061D] mt-2">
            Loved By Thousands
          </h2>

          {/* Aggregate Rating Score */}
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="flex text-[#C9A227]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current text-[#C9A227]" />
              ))}
            </div>
            <span className="text-xl font-serif font-bold text-[#1D1D1D]">
              4.9 / 5.0
            </span>
            <span className="text-xs text-[#6E5D57]">
              (Over 12,500+ Verified Orders)
            </span>
          </div>
        </div>

        {/* Reviews Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="p-8 bg-[#FFF9F8] rounded-[24px] border border-[#F0E2DE] shadow-sm hover:shadow-luxury hover:-translate-y-1 transition-all duration-300 relative flex flex-col justify-between"
            >
              <Quote className="w-10 h-10 text-[#C9A227]/20 absolute top-6 right-6 pointer-events-none" />

              <div>
                {/* Rating Stars */}
                <div className="flex text-[#C9A227] mb-4">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current text-[#C9A227]" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-sm text-[#1D1D1D] leading-relaxed italic mb-6">
                  &quot;{rev.comment}&quot;
                </p>
              </div>

              {/* User Profile Footer */}
              <div className="pt-4 border-t border-[#E8D8D3] flex items-center gap-3">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#C9A227]"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-[#5C061D]">
                      {rev.name}
                    </h4>
                    {rev.verified && (
                      <CheckCircle className="w-4 h-4 text-[#C9A227] fill-[#C9A227]/10" />
                    )}
                  </div>
                  <p className="text-xs text-[#6E5D57]">{rev.location} • {rev.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
