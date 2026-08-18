"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Keyboard } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";
import { HeroContent } from "./HeroContent";
import { HeroNavigation } from "./HeroNavigation";
import { HeroPagination } from "./HeroPagination";

import "swiper/css";
import "swiper/css/effect-fade";

export interface BannerSlide {
  id: number;
  desktopImage: string;
  mobileImage: string;
  alt: string;
  heading: string;
  subHeading: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

const BANNERS: BannerSlide[] = [
  {
    id: 1,
    desktopImage: "/hero-page-banners/rakhi-banner.png",
    mobileImage: "/hero-page-banners/rakhi-banner.png",
    alt: "Timeless 92.5 Silver Rakhis",
    heading: "Celebrate Every Bond",
    subHeading: "Timeless 92.5 Silver Rakhis Crafted with Love & Elegance",
    description: "Make This Raksha Bandhan Truly Memorable",
    buttonText: "Explore Now",
    buttonLink: "#featured",
  },
  {
    id: 2,
    desktopImage: "/hero-page-banners/customized-banner.png",
    mobileImage: "/hero-page-banners/customized-banner.png",
    alt: "Customized",
    heading: "Customized",
    subHeading: "",
    description: "",
    buttonText: "Explore Now",
    buttonLink: "#featured",
  }
];

export const HeroSlider: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperClass | null>(null);

  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  const handleSelectSlide = (index: number) => {
    if (swiperRef.current) {
      swiperRef.current.slideToLoop(index);
    }
  };

  return (
    <div className="relative w-full h-full group">
      <Swiper
        modules={[Autoplay, EffectFade, Keyboard]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop={true}
        speed={1000}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        keyboard={{ enabled: true }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.realIndex);
        }}
        className="w-full h-full"
      >
        {BANNERS.map((banner, index) => (
          <SwiperSlide key={banner.id} className="relative w-full h-full overflow-hidden">
            {/* Background Image Container */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <div
                className={`relative w-full h-full transition-transform duration-[5000ms] ease-linear ${
                  activeIndex === index ? "scale-105" : "scale-100"
                }`}
              >
                {/* Desktop Banner Image (>= 768px) */}
                <div className="hidden md:block relative w-full h-full">
                  <Image
                    src={banner.desktopImage}
                    alt={banner.alt}
                    fill
                    priority={index === 0}
                    quality={95}
                    sizes="(max-width: 1200px) 100vw, 1920px"
                    className="object-cover object-center"
                  />
                </div>

                {/* Mobile Banner Image (< 768px) */}
                <div className="block md:hidden relative w-full h-full">
                  <Image
                    src={banner.mobileImage}
                    alt={banner.alt}
                    fill
                    priority={index === 0}
                    quality={95}
                    sizes="100vw"
                    className="object-cover object-center"
                  />
                </div>
              </div>

              {/* Gradient Overlay to Guarantee Crisp Text Legibility */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#5C061D]/80 via-[#5C061D]/40 to-transparent z-10 pointer-events-none md:via-[#5C061D]/35" />
            </div>

            {/* Left Side Content Component */}
            <HeroContent
              heading={banner.heading}
              subHeading={banner.subHeading}
              description={banner.description}
              buttonText={banner.buttonText}
              buttonLink={banner.buttonLink}
              isActive={activeIndex === index}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Arrow Controls */}
      <HeroNavigation onPrev={handlePrev} onNext={handleNext} />

      {/* Pagination Dot Controls */}
      <HeroPagination
        total={BANNERS.length}
        activeIndex={activeIndex}
        onSelect={handleSelectSlide}
      />
    </div>
  );
};
