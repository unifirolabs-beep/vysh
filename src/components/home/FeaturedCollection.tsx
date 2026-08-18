"use client";

import React, { useState, useEffect } from "react";
import { PRODUCTS, Product } from "@/data/products";
import { ProductCard } from "@/components/common/ProductCard";
import { getProductsAction } from "@/actions/products.actions";

interface FeaturedCollectionProps {
  onOpenQuickView?: (product: Product) => void;
  budgetFilter?: number | null;
  categoryFilter?: string | null;
  onClearCategoryFilter?: () => void;
}

export const FeaturedCollection: React.FC<FeaturedCollectionProps> = ({
  onOpenQuickView,
  budgetFilter,
  categoryFilter,
  onClearCategoryFilter,
}) => {
  const [dbProducts, setDbProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProductsAction().then((res) => {
      if (res.success && res.products) {
        setDbProducts(res.products as Product[]);
      }
    });
  }, []);

  // Merge database products with mock products, avoiding duplicates by name
  const mergedProducts = [
    ...dbProducts,
    ...PRODUCTS.filter(
      (mp) => !dbProducts.some((dp) => dp.name.toLowerCase() === mp.name.toLowerCase())
    ),
  ];

  // Filter products based on budget or category selection
  let filtered = mergedProducts;

  if (budgetFilter) {
    filtered = filtered.filter((p) => p.price <= budgetFilter);
  }

  if (categoryFilter) {
    filtered = filtered.filter(
      (p) => p.category.toLowerCase() === categoryFilter.toLowerCase()
    );
  }

  return (
    <section id="featured" className="py-8 sm:py-16 bg-[#FFF9F8]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        {/* Section Heading */}
        <div className="text-center mb-6 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#1D1D1D]">
            {categoryFilter ? `${categoryFilter} Collection` : "Featured Products"}
          </h2>

          {/* Active Category / Budget Filter Pill */}
          {(categoryFilter || budgetFilter) && (
            <div className="mt-3 flex items-center justify-center gap-2">
              {categoryFilter && (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#5C061D] text-white text-xs font-bold rounded-full shadow-xs">
                  <span>Category: {categoryFilter}</span>
                  {onClearCategoryFilter && (
                    <button
                      onClick={onClearCategoryFilter}
                      className="text-[#C9A227] hover:text-white underline ml-1 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              )}

              {budgetFilter && (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#5C061D] text-white text-xs font-bold rounded-full shadow-xs">
                  <span>Under ₹{budgetFilter}</span>
                  <button
                    onClick={() => window.location.reload()}
                    className="text-[#C9A227] hover:text-white underline ml-1 cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 2-Columns Grid on Mobile, 4-Columns on Desktop */}
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-[#F0E2DE] max-w-md mx-auto">
            <p className="text-sm text-[#6E5D57] font-medium">
              No products found in {categoryFilter || "this selection"}.
            </p>
            {onClearCategoryFilter && (
              <button
                onClick={onClearCategoryFilter}
                className="mt-3 px-4 py-2 bg-[#5C061D] text-white text-xs font-bold rounded-full"
              >
                View All Products
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {filtered.map((product) => (
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
  );
};
