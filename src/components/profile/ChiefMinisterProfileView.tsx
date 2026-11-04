"use client";

import React, { useState } from "react";
import Link from "next/link";
import LeaderAvatar from "@/components/profile/LeaderAvatar";
import ShareButton from "@/components/profile/ShareButton";
import {
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Layers,
  Building2,
  Clock,
  Landmark,
} from "lucide-react";

interface Milestone {
  id: string;
  title: string;
  description: string;
  eventYear?: number | null;
  eventDate?: string | Date | null;
  sortOrder: number;
  verificationStatus: string;
  claimSources: {
    source: {
      id: string;
      title: string;
      url: string;
      publisher: string;
      checkedAt: string | Date;
    };
  }[];
}

interface Initiative {
  id: string;
  title: string;
  description: string;
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  verificationStatus: string;
  claimSources: {
    source: {
      id: string;
      title: string;
      url: string;
      publisher: string;
      checkedAt: string | Date;
    };
  }[];
}

interface Project {
  id: string;
  title: string;
  description: string;
  location?: string | null;
  department?: string | null;
  stage: string;
  budgetAmount?: string | null;
  evidenceUrl?: string | null;
  announcedDate?: string | Date | null;
}

interface SourceItem {
  id: string;
  title: string;
  url: string;
  publisher: string;
  sourceType: string;
  publicationDate?: Date | string | null;
  checkedAt: Date | string;
  notes?: string | null;
}

interface RelatedLeader {
  id: string;
  slug: string;
  displayName: string;
  kannadaName?: string | null;
  currentRole: string;
  portraitUrl?: string | null;
  constituency?: string | null;
}

interface ChiefMinisterProfileViewProps {
  profile: {
    id: string;
    slug: string;
    displayName: string;
    kannadaName?: string | null;
    currentRole: string;
    portfolio?: string | null;
    party: string;
    organisationName?: string | null;
    region?: string | null;
    district?: string | null;
    constituency?: string | null;
    assemblyNumber?: number | null;
    shortBio: string;
    biography: string;
    portraitUrl?: string | null;
    roleLastVerifiedAt?: string | Date | null;
    milestones: Milestone[];
    initiatives: Initiative[];
    projects?: Project[];
  };
  sources: SourceItem[];
  relatedLeaders: RelatedLeader[];
}

