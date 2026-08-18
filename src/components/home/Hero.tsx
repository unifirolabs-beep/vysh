"use client";

import React from "react";
import { HeroSlider } from "./HeroSlider";

export const Hero: React.FC = () => {
  return (
    <section className="w-full px-0 sm:px-6 md:px-8 mt-0 sm:mt-[24px]">
      <div className="max-w-[1440px] mx-auto w-full h-[180px] sm:h-[260px] md:h-[380px] lg:h-[500px] rounded-none sm:rounded-[24px] overflow-hidden shadow-md sm:shadow-2xl relative border-y sm:border border-[#C9A227]/20 bg-[#5C061D]">
        <HeroSlider />
      </div>
    </section>
  );
};

export default Hero;
