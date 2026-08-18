"use client";

import React, { useState } from "react";
import { Sparkles, Mail, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setIsSubscribed(true);
    toast.success("Welcome to the Vysh Royal Family!", {
      description: "Use coupon code WELCOME10 for 10% OFF your first order.",
      icon: "👑",
    });
  };

  return (
    <section className="py-16 sm:py-20 bg-[#FFF9F8] text-[#1D1D1D] relative overflow-hidden border-t border-[#F0E2DE]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 relative z-10">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          
          {/* VIP Royal Club Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5C061D]/10 border border-[#5C061D]/30 text-[#5C061D] text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-[#C9A227]" />
            <span>VIP ROYAL CLUB</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#1D1D1D] leading-tight">
            Join Our Family
          </h2>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-[#6E5D57] leading-relaxed">
            Subscribe to receive private preview drops of new Rakhi & Silver jewellery designs, festival offers, and an instant <strong className="text-[#5C061D]">10% OFF voucher</strong>.
          </p>

          {isSubscribed ? (
            <div className="p-6 bg-white rounded-2xl border border-[#C9A227] text-center space-y-2 shadow-sm animate-fade-in">
              <CheckCircle2 className="w-10 h-10 text-[#5C061D] mx-auto" />
              <h3 className="text-xl font-serif font-bold text-[#5C061D]">
                You&apos;re Officially Subscribed!
              </h3>
              <p className="text-xs text-[#6E5D57]">
                Use code <code className="bg-[#5C061D] text-white px-2 py-0.5 rounded font-bold">WELCOME10</code> at checkout.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center gap-3 pt-4">
              <div className="relative w-full flex-1">
                <Mail className="w-5 h-5 text-[#6E5D57] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white text-[#1D1D1D] placeholder-[#888888] rounded-[12px] border border-[#E8D8D3] text-sm focus:outline-none focus:border-[#C9A227] shadow-xs"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-4 bg-[#5C061D] text-white font-bold text-sm tracking-wide rounded-[12px] hover:bg-[#7A0A28] transition-colors shadow-md whitespace-nowrap cursor-pointer"
              >
                Subscribe Now
              </button>
            </form>
          )}

          <p className="text-[11px] text-[#888888] pt-2">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};
