"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

export const AnnouncementBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="w-full bg-[#5C061D] text-white py-2 px-4 relative z-50 shadow-xs border-b border-[#7A0A28]">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        {/* Empty left offset for balance */}
        <div className="w-6 hidden sm:block" />

        {/* Centered Announcement Message (Reference Screenshot Style) */}
        <div className="flex-1 text-center text-xs sm:text-sm font-medium tracking-wide">
          <span>92.5 Sterling Silver</span>
          <span className="mx-2 text-[#C9A227]">•</span>
          <span className="text-[#E5C358] font-bold">Use Code: RAKHI30</span>
        </div>

        {/* Right Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors focus:outline-none"
          aria-label="Close Announcement Bar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
