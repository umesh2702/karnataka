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
  Zap,
  Bus,
  Sparkles,
  GraduationCap,
  Layers,
  Search,
  Filter,
  Users,
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

interface ConstituencySummary {
  id: string;
  number: number;
  name: string;
  kannadaName?: string | null;
  slug: string;
  district: string;
  region: string;
  reservation: string;
  totalElectors?: number | null;
  summary?: string | null;
  representative?: {
    id: string;
    slug: string;
    displayName: string;
    kannadaName?: string | null;
    currentRole: string;
    party?: string | null;
    portraitUrl?: string | null;
    publicationStatus: string;
  } | null;
  _count?: {
    projects: number;
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
  constituencies?: ConstituencySummary[];
  schemes?: SchemeSummary[];
  projects?: ProjectSummary[];
}

export default function HomeHeroAndMap({
  publishedProfiles,
  cmProfile,
  dcmProfile,
  constituencies = [],
  schemes = [],
  projects = [],
}: HomeHeroAndMapProps) {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [directorySearch, setDirectorySearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  // Map leaders to districts
  const districtLeaderMap: Record<string, { count: number; leaders: string[] }> = {
    "Ramanagara": {
      count: 1,
      leaders: ["D. K. Shivakumar (Deputy Chief Minister & KPCC President)"],
    },
    "Bangalore": {
      count: 4,
      leaders: [
        "D. K. Shivakumar (Bengaluru City Development)",
        "Krishna Byre Gowda (Revenue)",
        "K. J. George (Energy)",
        "Ramalinga Reddy (Transport & Muzrai)",
      ],
    },
    "Mysore": {
      count: 1,
      leaders: ["Siddaramaiah (Chief Minister of Karnataka)"],
    },
    "Tumkur": {
      count: 1,
      leaders: ["Dr. G. Parameshwara (Minister for Home Affairs)"],
    },
    "Gulbarga": {
      count: 1,
      leaders: ["Priyank Kharge (Minister for RDPR, IT & BT)"],
    },
    "Bijapur": {
      count: 1,
      leaders: ["M. B. Patil (Minister for Large & Medium Industries)"],
    },
    "Belgaum": {
      count: 2,
      leaders: [
        "Satish Jarkiholi (Minister for Public Works Department)",
        "Laxmi Hebbalkar (Minister for Women & Child Development)",
      ],
    },
    "Bidar": {
      count: 1,
      leaders: ["Eshwar Khandre (Minister for Forest, Ecology & Environment)"],
    },
    "Gadag": {
      count: 1,
      leaders: ["H. K. Patil (Minister for Law & Tourism)"],
    },
  };

  // Constituencies in the selected district
  const selectedDistrictConstituencies = selectedDistrict
    ? constituencies.filter((c) => {
        const d = selectedDistrict.toLowerCase();
        const cd = c.district.toLowerCase();
        if (d === "bangalore") return cd.includes("bengaluru") || cd.includes("bangalore");
        if (d === "mysore") return cd.includes("mysuru") || cd.includes("mysore");
        if (d === "tumkur") return cd.includes("tumakuru") || cd.includes("tumkur");
        if (d === "gulbarga") return cd.includes("kalaburagi") || cd.includes("gulbarga");
        if (d === "bijapur") return cd.includes("vijayapura") || cd.includes("bijapur");
        if (d === "belgaum") return cd.includes("belagavi") || cd.includes("belgaum");
        return cd.includes(d);
      })
    : [];

  // Filter leaders directory
  const filteredProfiles = publishedProfiles.filter((p) => {
    const matchesSearch = directorySearch
      ? `${p.displayName} ${p.kannadaName || ""} ${p.currentRole} ${p.constituency || ""} ${p.district || ""}`
          .toLowerCase()
          .includes(directorySearch.toLowerCase())
      : true;

    const matchesRole =
      roleFilter === "ALL"
        ? true
        : roleFilter === "MINISTER"
        ? p.currentRole.toLowerCase().includes("minister")
        : !p.currentRole.toLowerCase().includes("minister");

    return matchesSearch && matchesRole;
  });

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
          SECTION A: LEADERSHIP HERO (CM SIDDARAMAIAH & DCM D. K. SHIVAKUMAR)
          ========================================================================= */}
      <section className="relative overflow-hidden border-b border-[#E6E1DA] pt-8 pb-16 md:pt-14 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Platform Identity Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#922036]/10 text-[#922036] text-xs font-semibold tracking-wider uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#922036]" />
            KARNATAKA CONGRESS PLATFORM · POWERED BY UCREATES
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Headline & Action Column */}
            <div className="lg:col-span-6 space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-[3.6rem] font-serif font-bold text-[#17191B] tracking-tight leading-[1.1]">
                Governance, through its <br className="hidden sm:inline" />
                <span className="italic font-normal text-[#922036]">leaders and constituencies.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#68645F] leading-relaxed max-w-xl font-light">
                An institutional, source-verified platform documenting Karnataka&apos;s governing leadership,
                assembly constituency development, and flagship Five Guarantee welfare architectures,
                built by UCreates.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <Link
                  href="/leaders"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#922036] text-white font-medium text-sm hover:bg-[#7A1629] transition-all shadow-sm group"
                >
                  <span>Explore Leadership Directory</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>

