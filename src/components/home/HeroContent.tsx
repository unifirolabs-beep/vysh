"use client";

import React from "react";
import { motion } from "framer-motion";
import { HeroButton } from "./HeroButton";

interface HeroContentProps {
  heading: string;
  subHeading: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  isActive: boolean;
}

export const HeroContent: React.FC<HeroContentProps> = ({
  heading,
  subHeading,
  description,
  buttonText,
  buttonLink,
  isActive,
}) => {
  if (!isActive) return null;

  return (
    <div className="w-full h-full pl-3.5 sm:pl-8 md:pl-16 lg:pl-[80px] pr-3 flex flex-col justify-center text-left relative z-20 pointer-events-auto">
      <div className="max-w-[58%] sm:max-w-[460px] space-y-0.5 sm:space-y-2 lg:space-y-3.5">
        {/* Heading: Playfair Display */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif font-bold text-white text-[13px] sm:text-[22px] md:text-[32px] lg:text-[48px] leading-[1.15] tracking-tight drop-shadow-md line-clamp-1 sm:line-clamp-2"
        >
          {heading}
        </motion.h1>

        {/* Sub Heading: Poppins */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.95 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
          className="font-sans font-medium text-white/95 text-[9px] sm:text-[14px] md:text-[18px] lg:text-[22px] leading-tight tracking-wide drop-shadow-sm line-clamp-1 sm:line-clamp-2"
        >
          {subHeading}
        </motion.h2>

        {/* Description: Hidden on small screens */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.85 }}
          transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
          className="hidden sm:block font-sans font-normal text-white/85 text-xs sm:text-sm lg:text-[16px] leading-relaxed max-w-[420px]"
        >
          {description}
        </motion.p>

        {/* Word with Arrow CTA */}
        <HeroButton text={buttonText} link={buttonLink} />
      </div>
    </div>
  );
};
