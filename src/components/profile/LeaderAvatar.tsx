"use client";

import React, { useState } from "react";
import Image from "next/image";

interface LeaderAvatarProps {
  src?: string | null;
  name: string;
  kannadaName?: string | null;
  size?: "sm" | "md" | "lg" | "hero";
  aspect?: "square" | "portrait";
  className?: string;
  provenance?: string;
  priority?: boolean;
}

export default function LeaderAvatar({
  src,
  name,
  kannadaName,
  size = "md",
  aspect = "portrait",
  className = "",
  provenance,
  priority = false,
}: LeaderAvatarProps) {
  const [imageError, setImageError] = useState(false);

  // Generate clean initials monogram
  const getInitials = (fullName: string) => {
    const parts = fullName
      .replace(/^Dr\.\s*/i, "")
      .replace(/^Shri\s*/i, "")
      .split(/[\s.-]+/)
      .filter(Boolean);

    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    if (parts.length === 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return `${parts[0][0]}${parts[1][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  };

  const initials = getInitials(name);
  const kannadaInitial = kannadaName ? kannadaName.trim().charAt(0) : "";

  const hasValidImage = src && !imageError;

  const sizeClasses = {
    sm: "w-12 h-12 text-xs",
    md: "w-16 h-16 sm:w-20 sm:h-20 text-sm",
    lg: "w-28 h-28 sm:w-36 sm:h-36 text-xl",
    hero: "w-full h-full min-h-[360px] text-3xl",
  }[size];

  const aspectClass = aspect === "portrait" && size === "hero" ? "aspect-3/4" : aspect === "portrait" && size === "lg" ? "aspect-3/4" : "aspect-square";

  if (!hasValidImage) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-[#E6E1DA] bg-gradient-to-br from-[#F4EFEB] via-[#EFE9DF] to-[#E5DECة/10] text-[#17191B] select-none ${aspectClass} ${sizeClasses} ${className}`}
        aria-label={`Official Record Monogram for ${name}`}
      >
        {/* Subtle topographic contour background */}
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none topo-lines" />
        
        {/* Faint Kannada glyph in background */}
        {kannadaInitial && (
          <span className="absolute text-[80px] sm:text-[110px] font-kannada font-bold text-[#922036]/10 select-none pointer-events-none -bottom-4 -right-2">
            {kannadaInitial}
          </span>
        )}

        {/* Central Monogram */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          <div className="w-8 h-0.5 bg-[#922036]/40 mb-1" />
          <span className="font-serif font-bold text-[#922036] tracking-wider leading-none">
            {initials}
          </span>
          <span className="text-[9px] uppercase tracking-widest text-[#68645F] mt-1 font-sans font-semibold">
            Archival Record
          </span>
        </div>

        {/* Neutral provenance label on hero sizes */}
        {size === "hero" && (
          <div className="absolute bottom-3 left-3 right-3 text-center">
            <span className="inline-block px-2.5 py-1 text-[11px] text-[#68645F] bg-white/80 backdrop-blur-xs rounded border border-[#E6E1DA]">
              Official Public Record Monogram • Photo Pending Gazette Authorization
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-[#E6E1DA] bg-[#EFECE6] ${aspectClass} ${sizeClasses} ${className}`}
    >
      {/* Background topographic texture behind image */}
      <div className="absolute inset-0 opacity-10 pointer-events-none topo-lines" />

      {/* Portrait Image */}
      <img
        src={src}
        alt={`Authentic public portrait of ${name}`}
        onError={() => setImageError(true)}
        className="w-full h-full object-cover object-top transition-transform duration-300 ease-out group-hover:scale-[1.02]"
        loading={priority ? "eager" : "lazy"}
      />

      {/* Gentle bottom gradient for contrast on hero sizes */}
      {size === "hero" && (
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#17191B]/75 via-[#17191B]/25 to-transparent pointer-events-none" />
      )}

      {/* Provenance attribution pill */}
      {size === "hero" && (
        <div className="absolute bottom-3 left-3 text-[11px] text-white/90 bg-[#17191B]/70 backdrop-blur-xs px-2.5 py-1 rounded border border-white/10 font-sans">
          {provenance || "Authentic Public Domain / Legislative Archive Record"}
        </div>
      )}
    </div>
  );
}
