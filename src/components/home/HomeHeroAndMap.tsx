"use client";

import React from "react";
import Link from "next/link";
import LeaderAvatar from "@/components/profile/LeaderAvatar";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Scale,
  MapPin,
  Award,
  BookOpen,
  ExternalLink,
  Zap,
  Bus,
  Sparkles,
  GraduationCap,
  Layers,
  Landmark,
} from "lucide-react";

interface ProfileSummary {
  id: string;
  slug: string;
  displayName: string;
  kannadaName?: string | null;
  currentRole: string;
  party?: string | null;
  portfolio?: string | null;
  constituency?: string | null;
  district?: string | null;
  region?: string | null;
  organisationName?: string | null;
  shortBio: string;
  portraitUrl?: string | null;
  roleLastVerifiedAt?: string | Date | null;
  _count?: {
    milestones: number;
    initiatives: number;
  };
}

interface SchemeSummary {
  id: string;
  name: string;
  kannadaName?: string | null;
  slug: string;
  tagline: string;
  description: string;
  department: string;
  eligibility: string;
  benefits: string;
  applicationUrl?: string | null;
  officialSourceUrl: string;
  sortOrder: number;
}

interface ProjectSummary {
  id: string;
  title: string;
  description: string;
  location?: string | null;
  department?: string | null;
  stage: string;
  budgetAmount?: string | null;
  evidenceUrl?: string | null;
  verificationStatus?: string | null;
  announcedDate?: string | Date | null;
  constituency?: {
    name: string;
    number: number;
    district: string;
    slug: string;
  } | null;
  leaderProfile?: {
    displayName: string;
    slug: string;
    currentRole: string;
  } | null;
}

interface HomeHeroAndMapProps {
  publishedProfiles: ProfileSummary[];
  cmProfile?: ProfileSummary | null;
  dcmProfile?: ProfileSummary | null;
  cabinetMinisters?: ProfileSummary[];
  schemes?: SchemeSummary[];
  projects?: ProjectSummary[];
}

