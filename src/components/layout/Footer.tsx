"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/components/i18n/LanguageContext";
import { ShieldCheck, ArrowUpRight, Scale } from "lucide-react";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#17191B] text-[#E0E0DB] border-t border-[#2A2C30] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#922036] text-white flex items-center justify-center font-serif font-bold text-lg">
                U
              </div>
              <span className="font-serif font-bold text-xl text-white tracking-tight">
                UCreates <span className="font-sans font-normal text-sm text-[#D9A0A9]">Leadership Studio</span>
              </span>
            </div>
            <p className="text-sm text-[#A0A2A8] max-w-md leading-relaxed">
              {t.footer.disclaimer}
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-[#82848A]">
              <Scale className="w-4 h-4 text-[#922036]" />
              <span>Independent Digital Publication & Cartographic Registry</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Platform & Directory
            </h4>
            <ul className="space-y-2 text-sm text-[#B0B2B8]">
              <li>
                <Link href="/leaders" className="hover:text-white transition-colors">
                  {t.nav.leaders}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  {t.footer.about}
                </Link>
              </li>
              <li>
                <Link href="/corrections" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>{t.footer.corrections}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#D9A0A9]" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Governance */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Legal & Trust
            </h4>
            <ul className="space-y-2 text-sm text-[#B0B2B8]">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  {t.footer.privacy}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  {t.footer.terms}
                </Link>
              </li>
              <li>
                <Link href="/studio/login" className="hover:text-white transition-colors text-xs text-[#D9A0A9]">
                  Authorised Studio Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#2A2C30] mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#707278] gap-4">
          <p>© {new Date().getFullYear()} UCreates Leadership Studio. {t.footer.rights}</p>
          <div className="flex items-center gap-4">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            <span>{t.footer.karnatakaEdition}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
