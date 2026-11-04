"use client";

import React, { useState } from "react";
import Link from "next/link";
import LeaderAvatar from "@/components/profile/LeaderAvatar";
import ShareButton from "@/components/profile/ShareButton";
import {
  ShieldCheck,
  CheckCircle2,
  MapPin,
  ExternalLink,
  ArrowRight,
  ChevronRight,
  GraduationCap,
  Shield,
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

interface DeputyChiefMinisterProfileViewProps {
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
  };
  sources: SourceItem[];
  relatedLeaders: RelatedLeader[];
}

export default function DeputyChiefMinisterProfileView({
  profile,
  sources,
  relatedLeaders,
}: DeputyChiefMinisterProfileViewProps) {
  const [activeTab, setActiveTab] = useState<"portfolios" | "timeline" | "academic" | "sources">("portfolios");

  const dcmPortfolios = [
    {
      title: "Revenue Administration & Land Governance",
      department: "Department of Revenue",
      focus: "Bhoomi 3.0, Digital Land Records, Survey Reforms & Disaster Mitigation",
      description:
        "Statewide supervision of land administration, digitization of farmer tenancy records, taluk revenue modernization, and Karnataka State Natural Disaster Monitoring Centre (KSNDMC) operations.",
      icon: <Landmark className="w-5 h-5 text-[#173B65]" />,
    },
    {
      title: "Youth Empowerment & Sports Administration",
      department: "Department of Youth Empowerment and Sports (DYES)",
      focus: "District Sports Complexes, Rural Athletics, Khelo India & Youth Welfare",
      description:
        "Direct ministerial supervision of state sports infrastructure, rural athlete training centers, sports scholarships, and modern athletic facilities across all 31 districts.",
      icon: <GraduationCap className="w-5 h-5 text-[#F47A20]" />,
    },
    {
      title: "Koratagere (SC) Legislative Development",
      department: "Constituency Administration · AC #132",
      focus: "Tumakuru District Irrigation, Drinking Water & Rural Education",
      description:
        "Dedicated representation of Koratagere reserved assembly constituency in Tumakuru, advancing local check-dam irrigation networks and rural educational campuses.",
      icon: <MapPin className="w-5 h-5 text-[#16864A]" />,
    },
  ];

  return (
    <div className="space-y-12 sm:space-y-16 pb-20">
      {/* =========================================================================
          DISTINCT EXECUTIVE HERO: DEPUTY CHIEF MINISTER
          ========================================================================= */}
      <section className="relative overflow-hidden bg-white border-b border-[#E6E1DA] pt-8 pb-14 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Breadcrumbs */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E6E1DA] text-xs">
            <div className="flex items-center gap-2 text-[#68645F]">
              <Link href="/" className="hover:text-[#17191B] transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#888]" />
              <Link href="/leaders" className="hover:text-[#17191B] transition-colors">Leadership Directory</Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#888]" />
              <span className="text-[#17191B] font-semibold">Deputy Chief Minister</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Verified Official Record
              </span>
              <ShareButton title={profile.displayName} />
            </div>
          </div>

          {/* Hero Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-8 sm:pt-10 items-center">
            {/* Left: Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#173B65]/10 text-[#173B65] text-xs font-semibold uppercase tracking-wider border border-[#173B65]/20">
                <ShieldCheck className="w-4 h-4 text-[#F47A20]" />
                Deputy Chief Minister of Karnataka
              </div>

              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-serif font-bold text-[#17191B] tracking-tight leading-[1.1]">
                  {profile.displayName}
                </h1>
                {profile.kannadaName && (
                  <p className="text-2xl sm:text-3xl font-kannada font-bold text-[#173B65] mt-2">
                    {profile.kannadaName}
                  </p>
                )}
                <p className="text-base sm:text-lg text-[#68645F] font-light mt-3 flex items-center gap-2">
                  <span className="font-semibold text-[#17191B]">Deputy Chief Minister</span>
                  <span>·</span>
                  <span className="font-medium text-[#173B65]">Minister for Revenue & Sports</span>
                  <span>·</span>
                  <span className="font-mono text-xs text-[#F47A20] font-semibold">Ph.D. Adelaide</span>
                </p>
              </div>

              <p className="text-sm sm:text-base text-[#4A4B4F] leading-relaxed font-light max-w-2xl">
                {profile.shortBio}
              </p>

              {/* Verified Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-[#FAF8F5] border border-[#E6E1DA]">
                <div>
                  <div className="text-xl sm:text-2xl font-serif font-bold text-[#17191B]">6 Terms</div>
                  <div className="text-[11px] text-[#68645F]">Karnataka Assembly</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-serif font-bold text-[#173B65]">8 Years</div>
                  <div className="text-[11px] text-[#68645F]">KPCC President (2010–18)</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-serif font-bold text-[#17191B]">AC #132</div>
                  <div className="text-[11px] text-[#68645F]">Koratagere (SC)</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-serif font-bold text-[#17191B]">Ph.D.</div>
                  <div className="text-[11px] text-[#68645F]">Univ. of Adelaide</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#portfolios"
                  className="px-5 py-2.5 rounded-lg bg-[#173B65] hover:bg-[#0F2744] text-white font-medium text-xs sm:text-sm transition-all shadow-sm flex items-center gap-2 border border-[#F47A20]/40"
                >
                  <span>Explore Revenue & Portfolios</span>
                  <ArrowRight className="w-4 h-4 text-[#F47A20]" />
                </a>

                <Link
                  href="/constituencies/koratagere"
                  className="px-5 py-2.5 rounded-lg bg-white border border-[#E6E1DA] hover:border-[#173B65] text-[#17191B] font-medium text-xs sm:text-sm transition-all shadow-2xs flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-[#173B65]" />
                  <span>Koratagere Constituency Profile</span>
                </Link>
              </div>
            </div>

            {/* Right: Prominent Authentic Portrait */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden border border-[#E6E1DA] shadow-xl bg-[#EFECE6]">
                <LeaderAvatar
                  src={profile.portraitUrl}
                  name={profile.displayName}
                  kannadaName={profile.kannadaName}
                  size="hero"
                  aspect="portrait"
                  className="w-full h-full"
                  priority={true}
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#17191B] text-white shadow-md tracking-wider uppercase border border-white/20">
                    Deputy Chief Minister
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-[2px] w-full tricolor-hairline opacity-75 mt-8" />
      </section>

      {/* =========================================================================
          TAB NAVIGATION
          ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-[#E6E1DA] bg-white rounded-xl p-1.5 editorial-shadow flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("portfolios")}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "portfolios"
                ? "bg-[#173B65] text-white shadow-xs"
                : "text-[#68645F] hover:bg-[#FAF8F5] hover:text-[#17191B]"
            }`}
          >
            Portfolios & Governance
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
            onClick={() => setActiveTab("academic")}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "academic"
                ? "bg-[#173B65] text-white shadow-xs"
                : "text-[#68645F] hover:bg-[#FAF8F5] hover:text-[#17191B]"
            }`}
          >
            Academic & Scientific Credentials
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
          TAB 1: PORTFOLIOS & GOVERNANCE
          ========================================================================= */}
      {activeTab === "portfolios" && (
        <section id="portfolios" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#173B65]">
              Executive Portfolios
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#17191B] mt-1">
              Portfolios & Administrative Mandates
            </h2>
            <p className="text-sm text-[#68645F] mt-1 font-light max-w-2xl">
              Under Dr. G. Parameshwara&apos;s executive stewardship as Deputy Chief Minister, Minister for Revenue and Youth Empowerment & Sports.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dcmPortfolios.map((item, idx) => (
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
                    <span className="text-xs text-[#922036] font-medium block">
                      {item.department}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[#68645F] font-mono">
                  Focus: {item.focus}
                </p>
                <p className="text-xs sm:text-sm text-[#4A4B4F] leading-relaxed font-light">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          TAB 2: TIMELINE
          ========================================================================= */}
      {activeTab === "timeline" && (
        <section id="timeline" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#922036]">
              Legislative Record
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#17191B] mt-1">
              Public-Office Timeline
            </h2>
            <p className="text-sm text-[#68645F] mt-1 font-light">
              Verified historical tenures from legislative gazette member sketches.
            </p>
          </div>

          <div className="relative border-l-2 border-[#922036]/30 ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-8">
            {profile.milestones.map((m) => (
              <div key={m.id} className="relative group">
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-[#922036]" />

                <div className="bg-white rounded-xl border border-[#E6E1DA] p-5 editorial-shadow space-y-2 hover:border-[#922036]/40 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-[#922036]/10 text-[#922036]">
                      {m.eventYear}
                    </span>
                    <span className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3 h-3" />
                      Official Gazette Record
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-[#17191B]">
                    {m.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#4A4B4F] leading-relaxed font-light">
                    {m.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          TAB 3: ACADEMIC CREDENTIALS
          ========================================================================= */}
      {activeTab === "academic" && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="bg-white rounded-2xl border border-[#E6E1DA] p-6 sm:p-8 editorial-shadow space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#922036]/10 text-[#922036] flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-2xl text-[#17191B]">
                  Academic Background & Doctoral Research
                </h3>
                <span className="text-xs text-[#922036] font-semibold uppercase tracking-wider">
                  Agricultural Scientist · University of Adelaide
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#4A4B4F] leading-relaxed font-light">
              Dr. G. Parameshwara graduated with a Bachelor of Science (B.Sc.) and Master of Science (M.Sc.) in Agriculture from the University of Agricultural Sciences, Bangalore. He was awarded a Doctor of Philosophy (Ph.D.) in Plant Physiology from the Waite Agricultural Research Institute, University of Adelaide, Australia, for groundbreaking research in drought resistance and crop physiology.
            </p>
          </div>
        </section>
      )}

      {/* =========================================================================
          TAB 4: SOURCES
          ========================================================================= */}
      {activeTab === "sources" && (
        <section id="sources" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#922036]">
              Verification Citations
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#17191B] mt-1">
              Official Source Documents
            </h2>
          </div>

          <div className="space-y-4">
            {sources.map((src) => (
              <div
                key={src.id}
                className="bg-white rounded-xl border border-[#E6E1DA] p-5 editorial-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E6E1DA] text-[#68645F]">
                    {src.publisher}
                  </span>
                  <h4 className="font-serif font-bold text-base text-[#17191B] mt-1">
                    {src.title}
                  </h4>
                </div>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#922036] hover:bg-[#7A1629] text-white text-xs font-semibold transition-colors shrink-0"
                >
                  <span>View Gazette</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          CROSS-LEADERSHIP NAVIGATION BAR
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#E6E1DA]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#922036]">
              Cabinet Colleagues
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#17191B] mt-0.5">
              Explore Showcase Leadership
            </h3>
          </div>
          <Link
            href="/leaders"
            className="text-xs font-semibold text-[#922036] hover:underline flex items-center gap-1"
          >
            <span>View All Showcase Leaders</span>
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
