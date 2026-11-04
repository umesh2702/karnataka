import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { BookOpen, ShieldCheck, Scale, CheckCircle2, Award, FileText, Landmark } from "lucide-react";

export const metadata = {
  title: "About & Institutional Standards | Karnataka Congress Official Digital Platform",
  description:
    "Learn about our institutional standards, verification methodology, and technology partnership for documenting Karnataka Congress leadership.",
};

export const dynamic = "force-dynamic";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8F6F2]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full">
        <div className="border-b border-[#E5E1D8] pb-8 mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#173B65]/10 text-[#173B65] text-xs font-semibold uppercase tracking-wider border border-[#173B65]/20">
            <span className="w-2 h-2 rounded-full bg-[#F47A20]" />
            Karnataka Pradesh Congress Committee · Institutional Governance
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#17191B]">
            Platform Purpose & Institutional Standards
          </h1>
          <p className="text-base sm:text-lg text-[#5E6066] leading-relaxed font-light">
            An institutional digital leadership and governance platform developed for Karnataka Congress leadership, engineered to establish verifiable, source-backed records of executive service and citizen welfare delivery.
          </p>
        </div>

        <div className="space-y-12 text-[#3A3B3F] leading-relaxed">
          {/* Mission */}
          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-[#17191B]">1. Institutional Platform Purpose</h2>
            <p className="font-light">
              The Karnataka Congress Official Digital Platform is developed to provide citizens, researchers, and public stakeholders with an authoritative, structured, and evidence-grounded record of state executive leadership, departmental portfolios, and the transformative Five Guarantees citizen welfare architecture.
            </p>
            <p className="font-light">
              Unlike ephemeral social announcements, this platform organizes public responsibilities into durable public-office timelines, departmental allocations, and verified milestone records with direct links to statutory documents.
            </p>
          </section>

          {/* Technology Partnership & Pre-launch Status */}
          <section className="p-6 rounded-2xl border border-[#E5E1D8] bg-white space-y-4 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#173B65]">
              <Landmark className="w-4 h-4 text-[#F47A20]" />
              <span>Technology Development Partnership & Pre-Launch Scope</span>
            </div>
            <h3 className="font-serif font-bold text-xl text-[#17191B]">
              Karnataka Congress & UCreates Partnership
            </h3>
            <p className="text-sm font-light text-[#5E6066] leading-relaxed">
              This digital platform is engineered by <strong className="text-[#17191B] font-semibold">UCreates</strong> as the designated technology development partner proposing and establishing the digital leadership architecture for the Karnataka Pradesh Congress Committee (KPCC).
            </p>
            <p className="text-sm font-light text-[#5E6066] leading-relaxed">
              The platform incorporates official Congress and KPCC visual identities, color systems, and governance structures. It is currently operating in pre-launch preview status undergoing executive verification and editorial review prior to formal public launch and institutional adoption.
            </p>
          </section>

          {/* Source Hierarchy */}
          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-[#17191B]">2. Source Hierarchy & Verification Protocol</h2>
            <p className="font-light">
              To ensure unmatched factual reliability and institutional credibility, all published claims, financial figures, dates, and scheme details follow a three-tier verification standard:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-xl border border-[#E5E1D8] bg-white space-y-2 shadow-2xs">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Tier 1: Primary Official Gazettes</span>
                <h4 className="font-serif font-bold text-base text-[#17191B]">Statutory Records & Department Portals</h4>
                <p className="text-xs text-[#65676B] font-light leading-relaxed">
                  Karnataka Legislative Assembly (KLA) and Council directories, official Government of Karnataka gazettes, Council of Ministers notifications, and Election Commission of India (ECI) sworn affidavits.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-[#E5E1D8] bg-white space-y-2 shadow-2xs">
                <span className="text-xs font-bold text-[#173B65] uppercase tracking-wider">Tier 2: Attributed Journalism</span>
                <h4 className="font-serif font-bold text-base text-[#17191B]">Established Press & Documentation</h4>
                <p className="text-xs text-[#65676B] font-light leading-relaxed">
                  Verified news coverage and policy reporting from established national and regional press outlets with accountable editorial mastheads (e.g. The Hindu, Deccan Herald, Indian Express).
                </p>
              </div>
            </div>
          </section>

          {/* Verification Status Classifications */}
          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-[#17191B]">3. Verification Status Classifications</h2>
            <p className="font-light">
              Every documented public project and executive initiative carries an explicit verification status:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 space-y-1.5">
                <span className="text-xs font-bold text-emerald-800 uppercase flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Officially Verified
                </span>
                <p className="text-xs text-emerald-950 font-light leading-relaxed">
                  Cross-referenced with primary gazette orders, Cabinet notifications, or signed administrative approvals.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 space-y-1.5">
                <span className="text-xs font-bold text-amber-800 uppercase flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5 text-amber-600" />
                  Partially Verified
                </span>
                <p className="text-xs text-amber-950 font-light leading-relaxed">
                  Supported by credible public press reports or departmental releases, awaiting formal gazette indexing.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5">
                <span className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                  Needs Review
                </span>
                <p className="text-xs text-slate-800 font-light leading-relaxed">
                  Under active desk review; sequestered in internal Studio queues and hidden from public presentation.
                </p>
              </div>
            </div>
          </section>

          {/* Corrections */}
          <section className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-[#17191B]">4. Public Corrections & Discrepancy Redressal</h2>
            <p className="font-light">
              We welcome source-backed submissions from citizens, civil society researchers, and party workers. If any portfolio, milestone date, or source citation contains an inaccuracy, please submit a correction request with documentary evidence.
            </p>
            <div className="pt-2">
              <a
                href="/corrections"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#173B65] text-white text-xs font-semibold hover:bg-[#0F2744] transition-colors border border-[#F47A20]/40"
              >
                <FileText className="w-4 h-4 text-[#F47A20]" />
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
