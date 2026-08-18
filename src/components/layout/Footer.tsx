"use client";

import React from "react";
import { VyshLogo } from "@/components/common/VyshLogo";
import { Phone, Mail, MapPin, ShieldCheck } from "lucide-react";
import { FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa6";
import Link from "next/link";

export const Footer: React.FC = () => {
  return (
    <footer id="footer" className="bg-[#5C061D] text-white pt-16 pb-8 border-t-4 border-[#C9A227] relative overflow-hidden">
      {/* Subtle Gold Pattern Overlay */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#C9A227_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/15">
          {/* Col 1: Brand Summary */}
          <div className="lg:col-span-2 space-y-4">
            <VyshLogo size="lg" />
            <p className="text-xs text-white/80 leading-relaxed max-w-sm">
              Vysh is India&apos;s premier luxury Rakhi & Silver Jewellery house. Handcrafted in 925 Pure Sterling Silver and hallmarked for authenticity, celebrating every brother-sister bond with royal timelessness.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a href="https://www.instagram.com/vysh.co.in?igsh=Ym5oY2h2dXBmaWR3" target="_blank" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-[#C9A227] hover:bg-[#C9A227] hover:text-[#5C061D] transition-colors" aria-label="Instagram">
                <FaInstagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-[#C9A227] hover:bg-[#C9A227] hover:text-[#5C061D] transition-colors" aria-label="Facebook">
                <FaFacebookF className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-[#C9A227] hover:bg-[#C9A227] hover:text-[#5C061D] transition-colors" aria-label="Youtube">
                <FaYoutube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Collections */}
          <div>
            <h4 className="text-sm font-serif font-bold text-[#C9A227] uppercase tracking-wider mb-4">
              Collections
            </h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li><Link href="#categories" className="hover:text-[#C9A227] transition-colors">925 Pure Silver Rakhi</Link></li>
              <li><Link href="#categories" className="hover:text-[#C9A227] transition-colors">Custom Photo Rakhi</Link></li>
              <li><Link href="#categories" className="hover:text-[#C9A227] transition-colors">Bhaiya Bhabhi Lumba Pair</Link></li>
              <li><Link href="#categories" className="hover:text-[#C9A227] transition-colors">Kids Superhero Rakhi</Link></li>
              <li><Link href="#categories" className="hover:text-[#C9A227] transition-colors">Silver Bracelets & Rings</Link></li>
              <li><Link href="#categories" className="hover:text-[#C9A227] transition-colors">Royal Gift Hampers</Link></li>
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div>
            <h4 className="text-sm font-serif font-bold text-[#C9A227] uppercase tracking-wider mb-4">
              Customer Support
            </h4>
            <ul className="space-y-2.5 text-xs text-white/80">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>+91 6360027560 (Mon-Sat 10am-7pm)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>vysh.co.in@gmail</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C9A227] shrink-0 mt-0.5" />
                <span>1-3-103, NEAR GANDHI CIRCLE, DEODURGA, Karnataka, 584111</span>
              </li>
              <li className="pt-1">
                <span className="inline-flex items-center gap-1 text-[11px] text-[#C9A227] font-semibold">
                  <ShieldCheck className="w-4 h-4" /> 100% BIS Hallmarked Silver
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Quick Links & Policies */}
          <div>
            <h4 className="text-sm font-serif font-bold text-[#C9A227] uppercase tracking-wider mb-4">
              Policies
            </h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li><a href="#" className="hover:text-[#C9A227] transition-colors">Shipping & Delivery Policy</a></li>
              <li><a href="#" className="hover:text-[#C9A227] transition-colors">15-Day Return & Exchange</a></li>
              <li><a href="#" className="hover:text-[#C9A227] transition-colors">Silver Care Guide</a></li>
              <li><a href="#" className="hover:text-[#C9A227] transition-colors">Track Your Order</a></li>
              <li><a href="#" className="hover:text-[#C9A227] transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-[#C9A227] transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Rights */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <p>© {new Date().getFullYear()} Vysh Luxury Rakhi & Jewellery. All Rights Reserved.</p>
          <div className="flex items-center gap-3">
            <span className="px-2 py-1 bg-white/10 rounded text-[10px] font-bold text-[#C9A227]">
              RAZORPAY SECURE PAYMENTS
            </span>
            <span className="px-2 py-1 bg-white/10 rounded text-[10px] font-bold text-white">
              UPI • CARDS • NETBANKING
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
