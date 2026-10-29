import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ShareButton from "@/components/profile/ShareButton";
import LeaderAvatar from "@/components/profile/LeaderAvatar";
import { PublicationStatus } from "@prisma/client";
import {
  CheckCircle2,
  MapPin,
  Award,
  Calendar,
  ExternalLink,
  ShieldCheck,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Info,
  Scale,
  Sparkles,
  FileText,
  AlertCircle,
  Building2,
  Compass,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface LeaderPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: LeaderPageProps): Promise<Metadata> {
  const { slug } = await params;

  const profile = await prisma.leaderProfile.findFirst({
    where: {
      slug,
      publicationStatus: PublicationStatus.PUBLISHED,
    },
  });

  if (!profile) {
    return { title: "Profile Not Found | UCreates Leadership Studio" };
  }

  const title = `${profile.displayName} — ${profile.currentRole} | UCreates Leadership Studio`;
  const description = profile.shortBio;
  const canonicalUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/leaders/${profile.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: profile.portraitUrl ? [{ url: profile.portraitUrl }] : [],
      type: "profile",
    },
  };
}

export default async function LeaderProfilePage({ params }: LeaderPageProps) {
  const { slug } = await params;

  // Retrieve published profile only
  const profile = await prisma.leaderProfile.findFirst({
    where: {
      slug,
      publicationStatus: PublicationStatus.PUBLISHED,
    },
    include: {
      milestones: {
        orderBy: { sortOrder: "asc" },
        include: {
          claimSources: {
            include: { source: true },
          },
        },
      },
      initiatives: {
        orderBy: { startDate: "desc" },
        include: {
          claimSources: {
            include: { source: true },
          },
        },
      },
      revisions: {
        where: { reviewStatus: "PUBLISHED" },
        orderBy: { version: "desc" },
        take: 1,
      },
    },
  });

  // Section 6: If profile doesn't exist or is unpublished/draft, return 404
  if (!profile) {
    notFound();
  }

  // Related published representatives (other published leaders in Karnataka cabinet / assembly)
  const relatedLeaders = await prisma.leaderProfile.findMany({
    where: {
      publicationStatus: PublicationStatus.PUBLISHED,
      id: { not: profile.id },
    },
    take: 3,
    orderBy: { displayName: "asc" },
  });

  // Collect all unique attached sources
  const allSourcesMap = new Map<
    string,
    { id: string; title: string; url: string; publisher: string; sourceType: string; publicationDate?: Date | null; checkedAt: Date; notes?: string | null }
  >();

  profile.milestones.forEach((m) => {
    m.claimSources.forEach((cs) => {
      allSourcesMap.set(cs.source.id, cs.source);
    });
  });

  profile.initiatives.forEach((i) => {
    i.claimSources.forEach((cs) => {
      allSourcesMap.set(cs.source.id, cs.source);
    });
  });

  const uniqueSources = Array.from(allSourcesMap.values());

  // Structured Data (JSON-LD) for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.displayName,
    alternateName: profile.kannadaName || undefined,
    jobTitle: profile.currentRole,
    worksFor: {
      "@type": "Organization",
      name: profile.organisationName || "Government of Karnataka",
    },
    description: profile.shortBio,
    image: profile.portraitUrl || undefined,
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F6F2]">
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-[#68645F]">
          <Link href="/" className="hover:text-[#17191B] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/leaders" className="hover:text-[#17191B] transition-colors">
            Leaders Directory
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#17191B] font-semibold truncate">{profile.displayName}</span>
        </nav>

        {/* =========================================================================
            PROFILE HERO SECTION (Section 6)
            ========================================================================= */}
        <div className="relative bg-white rounded-3xl border border-[#E6E1DA] editorial-shadow-lg p-6 sm:p-10 mb-8 overflow-hidden">
          {/* Subtle Karnataka Map Watermark in Background */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-[0.035] pointer-events-none select-none topo-lines overflow-hidden hidden md:block" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start relative z-10">
            {/* Authentic Portrait Treatment */}
            <div className="md:col-span-4 relative">
              <LeaderAvatar
                src={profile.portraitUrl}
                name={profile.displayName}
                kannadaName={profile.kannadaName}
                size="lg"
                aspect="portrait"
                className="w-full shadow-sm"
                priority={true}
              />
              <div className="mt-2.5 text-center text-[11px] text-[#68645F] font-sans">
                Authentic Photographic Record • Verified Dossier
              </div>
            </div>

            {/* Profile Core Record Information */}
            <div className="md:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#1A633F] bg-[#E9F5EE] px-3 py-1 rounded-full border border-[#C2E2CE]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified Public Record
                  </span>
                  {profile.roleLastVerifiedAt && (
                    <span className="text-xs text-[#68645F]">
                      Last Verified: {new Date(profile.roleLastVerifiedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  )}
                </div>

                <ShareButton title={profile.displayName} />
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#17191B] tracking-tight">
                  {profile.displayName}
                </h1>
                {profile.kannadaName && (
                  <p className="text-2xl font-kannada font-bold text-[#922036] mt-1.5">
                    {profile.kannadaName}
                  </p>
                )}
              </div>

              <p className="text-lg sm:text-xl font-semibold text-[#922036]">
                {profile.currentRole}
              </p>

              {/* Public Attributes Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 pb-3 text-xs text-[#4A4B4F] border-t border-b border-[#E6E1DA]">
                {profile.constituency && (
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-[#922036] shrink-0" />
                    <div>
                      <span className="text-[#888] block text-[10px] uppercase font-semibold">Constituency & District</span>
                      <span className="font-semibold text-[#17191B]">{profile.constituency}</span>
                    </div>
                  </div>
                )}
                {profile.organisationName && (
                  <div className="flex items-center gap-2.5">
                    <Award className="w-4 h-4 text-[#922036] shrink-0" />
                    <div>
                      <span className="text-[#888] block text-[10px] uppercase font-semibold">Public Administration</span>
                      <span className="font-semibold text-[#17191B]">{profile.organisationName}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Sourced Summary */}
              <p className="text-sm sm:text-base text-[#4A4B4F] leading-relaxed font-light">
                {profile.shortBio}
              </p>

              {/* Notice of Independence Banner */}
              <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E6E1DA] flex items-start gap-2.5 text-xs text-[#68645F]">
                <Info className="w-4 h-4 text-[#922036] shrink-0 mt-0.5" />
                <span>
                  <strong>Independent Curation Notice:</strong> This profile is compiled strictly from published
                  Karnataka Legislative Assembly records, election statutory filings, and verifiable public documents.
                  UCreates is an independent publisher and has no official affiliation with or endorsement from the Government of Karnataka.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky In-Page Section Navigation */}
        <div className="sticky top-20 z-30 mb-8 py-2 bg-[#F8F6F2]/95 backdrop-blur-md border-b border-[#E6E1DA] flex items-center gap-4 overflow-x-auto text-xs font-semibold text-[#68645F]">
          <span className="text-[#17191B] uppercase tracking-wider text-[11px] shrink-0">Sections:</span>
          <a href="#biography" className="hover:text-[#922036] transition-colors shrink-0">Biography & Background</a>
          <span>•</span>
          <a href="#timeline" className="hover:text-[#922036] transition-colors shrink-0">Career Timeline ({profile.milestones.length})</a>
          <span>•</span>
          <a href="#initiatives" className="hover:text-[#922036] transition-colors shrink-0">Public Initiatives ({profile.initiatives.length})</a>
          <span>•</span>
          <a href="#sources" className="hover:text-[#922036] transition-colors shrink-0">Source Registry ({uniqueSources.length})</a>
          <span>•</span>
          <a href="#related" className="hover:text-[#922036] transition-colors shrink-0">Related Representatives</a>
        </div>

        {/* =========================================================================
            SECTION 6.B: BIOGRAPHY & BACKGROUND
            ========================================================================= */}
        <section id="biography" className="bg-white rounded-2xl border border-[#E6E1DA] editorial-shadow p-6 sm:p-10 mb-8 space-y-4">
          <div className="border-b border-[#E6E1DA] pb-3">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#922036]">Biographical Record</span>
            <h2 className="text-2xl font-serif font-bold text-[#17191B] mt-0.5">
              Public Biography & Academic Background
            </h2>
          </div>

          <div className="text-sm sm:text-base text-[#3A3B3F] leading-relaxed space-y-4 whitespace-pre-line font-light">
            {profile.biography}
          </div>
        </section>

        {/* =========================================================================
            SECTION 6.C: CHRONOLOGICAL PUBLIC CAREER TIMELINE
            ========================================================================= */}
        <section id="timeline" className="bg-white rounded-2xl border border-[#E6E1DA] editorial-shadow p-6 sm:p-10 mb-8 space-y-6">
          <div className="border-b border-[#E6E1DA] pb-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-[#922036]">Chronology</span>
              <h2 className="text-2xl font-serif font-bold text-[#17191B] mt-0.5">
                Public Career Timeline
              </h2>
            </div>
            <span className="text-xs text-[#68645F] font-semibold bg-[#F8F6F2] px-2.5 py-1 rounded-full border border-[#E6E1DA]">
              {profile.milestones.length} Documented Milestones
            </span>
          </div>

          {profile.milestones.length === 0 ? (
            <p className="text-sm text-[#888] italic py-4">No verified career milestones recorded.</p>
          ) : (
            <div className="relative pl-6 sm:pl-8 border-l-2 border-[#922036]/30 space-y-8 my-4">
              {profile.milestones.map((milestone) => (
                <div key={milestone.id} className="relative group">
                  {/* Timeline Node Dot */}
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#922036] group-hover:bg-[#922036] transition-colors" />

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-[#922036] text-white">
                        {milestone.eventYear || (milestone.eventDate ? new Date(milestone.eventDate).getFullYear() : "Milestone")}
                      </span>
                      <span className="text-xs font-semibold text-[#1A633F] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </span>
                    </div>

                    <h3 className="text-lg font-serif font-bold text-[#17191B]">
                      {milestone.title}
                    </h3>

                    <p className="text-sm text-[#4A4B4F] leading-relaxed font-light">
                      {milestone.description}
                    </p>

                    {/* Sourced Citations for this milestone */}
                    {milestone.claimSources.length > 0 && (
                      <div className="pt-2 flex flex-wrap items-center gap-2">
                        <span className="text-[11px] text-[#888] font-medium">Citations:</span>
                        {milestone.claimSources.map((cs) => (
                          <a
                            key={cs.id}
                            href={cs.source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] bg-[#FAF8F5] border border-[#E6E1DA] text-[#922036] hover:bg-[#922036] hover:text-white transition-colors"
                            title={cs.relationshipNotes || cs.source.title}
                          >
                            <span>{cs.source.publisher}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* =========================================================================
            SECTION 6.D: PUBLIC RESPONSIBILITIES & INITIATIVES
            ========================================================================= */}
        <section id="initiatives" className="bg-white rounded-2xl border border-[#E6E1DA] editorial-shadow p-6 sm:p-10 mb-8 space-y-6">
          <div className="border-b border-[#E6E1DA] pb-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-[#922036]">Governance</span>
              <h2 className="text-2xl font-serif font-bold text-[#17191B] mt-0.5">
                Public Responsibilities & Initiatives
              </h2>
            </div>
            <span className="text-xs text-[#68645F] font-semibold bg-[#F8F6F2] px-2.5 py-1 rounded-full border border-[#E6E1DA]">
              {profile.initiatives.length} Sourced Initiatives
            </span>
          </div>

          <p className="text-xs text-[#68645F]">
            * Note: These initiatives represent official governmental portfolios and legislative programs,
            strictly distinguished from personal campaign claims.
          </p>

          {profile.initiatives.length === 0 ? (
            <p className="text-sm text-[#888] italic py-2">No public initiatives currently recorded.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {profile.initiatives.map((init) => (
                <div
                  key={init.id}
                  className="p-5 rounded-xl border border-[#E6E1DA] bg-[#FAF8F5] space-y-2.5 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#922036]">
                        {init.startDate ? new Date(init.startDate).getFullYear() : "Active Portfolio"}
                      </span>
                      <span className="text-[10px] text-[#1A633F] bg-[#E9F5EE] px-2 py-0.5 rounded-full border border-[#C2E2CE] font-semibold">
                        Documented
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-base text-[#17191B]">
                      {init.title}
                    </h3>

                    <p className="text-xs text-[#4A4B4F] leading-relaxed font-light">
                      {init.description}
                    </p>
                  </div>

                  {init.claimSources.length > 0 && (
                    <div className="pt-2 border-t border-[#E6E1DA] text-[11px] text-[#888] flex items-center justify-between">
                      <span>Source: {init.claimSources[0]?.source.publisher}</span>
                      <a
                        href={init.claimSources[0]?.source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#922036] hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>Examine Record</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* =========================================================================
            SECTION 6.E: SOURCE REGISTRY TABLE
            ========================================================================= */}
        <section id="sources" className="bg-white rounded-2xl border border-[#E6E1DA] editorial-shadow p-6 sm:p-10 mb-8 space-y-4">
          <div className="border-b border-[#E6E1DA] pb-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-[#922036]">Verification Evidence</span>
              <h2 className="text-2xl font-serif font-bold text-[#17191B] mt-0.5">
                Primary Source Citations & Gazette Registry
              </h2>
            </div>
            <span className="text-xs text-[#68645F] font-semibold bg-[#F8F6F2] px-2.5 py-1 rounded-full border border-[#E6E1DA]">
              {uniqueSources.length} Verified References
            </span>
          </div>

          <p className="text-xs text-[#68645F] leading-relaxed">
            Every statement of public office and career milestone above is verified against these primary legal and press references:
          </p>

          <div className="overflow-x-auto rounded-xl border border-[#E6E1DA]">
            <table className="w-full text-left text-xs text-[#17191B]">
              <thead className="bg-[#FAF8F5] border-b border-[#E6E1DA] text-[11px] font-semibold text-[#68645F] uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Publisher / Authority</th>
                  <th className="px-4 py-3">Document Title</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Last Checked</th>
                  <th className="px-4 py-3 text-right">Official Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E1DA]">
                {uniqueSources.map((source) => (
                  <tr key={source.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="px-4 py-3 font-semibold text-[#17191B]">
                      {source.publisher}
                    </td>
                    <td className="px-4 py-3 text-[#4A4B4F] max-w-sm truncate" title={source.title}>
                      {source.title}
                    </td>
                    <td className="px-4 py-3 text-[#68645F]">
                      <span className="px-2 py-0.5 rounded bg-[#F8F6F2] border border-[#E6E1DA] text-[10px] font-semibold">
                        {source.sourceType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#68645F]">
                      {new Date(source.checkedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-[#922036] hover:underline"
                      >
                        <span>Examine</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* =========================================================================
            SECTION 6.F: PUBLIC CORRECTIONS DESK CTA
            ========================================================================= */}
        <section className="bg-gradient-to-r from-[#FAF8F5] to-white rounded-2xl border border-[#E6E1DA] p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6 editorial-shadow">
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#922036] uppercase tracking-wider">
              <Scale className="w-3.5 h-3.5" />
              Public Verification Desk
            </div>
            <h3 className="font-serif font-bold text-xl text-[#17191B]">
              Notice an inaccuracy or missing citation?
            </h3>
            <p className="text-xs text-[#68645F] max-w-lg">
              Citizens, researchers, and public representatives can submit factual corrections with documentary citations.
              All submissions are investigated by our editorial review team.
            </p>
          </div>

          <Link
            href={`/corrections?profile=${profile.slug}`}
            className="px-5 py-3 rounded-lg bg-[#922036] text-white text-xs font-semibold hover:bg-[#7A1629] transition-all shadow-sm shrink-0"
          >
            Submit Evidentiary Correction
          </Link>
        </section>

        {/* =========================================================================
            SECTION 6.G: RELATED PUBLIC REPRESENTATIVES
            ========================================================================= */}
        {relatedLeaders.length > 0 && (
          <section id="related" className="space-y-4 pt-4">
            <div className="border-b border-[#E6E1DA] pb-3">
              <span className="text-xs font-semibold tracking-wider uppercase text-[#922036]">
                Cabinet & Legislative Assembly Colleagues
              </span>
              <h2 className="text-xl font-serif font-bold text-[#17191B] mt-0.5">
                Related Public Representatives
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedLeaders.map((related) => (
                <article
                  key={related.id}
                  className="bg-white rounded-xl border border-[#E6E1DA] p-5 card-hover-effect flex flex-col justify-between space-y-3 editorial-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-16 shrink-0">
                      <LeaderAvatar
                        src={related.portraitUrl}
                        name={related.displayName}
                        kannadaName={related.kannadaName}
                        size="sm"
                        aspect="portrait"
                        className="w-full h-full"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-serif font-bold text-base text-[#17191B] truncate hover:text-[#922036]">
                        <Link href={`/leaders/${related.slug}`}>{related.displayName}</Link>
                      </h4>
                      {related.kannadaName && (
                        <p className="text-xs font-kannada font-semibold text-[#922036]">
                          {related.kannadaName}
                        </p>
                      )}
                      <p className="text-xs font-medium text-[#17191B] mt-1 line-clamp-1">
                        {related.currentRole}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-[#68645F] line-clamp-2">
                    {related.shortBio}
                  </p>

                  <div className="pt-2 border-t border-[#E6E1DA] flex items-center justify-between text-xs text-[#68645F]">
                    <span>{related.constituency || "Karnataka"}</span>
                    <Link
                      href={`/leaders/${related.slug}`}
                      className="text-[#922036] font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>View record</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
