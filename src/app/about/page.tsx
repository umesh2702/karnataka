import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { BookOpen, ShieldCheck, Scale, CheckCircle2, Award, FileText } from "lucide-react";

export const metadata = {
  title: "About & Editorial Standards | UCreates Leadership Studio",
  description:
    "Learn about our editorial standards, verification methodology, and institutional principles for documenting public leadership in Karnataka.",
};

export const dynamic = "force-dynamic";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F7F7F4]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full">
        <div className="border-b border-[#E5E5E0] pb-8 mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#8A1C2C]/10 text-[#8A1C2C] text-xs font-semibold uppercase">
            Editorial Mission & Governance
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#191A1C]">
            Editorial Standards & Product Purpose
          </h1>
          <p className="text-base sm:text-lg text-[#5E6066] leading-relaxed font-light">
            UCreates Leadership Studio is an independent digital publication technology developed to document
            public leadership records with verifiability, provenance, and source-level precision.
          </p>
        </div>

        <div className="space-y-12 text-[#3A3B3F] leading-relaxed">
          {/* Mission */}
          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-[#191A1C]">1. Product Purpose</h2>
            <p className="font-light">
              Modern digital information regarding public representatives is frequently fragmented across campaign
              websites, partisan blogs, and social media announcements. UCreates Leadership Studio addresses this by
              establishing a structured, source-aware digital platform where public career records, statutory tenures,
              and policy work are catalogued with direct citations to official documents.
            </p>
            <p className="font-light">
              The Karnataka Edition is our inaugural regional implementation, mapping executive portfolios,
              legislative service, and notable initiatives across Karnataka state representatives.
            </p>
          </section>

          {/* Independence statement */}
          <section className="p-6 rounded-xl border border-[#E5E5E0] bg-white space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#8A1C2C]">
              <Scale className="w-4 h-4" />
              <span>Statement of Institutional Independence</span>
            </div>
            <h3 className="font-serif font-bold text-lg text-[#191A1C]">
              Independent Publication Technology
            </h3>
            <p className="text-sm font-light text-[#5E6066]">
              UCreates Leadership Studio is developed and maintained independently by UCreates. It has not been
              commissioned, endorsed, or financed by the Government of Karnataka, the Indian National Congress, or
              any named political organisation or elected representative. Official emblems, government seals, and
              party marks are intentionally excluded to respect statutory intellectual property protections.
            </p>
          </section>

          {/* Source Hierarchy */}
          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-[#191A1C]">2. Source Hierarchy & Verification Rules</h2>
            <p className="font-light">
              To prevent promotional inflation or unverified biographical claims, our editorial desk enforces a
              strict source tiering framework:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-lg border border-[#E5E5E0] bg-white space-y-2">
                <span className="text-xs font-bold text-emerald-700 uppercase">Tier 1: Primary Public Gazettes</span>
                <h4 className="font-serif font-bold text-base text-[#191A1C]">Official Legislative Records</h4>
                <p className="text-xs text-[#65676B] font-light">
                  Karnataka Legislative Assembly (KLA) member dossiers, Council of Ministers notifications, and
                  Election Commission of India (ECI) Form 26 sworn affidavits.
                </p>
              </div>

              <div className="p-5 rounded-lg border border-[#E5E5E0] bg-white space-y-2">
                <span className="text-xs font-bold text-blue-700 uppercase">Tier 2: Reputable Press Reporting</span>
                <h4 className="font-serif font-bold text-base text-[#191A1C]">Established Journalistic Outlets</h4>
                <p className="text-xs text-[#65676B] font-light">
                  Investigative reporting and verified coverage from reputable national and state publications (The
                  Hindu, Deccan Herald, Indian Express) with verified editorial mastheads.
                </p>
              </div>
            </div>
          </section>

          {/* Corrections */}
          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-[#191A1C]">3. Corrections & Discrepancy Redressal</h2>
            <p className="font-light">
              We welcome corrections from citizens, legal representatives, and researchers. If any published milestone,
              designation, date, or source citation contains an inaccuracy, please submit a correction request with
              supporting evidence.
            </p>
            <div className="pt-2">
              <a
                href="/corrections"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#8A1C2C] text-white text-xs font-semibold hover:bg-[#721422] transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>Submit Factual Correction</span>
              </a>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
