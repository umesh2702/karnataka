import React from "react";
import prisma from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { PublicationStatus } from "@prisma/client";
import {
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  Award,
  Zap,
  Bus,
  Sparkles,
  GraduationCap,
  Scale,
  Calendar,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Karnataka's Five Guarantees & Welfare Framework | UCreates",
  description:
    "Official documentation and verified guidelines for Gruha Lakshmi, Gruha Jyothi, Shakthi, Anna Bhagya, and Yuva Nidhi in Karnataka.",
};

export default async function SchemesPage() {
  const schemes = await prisma.governmentScheme.findMany({
    where: { publicationStatus: PublicationStatus.PUBLISHED },
    orderBy: { sortOrder: "asc" },
  });

  const getSchemeIcon = (slug: string) => {
    switch (slug) {
      case "gruha-lakshmi":
        return <Award className="w-6 h-6 text-[#922036]" />;
      case "gruha-jyothi":
        return <Zap className="w-6 h-6 text-amber-600" />;
      case "shakthi-scheme":
        return <Bus className="w-6 h-6 text-emerald-700" />;
      case "anna-bhagya":
        return <Sparkles className="w-6 h-6 text-sky-700" />;
      case "yuva-nidhi":
        return <GraduationCap className="w-6 h-6 text-indigo-700" />;
      default:
        return <BookOpen className="w-6 h-6 text-[#922036]" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F6F2]">
      <Navbar />

      <main className="flex-1 py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#922036]/10 text-[#922036] text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              Government of Karnataka · Five Guarantees Framework
            </div>

            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#17191B] tracking-tight">
              The Five Guarantees
            </h1>

            <p className="text-base text-[#68645F] font-light leading-relaxed">
              Official, evidence-verified documentation of Karnataka&apos;s flagship citizen welfare
              and economic stabilization guarantees, complete with statutory department eligibility
              rules and official Seva Sindhu application portals.
            </p>
          </div>

          {/* Guarantees Showcase Cards */}
          <div className="space-y-8">
            {schemes.map((scheme, index) => (
              <article
                key={scheme.id}
                id={scheme.slug}
                className="bg-white rounded-2xl border border-[#E6E1DA] p-6 sm:p-10 editorial-shadow space-y-6 hover:border-[#922036]/40 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-[#E6E1DA] flex items-center justify-center shrink-0 mt-1">
                      {getSchemeIcon(scheme.slug)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-[#922036]/10 text-[#922036]">
                          GUARANTEE 0{index + 1}
                        </span>
                        <span className="text-xs text-[#68645F] font-medium">
                          {scheme.department}
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#17191B]">
                        {scheme.name}
                      </h2>
                      {scheme.kannadaName && (
                        <p className="text-lg font-kannada font-semibold text-[#922036] mt-0.5">
                          {scheme.kannadaName}
                        </p>
                      )}
                    </div>
                  </div>

                  {scheme.applicationUrl && (
                    <a
                      href={scheme.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#922036] text-white text-xs font-semibold hover:bg-[#7A1629] transition-colors shrink-0 shadow-2xs self-start"
                    >
                      <span>Apply on Seva Sindhu</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <p className="text-base text-[#17191B] font-medium leading-relaxed">
                  {scheme.tagline}
                </p>

                <p className="text-sm text-[#4A4B4F] font-light leading-relaxed">
                  {scheme.description}
                </p>

                {/* Eligibility & Benefits Split Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E1DA] space-y-1.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#17191B] flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1A633F]" />
                      Statutory Eligibility Criteria
                    </h3>
                    <p className="text-xs text-[#4A4B4F] leading-relaxed">
                      {scheme.eligibility}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E1DA] space-y-1.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#17191B] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#922036]" />
                      Statutory Citizen Entitlement
                    </h3>
                    <p className="text-xs text-[#4A4B4F] leading-relaxed">
                      {scheme.benefits}
                    </p>
                  </div>
                </div>

                {/* Official Source Attribution Bar */}
                <div className="pt-4 border-t border-[#E6E1DA] flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#68645F] gap-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-[#922036]" />
                    <span>
                      <strong>Attribution:</strong>{" "}
                      <a
                        href={scheme.officialSourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#17191B] underline"
                      >
                        Official Government Gazette Notification
                      </a>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-[#82848A]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      Verified:{" "}
                      {new Date(scheme.verifiedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Institutional Transparency Box */}
          <div className="p-6 bg-white rounded-2xl border border-[#E6E1DA] editorial-shadow text-xs text-[#68645F] space-y-2">
            <div className="flex items-center gap-2 text-[#17191B] font-bold">
              <Scale className="w-4 h-4 text-[#922036]" />
              <span>Editorial Standards & Verification Disclaimer</span>
            </div>
            <p className="leading-relaxed">
              All welfare schemes and announcements displayed on this platform are compiled strictly from
              gazetted orders of the Government of Karnataka and authenticated department notifications.
              UCreates does not process applications directly or collect beneficiary banking details.
              Users must apply exclusively through the official state portal at{" "}
              <a
                href="https://sevasindhugs.karnataka.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#922036] font-semibold underline"
              >
                sevasindhugs.karnataka.gov.in
              </a>
              .
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
