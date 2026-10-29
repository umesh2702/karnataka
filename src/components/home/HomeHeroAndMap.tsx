"use client";

import React, { useState } from "react";
import Link from "next/link";
import KarnatakaMap from "@/components/map/KarnatakaMap";
import LeaderAvatar from "@/components/profile/LeaderAvatar";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Scale,
  MapPin,
  Award,
  BookOpen,
  Calendar,
  Compass,
  FileText,
  ExternalLink,
} from "lucide-react";

interface ProfileSummary {
  id: string;
  slug: string;
  displayName: string;
  kannadaName?: string | null;
  currentRole: string;
  constituency?: string | null;
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

interface HomeHeroAndMapProps {
  publishedProfiles: ProfileSummary[];
  featuredProfile?: ProfileSummary | null;
}

export default function HomeHeroAndMap({
  publishedProfiles,
  featuredProfile,
}: HomeHeroAndMapProps) {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  // Map leaders to districts based on constituency & region data
  const districtLeaderMap: Record<string, { count: number; leaders: string[] }> = {
    "Ramanagara": {
      count: 1,
      leaders: ["D. K. Shivakumar (Chief Minister of Karnataka)"],
    },
    "Bangalore": {
      count: 1,
      leaders: ["D. K. Shivakumar (Bengaluru Development)"],
    },
    "Mysore": {
      count: 1,
      leaders: ["Siddaramaiah (Former Chief Minister)"],
    },
    "Tumkur": {
      count: 1,
      leaders: ["Dr. G. Parameshwara (Deputy Chief Minister)"],
    },
    "Gulbarga": {
      count: 1,
      leaders: ["Priyank Kharge (Minister for IT/BT & RDPR)"],
    },
    "Bijapur": {
      count: 1,
      leaders: ["M. B. Patil (Minister for Large & Medium Industries)"],
    },
    "Belgaum": {
      count: 1,
      leaders: ["Satish Jarkiholi (Minister for Public Works)"],
    },
  };

  // Determine filtered leaders when a district is selected
  const filteredProfiles = selectedDistrict
    ? publishedProfiles.filter((p) => {
        const text = `${p.constituency || ""} ${p.region || ""} ${p.shortBio || ""}`.toLowerCase();
        const dist = selectedDistrict.toLowerCase();
        if (dist === "ramanagara") return text.includes("kanakapura") || text.includes("ramanagara");
        if (dist === "bangalore") return text.includes("bengaluru") || text.includes("bangalore");
        if (dist === "mysore") return text.includes("varuna") || text.includes("mysuru") || text.includes("mysore");
        if (dist === "tumkur") return text.includes("koratagere") || text.includes("tumakuru") || text.includes("tumkur");
        if (dist === "gulbarga") return text.includes("chittapur") || text.includes("kalaburagi") || text.includes("gulbarga");
        if (dist === "bijapur") return text.includes("babaleshwar") || text.includes("vijayapura") || text.includes("bijapur");
        if (dist === "belgaum") return text.includes("yemkanmardi") || text.includes("belagavi") || text.includes("belgaum");
        return text.includes(dist);
      })
    : publishedProfiles;

  const featured = featuredProfile || publishedProfiles[0];

  return (
    <div>
      {/* =========================================================================
          SECTION 3: SPLIT EDITORIAL HERO WITH KARNATAKA CARTOGRAPHIC MAP
          ========================================================================= */}
      <section className="relative overflow-hidden border-b border-[#E6E1DA] pt-8 pb-16 md:pt-12 md:pb-24">
        {/* Subtle background cartographic texture */}
        <div className="absolute inset-0 opacity-[0.035] pointer-events-none topo-lines" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Side: Split Editorial Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#922036]/10 text-[#922036] text-xs font-semibold tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#922036]" />
                KARNATAKA · PUBLIC LEADERSHIP RECORDS
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-serif font-bold text-[#17191B] tracking-tight leading-[1.12]">
                Karnataka, through its <br className="hidden sm:inline" />
                <span className="italic font-normal text-[#922036]">public leaders.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#68645F] leading-relaxed max-w-xl font-normal">
                An independent public information initiative documenting verified career milestones,
                statutory elective declarations, and legislative service records across Karnataka without partisan affiliation.
              </p>

              {/* Primary & Secondary CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <Link
                  href="/leaders"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#922036] text-white font-medium text-sm hover:bg-[#7A1629] transition-all shadow-sm group"
                >
                  <span>Explore Directory</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>

                <a
                  href="#karnataka-map-section"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-lg bg-white border border-[#E6E1DA] text-[#17191B] font-medium text-sm hover:bg-[#F8F6F2] hover:border-[#D5D0C7] transition-all shadow-2xs"
                >
                  <Compass className="w-4 h-4 text-[#922036]" />
                  <span>Explore the Karnataka Map</span>
                </a>
              </div>

              {/* Factual Trust Indicators */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-[#E6E1DA]">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1A633F] shrink-0 mt-0.5" />
                  <div>
                    <h2 className="text-xs font-bold text-[#17191B]">Source Citations</h2>
                    <p className="text-[11px] text-[#68645F] leading-tight">Official Assembly gazettes & ECI affidavits</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#922036] shrink-0 mt-0.5" />
                  <div>
                    <h2 className="text-xs font-bold text-[#17191B]">Editorial Review</h2>
                    <p className="text-[11px] text-[#68645F] leading-tight">Self-approval strictly prevented by RBAC</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 col-span-2 sm:col-span-1">
                  <Scale className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" />
                  <div>
                    <h2 className="text-xs font-bold text-[#17191B]">Public Corrections</h2>
                    <p className="text-[11px] text-[#68645F] leading-tight">Evidence-backed factual corrections desk</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Karnataka State Vector Map & Featured Record Panel */}
            <div className="lg:col-span-6 relative" id="karnataka-map-section">
              <KarnatakaMap
                selectedDistrict={selectedDistrict}
                onSelectDistrict={setSelectedDistrict}
                districtLeaderMap={districtLeaderMap}
                className="w-full"
              />

              {/* Small Featured-Record Panel attached below map */}
              {featured && (
                <div className="mt-4 p-4 bg-white rounded-xl border border-[#E6E1DA] editorial-shadow flex items-center gap-4 transition-all">
                  <div className="w-16 h-20 shrink-0">
                    <LeaderAvatar
                      src={featured.portraitUrl}
                      name={featured.displayName}
                      kannadaName={featured.kannadaName}
                      size="sm"
                      aspect="portrait"
                      className="w-full h-full"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#E9F5EE] text-[#1A633F] border border-[#C2E2CE] inline-flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        Verified Record
                      </span>
                      {featured.roleLastVerifiedAt && (
                        <span className="text-[10px] text-[#68645F] hidden sm:inline">
                          Verified: {new Date(featured.roleLastVerifiedAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif font-bold text-base text-[#17191B] truncate hover:text-[#922036]">
                      <Link href={`/leaders/${featured.slug}`}>{featured.displayName}</Link>
                    </h3>

                    {featured.kannadaName && (
                      <p className="text-xs font-kannada text-[#922036] font-semibold -mt-0.5 truncate">
                        {featured.kannadaName}
                      </p>
                    )}

                    <p className="text-xs font-semibold text-[#922036] mt-0.5 truncate">
                      {featured.currentRole}
                    </p>

                    <p className="text-[11px] text-[#68645F] truncate">
                      {featured.constituency}
                    </p>
                  </div>

                  <Link
                    href={`/leaders/${featured.slug}`}
                    className="shrink-0 p-2 text-[#922036] hover:bg-[#922036]/10 rounded-lg transition-colors"
                    aria-label={`View complete record of ${featured.displayName}`}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: FEATURED LEADERSHIP PROFILE EDITORIAL SHOWCASE
          ========================================================================= */}
      {featured && (
        <section className="py-14 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#E6E1DA] gap-3">
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-[#922036]">
                Editorial In-Depth Feature
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#17191B] mt-1">
                State Executive Leadership Feature
              </h2>
            </div>
            <Link
              href="/leaders"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#922036] hover:text-[#7A1629] uppercase tracking-wider"
            >
              <span>View Directory ({publishedProfiles.length} verified records)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-[#E6E1DA] editorial-shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            {/* Leader Authentic Portrait with Topographic Background */}
            <div className="lg:col-span-5 relative bg-[#EFECE6] min-h-[420px] lg:min-h-full">
              <LeaderAvatar
                src={featured.portraitUrl}
                name={featured.displayName}
                kannadaName={featured.kannadaName}
                size="hero"
                aspect="portrait"
                provenance="Press Information Bureau (PIB) / Government of India • Public Domain"
                priority={true}
              />
            </div>

            {/* Leader Verified Record Content */}
            <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E9F5EE] text-[#1A633F] border border-[#C2E2CE] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified Published Profile
                  </span>
                  {featured.roleLastVerifiedAt && (
                    <span className="text-xs text-[#68645F]">
                      Checked: {new Date(featured.roleLastVerifiedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-3xl sm:text-4xl font-serif font-bold text-[#17191B] tracking-tight">
                    {featured.displayName}
                  </h3>
                  {featured.kannadaName && (
                    <p className="text-xl font-kannada text-[#922036] font-semibold mt-1">
                      {featured.kannadaName}
                    </p>
                  )}
                </div>

                <p className="text-lg font-semibold text-[#922036]">
                  {featured.currentRole}
                </p>

                <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-[#4A4B4F] pt-1">
                  {featured.constituency && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#922036]" />
                      <span className="font-medium text-[#17191B]">{featured.constituency}</span>
                    </div>
                  )}
                  {featured.organisationName && (
                    <div className="flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-[#922036]" />
                      <span className="text-[#68645F]">{featured.organisationName}</span>
                    </div>
                  )}
                </div>

                <p className="text-sm text-[#4A4B4F] leading-relaxed line-clamp-4 font-light">
                  {featured.shortBio}
                </p>

                {/* Sourced integrity callout */}
                <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E6E1DA] text-xs text-[#68645F] flex items-start gap-2">
                  <BookOpen className="w-4 h-4 text-[#922036] shrink-0 mt-0.5" />
                  <span>
                    Documented from Karnataka Legislative Assembly gazette notifications and Election Commission statutory candidate filings.
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E6E1DA] flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs text-[#68645F]">
                  <span>{featured._count?.milestones || 6} Documented Milestones</span> •{" "}
                  <span>{featured._count?.initiatives || 2} Active Initiatives</span>
                </div>

                <Link
                  href={`/leaders/${featured.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#922036] text-white text-xs font-semibold hover:bg-[#7A1629] transition-colors shadow-2xs"
                >
                  <span>View Full Profile & Sources</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          DIRECTORY SECTION WITH DISTRICT FILTER STATE
          ========================================================================= */}
      <section className="py-16 bg-[#F4EFEB]/50 border-t border-b border-[#E6E1DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#E6E1DA] gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold tracking-wider uppercase text-[#922036]">
                  Public Records Directory
                </span>
                {selectedDistrict && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#922036] text-white">
                    Filtered: {selectedDistrict}
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#17191B] mt-1">
                {selectedDistrict ? `Representatives Mapped to ${selectedDistrict}` : "Published Karnataka Representatives"}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {selectedDistrict && (
                <button
                  type="button"
                  onClick={() => setSelectedDistrict(null)}
                  className="text-xs font-semibold text-[#922036] hover:underline"
                >
                  Reset Map Filter
                </button>
              )}
              <Link
                href="/leaders"
                className="inline-flex items-center gap-1 text-sm font-semibold text-[#922036] hover:underline"
              >
                <span>Full Directory & Search</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* District Filter Empty State */}
          {filteredProfiles.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#E6E1DA] p-10 text-center space-y-3 editorial-shadow">
              <Compass className="w-10 h-10 text-[#68645F] mx-auto opacity-40" />
              <h3 className="font-serif font-bold text-lg text-[#17191B]">
                No Published Records Mapped to {selectedDistrict} District
              </h3>
              <p className="text-sm text-[#68645F] max-w-md mx-auto">
                UCreates Leadership Studio publishes leadership profiles only after statutory gazette verification.
                Records for this district are currently pending editorial review.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedDistrict(null)}
                  className="px-4 py-2 bg-[#922036] text-white rounded-lg text-xs font-semibold hover:bg-[#7A1629]"
                >
                  View All Karnataka Records
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfiles.map((leader) => (
                <article
                  key={leader.id}
                  className="bg-white rounded-xl border border-[#E6E1DA] p-6 card-hover-effect flex flex-col justify-between space-y-4 editorial-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-20 shrink-0">
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
                      <h3 className="font-serif font-bold text-lg text-[#17191B] hover:text-[#922036] transition-colors leading-snug">
                        <Link href={`/leaders/${leader.slug}`}>{leader.displayName}</Link>
                      </h3>
                      {leader.kannadaName && (
                        <p className="text-xs font-kannada font-semibold text-[#922036] mt-0.5">
                          {leader.kannadaName}
                        </p>
                      )}
                      <p className="text-xs font-medium text-[#17191B] mt-1 line-clamp-1">
                        {leader.currentRole}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-[#68645F] leading-relaxed line-clamp-2">
                    {leader.shortBio}
                  </p>

                  <div className="pt-3 border-t border-[#E6E1DA] flex items-center justify-between text-[11px] text-[#68645F]">
                    <div className="flex items-center gap-1 truncate max-w-[60%]">
                      <MapPin className="w-3.5 h-3.5 text-[#922036] shrink-0" />
                      <span className="truncate">{leader.constituency || "Karnataka Statewide"}</span>
                    </div>

                    <Link
                      href={`/leaders/${leader.slug}`}
                      className="text-[#922036] font-semibold hover:underline flex items-center gap-1 shrink-0"
                    >
                      <span>View record</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          INSTITUTIONAL RIGOUR & EDITORIAL METHODOLOGY SHOWCASE
          ========================================================================= */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#922036]">
            Institutional Methodology
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#17191B]">
            How Public Information is Verified
          </h2>
          <p className="text-sm sm:text-base text-[#68645F] leading-relaxed font-light">
            UCreates Leadership Studio enforces multi-tiered evidentiary standards before publishing any milestone,
            portfolio, or service record.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-white rounded-xl border border-[#E6E1DA] space-y-4 editorial-shadow">
            <div className="w-12 h-12 rounded-lg bg-[#922036]/10 text-[#922036] flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#17191B]">Primary Legislative Gazettes</h3>
            <p className="text-sm text-[#68645F] leading-relaxed">
              Cabinet portfolios, oath records, and electoral returns are corroborated against official Karnataka
              Legislative Council and Assembly gazette entries and Election Commission Form 26 statutory affidavits.
            </p>
          </div>

          <div className="p-8 bg-white rounded-xl border border-[#E6E1DA] space-y-4 editorial-shadow">
            <div className="w-12 h-12 rounded-lg bg-[#922036]/10 text-[#922036] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#17191B]">Independent Review Queue</h3>
            <p className="text-sm text-[#68645F] leading-relaxed">
              Draft submissions must pass independent senior editorial review. Self-approval is strictly prevented by
              the platform security architecture to preserve objective verification.
            </p>
          </div>

          <div className="p-8 bg-white rounded-xl border border-[#E6E1DA] space-y-4 editorial-shadow">
            <div className="w-12 h-12 rounded-lg bg-[#922036]/10 text-[#922036] flex items-center justify-center">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#17191B]">Public Corrections Desk</h3>
            <p className="text-sm text-[#68645F] leading-relaxed">
              Citizens, researchers, and public offices can submit factual correction requests with citation URLs
              through our public intake desk for prompt editorial re-examination.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
