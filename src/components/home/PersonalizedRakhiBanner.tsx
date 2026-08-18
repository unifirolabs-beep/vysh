"use client";

import React, { useState } from "react";
import { PRODUCTS } from "@/data/products";
import { useCartStore } from "@/store/useCartStore";
import { Upload, Sparkles, Wand2, Check, Heart, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export const PersonalizedRakhiBanner: React.FC = () => {
  const { addItem } = useCartStore();
  const [customName, setCustomName] = useState("VIRAAG");
  const [customMessage, setCustomMessage] = useState("Best Brother Ever ❤️");
  const [previewPhoto, setPreviewPhoto] = useState<string>(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop"
  );

  const customProduct = PRODUCTS.find((p) => p.id === "prod-2") || PRODUCTS[1];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewPhoto(url);
      toast.success("Photo uploaded successfully!");
    }
  };

  const handleAddCustomToCart = () => {
    addItem(customProduct, 1, {
      name: customName,
      message: customMessage,
      photoUrl: previewPhoto,
    });
    toast.success(`Customized Rakhi for "${customName}" added to cart!`, {
      description: `₹${customProduct.price} • Engraved Metallic Frame`,
      icon: "✨",
    });
  };

  return (
    <section id="personalized" className="py-20 bg-[#FFF9F8] border-b border-[#F0E2DE] relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="bg-gradient-to-r from-[#5C061D] via-[#7A0A28] to-[#3D0312] rounded-[32px] overflow-hidden shadow-2xl border-2 border-[#C9A227]/40 text-white p-6 sm:p-12 relative">
          
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A227]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Interactive Customizer Controls */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C9A227]/20 border border-[#C9A227]/50 text-[#C9A227] text-xs font-bold uppercase tracking-wider">
                <Wand2 className="w-3.5 h-3.5" />
                <span>LIVE CUSTOM RAKHI STUDIO</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-serif font-bold leading-tight">
                Create Your Personalized Sibling Keepsake
              </h2>

              <p className="text-sm text-white/80 leading-relaxed font-medium">
                Upload your favorite photo, engrave your brother&apos;s name, and add a custom love note on high-grade 18K gold polished metal with silk thread.
              </p>

              {/* Form Controls */}
              <div className="space-y-4 pt-2">
                {/* 1. Name Input */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#C9A227] mb-1.5">
                    1. Brother&apos;s Name / Initial
                  </label>
                  <input
                    type="text"
                    maxLength={15}
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Enter Brother's Name"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#C9A227]"
                  />
                </div>

                {/* 2. Custom Message */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#C9A227] mb-1.5">
                    2. Personalized Message
                  </label>
                  <input
                    type="text"
                    maxLength={40}
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Enter short gift card message"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#C9A227]"
                  />
                </div>

                {/* 3. Upload Photo */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#C9A227] mb-1.5">
                    3. Upload Sibling Memory Photo
                  </label>
                  <label className="w-full py-3 px-4 bg-white/10 border border-dashed border-[#C9A227]/60 rounded-xl flex items-center justify-center gap-2 cursor-pointer hover:bg-white/15 transition-colors text-xs font-semibold text-white">
                    <Upload className="w-4 h-4 text-[#C9A227]" />
                    <span>Choose Photo from Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 flex items-center gap-4">
                <button
                  onClick={handleAddCustomToCart}
                  className="px-8 py-4 bg-[#C9A227] text-[#5C061D] font-bold text-sm tracking-wide rounded-[12px] hover:bg-[#E5C358] transition-all shadow-lg flex items-center gap-2 group"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Create Your Rakhi (₹{customProduct.price})</span>
                </button>
              </div>
            </div>

            {/* Right Real-time Visual Preview Card */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center">
              <div className="relative w-full max-w-[420px] bg-white text-[#1D1D1D] rounded-[28px] p-6 shadow-2xl border-4 border-[#C9A227]/40">
                <div className="text-center pb-3 border-b border-[#F0E2DE]">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#5C061D]">
                    REAL-TIME PREVIEW
                  </span>
                  <h4 className="text-sm font-serif font-bold text-[#5C061D]">
                    Customized Photo & Engraving Frame
                  </h4>
                </div>

                {/* Simulated Medallion */}
                <div className="my-6 relative flex flex-col items-center justify-center">
                  {/* Left Silk Thread */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-16 h-2 bg-gradient-to-r from-[#5C061D] via-[#C9A227] to-[#5C061D] rounded-full shadow-xs" />
                  {/* Right Silk Thread */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-2 bg-gradient-to-r from-[#5C061D] via-[#C9A227] to-[#5C061D] rounded-full shadow-xs" />

                  {/* Circular Gold Medallion */}
                  <div className="w-40 h-40 rounded-full border-4 border-[#C9A227] p-1 shadow-xl bg-gradient-to-br from-[#E5C358] to-[#9B7711] relative z-10 flex items-center justify-center overflow-hidden">
                    <img
                      src={previewPhoto}
                      alt="Custom Photo"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>

                  {/* Custom Engraved Name Badge */}
                  <div className="mt-4 px-6 py-2 bg-[#5C061D] text-[#C9A227] font-serif font-bold text-lg rounded-full border border-[#C9A227] shadow-md tracking-wider uppercase">
                    {customName || "YOUR NAME"}
                  </div>
                </div>

                {/* Custom Gift Card Message Preview */}
                <div className="p-3 bg-[#FFF9F8] rounded-xl border border-[#F0E2DE] text-center">
                  <p className="text-xs italic text-[#5C061D] font-medium">
                    &quot;{customMessage || "Best Brother Ever"}&quot;
                  </p>
                </div>

                <div className="mt-4 text-center">
                  <span className="text-[10px] text-[#6E5D57] flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C9A227]" />
                    <span>Includes Hallmark Certificate & Velvet Gift Box</span>
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
