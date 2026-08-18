"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/home/Hero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ShopByBudget } from "@/components/home/ShopByBudget";
import { FeaturedCollection } from "@/components/home/FeaturedCollection";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { CustomerReviews } from "@/components/home/CustomerReviews";
import { Newsletter } from "@/components/home/Newsletter";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { QuickViewModal } from "@/components/product/QuickViewModal";
import { Product } from "@/data/products";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";

export default function Home() {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [budgetFilter, setBudgetFilter] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleOpenQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  const handleCloseQuickView = () => {
    setQuickViewProduct(null);
  };

  const handleSelectBudget = (maxPrice: number) => {
    setBudgetFilter(maxPrice);
    const element = document.getElementById("featured");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelectCategory = (categoryName: string | null) => {
    setSelectedCategory(categoryName);
  };

  const handleClearCategoryFilter = () => {
    setSelectedCategory(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F8] selection:bg-[#5C061D] selection:text-[#C9A227]">

      <AnnouncementBar />

      {/* 2. Unified Header & Navigation Bar */}
      <Header onOpenQuickView={handleOpenQuickView} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 3. Luxury Swiper Hero Carousel */}
        <Hero />

        {/* 4. Single Row Category Carousel (Desktop & Mobile) */}
        <CategoryGrid
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />

        {/* 5. Shop By Budget */}
        <ShopByBudget onSelectBudget={handleSelectBudget} />

        {/* 6. Featured Collection with Dynamic Category Filtering */}
        <FeaturedCollection
          onOpenQuickView={handleOpenQuickView}
          budgetFilter={budgetFilter}
          categoryFilter={selectedCategory}
          onClearCategoryFilter={handleClearCategoryFilter}
        />

        {/* 7. Why Choose Us */}
        <WhyChooseUs />

        {/* 8. Customer Reviews */}
        <CustomerReviews />

        {/* 9. Newsletter */}
        <Newsletter />
      </main>

      {/* 10. Footer */}
      <Footer />

      {/* Interactive Global Drawers & Modals */}
      <CartDrawer />
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={handleCloseQuickView}
      />
    </div>
  );
}
