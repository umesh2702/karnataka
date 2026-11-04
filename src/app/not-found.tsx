import React from "react";
import Link from "next/link";
import { FileQuestion, ArrowLeft, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8F6F2] text-[#191A1C]">
      {/* Standalone Brand Header */}
      <header className="h-16 border-b border-[#E5E1D8] bg-white px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-serif font-bold text-lg text-[#191A1C]">
          <div className="w-8 h-8 rounded-full bg-white border border-[#E5E1D8] p-1 flex items-center justify-center shrink-0">
            <img
              src="/images/inc-logo.svg"
              alt="Indian National Congress Symbol"
              className="w-6 h-6 object-contain"
            />
          </div>
          <span className="tracking-tight">
            Karnataka Congress <span className="font-sans font-normal text-xs text-[#5E6066]">Digital Platform</span>
          </span>
        </Link>
        <div className="flex items-center gap-4 text-xs font-medium">
          <Link href="/leaders" className="text-[#173B65] hover:underline">
            Directory
          </Link>
          <Link href="/about" className="text-stone-600 hover:text-black">
            About
          </Link>
        </div>
      </header>

      {/* Main 404 message */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 text-center max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-full bg-[#173B65]/10 text-[#173B65] flex items-center justify-center mx-auto mb-6">
          <FileQuestion className="w-8 h-8" />
        </div>

        <span className="text-xs font-semibold text-[#173B65] uppercase tracking-wider">
          404 Record Not Found
        </span>

        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#191A1C] mt-2 mb-3">
          Profile or Document Unavailable
        </h1>

        <p className="text-xs sm:text-sm text-[#5E6066] leading-relaxed mb-8">
          The requested leadership record, publication route, or draft revision does not exist or is currently restricted to private editorial review.
        </p>

        <div className="flex items-center gap-3">
          <Link
            href="/leaders"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#173B65] text-white text-xs font-semibold hover:bg-[#0F2744] transition-colors border border-[#F47A20]/40"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#F47A20]" />
            <span>Browse Leadership Directory</span>
          </Link>
          <Link
            href="/"
            className="px-4 py-2.5 rounded-lg border border-[#D5D5D0] bg-white text-xs font-semibold text-[#191A1C] hover:bg-[#FAF8F5]"
          >
            Homepage
          </Link>
        </div>
      </main>

      {/* Standalone Simple Footer */}
      <footer className="border-t border-[#E5E1D8] bg-white py-6 px-6 text-center text-xs text-stone-500">
        <div className="flex items-center justify-center gap-2 mb-1 text-stone-600">
          <ShieldCheck className="w-3.5 h-3.5 text-[#173B65]" />
          <span>Karnataka Pradesh Congress Committee · Technology Development Partner: UCreates</span>
        </div>
        <p>© {new Date().getFullYear()} Karnataka Congress Official Digital Platform.</p>
      </footer>
    </div>
  );
}
