"use client";

import React, { useState } from "react";
import Link from "next/link";
import { VyshLogo } from "@/components/common/VyshLogo";
import { AuthModal } from "@/components/auth/AuthModal";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { WishlistDrawer } from "@/components/wishlist/WishlistDrawer";
import { PRODUCTS, Product } from "@/data/products";
import {
  Menu,
  Search,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface HeaderProps {
  onOpenQuickView?: (product: Product) => void;
}

const categories = [
  {
    name: "Rakhi",
    href: "/collections/rakhis",
  },
  {
    name: "Necklaces",
    href: "/collections/necklaces",
  },
  {
    name: "Earrings",
    href: "/collections/earrings",
  },
  {
    name: "Rings",
    href: "/collections/rings",
  },
  {
    name: "Pendants",
    href: "/collections/pendants",
  },
  {
    name: "Bangles",
    href: "/collections/bangles",
  },
  {
    name: "Bracelets",
    href: "/collections/bracelets",
  },
  {
    name: "Anklets",
    href: "/collections/anklets",
  },
];

export const Header: React.FC<HeaderProps> = ({ onOpenQuickView }) => {
  const { openCart, getItemCount } = useCartStore();
  const { getWishlistCount, openWishlist } = useWishlistStore();
  const cartCount = getItemCount();
  const wishlistCount = getWishlistCount();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const filteredProducts = searchQuery.trim()
    ? PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.material ?? "").toLowerCase().includes(searchQuery.toLowerCase())
    )
    : [];

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-[#F0E2DE] shadow-xs py-2 sm:py-3 lg:py-4 transition-all duration-300">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">

          {/* 1. Left: Mobile Hamburger Menu (visible lg:hidden) + Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <button
                  className="lg:hidden p-1.5 text-[#1D1D1D] hover:text-[#5C061D] focus:outline-none"
                  aria-label="Open Navigation Menu"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[350px] bg-[#FFF9F8] border-[#F0E2DE] p-0 flex flex-col">
                <SheetHeader className="p-4 bg-[#5C061D] text-white border-b border-[#7A0A28] flex flex-row items-center justify-between">
                  <SheetTitle className="text-white font-serif text-lg font-bold">
                    Menu
                  </SheetTitle>
                </SheetHeader>
                <div className="p-4 space-y-4 overflow-y-auto flex-1 text-left">
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <Link
                      key={category.name}
                      href={category.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-2.5 px-3 text-sm font-semibold text-[#1D1D1D] hover:bg-[#5C061D]/10 hover:text-[#5C061D] rounded-xl transition-colors"
                    >
                      {category.name}
                    </Link>
                    ))}

                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <VyshLogo size="lg" />
          </div>

          {/* 2. Center: Desktop Navigation Menu Links & Interactive Dropdowns */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7">
            
            {categories.map((category) => (
              <Link
              key={category.name}
              href={category.href}
              className="text-sm font-semibold text-[#1D1D1D] hover:text-[#5C061D] transition-colors relative group py-1"
            >
              <span>{category.name}</span>
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#5C061D] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 transform origin-left rounded-full" />
            </Link>
            ))}
          </nav>

          {/* 3. Right: Sleek Minimal Utility Icons */}
          <div className="flex items-center gap-1.5 sm:gap-4">

            {/* Shopping Cart Icon with Badge Counter */}
            <button
              onClick={openCart}
              className="p-1.5 sm:p-2 text-[#1D1D1D] hover:text-[#5C061D] relative transition-colors group flex items-center gap-1"
              aria-label="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 h-4 w-4 rounded-full bg-[#5C061D] text-[#C9A227] text-[10px] font-extrabold flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Search Dialog */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 bg-[#FFF9F8] border-[#E8D8D3] rounded-2xl overflow-hidden">
          <DialogHeader className="p-4 bg-[#5C061D] text-white border-b border-[#7A0A28]">
            <DialogTitle className="flex items-center gap-2 text-lg font-serif text-[#C9A227]">
              <Search className="w-5 h-5 text-[#C9A227]" />
              <span>Search 925 Sterling Silver Collection</span>
            </DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <input
              type="text"
              placeholder="Type Rakhi name, material (e.g. 925 Silver), category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#E8D8D3] rounded-xl text-sm focus:outline-none focus:border-[#C9A227] shadow-sm text-[#1D1D1D]"
              autoFocus
            />

            <div className="mt-4 max-h-[350px] overflow-y-auto space-y-2">
              {searchQuery.trim() === "" ? (
                <div className="text-center py-6 text-xs text-[#6E5D57]">
                  <Sparkles className="w-6 h-6 text-[#C9A227] mx-auto mb-2 opacity-60" />
                  <p>Popular searches: 925 Pure Silver Rakhi, Bhaiya Bhabhi Set, Customized Photo Rakhi</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <p className="text-center py-6 text-sm text-[#6E5D57]">
                  No items match &quot;{searchQuery}&quot;.
                </p>
              ) : (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      if (onOpenQuickView) onOpenQuickView(product);
                    }}
                    className="flex items-center gap-3 p-2.5 hover:bg-white rounded-xl cursor-pointer transition-colors border border-transparent hover:border-[#E8D8D3]"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1D1D1D] truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-[#6E5D57]">{product.category}</p>
                    </div>
                    <span className="text-sm font-bold text-[#5C061D]">
                      Rs. {product.price.toLocaleString("en-IN")}.00
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Global Auth Modal & Wishlist Drawer */}
      <AuthModal />
      <WishlistDrawer onOpenQuickView={onOpenQuickView} />
    </>
  );
};
