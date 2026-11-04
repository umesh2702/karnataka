"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/components/i18n/LanguageContext";
import { ShieldCheck, ArrowUpRight, Scale } from "lucide-react";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#17191B] text-[#E0E0DB] border-t border-[#2A2C30] mt-auto relative">
      {/* Tricolor accent bar */}
      <div className="h-[2px] w-full tricolor-hairline opacity-75" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand & Attribution Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white border border-white/20 p-1 flex items-center justify-center shrink-0">
                <img
                  src="/images/inc-logo.svg"
                  alt="Indian National Congress Symbol"
                  className="w-7 h-7 object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-lg text-white tracking-tight leading-tight">
                  Karnataka Congress Digital Platform
                </span>
                <span className="text-xs text-[#A0A2A8]">
                  Technology Development Partner: <strong className="text-white">UCreates</strong>
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#A0A2A8] max-w-md leading-relaxed">
              The digital leadership and governance platform of the Karnataka Pradesh Congress Committee (KPCC), developed in technical partnership with UCreates. Documenting executive portfolios, flagship Five Guarantees, and verifiable public service records cross-referenced with official legislative gazettes.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-[#82848A]">
              <Scale className="w-4 h-4 text-[#F47A20]" />
              <span>Karnataka Pradesh Congress Committee · Institutional Leadership Registry</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Platform & Leadership
            </h4>
            <ul className="space-y-2 text-sm text-[#B0B2B8]">
              <li>
                <Link href="/leaders" className="hover:text-white transition-colors">
                  {t.nav.leaders}
                </Link>
              </li>
              <li>
                <Link href="/schemes" className="hover:text-white transition-colors">
                  {t.nav.schemes}
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
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#F47A20]" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Governance */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Trust & Administration
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
                <Link href="/studio/login" className="hover:text-white transition-colors text-xs text-[#F47A20]">
                  Authorised Studio Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#2A2C30] mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#707278] gap-4">
          <p>© {new Date().getFullYear()} Karnataka Pradesh Congress Committee · Technology Development Partner: UCreates.</p>
          <div className="flex items-center gap-4">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            <span>Karnataka Congress Platform · 6 Showcase Leaders</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
