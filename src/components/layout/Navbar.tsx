"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/components/i18n/LanguageContext";
import {
  Compass,
  Search,
  Languages,
  ShieldCheck,
  Menu,
  X,
  FileCheck2,
  ExternalLink,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, setLang, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/leaders?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/leaders", label: t.nav.leaders },
    { href: "/schemes", label: t.nav.schemes },
    { href: "/about", label: t.nav.about },
    { href: "/corrections", label: t.nav.corrections },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#F8F7F3]/95 backdrop-blur-md border-b border-[#E5E1D8] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Official INC Logo & Product Identity */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative w-11 h-11 rounded-full bg-white border border-[#E5E1D8] shadow-xs flex items-center justify-center p-1 group-hover:scale-105 transition-transform overflow-hidden shrink-0">
              <img
                src="/images/inc-logo.svg"
                alt="Indian National Congress Symbol"
                className="w-9 h-9 object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-lg tracking-tight text-[#242424] leading-tight">
                Karnataka <span className="font-semibold text-sm text-[#173B65]">Congress</span>
              </span>
              <span className="text-[11px] font-medium tracking-wide text-[#68645F] font-kannada">
                ಕರ್ನಾಟಕ ಪ್ರದೇಶ ಕಾಂಗ್ರೆಸ್ ಸಮಿತಿ · Digital Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-7" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? "text-[#173B65] font-bold border-b-2 border-[#F47A20] pb-1 -mb-1"
                      : "text-[#595959] hover:text-[#173B65]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Search, Language Selector & Studio Access */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Quick Search */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder={t.nav.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-56 pl-9 pr-3 py-1.5 text-xs bg-white border border-[#E5E1D8] rounded-full focus:outline-none focus:ring-1 focus:ring-[#173B65] focus:border-[#173B65] transition-all text-[#242424]"
              />
              <Search className="w-3.5 h-3.5 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
            </form>

            {/* Language Switcher */}
            <div className="flex items-center bg-white border border-[#E5E1D8] rounded-full p-0.5 text-xs shadow-2xs">
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-2.5 py-1 rounded-full font-medium transition-colors ${
                  lang === "en" ? "bg-[#173B65] text-white" : "text-[#555] hover:text-[#242424]"
                }`}
                title="Switch to English"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang("kn")}
                className={`px-2.5 py-1 rounded-full font-medium transition-colors font-kannada ${
                  lang === "kn" ? "bg-[#173B65] text-white" : "text-[#555] hover:text-[#242424]"
                }`}
                title="ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಿ"
              >
                ಕನ್ನಡ
              </button>
            </div>

            {/* Admin Studio Sign-in */}
            <Link
              href="/studio"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-[#173B65] text-[#173B65] hover:bg-[#173B65] hover:text-white transition-all shadow-2xs"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t.nav.studio}</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setLang(lang === "en" ? "kn" : "en")}
              className="px-2 py-1 text-xs border border-[#E5E1D8] rounded-md font-medium text-[#242424] bg-white"
            >
              {lang === "en" ? "ಕನ್ನಡ" : "EN"}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#242424] hover:text-[#173B65]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Subtle Tricolor hairline at bottom edge */}
      <div className="h-[2px] w-full tricolor-hairline opacity-90" />

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5E1D8] bg-[#F8F7F3] px-4 pt-3 pb-6 space-y-3">
          <form onSubmit={handleSearch} className="relative mb-3">
            <input
              type="text"
              placeholder={t.nav.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#E5E1D8] rounded-lg"
            />
            <Search className="w-4 h-4 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-[#242424] hover:text-[#173B65]"
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-3 border-t border-[#E5E1D8]">
            <Link
              href="/studio"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#173B65] text-white rounded-lg text-sm font-semibold"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{t.nav.signIn}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
