"use client";

import React, { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";

export default function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md border border-[#D5D5D0] bg-white text-[#191A1C] text-xs font-semibold hover:bg-[#FAF8F5] transition-colors shadow-2xs"
      title="Copy profile link"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-emerald-700 font-medium">Link Copied!</span>
        </>
      ) : (
        <>
          <Share2 className="w-3.5 h-3.5 text-[#8A1C2C]" />
          <span>Share Profile</span>
        </>
      )}
    </button>
  );
}
