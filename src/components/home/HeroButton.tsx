"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface HeroButtonProps {
  text: string;
  link: string;
}

export const HeroButton: React.FC<HeroButtonProps> = ({ text, link }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
      className="pt-1 sm:pt-2"
    >
      <Link
        href={link}
        className="inline-flex items-center gap-1.5 sm:gap-2.5 text-white hover:text-[#C9A227] font-extrabold text-[10px] sm:text-sm lg:text-base tracking-[0.14em] uppercase transition-colors duration-300 group cursor-pointer select-none py-0.5 sm:py-1 border-b sm:border-b-2 border-[#C9A227] hover:border-white w-fit"
      >
        <span>{text}</span>
        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-[#C9A227] group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
      </Link>
    </motion.div>
  );
};
