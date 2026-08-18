"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { QuickViewModal } from "@/components/product/QuickViewModal";
import { CollectionPage } from "@/components/collection/CollectionPage";
import { Product } from "@/data/products";
import { CollectionMeta } from "@/data/collections";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";

interface Props {
  collection: CollectionMeta;
  initialDbProducts: Product[];
}

export function CollectionSlugClient({ collection, initialDbProducts }: Props) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const handleOpenQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  const handleCloseQuickView = () => {
    setQuickViewProduct(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F8] selection:bg-[#5C061D] selection:text-[#C9A227]">
      <AnnouncementBar />
      <Header onOpenQuickView={handleOpenQuickView} />
      
      <main className="flex-1">
        <CollectionPage
          collection={collection}
          initialDbProducts={initialDbProducts}
          onOpenQuickView={handleOpenQuickView}
        />
      </main>

      <Footer />
      <CartDrawer />
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={handleCloseQuickView}
      />
    </div>
  );
}
