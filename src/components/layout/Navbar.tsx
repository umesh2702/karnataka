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
    { href: "/about", label: t.nav.about },
    { href: "/corrections", label: t.nav.corrections },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#F7F7F4]/90 backdrop-blur-md border-b border-[#E5E5E0] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Product Identity */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="w-10 h-10 rounded-lg bg-[#8A1C2C] text-white flex items-center justify-center font-serif font-bold text-xl shadow-sm group-hover:bg-[#721422] transition-colors">
              U
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-lg tracking-tight text-[#191A1C] leading-tight">
                UCreates <span className="font-normal font-sans text-sm text-[#8A1C2C]">Leadership Studio</span>
              </span>
              <span className="text-[11px] font-medium uppercase tracking-wider text-[#65676B]">
                Karnataka Edition
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
                      ? "text-[#8A1C2C] font-semibold border-b-2 border-[#8A1C2C] pb-1 -mb-1"
                      : "text-[#4A4B4F] hover:text-[#191A1C]"
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
                className="w-56 pl-9 pr-3 py-1.5 text-xs bg-white border border-[#E0E0DB] rounded-full focus:outline-none focus:ring-1 focus:ring-[#8A1C2C] focus:border-[#8A1C2C] transition-all"
              />
              <Search className="w-3.5 h-3.5 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
            </form>

            {/* Language Switcher */}
            <div className="flex items-center bg-white border border-[#E0E0DB] rounded-full p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-2.5 py-1 rounded-full font-medium transition-colors ${
                  lang === "en" ? "bg-[#8A1C2C] text-white" : "text-[#555] hover:text-[#191A1C]"
                }`}
                title="Switch to English"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang("kn")}
                className={`px-2.5 py-1 rounded-full font-medium transition-colors font-kannada ${
                  lang === "kn" ? "bg-[#8A1C2C] text-white" : "text-[#555] hover:text-[#191A1C]"
                }`}
                title="ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಿ"
              >
                ಕನ್ನಡ
              </button>
            </div>

            {/* Admin Studio Sign-in */}
            <Link
              href="/studio"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md border border-[#8A1C2C] text-[#8A1C2C] hover:bg-[#8A1C2C] hover:text-white transition-all shadow-2xs"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t.nav.studio}</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setLang(lang === "en" ? "kn" : "en")}
              className="px-2 py-1 text-xs border border-[#D0D0CB] rounded-md font-medium"
            >
              {lang === "en" ? "ಕನ್ನಡ" : "EN"}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#4A4B4F] hover:text-[#191A1C]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5E5E0] bg-[#F7F7F4] px-4 pt-3 pb-6 space-y-3">
          <form onSubmit={handleSearch} className="relative mb-3">
            <input
              type="text"
              placeholder={t.nav.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#E0E0DB] rounded-lg"
            />
            <Search className="w-4 h-4 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-[#191A1C] hover:text-[#8A1C2C]"
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-3 border-t border-[#E5E5E0]">
            <Link
              href="/studio"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#8A1C2C] text-white rounded-lg text-sm font-semibold"
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
