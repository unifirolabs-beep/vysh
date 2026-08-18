"use client";

import React, { useState } from "react";
import { CollectionMeta } from "@/data/collections";
import { Product } from "@/data/products";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";

import { ProductCard } from "@/components/common/ProductCard";

interface CollectionPageProps {
  collection: CollectionMeta;
  initialDbProducts?: Product[];
  onOpenQuickView?: (product: Product) => void;
}

export const CollectionPage: React.FC<CollectionPageProps> = ({
  collection,
  initialDbProducts = [],
  onOpenQuickView,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const products = initialDbProducts;

  return (
    <div className="min-h-screen bg-[#FFF9F8]">

      {/* ─── 1. HERO BANNER ─────────────────────────────────────────────────── */}
      <section className="w-full px-3 sm:px-5 lg:px-8 pt-3 sm:pt-4">
        <div className="relative w-full h-[200px] sm:h-[340px] lg:h-[480px] rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] overflow-hidden shadow-md">
          <img
            src={collection.bannerImage}
            alt={`${collection.title} collection banner`}
            className="w-full h-full object-cover object-center"
          />

          {/* Conditional left-side text overlay — only renders when collection has textOverlay */}
          {collection.textOverlay && (
            <>
              {/* Gradient: strong on left, transparent on right */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#5C061D]/80 via-[#5C061D]/40 to-transparent" />

              {/* Text content */}
              <div className="absolute inset-0 flex flex-col justify-center px-5 sm:px-10 lg:px-16 space-y-2 sm:space-y-3 max-w-[55%] sm:max-w-[50%]">
                {/* Badge pill */}
                <span className="inline-flex w-fit items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A227] text-[#5C061D] text-[9px] sm:text-[11px] font-extrabold uppercase tracking-widest shadow-md">
                  {collection.textOverlay.badge}
                </span>

                {/* Headline — newlines become line breaks */}
                <h1 className="text-xl sm:text-3xl lg:text-5xl font-serif font-bold text-white leading-tight drop-shadow-lg whitespace-pre-line">
                  {collection.textOverlay.headline}
                </h1>

                {/* Subline */}
                <p className="text-[10px] sm:text-sm lg:text-base text-white/90 leading-relaxed drop-shadow-md whitespace-pre-line">
                  {collection.textOverlay.subline}
                </p>

                {/* CTA button */}
                {collection.textOverlay.cta && (
                  <div className="pt-1">
                    <span className="inline-flex items-center gap-2 px-4 sm:px-6 py-1.5 sm:py-2.5 bg-[#C9A227] text-[#5C061D] text-[10px] sm:text-xs font-extrabold uppercase tracking-widest rounded-full shadow-lg hover:bg-[#E5C358] transition-colors cursor-pointer">
                      {collection.textOverlay.cta} →
                    </span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ─── 2. PRODUCT GRID ────────────────────────────────────────────────── */}
      <section className="py-10 sm:py-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
          {/* Section heading */}
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#C9A227] mb-2">
              {collection.title}
            </p>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#1D1D1D]">
              {collection.categoryName} Collection
            </h2>
            <p className="mt-2 text-sm text-[#6E5D57]">
              {products.length} products in 925 Pure Sterling Silver
            </p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#F0E2DE]">
              <p className="text-sm text-[#6E5D57]">
                No products yet in this collection. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenQuickView={onOpenQuickView}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── 3. COLLECTION INFO ─────────────────────────────────────────────── */}
      <section className="py-10 sm:py-16 bg-white border-t border-[#F0E2DE]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1D1D1D]">
              {collection.info.heading}
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#6E5D57] leading-relaxed">
              {collection.info.about}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Styling Tips */}
            <div className="bg-[#FFF9F8] rounded-2xl border border-[#F0E2DE] p-6">
              <h3 className="text-sm font-serif font-bold text-[#5C061D] uppercase tracking-wider mb-4">
                ✨ Styling Tips
              </h3>
              <ul className="space-y-2">
                {collection.info.stylingTips.map((tip, i) => (
                  <li key={i} className="flex gap-2 text-xs sm:text-sm text-[#1D1D1D]">
                    <span className="text-[#C9A227] font-bold shrink-0">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Care Instructions */}
            <div className="bg-[#FFF9F8] rounded-2xl border border-[#F0E2DE] p-6">
              <h3 className="text-sm font-serif font-bold text-[#5C061D] uppercase tracking-wider mb-4">
                🌿 Care Instructions
              </h3>
              <ul className="space-y-2">
                {collection.info.careInstructions.map((care, i) => (
                  <li key={i} className="flex gap-2 text-xs sm:text-sm text-[#1D1D1D]">
                    <span className="text-[#C9A227] font-bold shrink-0">•</span>
                    <span>{care}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="max-w-3xl mx-auto mt-10">
            <h3 className="text-lg sm:text-xl font-serif font-bold text-[#1D1D1D] mb-5 text-center">
              Frequently Asked Questions
            </h3>
            <div className="space-y-3">
              {collection.info.faqs.map((faq, i) => (
                <div
                  key={i}
                  className="border border-[#F0E2DE] rounded-xl overflow-hidden bg-white"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-semibold text-[#1D1D1D] hover:bg-[#FFF9F8] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#5C061D] shrink-0 ml-3 transition-transform duration-200 ${
                        openFaq === i ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-4 text-xs sm:text-sm text-[#6E5D57] leading-relaxed border-t border-[#F0E2DE] pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. GALLERY ─────────────────────────────────────────────────────── */}
      {collection.galleryImages.length > 0 && (
        <section className="py-10 sm:py-16 bg-[#FFF9F8] border-t border-[#F0E2DE]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
            <div className="text-center mb-8">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#C9A227] mb-2">
                Gallery
              </p>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1D1D1D]">
                {collection.categoryName} in Real Life
              </h2>
            </div>
            <div className={`grid gap-4 ${
              collection.galleryImages.length === 3
                ? "grid-cols-3"
                : collection.galleryImages.length === 4
                ? "grid-cols-2 sm:grid-cols-4"
                : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
            }`}>
              {collection.galleryImages.map((img, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-[16px] overflow-hidden bg-white border border-[#F0E2DE] shadow-xs hover:shadow-md transition-shadow"
                >
                  <img
                    src={img}
                    alt={`${collection.categoryName} gallery ${i + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
