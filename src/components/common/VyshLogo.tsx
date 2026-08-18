import React from "react";
import Link from "next/link";

interface VyshLogoProps {
  className?: string;
  variant?: "gold" | "dark" | "white";
  size?: "sm" | "md" | "lg" | "xl";
  href?: string;
}

export const VyshLogo: React.FC<VyshLogoProps> = ({
  className = "",
  size = "lg",
  href = "/",
}) => {
  const heightClasses = {
    sm: "h-8 sm:h-10",
    md: "h-10 sm:h-14 lg:h-16",
    lg: "h-12 sm:h-16 lg:h-[76px]",
    xl: "h-16 sm:h-20 lg:h-[96px]",
  };

  return (
    <Link
      href={href}
      className={`inline-flex items-center group select-none transition-transform duration-300 hover:scale-[1.03] ${className}`}
    >
      <div className={`relative ${heightClasses[size]} w-auto flex items-center justify-center`}>
        <img
          src="/logo.png"
          alt="Vysh Luxury 925 Sterling Silver Rakhi & Jewellery"
          className="h-full w-auto object-contain drop-shadow-md transition-all duration-300 max-h-none"
        />
      </div>
    </Link>
  );
};
