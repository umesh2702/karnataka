"use client";

import React, { useState } from "react";
import Link from "next/link";
import LeaderAvatar from "@/components/profile/LeaderAvatar";
import ShareButton from "@/components/profile/ShareButton";
import {
  CheckCircle2,
  MapPin,
  ExternalLink,
  ArrowRight,
  ChevronRight,
  Building2,
  Layers,
  Sparkles,
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

interface CabinetMinisterProfileViewProps {
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

export default function CabinetMinisterProfileView({
  profile,
  sources,
  relatedLeaders,
}: CabinetMinisterProfileViewProps) {
  const [activeTab, setActiveTab] = useState<"department" | "initiatives" | "timeline" | "sources">("department");

  // Determine department badge & description based on minister slug
  const getDepartmentDetails = () => {
    switch (profile.slug) {
      case "priyank-kharge":
        return {
          deptName: "Home (excluding Intelligence), IT & BT, and E-Governance",
          badge: "Internal Security, Technology & E-Governance",
          icon: <Sparkles className="w-5 h-5 text-[#173B65]" />,
          mandate:
            "Ministerial supervision of Karnataka State Police administration and law enforcement (excluding Intelligence), advancing IT/BT innovation ecosystems, Beyond Bengaluru technology clusters, and statewide e-governance service delivery platforms.",
        };
      case "mb-patil":
        return {
          deptName: "Large & Medium Industries and Infrastructure Development",
          badge: "Industrial Growth & Infrastructure",
          icon: <Building2 className="w-5 h-5 text-[#173B65]" />,
          mandate:
            "Direct ministerial oversight of Karnataka's manufacturing clusters, aerospace and semiconductor industrial parks, major investor summits, and state infrastructure connectivity projects.",
        };
      case "satish-jarkiholi":
        return {
          deptName: "Public Works Department (PWD)",
          badge: "State Roadway Connectivity & Public Works",
          icon: <Layers className="w-5 h-5 text-[#F47A20]" />,
          mandate:
            "Executing statewide state highway four-laning, major district road upgrades, bridge infrastructure, and freight corridor expansion across all 31 districts of Karnataka.",
        };
      case "krishna-byre-gowda":
        return {
          deptName: "Greater Bengaluru Development and Parliamentary Affairs and Legislation",
          badge: "Metropolitan Planning & Legislative Governance",
          icon: <Landmark className="w-5 h-5 text-[#16864A]" />,
          mandate:
            "Comprehensive oversight of Greater Bengaluru metropolitan planning, civic infrastructure coordination, suburban transit connectivity, and managing legislative business and statutory drafting in the Karnataka State Legislature.",
        };
      default:
        return {
          deptName: profile.portfolio || "Government of Karnataka",
          badge: "Cabinet Ministry",
          icon: <Building2 className="w-5 h-5 text-[#173B65]" />,
          mandate: profile.shortBio,
        };
    }
  };

  const dept = getDepartmentDetails();

  return (
    <div className="space-y-12 sm:space-y-16 pb-20">
      {/* =========================================================================
          MINISTERIAL PROFILE HERO
          ========================================================================= */}
      <section className="relative overflow-hidden bg-white border-b border-[#E6E1DA] pt-8 pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E6E1DA] text-xs">
            <div className="flex items-center gap-2 text-[#68645F]">
              <Link href="/" className="hover:text-[#17191B] transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#888]" />
              <Link href="/leaders" className="hover:text-[#17191B] transition-colors">Leadership Directory</Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#888]" />
              <span className="text-[#17191B] font-semibold">{profile.displayName}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Verified Official Record
              </span>
              <ShareButton title={profile.displayName} />
            </div>
          </div>

          {/* Profile Header Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-8 items-center">
            {/* Portrait / Monogram */}
            <div className="md:col-span-4 flex justify-center">
              <div className="relative w-full max-w-xs aspect-[3/4] rounded-2xl overflow-hidden border border-[#E6E1DA] shadow-lg bg-[#EFECE6]">
                <LeaderAvatar
                  src={profile.portraitUrl}
                  name={profile.displayName}
                  kannadaName={profile.kannadaName}
                  size="hero"
                  aspect="portrait"
                  className="w-full h-full"
                  priority={true}
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#173B65] text-white shadow-xs border border-[#F47A20]/40">
                    Cabinet Minister
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Intro */}
            <div className="md:col-span-8 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#173B65]/10 border border-[#173B65]/20 text-[#173B65] text-xs font-semibold uppercase tracking-wider">
                {dept.badge}
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#17191B] tracking-tight">
                  {profile.displayName}
                </h1>
                {profile.kannadaName && (
                  <p className="text-xl sm:text-2xl font-kannada font-bold text-[#173B65] mt-1.5">
                    {profile.kannadaName}
                  </p>
                )}
                <p className="text-sm sm:text-base text-[#17191B] font-semibold mt-2">
                  {profile.currentRole}
                </p>
                {profile.portfolio && (
                  <p className="text-xs sm:text-sm text-[#68645F] mt-0.5 font-light">
                    Portfolio: {profile.portfolio}
                  </p>
                )}
              </div>

              <p className="text-xs sm:text-sm text-[#4A4B4F] leading-relaxed font-light">
                {profile.shortBio}
              </p>

              {/* Constituency Quick Box */}
              {profile.constituency && (
                <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E6E1DA] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#922036]" />
                    <span className="text-[#17191B] font-medium">
                      Elected MLA for <strong>{profile.constituency}</strong>
                    </span>
                    {profile.district && (
                      <span className="text-[#68645F]">({profile.district} District)</span>
                    )}
                  </div>

                  <span className="text-[11px] font-mono text-[#82848A]">
                    Karnataka Legislative Assembly
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="h-[2px] w-full tricolor-hairline opacity-75 mt-8" />
      </section>

      {/* =========================================================================
          TABS NAVIGATION
          ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-[#E6E1DA] bg-white rounded-xl p-1.5 editorial-shadow flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("department")}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "department"
                ? "bg-[#173B65] text-white shadow-xs"
                : "text-[#68645F] hover:bg-[#FAF8F5] hover:text-[#17191B]"
            }`}
          >
            Department Mandate & Responsibilities
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
            Documented Initiatives ({profile.initiatives.length})
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
          TAB 1: DEPARTMENT SCOPE & MANDATE
          ========================================================================= */}
      {activeTab === "department" && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="bg-white rounded-2xl border border-[#E6E1DA] p-6 sm:p-8 editorial-shadow space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-[#E6E1DA] flex items-center justify-center">
                {dept.icon}
              </div>
              <div>
                <h3 className="font-serif font-bold text-2xl text-[#17191B]">
                  {dept.deptName}
                </h3>
                <span className="text-xs text-[#922036] font-semibold uppercase tracking-wider">
                  Official Ministerial Portfolio
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#4A4B4F] leading-relaxed font-light">
              {dept.mandate}
            </p>

            <div className="pt-4 border-t border-[#F0ECE6]">
              <h4 className="font-serif font-bold text-base text-[#17191B] mb-2">
                Biographical & Legislative Background
              </h4>
              <p className="text-xs sm:text-sm text-[#4A4B4F] leading-relaxed font-light whitespace-pre-line">
                {profile.biography}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          TAB 2: DOCUMENTED INITIATIVES
          ========================================================================= */}
      {activeTab === "initiatives" && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#922036]">
              Department Programs
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#17191B] mt-1">
              Documented Initiatives & Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profile.initiatives.map((init) => (
              <div
                key={init.id}
                className="bg-white rounded-2xl border border-[#E6E1DA] p-6 editorial-shadow space-y-3 hover:border-[#922036]/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#922036]/10 text-[#922036]">
                    Ministerial Program
                  </span>
                  <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified Order
                  </span>
                </div>

                <h3 className="font-serif font-bold text-xl text-[#17191B]">
                  {init.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#4A4B4F] leading-relaxed font-light">
                  {init.description}
                </p>

                {init.claimSources && init.claimSources.length > 0 && (
                  <div className="pt-2 border-t border-[#F0ECE6] text-xs">
                    <span className="text-[#82848A]">Source: </span>
                    {init.claimSources.map((cs) => (
                      <a
                        key={cs.source.id}
                        href={cs.source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#922036] hover:underline font-medium inline-flex items-center gap-1"
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
          TAB 3: TIMELINE
          ========================================================================= */}
      {activeTab === "timeline" && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#922036]">
              Public Service Record
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#17191B] mt-1">
              Public-Office Timeline
            </h2>
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
                      Official Legislative Archive
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
          TAB 4: SOURCES
          ========================================================================= */}
      {activeTab === "sources" && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
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
                  <span>View Source</span>
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