export default function HomeHeroAndMap({
  publishedProfiles,
  cmProfile,
  dcmProfile,
  cabinetMinisters = [],
  schemes = [],
  projects = [],
}: HomeHeroAndMapProps) {
  // If cmProfile or dcmProfile are not provided directly, find them from publishedProfiles
  const resolvedCm = cmProfile || publishedProfiles.find((p) => p.slug === "dk-shivakumar") || null;
  const resolvedDcm = dcmProfile || publishedProfiles.find((p) => p.slug === "g-parameshwara") || null;

  // The four selected cabinet ministers for the showcase
  const cabinetSlugs = ["priyank-kharge", "mb-patil", "satish-jarkiholi", "krishna-byre-gowda"];
  const resolvedCabinet = cabinetMinisters.length > 0
    ? cabinetMinisters
    : publishedProfiles.filter((p) => cabinetSlugs.includes(p.slug));

  const getSchemeIcon = (slug: string) => {
    switch (slug) {
      case "gruha-lakshmi":
        return <Award className="w-5 h-5 text-[#922036]" />;
      case "gruha-jyothi":
        return <Zap className="w-5 h-5 text-amber-600" />;
      case "shakthi-scheme":
        return <Bus className="w-5 h-5 text-emerald-700" />;
      case "anna-bhagya":
        return <Sparkles className="w-5 h-5 text-sky-700" />;
      case "yuva-nidhi":
        return <GraduationCap className="w-5 h-5 text-indigo-700" />;
      default:
        return <BookOpen className="w-5 h-5 text-[#922036]" />;
    }
  };

  return (
    <div className="space-y-16 md:space-y-24">
      {/* =========================================================================
          SECTION 1: HERO SECTION — EDITORIAL COMPOSITION
          ========================================================================= */}
      <section className="relative overflow-hidden border-b border-[#E6E1DA] pt-8 pb-16 md:pt-14 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Platform Identity Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#173B65]/10 text-[#173B65] text-xs font-semibold tracking-wider uppercase mb-6 border border-[#173B65]/20">
            <span className="w-2 h-2 rounded-full bg-[#F47A20]" />
            KARNATAKA PRADESH CONGRESS COMMITTEE · OFFICIAL DIGITAL PLATFORM
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Headline & Action Column */}
            <div className="lg:col-span-6 space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-[3.6rem] font-serif font-bold text-[#242424] tracking-tight leading-[1.08]">
                Governance, documented <br className="hidden sm:inline" />
                <span className="italic font-normal text-[#173B65]">through verified leadership.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#68645F] leading-relaxed max-w-xl font-light">
                An institutional digital platform documenting the executive leadership of the Indian National Congress in Karnataka, verified departmental portfolios, flagship Five Guarantees, and evidence-linked public initiatives.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                {resolvedCm && (
                  <Link
                    href={`/leaders/${resolvedCm.slug}`}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#173B65] text-white font-medium text-sm hover:bg-[#0F2744] transition-all shadow-sm group border border-[#F47A20]/40"
                  >
                    <span>Chief Minister Profile</span>
                    <ArrowRight className="w-4 h-4 text-[#F47A20] transition-transform group-hover:translate-x-0.5" />
                  </Link>
                )}

                <a
                  href="#cabinet-leadership"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-lg bg-white border border-[#E5E1D8] text-[#242424] font-medium text-sm hover:bg-[#F8F7F3] hover:border-[#173B65] transition-all shadow-2xs"
                >
                  <Landmark className="w-4 h-4 text-[#173B65]" />
                  <span>Cabinet Ministers</span>
                </a>

                <a
                  href="#documented-initiatives"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-lg bg-[#FAF8F5] border border-[#E5E1D8] text-[#173B65] font-medium text-sm hover:bg-white hover:border-[#173B65] transition-all shadow-2xs"
                >
                  <Sparkles className="w-4 h-4 text-[#F47A20]" />
                  <span>Documented Works</span>
                </a>
              </div>

              {/* Verified Metrics Strip (Focused Scope) */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#E5E1D8]">
                <div>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-[#173B65]">6 Leaders</div>
                  <div className="text-[11px] text-[#68645F] mt-0.5">Verified Showcase Profiles</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-[#F47A20]">5 Guarantees</div>
                  <div className="text-[11px] text-[#68645F] mt-0.5">Flagship Citizen Welfare</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-[#16864A]">Evidence-Linked</div>
                  <div className="text-[11px] text-[#68645F] mt-0.5">Gazettes & Statutory Filings</div>
                </div>
              </div>
            </div>

            {/* Right Side: Dual Executive Cards (CM D. K. Shivakumar & DCM Dr. G. Parameshwara) */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Card 1: Chief Minister D. K. Shivakumar */}
              {resolvedCm && (
                <div className="bg-white rounded-2xl border border-[#E5E1D8] p-5 editorial-shadow flex flex-col justify-between hover:border-[#173B65]/50 transition-all">
                  <div className="space-y-4">
                    <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-[#EFECE6]">
                      <LeaderAvatar
                        src={resolvedCm.portraitUrl}
                        name={resolvedCm.displayName}
                        kannadaName={resolvedCm.kannadaName}
                        size="hero"
                        aspect="portrait"
                        className="w-full h-full"
                        priority={true}
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#173B65] text-white shadow-xs uppercase tracking-wider border border-[#F47A20]/40">
                          Chief Minister
                        </span>
                      </div>
                    </div>

                    <div>
                      <h2 className="font-serif font-bold text-xl text-[#242424]">
                        <Link href={`/leaders/${resolvedCm.slug}`} className="hover:text-[#173B65] transition-colors">{resolvedCm.displayName}</Link>
                      </h2>
                      {resolvedCm.kannadaName && (
                        <p className="text-xs font-kannada font-semibold text-[#173B65]">
                          {resolvedCm.kannadaName}
                        </p>
                      )}
                      <p className="text-xs font-semibold text-[#173B65] mt-1">
                        Chief Minister of Karnataka
                      </p>
                      <p className="text-[11px] text-[#68645F] mt-0.5">
                        MLA, Kanakapura (AC No. 184) · Ramanagara
                      </p>
                    </div>

                    <p className="text-xs text-[#4A4B4F] line-clamp-3 leading-relaxed font-light">
                      {resolvedCm.shortBio}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#F0ECE6] flex items-center justify-between">
                    <span className="text-[10px] text-[#68645F] flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3 h-3 text-[#16864A]" />
                      Official Record
                    </span>
                    <Link
                      href={`/leaders/${resolvedCm.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#173B65] hover:text-[#0F2744]"
                    >
                      <span>Executive Profile</span>
                      <ArrowRight className="w-3 h-3 text-[#F47A20]" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Card 2: Deputy Chief Minister Dr. G. Parameshwara */}
              {resolvedDcm && (
                <div className="bg-white rounded-2xl border border-[#E5E1D8] p-5 editorial-shadow flex flex-col justify-between hover:border-[#173B65]/50 transition-all">
                  <div className="space-y-4">
                    <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-[#EFECE6]">
                      <LeaderAvatar
                        src={resolvedDcm.portraitUrl}
                        name={resolvedDcm.displayName}
                        kannadaName={resolvedDcm.kannadaName}
                        size="hero"
                        aspect="portrait"
                        className="w-full h-full"
                        priority={true}
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#173B65] text-white shadow-xs uppercase tracking-wider border border-[#16864A]/40">
                          Deputy Chief Minister
                        </span>
                      </div>
                    </div>

                    <div>
                      <h2 className="font-serif font-bold text-xl text-[#242424]">
                        <Link href={`/leaders/${resolvedDcm.slug}`} className="hover:text-[#173B65] transition-colors">{resolvedDcm.displayName}</Link>
                      </h2>
                      {resolvedDcm.kannadaName && (
                        <p className="text-xs font-kannada font-semibold text-[#173B65]">
                          {resolvedDcm.kannadaName}
                        </p>
                      )}
                      <p className="text-xs font-semibold text-[#173B65] mt-1">
                        Deputy Chief Minister of Karnataka
                      </p>
                      <p className="text-[11px] text-[#68645F] mt-0.5">
                        MLA, Koratagere (SC AC No. 132) · Tumakuru
                      </p>
                    </div>

                    <p className="text-xs text-[#4A4B4F] line-clamp-3 leading-relaxed font-light">
                      {resolvedDcm.shortBio}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#F0ECE6] flex items-center justify-between">
                    <span className="text-[10px] text-[#68645F] flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3 h-3 text-[#16864A]" />
                      Official Record
                    </span>
                    <Link
                      href={`/leaders/${resolvedDcm.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#173B65] hover:text-[#0F2744]"
                    >
                      <span>Executive Profile</span>
                      <ArrowRight className="w-3 h-3 text-[#F47A20]" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: CABINET LEADERSHIP — FOUR SELECTED MINISTERS
          ========================================================================= */}
      <section id="cabinet-leadership" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 border-b border-[#E5E1D8] gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#173B65]/10 text-[#173B65] text-xs font-semibold uppercase tracking-wider mb-1 border border-[#173B65]/20">
              <Landmark className="w-3.5 h-3.5 text-[#F47A20]" />
              State Executive Governance
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#242424]">
              Cabinet Ministerial Leadership
            </h2>
            <p className="text-sm text-[#68645F] mt-1 font-light">
              Selected key ministries driving internal security & technology, industries, roadways, and Greater Bengaluru development.
            </p>
          </div>

          <Link
            href="/leaders"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#173B65] hover:text-[#0F2744] uppercase tracking-wider shrink-0"
          >
            <span>All 6 Showcase Profiles</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#F47A20]" />
          </Link>
        </div>

        {/* 4-Column Ministerial Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
          {resolvedCabinet.map((leader) => (
            <article
              key={leader.id}
              className="bg-white rounded-2xl border border-[#E5E1D8] p-5 editorial-shadow flex flex-col justify-between hover:border-[#173B65]/50 transition-all space-y-4"
            >
              <div className="space-y-4">
                <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-[#EFECE6] border border-[#E5E1D8]">
                  <LeaderAvatar
                    src={leader.portraitUrl}
                    name={leader.displayName}
                    kannadaName={leader.kannadaName}
                    size="md"
                    aspect="portrait"
                    className="w-full h-full"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#173B65]/90 backdrop-blur-xs text-white border border-[#F47A20]/30">
                      Cabinet Minister
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-lg text-[#242424] hover:text-[#173B65] transition-colors leading-snug">
                    <Link href={`/leaders/${leader.slug}`}>{leader.displayName}</Link>
                  </h3>
                  {leader.kannadaName && (
                    <p className="text-xs font-kannada font-semibold text-[#173B65] mt-0.5">
                      {leader.kannadaName}
                    </p>
                  )}
                  <p className="text-xs font-semibold text-[#173B65] mt-1 line-clamp-1">
                    {leader.currentRole}
                  </p>
                  {leader.constituency && (
                    <p className="text-[11px] text-[#68645F] mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#173B65] shrink-0" />
                      <span className="truncate">{leader.constituency}</span>
                    </p>
                  )}
                </div>

                <p className="text-xs text-[#4A4B4F] line-clamp-3 leading-relaxed font-light">
                  {leader.shortBio}
                </p>
              </div>

              <div className="pt-3 border-t border-[#F0ECE6] flex items-center justify-between text-xs">
                <span className="text-[10px] text-[#16864A] font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </span>
                <Link
                  href={`/leaders/${leader.slug}`}
                  className="font-semibold text-[#173B65] hover:text-[#0F2744] inline-flex items-center gap-1"
                >
                  <span>View Profile</span>
                  <ArrowRight className="w-3 h-3 text-[#F47A20]" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: DOCUMENTED INITIATIVES & WORKS
          ========================================================================= */}
      <section id="documented-initiatives" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 border-b border-[#E5E1D8] gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#173B65]/10 text-[#173B65] text-xs font-semibold uppercase tracking-wider mb-1 border border-[#173B65]/20">
              <Layers className="w-3.5 h-3.5 text-[#F47A20]" />
              Evidence-Linked Execution
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#242424]">
              Key Works & Departmental Initiatives
            </h2>
            <p className="text-sm text-[#68645F] mt-1 font-light">
              Major infrastructure works, industrial clusters, and digital programs documented with verified stages, departments, and evidence links.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          {projects.map((project) => {
            const stageBadgeColors: Record<string, string> = {
              COMPLETED: "bg-emerald-50 text-emerald-800 border-emerald-200",
              ONGOING: "bg-blue-50 text-blue-800 border-blue-200",
              APPROVED: "bg-purple-50 text-purple-800 border-purple-200",
              PROPOSED: "bg-amber-50 text-amber-800 border-amber-200",
              DELAYED: "bg-orange-50 text-orange-800 border-orange-200",
              CANCELLED: "bg-red-50 text-red-800 border-red-200",
            };

            return (
              <div
                key={project.id}
                className="bg-white rounded-2xl border border-[#E5E1D8] p-6 editorial-shadow flex flex-col justify-between hover:border-[#173B65]/50 transition-all space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                          stageBadgeColors[project.stage] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {project.stage}
                      </span>
                      {project.verificationStatus === "VERIFIED" && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Verified Evidence
                        </span>
                      )}
                      {project.verificationStatus === "PARTIALLY_VERIFIED" && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                          Partially Verified
                        </span>
                      )}
                      {project.verificationStatus === "NEEDS_REVIEW" && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                          Review Pending
                        </span>
                      )}
                    </div>
                    {project.budgetAmount && (
                      <span
                        className="text-xs font-mono font-bold text-[#173B65] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E5E1D8] truncate max-w-[200px]"
                        title={project.budgetAmount}
                      >
                        {project.budgetAmount}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif font-bold text-lg text-[#242424] leading-snug">
                    {project.title}
                  </h3>

                  <p className="text-xs text-[#4A4B4F] leading-relaxed line-clamp-3 font-light">
                    {project.description}
                  </p>

                  <div className="pt-2 border-t border-[#F0ECE6] space-y-1 text-xs text-[#68645F]">
                    {project.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#173B65]" />
                        <span>{project.location}</span>
                      </div>
                    )}
                    {project.leaderProfile && (
                      <div className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-[#F47A20]" />
                        <span>Minister: {project.leaderProfile.displayName}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F0ECE6] flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#82848A] truncate max-w-[180px]">
                    {project.department || "Government of Karnataka"}
                  </span>
                  {project.evidenceUrl && (
                    <a
                      href={project.evidenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-[#173B65] hover:underline"
                    >
                      <span>Evidence</span>
                      <ExternalLink className="w-3 h-3 text-[#F47A20]" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: THE FIVE GUARANTEES SHOWCASE
          ========================================================================= */}
      <section id="five-guarantees" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 border-b border-[#E5E1D8] gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#173B65]/10 text-[#173B65] text-xs font-semibold uppercase tracking-wider mb-1 border border-[#173B65]/20">
              <Sparkles className="w-3.5 h-3.5 text-[#F47A20]" />
              Flagship Social Contract
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#242424]">
              Karnataka&apos;s Five Guarantees
            </h2>
            <p className="text-sm text-[#68645F] mt-1 font-light">
              Universal citizen entitlements enacted by the Karnataka Cabinet, cited with official department sources.
            </p>
          </div>

          <Link
            href="/schemes"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#173B65] hover:text-[#0F2744] uppercase tracking-wider shrink-0"
          >
            <span>Detailed Schemes Guide</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#F47A20]" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          {schemes.map((scheme) => (
            <div
              key={scheme.id}
              className="bg-white rounded-2xl border border-[#E5E1D8] p-6 editorial-shadow flex flex-col justify-between hover:border-[#173B65]/50 transition-all space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E5E1D8] flex items-center justify-center">
                    {getSchemeIcon(scheme.slug)}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Active Guarantee
                  </span>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-xl text-[#242424]">
                    {scheme.name}
                  </h3>
                  {scheme.kannadaName && (
                    <p className="text-xs font-kannada font-semibold text-[#173B65] mt-0.5">
                      {scheme.kannadaName}
                    </p>
                  )}
                  <p className="text-xs text-[#82848A] mt-1">{scheme.department}</p>
                </div>

                <p className="text-xs text-[#4A4B4F] leading-relaxed line-clamp-3 font-light">
                  {scheme.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#F0ECE6] flex items-center justify-between text-xs">
                {scheme.applicationUrl ? (
                  <a
                    href={scheme.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#173B65] hover:underline inline-flex items-center gap-1"
                  >
                    <span>Apply via Seva Sindhu</span>
                    <ExternalLink className="w-3 h-3 text-[#F47A20]" />
                  </a>
                ) : (
                  <span className="text-[#888]">Direct Benefit Transfer</span>
                )}

                <Link
                  href={`/schemes#${scheme.slug}`}
                  className="font-medium text-[#68645F] hover:text-[#242424]"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: PLATFORM INTRODUCTION & EDITORIAL STANDARDS
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white rounded-2xl border border-[#E5E1D8] p-8 sm:p-10 editorial-shadow space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#173B65]/10 text-[#173B65] flex items-center justify-center font-bold">
              <Scale className="w-5 h-5 text-[#F47A20]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl text-[#242424]">
                Institutional Platform Architecture & Governance
              </h3>
              <p className="text-xs text-[#68645F]">
                Authoritative digital governance infrastructure developed in technical partnership with UCreates
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#4A4B4F] leading-relaxed font-light">
            Built to institutional standards for the Karnataka Pradesh Congress Committee (KPCC), this platform establishes a single, verified digital destination documenting executive leadership responsibilities, the flagship Five Guarantees citizen welfare architecture, and evidence-linked developmental milestones across Karnataka. Developed by technology partner UCreates with rigorous source citations.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-[#68645F] border-t border-[#F0ECE6]">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#16864A]" />
              Sourced from official legislative gazettes & statutory election affidavits
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#173B65]" />
              Institutional Congress Platform · Technology Partner: UCreates
            </span>
            <Link href="/about" className="text-[#173B65] font-semibold hover:underline">
              Editorial & Verification Standards →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
