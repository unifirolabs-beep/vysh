"use client";

import React from "react";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import { PRODUCTS, Product } from "@/data/products";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Heart, Trash2, ShoppingBag, ArrowRight, Sparkles, Check } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface WishlistDrawerProps {
  onOpenQuickView?: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({ onOpenQuickView }) => {
  const router = useRouter();
  const { wishlistIds, isOpen, closeWishlist, removeFromWishlist, clearWishlist } =
    useWishlistStore();
  const { addItem, items: cartItems } = useCartStore();

  const wishlistedProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  const totalValue = wishlistedProducts.reduce((sum, p) => sum + p.price, 0);

  const handleAddToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    addItem(product, 1);
    toast.success(`Added "${product.name}" to cart!`, {
      icon: "🛍️",
    });
  };

  const handleMoveAllToCart = () => {
    if (wishlistedProducts.length === 0) return;
    wishlistedProducts.forEach((product) => {
      addItem(product, 1);
    });
    toast.success(`Moved all ${wishlistedProducts.length} items to your shopping cart!`, {
      icon: "🛍️",
    });
    closeWishlist();
    useCartStore.getState().openCart();
  };

  const handleRemoveItem = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    removeFromWishlist(product.id);
    toast("Removed from Wishlist", { icon: "💔" });
  };

  return (
    <Sheet open={isOpen} onOpenChange={closeWishlist}>
      <SheetContent className="w-full sm:max-w-[440px] bg-[#FFF9F8] p-0 flex flex-col border-l border-[#E8D8D3]">
        {/* Drawer Header */}
        <SheetHeader className="p-6 bg-[#5C061D] text-white border-b border-[#7A0A28]">
          <SheetTitle className="text-xl font-serif text-[#C9A227] flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Heart className="w-5 h-5 fill-[#C9A227] text-[#C9A227]" />
              Your Wishlist
            </span>
            <span className="text-xs font-mono font-normal text-white/80 bg-[#7A0A28] px-2.5 py-1 rounded-full">
              {wishlistedProducts.length} {wishlistedProducts.length === 1 ? "Item" : "Items"}
            </span>
          </SheetTitle>
        </SheetHeader>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {wishlistedProducts.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-20 h-20 rounded-full bg-[#5C061D]/10 flex items-center justify-center mx-auto">
                <Heart className="w-10 h-10 text-[#5C061D] opacity-60" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#5C061D]">
                Your Wishlist is Empty
              </h3>
              <p className="text-xs text-[#6E5D57] max-w-xs mx-auto">
                Explore our pure 925 silver collection and save your favorite Rakhis & jewelry to view them later.
              </p>
              <button
                onClick={closeWishlist}
                className="mt-2 px-6 py-2.5 bg-[#5C061D] text-white text-xs font-bold rounded-xl hover:bg-[#7A0A28] transition-colors shadow-md"
              >
                Explore Collections
              </button>
            </div>
          ) : (
            wishlistedProducts.map((product) => {
              const isInCart = cartItems.some((ci) => ci.product.id === product.id);

              return (
                <div
                  key={product.id}
                  onClick={() => {
                    closeWishlist();
                    if (onOpenQuickView) onOpenQuickView(product);
                  }}
                  className="p-4 bg-white rounded-2xl border border-[#F0E2DE] shadow-xs flex gap-4 relative group hover:border-[#C9A227] transition-all cursor-pointer"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-xl border border-[#E8D8D3] flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] font-semibold text-[#C9A227] uppercase tracking-wider">
                          {product.category}
                        </span>
                        <button
                          onClick={(e) => handleRemoveItem(product, e)}
                          className="text-[#888888] hover:text-[#A3183F] p-1 transition-colors"
                          title="Remove from wishlist"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <h4 className="text-sm font-semibold text-[#1D1D1D] truncate group-hover:text-[#5C061D] transition-colors">
                        {product.name}
                      </h4>

                      <p className="text-[11px] text-[#6E5D57] font-medium">
                        925 Pure Silver
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F5EBE6]">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-bold text-[#5C061D]">
                          Rs. {product.price.toLocaleString("en-IN")}
                        </span>
                        {product.originalPrice && (
                          <span className="text-[11px] text-[#888888] line-through">
                            Rs. {product.originalPrice.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors ${
                          isInCart
                            ? "bg-green-100 text-green-800 border border-green-300"
                            : "bg-[#5C061D] text-white hover:bg-[#7A0A28]"
                        }`}
                      >
                        {isInCart ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>In Cart</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5 text-[#C9A227]" />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions & Summary */}
        {wishlistedProducts.length > 0 && (
          <div className="p-6 bg-white border-t border-[#E8D8D3] space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#6E5D57] font-medium">Wishlist Total Value:</span>
              <span className="font-bold text-[#5C061D] text-base">
                Rs. {totalValue.toLocaleString("en-IN")}.00
              </span>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleMoveAllToCart}
                className="w-full py-3 bg-[#5C061D] text-white text-xs font-bold tracking-wide rounded-xl hover:bg-[#7A0A28] transition-all shadow-md flex items-center justify-center gap-2 border border-[#C9A227]/40 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#C9A227]" />
                <span>Move All Items to Cart</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => {
                  clearWishlist();
                  toast("Cleared all items from wishlist", { icon: "🧹" });
                }}
                className="w-full py-2 text-center text-xs font-semibold text-[#888888] hover:text-[#A3183F] transition-colors cursor-pointer"
              >
                Clear Wishlist
              </button>
            </div>

            <div className="pt-2 text-center">
              <p className="text-[10px] text-[#6E5D57] flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3 text-[#C9A227]" /> 925 Hallmark Certified
                Silver items reserved for you
              </p>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
