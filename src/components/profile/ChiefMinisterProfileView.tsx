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

  // Executive responsibilities broken down
  const executivePortfolios = [
    {
      title: "Executive Head & State Administration",
      department: "Cabinet Affairs & DPAR",
      description:
        "Chief executive oversight of state policy formulation, cabinet proceedings, administrative reforms, and inter-departmental coordination.",
      icon: <Landmark className="w-5 h-5 text-[#922036]" />,
    },
    {
      title: "Major & Medium Irrigation",
      department: "Water Resources Department",
      description:
        "Direct ministerial supervision of Karnataka's irrigation canal infrastructure, Cauvery & Krishna basin multi-purpose projects, and the Mekedatu balancing reservoir.",
      icon: <Layers className="w-5 h-5 text-blue-700" />,
    },
    {
      title: "Bengaluru City Development",
      department: "Urban Development & BBMP",
      description:
        "Metropolitan infrastructure stewardship including Brand Bengaluru white-topping, stormwater channel remodelling, and suburban transit integration.",
      icon: <Building2 className="w-5 h-5 text-emerald-700" />,
    },
    {
      title: "Finance & Fiscal Modernization",
      department: "Finance Department",
      description:
        "State revenue mobilization, statutory budget oversight, and resource allocations financing Karnataka's universal citizen welfare guarantees.",
      icon: <Sparkles className="w-5 h-5 text-amber-700" />,
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
              <Link href="/leaders" className="hover:text-white transition-colors">Leadership Showcase</Link>
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
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#922036] text-white shadow-lg tracking-wider uppercase border border-white/20">
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#922036]/30 text-[#E8A5B0] text-xs font-semibold uppercase tracking-wider border border-[#922036]/40">
                <Sparkles className="w-3.5 h-3.5" />
                Executive Leadership of Karnataka
              </div>

              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-[1.08]">
                  {profile.displayName}
                </h1>
                {profile.kannadaName && (
                  <p className="text-2xl sm:text-3xl font-kannada font-bold text-[#E8A5B0] mt-2">
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
                  <div className="text-2xl font-serif font-bold text-[#E8A5B0]">AC #184</div>
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
                  className="px-5 py-2.5 rounded-lg bg-[#922036] hover:bg-[#7A1629] text-white font-medium text-xs sm:text-sm transition-all shadow-sm flex items-center gap-2"
                >
                  <span>View Executive Portfolios</span>
                  <ArrowRight className="w-4 h-4" />
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
                ? "bg-[#922036] text-white shadow-xs"
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
                ? "bg-[#922036] text-white shadow-xs"
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
                ? "bg-[#922036] text-white shadow-xs"
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
                ? "bg-[#922036] text-white shadow-xs"
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
        <section id="responsibilities" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#922036]">
              Cabinet Portfolios & Executive Administration
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#17191B] mt-1">
              Current Executive Responsibilities
            </h2>
            <p className="text-sm text-[#68645F] mt-1 font-light max-w-2xl">
              Official governmental portfolios held by Chief Minister D. K. Shivakumar per the Karnataka Legislative Secretariat and Cabinet Secretariat notifications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {executivePortfolios.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#E6E1DA] p-6 editorial-shadow space-y-3 hover:border-[#922036]/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E6E1DA] flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#17191B]">
                      {item.title}
                    </h3>
                    <span className="text-xs text-[#922036] font-medium">
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
