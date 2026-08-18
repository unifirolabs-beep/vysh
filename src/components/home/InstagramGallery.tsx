"use client";

import React from "react";
import { INSTAGRAM_POSTS } from "@/data/products";
import { Heart } from "lucide-react";
import { FaInstagram } from "react-icons/fa6";

export const InstagramGallery: React.FC = () => {
  return (
    <section className="py-20 bg-[#FFF9F8] border-b border-[#F0E2DE]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C9A227] flex items-center justify-center gap-1.5">
            <FaInstagram className="w-4 h-4 text-[#C9A227]" />
            <span>@VYSH_OFFICIAL</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#5C061D] mt-1">
            Follow Us On Instagram
          </h2>
          <p className="text-xs sm:text-sm text-[#6E5D57] mt-2">
            Tag @vysh_official in your Raksha Bandhan moments to get featured in our royal gallery.
          </p>
        </div>

        {/* 6 Images Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {INSTAGRAM_POSTS.map((post) => (
            <a
              key={post.id}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative h-48 sm:h-56 rounded-2xl overflow-hidden shadow-sm hover:shadow-luxury transition-all duration-300 block"
            >
              <img
                src={post.image}
                alt="Instagram post"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-[#5C061D]/80 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-xs">
                <FaInstagram className="w-8 h-8 text-[#C9A227] mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 fill-white text-white" />
                  {post.likes}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