                <a
                  href="#constituency-explorer"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-lg bg-white border border-[#E6E1DA] text-[#17191B] font-medium text-sm hover:bg-[#F8F6F2] hover:border-[#D5D0C7] transition-all shadow-2xs"
                >
                  <Compass className="w-4 h-4 text-[#922036]" />
                  <span>Constituency Explorer</span>
                </a>

                <a
                  href="#five-guarantees"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-lg bg-[#FAF8F5] border border-[#E6E1DA] text-[#922036] font-medium text-sm hover:bg-white transition-all shadow-2xs"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>The 5 Guarantees</span>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#E6E1DA]">
                <div>
                  <div className="text-xl sm:text-2xl font-serif font-bold text-[#17191B]">135+</div>
                  <div className="text-[11px] text-[#68645F]">Elected Congress MLAs</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-serif font-bold text-[#17191B]">224</div>
                  <div className="text-[11px] text-[#68645F]">Assembly Constituencies</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-serif font-bold text-[#922036]">5 Guarantees</div>
                  <div className="text-[11px] text-[#68645F]">Universal Welfare Rollout</div>
                </div>
              </div>
            </div>

            {/* Right Side: Dual Leadership Cards (CM Siddaramaiah & DCM D. K. Shivakumar) */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Card 1: CM Siddaramaiah */}
              {cmProfile && (
                <div className="bg-white rounded-2xl border border-[#E6E1DA] p-5 editorial-shadow flex flex-col justify-between hover:border-[#922036]/50 transition-all">
                  <div className="space-y-4">
                    <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-[#EFECE6]">
                      <LeaderAvatar
                        src={cmProfile.portraitUrl}
                        name={cmProfile.displayName}
                        kannadaName={cmProfile.kannadaName}
                        size="hero"
                        aspect="portrait"
                        className="w-full h-full"
                        priority={true}
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#17191B]/80 backdrop-blur-md text-white border border-white/20">
                          Chief Minister
                        </span>
                      </div>
                    </div>

                    <div>
                      <h2 className="font-serif font-bold text-xl text-[#17191B]">
                        <Link href={`/leaders/${cmProfile.slug}`}>{cmProfile.displayName}</Link>
                      </h2>
                      {cmProfile.kannadaName && (
                        <p className="text-xs font-kannada font-semibold text-[#922036]">
                          {cmProfile.kannadaName}
                        </p>
                      )}
                      <p className="text-xs font-semibold text-[#922036] mt-1">
                        Chief Minister of Karnataka
                      </p>
                      <p className="text-[11px] text-[#68645F] mt-0.5">
                        MLA, Varuna (AC No. 221) · Mysuru
                      </p>
                    </div>

                    <p className="text-xs text-[#4A4B4F] line-clamp-3 leading-relaxed font-light">
                      {cmProfile.shortBio}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#F0ECE6] flex items-center justify-between">
                    <span className="text-[10px] text-[#82848A] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Verified Record
                    </span>
                    <Link
                      href={`/leaders/${cmProfile.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#922036] hover:text-[#7A1629]"
                    >
                      <span>Profile & Portfolios</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Card 2: DCM D. K. Shivakumar */}
              {dcmProfile && (
                <div className="bg-white rounded-2xl border border-[#E6E1DA] p-5 editorial-shadow flex flex-col justify-between hover:border-[#922036]/50 transition-all">
                  <div className="space-y-4">
                    <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-[#EFECE6]">
                      <LeaderAvatar
                        src={dcmProfile.portraitUrl}
                        name={dcmProfile.displayName}
                        kannadaName={dcmProfile.kannadaName}
                        size="hero"
                        aspect="portrait"
                        className="w-full h-full"
                        priority={true}
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#922036] text-white">
                          Deputy Chief Minister
                        </span>
                      </div>
                    </div>

                    <div>
                      <h2 className="font-serif font-bold text-xl text-[#17191B]">
                        <Link href={`/leaders/${dcmProfile.slug}`}>{dcmProfile.displayName}</Link>
                      </h2>
                      {dcmProfile.kannadaName && (
                        <p className="text-xs font-kannada font-semibold text-[#922036]">
                          {dcmProfile.kannadaName}
                        </p>
                      )}
                      <p className="text-xs font-semibold text-[#922036] mt-1">
                        Deputy Chief Minister & KPCC President
                      </p>
                      <p className="text-[11px] text-[#68645F] mt-0.5">
                        MLA, Kanakapura (AC No. 184) · Ramanagara
                      </p>
                    </div>

                    <p className="text-xs text-[#4A4B4F] line-clamp-3 leading-relaxed font-light">
                      {dcmProfile.shortBio}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#F0ECE6] flex items-center justify-between">
                    <span className="text-[10px] text-[#82848A] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Verified Record
                    </span>
                    <Link
                      href={`/leaders/${dcmProfile.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#922036] hover:text-[#7A1629]"
                    >
                      <span>Profile & Portfolios</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION E: THE FIVE GUARANTEES SHOWCASE
          ========================================================================= */}
      <section id="five-guarantees" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 border-b border-[#E6E1DA] gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#922036]/10 text-[#922036] text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Flagship Social Contract
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#17191B]">
              Karnataka&apos;s Five Guarantees
            </h2>
            <p className="text-sm text-[#68645F] mt-1 font-light">
              Universal citizen entitlements enacted by the Karnataka Cabinet, cited with official department sources.
            </p>
          </div>

          <Link
            href="/schemes"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#922036] hover:text-[#7A1629] uppercase tracking-wider shrink-0"
          >
            <span>Detailed Schemes Guide</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          {schemes.slice(0, 5).map((scheme, i) => (
            <div
              key={scheme.id}
              className="bg-white rounded-2xl border border-[#E6E1DA] p-6 editorial-shadow flex flex-col justify-between hover:border-[#922036]/50 transition-all space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E6E1DA] flex items-center justify-center">
                    {getSchemeIcon(scheme.slug)}
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#922036]/10 text-[#922036]">
                    GUARANTEE 0{i + 1}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-xl text-[#17191B]">
                    {scheme.name}
                  </h3>
                  {scheme.kannadaName && (
                    <p className="text-sm font-kannada font-semibold text-[#922036]">
                      {scheme.kannadaName}
                    </p>
                  )}
                  <p className="text-xs text-[#68645F] mt-0.5">{scheme.department}</p>
                </div>

                <p className="text-xs text-[#4A4B4F] leading-relaxed font-light">
                  {scheme.tagline}
                </p>

                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#F0ECE6] space-y-1 text-xs">
                  <span className="font-semibold text-[#17191B] block">Benefit Entitlement:</span>
                  <p className="text-[#68645F] leading-relaxed">{scheme.benefits}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#F0ECE6] flex items-center justify-between text-xs">
                {scheme.applicationUrl ? (
                  <a
                    href={scheme.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-[#922036] hover:underline"
                  >
                    <span>Apply on Seva Sindhu</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-[#888]">Direct Bank Transfer</span>
                )}

                <Link
                  href={`/schemes#${scheme.slug}`}
                  className="font-medium text-[#68645F] hover:text-[#17191B]"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION C: KARNATAKA CONSTITUENCY EXPLORER & MAP
          ========================================================================= */}
      <section id="constituency-explorer" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 border-b border-[#E6E1DA] gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#922036]/10 text-[#922036] text-xs font-semibold uppercase tracking-wider mb-1">
              <Compass className="w-3.5 h-3.5" />
              Delimited Representation
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#17191B]">
              Karnataka Constituency Explorer
            </h2>
            <p className="text-sm text-[#68645F] mt-1 font-light">
              Interactive cartographic registry mapping Karnataka&apos;s administrative districts to verified assembly constituencies and elected representatives.
            </p>
          </div>

          <Link
            href="/constituencies"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#922036] hover:text-[#7A1629] uppercase tracking-wider shrink-0"
          >
            <span>All 224 Constituencies Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-start">
          {/* Map Column */}
          <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-[#E6E1DA] editorial-shadow">
            <KarnatakaMap
              selectedDistrict={selectedDistrict}
              onSelectDistrict={setSelectedDistrict}
              districtLeaderMap={districtLeaderMap}
            />

            <div className="mt-4 pt-3 border-t border-[#E6E1DA] flex flex-wrap items-center justify-between text-xs text-[#68645F] gap-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#922036]" />
                Click any district to view its legislative assembly constituencies
              </span>
              <span className="text-[11px] text-[#82848A]">Verified against ECI delimitations</span>
            </div>
          </div>

          {/* Drill-down Results Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-[#E6E1DA] editorial-shadow space-y-4">
              <div className="flex items-center justify-between border-b border-[#E6E1DA] pb-3">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#922036] font-semibold">
                    District Focus
                  </span>
                  <h3 className="font-serif font-bold text-xl text-[#17191B]">
                    {selectedDistrict || "Select a District from the Map"}
                  </h3>
                </div>
                {selectedDistrict && (
                  <button
                    type="button"
                    onClick={() => setSelectedDistrict(null)}
                    className="text-xs font-semibold text-[#922036] hover:underline"
                  >
                    Reset
                  </button>
                )}
              </div>

              {selectedDistrict ? (
                <div className="space-y-3">
                  <p className="text-xs text-[#68645F]">
                    Showing verified assembly constituencies mapped to {selectedDistrict}:
                  </p>

                  {selectedDistrictConstituencies.length === 0 ? (
                    <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E6E1DA] text-center text-xs text-[#68645F] space-y-1">
                      <p className="font-medium text-[#17191B]">Constituency Documentation Under Review</p>
                      <p>Full assembly mapping for this district is currently being verified against official gazettes.</p>
                      <Link href="/constituencies" className="text-[#922036] font-semibold underline block pt-1">
                        Browse Full Directory
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                      {selectedDistrictConstituencies.map((c) => (
                        <div
                          key={c.id}
                          className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#E6E1DA] hover:border-[#922036] transition-colors"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold font-mono text-[#922036]">
                              AC {c.number}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-white border border-[#E6E1DA] text-[#68645F]">
                              {c.reservation}
                            </span>
                          </div>

                          <h4 className="font-serif font-bold text-base text-[#17191B] mt-1">
                            <Link href={`/constituencies/${c.slug}`} className="hover:text-[#922036]">
                              {c.name}
                            </Link>
                          </h4>

                          {c.representative && c.representative.publicationStatus === "PUBLISHED" ? (
                            <div className="mt-2 pt-2 border-t border-[#E6E1DA] flex items-center justify-between text-xs">
                              <span className="text-[#68645F]">
                                Rep: <strong>{c.representative.displayName}</strong>
                              </span>
                              <Link
                                href={`/leaders/${c.representative.slug}`}
                                className="text-[#922036] font-semibold hover:underline"
                              >
                                View MLA →
                              </Link>
                            </div>
                          ) : (
                            <div className="mt-2 pt-2 border-t border-[#E6E1DA] text-[11px] text-[#888]">
                              Representative profile pending verification
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center space-y-3 bg-[#FAF8F5] rounded-xl border border-[#E6E1DA]">
                  <Compass className="w-8 h-8 text-[#922036] mx-auto opacity-70" />
                  <p className="text-xs text-[#68645F] leading-relaxed">
                    Click any of Karnataka&apos;s 30 districts on the vector map to instantly see its active assembly constituencies,
                    elected MLAs, and localized project records.
                  </p>
                  <Link
                    href="/constituencies"
                    className="inline-block px-4 py-2 bg-[#922036] text-white text-xs font-semibold rounded-lg hover:bg-[#7A1629]"
                  >
                    Browse All Constituencies
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION D: WORKS & INITIATIVES REGISTRY SHOWCASE
          ========================================================================= */}
      <section id="works-initiatives" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 border-b border-[#E6E1DA] gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#922036]/10 text-[#922036] text-xs font-semibold uppercase tracking-wider mb-1">
              <Layers className="w-3.5 h-3.5" />
              Evidence-Linked Execution
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#17191B]">
              Key Works & Governance Initiatives
            </h2>
            <p className="text-sm text-[#68645F] mt-1 font-light">
              Major infrastructure works, water security packages, and tech initiatives documented with verified budgets and evidence citations.
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
                className="bg-white rounded-2xl border border-[#E6E1DA] p-6 editorial-shadow flex flex-col justify-between hover:border-[#922036]/50 transition-all space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                        stageBadgeColors[project.stage] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {project.stage}
                    </span>
                    {project.budgetAmount && (
                      <span className="text-xs font-mono font-bold text-[#17191B] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E6E1DA]">
                        {project.budgetAmount}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif font-bold text-lg text-[#17191B] leading-snug">
                    {project.title}
                  </h3>

                  <p className="text-xs text-[#4A4B4F] leading-relaxed line-clamp-3 font-light">
                    {project.description}
                  </p>

                  <div className="pt-2 border-t border-[#F0ECE6] space-y-1 text-xs text-[#68645F]">
                    {project.constituency && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#922036]" />
                        <span>
                          {project.constituency.name} ({project.constituency.district})
                        </span>
                      </div>
                    )}
                    {project.leaderProfile && (
                      <div className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-[#922036]" />
                        <span>Representative: {project.leaderProfile.displayName}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F0ECE6] flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#82848A]">
                    {project.department || "Government of Karnataka"}
                  </span>
                  {project.evidenceUrl && (
                    <a
                      href={project.evidenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-[#922036] hover:underline"
                    >
                      <span>Evidence</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION B: LEADERSHIP DIRECTORY HIGHLIGHTS
          ========================================================================= */}
      <section id="leadership-directory" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 border-b border-[#E6E1DA] gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#922036]/10 text-[#922036] text-xs font-semibold uppercase tracking-wider mb-1">
              <Users className="w-3.5 h-3.5" />
              Verified Public Representation
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#17191B]">
              Karnataka Congress Leadership Directory
            </h2>
            <p className="text-sm text-[#68645F] mt-1 font-light">
              Current Cabinet Ministers and Congress MLAs with verified portfolios, educational credentials, and legislative milestones.
            </p>
          </div>

          <Link
            href="/leaders"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#922036] hover:text-[#7A1629] uppercase tracking-wider shrink-0"
          >
            <span>Complete Roster ({publishedProfiles.length} verified)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Quick Toolbar */}
        <div className="mt-6 p-4 bg-white rounded-xl border border-[#E6E1DA] editorial-shadow flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={directorySearch}
              onChange={(e) => setDirectorySearch(e.target.value)}
              placeholder="Search minister, MLA or constituency..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF8F5] border border-[#E6E1DA] rounded-lg text-[#17191B] focus:outline-none focus:ring-1 focus:ring-[#922036]"
            />
            <Search className="w-3.5 h-3.5 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setRoleFilter("ALL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                roleFilter === "ALL" ? "bg-[#922036] text-white" : "bg-[#FAF8F5] text-[#68645F] hover:bg-[#EFECE6]"
              }`}
            >
              All Leaders
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter("MINISTER")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                roleFilter === "MINISTER" ? "bg-[#922036] text-white" : "bg-[#FAF8F5] text-[#68645F] hover:bg-[#EFECE6]"
              }`}
            >
              Cabinet Ministers
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter("MLA")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                roleFilter === "MLA" ? "bg-[#922036] text-white" : "bg-[#FAF8F5] text-[#68645F] hover:bg-[#EFECE6]"
              }`}
            >
              MLAs
            </button>
          </div>
        </div>

        {/* Leaders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          {filteredProfiles.map((leader) => (
            <article
              key={leader.id}
              className="bg-white rounded-2xl border border-[#E6E1DA] p-5 editorial-shadow flex flex-col justify-between hover:border-[#922036]/50 transition-all space-y-4"
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
                  <h3 className="font-serif font-bold text-lg text-[#17191B] hover:text-[#922036] transition-colors truncate">
                    <Link href={`/leaders/${leader.slug}`}>{leader.displayName}</Link>
                  </h3>
                  {leader.kannadaName && (
                    <p className="text-xs font-kannada font-semibold text-[#922036] mt-0.5 truncate">
                      {leader.kannadaName}
                    </p>
                  )}
                  <p className="text-xs font-semibold text-[#922036] mt-1 line-clamp-1">
                    {leader.currentRole}
                  </p>
                  {leader.constituency && (
                    <p className="text-[11px] text-[#68645F] mt-0.5 truncate flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#922036]" />
                      {leader.constituency}
                    </p>
                  )}
                </div>
              </div>

              <p className="text-xs text-[#4A4B4F] line-clamp-2 leading-relaxed font-light">
                {leader.shortBio}
              </p>

              <div className="pt-3 border-t border-[#F0ECE6] flex items-center justify-between text-xs">
                <span className="text-[10px] text-[#82848A]">
                  {leader.party || "Indian National Congress"}
                </span>

                <Link
                  href={`/leaders/${leader.slug}`}
                  className="inline-flex items-center gap-1 font-semibold text-[#922036] hover:text-[#7A1629]"
                >
                  <span>View Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION G: INSTITUTIONAL TRANSPARENCY & EDITORIAL STANDARDS
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white rounded-2xl border border-[#E6E1DA] p-8 sm:p-10 editorial-shadow space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#922036]/10 text-[#922036] flex items-center justify-center font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl text-[#17191B]">
                Editorial Standards & Independent Governance Verification
              </h3>
              <p className="text-xs text-[#68645F]">
                Built by UCreates as a demonstration platform for Karnataka public leadership documentation
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#4A4B4F] leading-relaxed font-light">
            Every leadership milestone, designation, portfolio, and project record on this platform is compiled
            strictly from verifiable public records, including the Karnataka Legislative Assembly gazette roster,
            Election Commission of India statutory filings (Form 26), and state executive government orders.
            This platform does not imply official government authorization or party ownership without permission.
            To submit corrections or propose updates, visit our{" "}
            <Link href="/corrections" className="text-[#922036] font-semibold underline">
              Corrections Desk
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