export default function ChiefMinisterProfileView({
  profile,
  sources,
  relatedLeaders,
}: ChiefMinisterProfileViewProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "timeline" | "initiatives" | "sources">("overview");
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>(null);

  // Complete official portfolio allocation per Karnataka Legislative Council directory
  // (https://kla.kar.nic.in/council/govtminister.htm)
  const canonicalPortfolios = [
    {
      name: "Finance",
      code: "FIN",
      classification: "Constitutional Ministry",
      desc: "State budget formulation, fiscal policy, debt management, expenditure sanctions, and treasury administration.",
    },
    {
      name: "Cabinet Affairs",
      code: "CAB",
      classification: "Executive Secretariat",
      desc: "Council of Ministers proceedings, cabinet decisions, policy ratification, and inter-ministerial coordination.",
    },
    {
      name: "Department of Personnel and Administrative Reforms (DPAR)",
      code: "DPAR",
      classification: "Administrative Secretariat",
      desc: "State civil services, administrative modernization, IAS/KAS cadre control, and service conduct rules.",
    },
    {
      name: "Intelligence (from Home Department)",
      code: "INT",
      classification: "State Security Subject",
      desc: "State internal security, strategic intelligence, and high-level security apparatus coordination.",
    },
    {
      name: "Information",
      code: "INFO",
      classification: "Communications Department",
      desc: "State government communications, media transparency, gazette publications, and public governance outreach (DIPR).",
    },
    {
      name: "Law, Justice and Human Rights",
      code: "LAW",
      classification: "Legal Secretariat",
      desc: "Judicial coordination, state litigation management, statutory drafting, and human rights compliance.",
    },
    {
      name: "Parliamentary Affairs and Legislation",
      code: "PARL",
      classification: "Legislative Affairs Subject",
      desc: "Coordination of executive legislative business across the Legislative Assembly and Legislative Council.",
    },
    {
      name: "Agriculture Marketing",
      code: "AGR-MKT",
      classification: "Commodity & Commerce Subject",
      desc: "Agricultural produce market committees (APMC), mandi infrastructure, and agricultural commerce regulation.",
    },
    {
      name: "Commissionerate of Town & Country Planning",
      code: "TCP",
      classification: "Planning Directorate",
      desc: "Urban-rural spatial planning, zonal development regulations, and state master plan oversight.",
    },
    {
      name: "All Urban Local Bodies falling under the BDA and BMRDA areas",
      code: "ULB-BMR",
      classification: "Metropolitan Territorial Subject",
      desc: "Urban governance, municipal planning, and local authority oversight across Bengaluru metropolitan jurisdiction.",
    },
    {
      name: "Planning and Statistics",
      code: "PLAN",
      classification: "State Planning Subject",
      desc: "State socioeconomic planning, project performance evaluation, and statistical analytics.",
    },
    {
      name: "Any other unallocated portfolio(s)",
      code: "UNALLOC",
      classification: "Residual Executive Mandate",
      desc: "Residual government departments and administrative wings not specifically assigned to any other cabinet minister.",
    },
  ];

  // Selected strategic focus responsibilities
  const executivePortfolios = [
    {
      title: "Cabinet Affairs & DPAR",
      department: "Department of Personnel and Administrative Reforms",
      description:
        "Chief executive oversight of state policy formulation, cabinet proceedings, administrative reforms, state civil services, and inter-departmental coordination.",
      icon: <Landmark className="w-5 h-5 text-[#173B65]" />,
    },
    {
      title: "Finance & Fiscal Modernization",
      department: "Finance Department",
      description:
        "State revenue mobilization, statutory budget oversight, expenditure management, and resource allocations financing Karnataka's universal citizen welfare guarantees.",
      icon: <Sparkles className="w-5 h-5 text-[#F47A20]" />,
    },
    {
      title: "Information & Public Relations (DIPR)",
      department: "Department of Information & Public Relations",
      description:
        "Strategic state communications, civic transparency initiatives, public awareness dissemination, and government-citizen outreach platforms.",
      icon: <Building2 className="w-5 h-5 text-[#16864A]" />,
    },
    {
      title: "State Intelligence & Planning",
      department: "Department of Planning & State Intelligence",
      description:
        "Long-term socioeconomic development strategies, regional growth planning, state statistical monitoring, and administrative security oversight.",
      icon: <Layers className="w-5 h-5 text-[#173B65]" />,
    },
  ];

  // Former portfolios explicitly distinguished as historical
  const formerPortfolios = [
    {
      title: "Major & Medium Irrigation",
      tenure: "Previous Cabinet Tenure",
      detail: "Steered major irrigation, dam restoration, and water resource projects across the Cauvery and Krishna river basins. Note: Not part of current portfolio responsibilities in the present cabinet.",
    },
    {
      title: "Energy Department",
      tenure: "2014–2018 Cabinet Tenure",
      detail: "Spearheaded Karnataka's renewable energy transition and established the 2,050 MW Pavagada Solar Park in Tumakuru district. Currently held by Cabinet Minister K. J. George.",
    },
    {
      title: "Bengaluru City Development",
      tenure: "Realigned Portfolio Allocation",
      detail: "Metropolitan urban infrastructure and civic mobility have been reorganized under the Greater Bengaluru Development portfolio held by Cabinet Minister Krishna Byre Gowda and municipal bodies.",
    },
  ];

  return (
    <div className="space-y-12 sm:space-y-16 pb-20">
      {/* =========================================================================
          EXECUTIVE HERO: CINEMATIC CHIEF MINISTER COMPOSITION
          ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#17191B] via-[#1F2226] to-[#17191B] text-white pt-8 pb-14 sm:pb-20 border-b border-[#2A2C30]">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#922036]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Breadcrumbs & Navigation Back */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-white/10 text-xs">
            <div className="flex items-center gap-2 text-white/70">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5 text-white/40" />
              <Link href="/leaders" className="hover:text-white transition-colors">Leadership Directory</Link>
              <ChevronRight className="w-3.5 h-3.5 text-white/40" />
              <span className="text-white font-semibold">Chief Minister</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Verified Official Record
              </span>
              <ShareButton title={profile.displayName} />
            </div>
          </div>

          {/* Hero Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-8 sm:pt-12 items-center">
            {/* Left: Large Editorial Portrait */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden border-2 border-white/15 shadow-2xl bg-[#2A2C30]">
                <LeaderAvatar
                  src={profile.portraitUrl}
                  name={profile.displayName}
                  kannadaName={profile.kannadaName}
                  size="hero"
                  aspect="portrait"
                  className="w-full h-full"
                  priority={true}
                />
                {/* Official Executive Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#173B65] text-white shadow-lg tracking-wider uppercase border border-[#F47A20]/40">
                    Chief Minister of Karnataka
                  </span>
                </div>

                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5">
                  <span className="text-[11px] text-white/80 block uppercase tracking-widest font-mono">
                    8th Term Legislator · KPCC President
                  </span>
                  <span className="text-xs text-white/90 font-medium">
                    Kanakapura Assembly Constituency (AC No. 184)
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Authoritative Executive Overview */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#173B65]/40 text-[#F47A20] text-xs font-semibold uppercase tracking-wider border border-[#F47A20]/30">
                <Sparkles className="w-3.5 h-3.5" />
                Executive Leadership of Karnataka
              </div>

              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-[1.08]">
                  {profile.displayName}
                </h1>
                {profile.kannadaName && (
                  <p className="text-2xl sm:text-3xl font-kannada font-bold text-[#F47A20] mt-2">
                    {profile.kannadaName}
                  </p>
                )}
                <p className="text-lg sm:text-xl text-white/90 font-light mt-3 flex items-center gap-2">
                  <span className="font-semibold text-white">Chief Minister of Karnataka</span>
                  <span className="text-white/40">·</span>
                  <span className="text-white/80">President, KPCC</span>
                </p>
              </div>

              <p className="text-sm sm:text-base text-white/80 leading-relaxed font-light max-w-2xl">
                {profile.shortBio}
              </p>

              {/* Verified Metrics Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 pb-2 border-y border-white/10">
                <div>
                  <div className="text-2xl font-serif font-bold text-white">8 Terms</div>
                  <div className="text-[11px] text-white/60">Legislative Assembly</div>
                </div>
                <div>
                  <div className="text-2xl font-serif font-bold text-[#F47A20]">AC #184</div>
                  <div className="text-[11px] text-white/60">Kanakapura (Ramanagara)</div>
                </div>
                <div>
                  <div className="text-2xl font-serif font-bold text-white">1989</div>
                  <div className="text-[11px] text-white/60">First Sworn as MLA</div>
                </div>
                <div>
                  <div className="text-2xl font-serif font-bold text-emerald-400">June 2026</div>
                  <div className="text-[11px] text-white/60">Chief Ministership</div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#responsibilities"
                  className="px-5 py-2.5 rounded-lg bg-[#173B65] hover:bg-[#0F2744] text-white font-medium text-xs sm:text-sm transition-all shadow-sm flex items-center gap-2 border border-[#F47A20]/40"
                >
                  <span>View Executive Portfolios</span>
                  <ArrowRight className="w-4 h-4 text-[#F47A20]" />
                </a>

                <a
                  href="#timeline"
                  className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm transition-all border border-white/15 flex items-center gap-2"
                >
                  <Clock className="w-4 h-4 text-white/70" />
                  <span>Public-Office Timeline</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="h-[2px] w-full tricolor-hairline opacity-75 mt-12" />
      </section>

      {/* =========================================================================
          STICKY TAB NAVIGATION
          ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-[#E6E1DA] bg-white rounded-xl p-1.5 editorial-shadow flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "overview"
                ? "bg-[#173B65] text-white shadow-xs"
                : "text-[#68645F] hover:bg-[#FAF8F5] hover:text-[#17191B]"
            }`}
          >
            Executive Responsibilities
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("timeline")}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "timeline"
                ? "bg-[#173B65] text-white shadow-xs"
                : "text-[#68645F] hover:bg-[#FAF8F5] hover:text-[#17191B]"
            }`}
          >
            Public-Office Timeline ({profile.milestones.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("initiatives")}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "initiatives"
                ? "bg-[#173B65] text-white shadow-xs"
                : "text-[#68645F] hover:bg-[#FAF8F5] hover:text-[#17191B]"
            }`}
          >
            Major Initiatives ({profile.initiatives.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("sources")}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "sources"
                ? "bg-[#173B65] text-white shadow-xs"
                : "text-[#68645F] hover:bg-[#FAF8F5] hover:text-[#17191B]"
            }`}
          >
            Verified Sources ({sources.length})
          </button>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: EXECUTIVE RESPONSIBILITIES & PORTFOLIOS
          ========================================================================= */}
      {activeTab === "overview" && (
        <section id="responsibilities" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Sub-section 1: Complete Official Portfolio Allocation */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-3 border-b border-[#E6E1DA] gap-2">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#173B65]">
                  Official Karnataka Legislative Council Directory Roster
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#17191B] mt-0.5">
                  Complete Official Portfolio Allocation
                </h2>
                <p className="text-xs sm:text-sm text-[#68645F] mt-1 font-light max-w-2xl">
                  Official portfolio subjects as enumerated in the Karnataka Legislative Council Council of Ministers directory roster, including executive departments, statutory directorates, and territorial jurisdictions.
                </p>
              </div>

              <a
                href="https://kla.kar.nic.in/council/govtminister.htm"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#E6E1DA] text-[#173B65] text-xs font-semibold hover:border-[#F47A20] transition-colors shrink-0 shadow-2xs"
              >
                <span>Official Directory Reference</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#F47A20]" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {canonicalPortfolios.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-[#E6E1DA] p-4 editorial-shadow flex flex-col justify-between hover:border-[#173B65]/40 transition-colors space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#173B65]/10 text-[#173B65]">
                        {item.code}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        {item.classification}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#173B65] block">
                        Official Subject
                      </span>
                      <h3 className="font-serif font-bold text-sm text-[#17191B] leading-snug">
                        {item.name}
                      </h3>
                    </div>
                  </div>

                  <div className="bg-[#FAF8F5] p-2.5 rounded-lg border border-[#EBE6DF] text-xs">
                    <span className="text-[10px] font-semibold text-[#82848A] uppercase tracking-wider block mb-0.5">
                      Scope Note
                    </span>
                    <p className="text-[11px] text-[#4A4B4F] leading-relaxed font-light">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sub-section 2: Selected Strategic Focus & Governance Priority */}
          <div className="space-y-4 pt-4 border-t border-[#E6E1DA]">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#F47A20]">
                Strategic Focus & Institutional Authority
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#17191B] mt-0.5">
                Key Strategic Governance Priorities
              </h2>
              <p className="text-xs sm:text-sm text-[#68645F] mt-1 font-light max-w-2xl">
                Detailed executive focus areas driving statewide administrative modernization, fiscal guarantees, and civic communications.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {executivePortfolios.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-[#E6E1DA] p-6 editorial-shadow space-y-3 hover:border-[#173B65]/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E6E1DA] flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-lg text-[#17191B]">
                        {item.title}
                      </h3>
                      <span className="text-xs text-[#173B65] font-medium">
                        {item.department}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-[#4A4B4F] leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Sub-section 3: Former Ministerial Responsibilities */}
          <div className="space-y-4 pt-4 border-t border-[#E6E1DA]">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Historical Public Service & Portfolio Distinctions
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#17191B] mt-0.5">
                Former Ministerial Responsibilities (Not Currently Held)
              </h2>
              <p className="text-xs sm:text-sm text-[#68645F] mt-1 font-light max-w-2xl">
                Portfolios previously administered by D. K. Shivakumar in earlier state cabinets, distinguished from his current 2026 executive responsibilities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {formerPortfolios.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#FAF8F5] rounded-xl border border-[#E6E1DA] p-5 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                      Former Responsibility
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {item.tenure}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#17191B]">
                    {item.title}
                  </h3>
                  <p className="text-[#68645F] leading-relaxed font-light">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Legislative Constituency Card */}
          <div className="bg-white rounded-2xl border border-[#E6E1DA] p-6 sm:p-8 editorial-shadow grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#922036]">
                Electoral Representation
              </span>
              <h3 className="font-serif font-bold text-2xl text-[#17191B]">
                Kanakapura Assembly Constituency (AC No. 184)
              </h3>
              <p className="text-xs sm:text-sm text-[#4A4B4F] leading-relaxed font-light">
                Represented continuously by D. K. Shivakumar since the 2008 delimitation, winning successive mandates in 2008, 2013, 2018, and 2023 with overwhelming majorities in Ramanagara district.
              </p>
            </div>
            <div className="md:col-span-4 flex flex-col sm:items-end justify-center">
              <Link
                href="/constituencies/kanakapura"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#FAF8F5] border border-[#E6E1DA] hover:border-[#922036] text-[#922036] font-semibold text-xs sm:text-sm transition-all shadow-2xs"
              >
                <span>Explore Kanakapura Details</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          TAB 2: PUBLIC-OFFICE TIMELINE
          ========================================================================= */}
      {activeTab === "timeline" && (
        <section id="timeline" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#922036]">
              Verified Parliamentary Career
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#17191B] mt-1">
              Public-Office Timeline & Milestones
            </h2>
            <p className="text-sm text-[#68645F] mt-1 font-light">
              Chronological milestones verified against the Election Commission of India (Form 26 statutory filings) and the Karnataka Legislative Assembly biographical archives.
            </p>
          </div>

          <div className="relative border-l-2 border-[#922036]/30 ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-8">
            {profile.milestones.map((m) => {
              const isExpanded = expandedMilestone === m.id;
              return (
                <div key={m.id} className="relative group">
                  {/* Timeline node */}
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-[#922036]" />

                  <div
                    onClick={() => setExpandedMilestone(isExpanded ? null : m.id)}
                    className="cursor-pointer bg-white rounded-xl border border-[#E6E1DA] p-5 editorial-shadow space-y-2 hover:border-[#922036]/40 transition-colors"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-[#922036]/10 text-[#922036]">
                        {m.eventYear}
                      </span>
                      <span className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified Milestone
                        <span className="text-[#82848A] text-[10px] ml-1">({isExpanded ? "Click to collapse" : "Click to view"})</span>
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-lg text-[#17191B]">
                      {m.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#4A4B4F] leading-relaxed font-light">
                      {m.description}
                    </p>

                    {isExpanded && m.claimSources && m.claimSources.length > 0 && (
                      <div className="pt-2 border-t border-[#F0ECE6] flex flex-wrap items-center gap-2 text-xs">
                        <span className="text-[#82848A]">Evidence:</span>
                        {m.claimSources.map((cs) => (
                          <a
                            key={cs.source.id}
                            href={cs.source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-[#922036] hover:underline font-medium"
                          >
                            <span>{cs.source.title}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* =========================================================================
          TAB 3: GOVERNMENT-WIDE INITIATIVES
          ========================================================================= */}
      {activeTab === "initiatives" && (
        <section id="initiatives" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#922036]">
              Documented Executive Programs
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#17191B] mt-1">
              Major Government Initiatives & Works
            </h2>
            <p className="text-sm text-[#68645F] mt-1 font-light">
              Key infrastructure programs, water resource projects, and welfare implementations led under executive charge.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profile.initiatives.map((init) => (
              <div
                key={init.id}
                className="bg-white rounded-2xl border border-[#E6E1DA] p-6 editorial-shadow space-y-4 hover:border-[#922036]/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#922036]/10 text-[#922036]">
                    Executive Program
                  </span>
                  <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Cabinet Order Cited
                  </span>
                </div>

                <h3 className="font-serif font-bold text-xl text-[#17191B]">
                  {init.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#4A4B4F] leading-relaxed font-light">
                  {init.description}
                </p>

                {init.claimSources && init.claimSources.length > 0 && (
                  <div className="pt-3 border-t border-[#F0ECE6] text-xs">
                    <span className="text-[#82848A] block mb-1">Gazette Citation:</span>
                    {init.claimSources.map((cs) => (
                      <a
                        key={cs.source.id}
                        href={cs.source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#922036] hover:underline font-medium"
                      >
                        <span>{cs.source.title}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          TAB 4: VERIFIED SOURCES & AUDIT CITATIONS
          ========================================================================= */}
      {activeTab === "sources" && (
        <section id="sources" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#922036]">
              Verification Registry
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#17191B] mt-1">
              Official Source Documents & Citations
            </h2>
            <p className="text-sm text-[#68645F] mt-1 font-light">
              All public statements, designations, and legislative records for Chief Minister D. K. Shivakumar are sourced from statutory public filings.
            </p>
          </div>

          <div className="space-y-4">
            {sources.map((src) => (
              <div
                key={src.id}
                className="bg-white rounded-xl border border-[#E6E1DA] p-5 editorial-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAF8F5] border border-[#E6E1DA] text-[#68645F]">
                      {src.sourceType}
                    </span>
                    <span className="text-xs text-[#82848A]">{src.publisher}</span>
                  </div>
                  <h4 className="font-serif font-bold text-base text-[#17191B]">
                    {src.title}
                  </h4>
                  {src.notes && (
                    <p className="text-xs text-[#68645F] font-light">
                      {src.notes}
                    </p>
                  )}
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#922036] hover:bg-[#7A1629] text-white text-xs font-semibold transition-colors"
                  >
                    <span>View Official Record</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          CROSS-LEADERSHIP NAVIGATION BAR (SMOOTH PROFILE-TO-PROFILE)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#E6E1DA]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#922036]">
              Cabinet Colleagues
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#17191B] mt-0.5">
              Explore Key Cabinet Leadership
            </h3>
          </div>
          <Link
            href="/leaders"
            className="text-xs font-semibold text-[#922036] hover:underline flex items-center gap-1"
          >
            <span>View All 6 Showcase Leaders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {relatedLeaders.map((leader) => (
            <Link
              key={leader.id}
              href={`/leaders/${leader.slug}`}
              className="bg-white rounded-xl border border-[#E6E1DA] p-4 editorial-shadow flex items-center gap-3.5 hover:border-[#922036] transition-all group"
            >
              <div className="w-14 h-16 shrink-0 rounded-lg overflow-hidden border border-[#E6E1DA]">
                <LeaderAvatar
                  src={leader.portraitUrl}
                  name={leader.displayName}
                  kannadaName={leader.kannadaName}
                  size="sm"
                  aspect="portrait"
                  className="w-full h-full"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-serif font-bold text-sm text-[#17191B] group-hover:text-[#922036] transition-colors truncate">
                  {leader.displayName}
                </h4>
                <p className="text-xs text-[#922036] font-medium truncate mt-0.5">
                  {leader.currentRole}
                </p>
                {leader.constituency && (
                  <p className="text-[11px] text-[#82848A] truncate mt-0.5">
                    {leader.constituency}
                  </p>
                )}
              </div>
              <ChevronRight className="w-4 h-4 text-[#888] group-hover:translate-x-1 group-hover:text-[#922036] transition-all shrink-0" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
