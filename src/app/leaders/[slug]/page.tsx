import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ShareButton from "@/components/profile/ShareButton";
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
  ChevronRight,
  Info,
  Scale,
  Sparkles,
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

  // Collect all unique attached sources
  const allSourcesMap = new Map<string, { id: string; title: string; url: string; publisher: string; sourceType: string; checkedAt: Date }>();

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
    <div className="flex flex-col min-h-screen bg-[#F7F7F4]">
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-[#65676B]">
          <Link href="/" className="hover:text-[#191A1C] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/leaders" className="hover:text-[#191A1C] transition-colors">
            Leaders Directory
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#191A1C] font-semibold truncate">{profile.displayName}</span>
        </nav>

        {/* Profile Hero Section (Section 6.A) */}
        <div className="bg-white rounded-2xl border border-[#E5E5E0] editorial-shadow p-6 sm:p-10 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Portrait */}
            <div className="md:col-span-4 relative">
              <div className="aspect-3/4 rounded-xl overflow-hidden bg-[#EFEFEA] border border-[#E0E0DB]">
                {profile.portraitUrl ? (
                  <img
                    src={profile.portraitUrl}
                    alt={profile.displayName}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-[#888]">
                    Portrait
                  </div>
                )}
              </div>
              <div className="mt-2 text-center text-[11px] text-[#707278]">
                Documented Public Record Portrait
              </div>
            </div>

            {/* Profile Core Information */}
            <div className="md:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified Public Record
                  </span>
                  {profile.roleLastVerifiedAt && (
                    <span className="text-xs text-[#65676B]">
                      Role Verified: {new Date(profile.roleLastVerifiedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  )}
                </div>

                <ShareButton title={profile.displayName} />
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#191A1C] tracking-tight">
                  {profile.displayName}
                </h1>
                {profile.kannadaName && (
                  <p className="text-2xl font-kannada font-bold text-[#8A1C2C] mt-1.5">
                    {profile.kannadaName}
                  </p>
                )}
              </div>

              <p className="text-base sm:text-lg font-semibold text-[#8A1C2C]">
                {profile.currentRole}
              </p>

              {/* Public Attributes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 pb-2 text-xs text-[#4A4B4F] border-t border-b border-[#F0F0EB]">
                {profile.constituency && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#8A1C2C] shrink-0" />
                    <div>
                      <span className="text-[#888] block text-[10px] uppercase font-semibold">Constituency</span>
                      <span className="font-medium text-[#191A1C]">{profile.constituency}</span>
                    </div>
                  </div>
                )}
                {profile.organisationName && (
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#8A1C2C] shrink-0" />
                    <div>
                      <span className="text-[#888] block text-[10px] uppercase font-semibold">Organisation</span>
                      <span className="font-medium text-[#191A1C]">{profile.organisationName}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Sourced Introduction */}
              <p className="text-sm sm:text-base text-[#4A4B4F] leading-relaxed font-light">
                {profile.shortBio}
              </p>

              {/* Notice of Independence */}
              <div className="bg-[#FAF8F5] p-3 rounded-lg border border-[#EFEFEA] flex items-start gap-2.5 text-xs text-[#65676B]">
                <Info className="w-4 h-4 text-[#8A1C2C] shrink-0 mt-0.5" />
                <span>
                  This record is compiled independently by UCreates using public legislative gazettes. It does not
                  constitute an endorsement by the Government of Karnataka.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 6.B: Biography & Background */}
        <section className="bg-white rounded-2xl border border-[#E5E5E0] editorial-shadow p-6 sm:p-10 mb-10 space-y-4">
          <div className="border-b border-[#E5E5E0] pb-3">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#8A1C2C]">Biographical Record</span>
            <h2 className="text-2xl font-serif font-bold text-[#191A1C]">Public Biography & Educational Background</h2>
          </div>

          <div className="text-sm sm:text-base text-[#3A3B3F] leading-relaxed space-y-4 whitespace-pre-line font-light">
            {profile.biography}
          </div>
        </section>

        {/* Section 6.C: Public Career Timeline */}
        <section className="bg-white rounded-2xl border border-[#E5E5E0] editorial-shadow p-6 sm:p-10 mb-10 space-y-6">
          <div className="border-b border-[#E5E5E0] pb-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-[#8A1C2C]">Chronology</span>
              <h2 className="text-2xl font-serif font-bold text-[#191A1C]">Public Career Timeline</h2>
            </div>
            <span className="text-xs text-[#65676B] font-medium">
              {profile.milestones.length} Documented Milestones
            </span>
          </div>

          {profile.milestones.length === 0 ? (
            <p className="text-sm text-[#888] italic py-4">No verified career milestones recorded.</p>
          ) : (
            <div className="relative pl-6 sm:pl-8 border-l-2 border-[#8A1C2C]/30 space-y-8 my-4">
              {profile.milestones.map((milestone) => (
                <div key={milestone.id} className="relative group">
                  {/* Timeline Node Dot */}
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#8A1C2C] group-hover:bg-[#8A1C2C] transition-colors"></div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-[#8A1C2C] text-white">
                        {milestone.eventYear || (milestone.eventDate ? new Date(milestone.eventDate).getFullYear() : "Milestone")}
                      </span>
                      <span className="text-xs font-medium text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </span>
                    </div>

                    <h3 className="text-lg font-serif font-bold text-[#191A1C]">
                      {milestone.title}
                    </h3>

                    <p className="text-sm text-[#4A4B4F] leading-relaxed font-light">
                      {milestone.description}
                    </p>

                    {/* Attached Source References */}
                    {milestone.claimSources.length > 0 && (
                      <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                        <span className="text-[#888]">Citations:</span>
                        {milestone.claimSources.map((cs) => (
                          <a
                            key={cs.id}
                            href={cs.source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E0E0DB] text-[#8A1C2C] hover:bg-[#EFEFEA] transition-colors"
                          >
                            <span>{cs.source.publisher}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
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

        {/* Section 6.D: Documented Initiatives & Work */}
        {profile.initiatives.length > 0 && (
          <section className="bg-white rounded-2xl border border-[#E5E5E0] editorial-shadow p-6 sm:p-10 mb-10 space-y-6">
            <div className="border-b border-[#E5E5E0] pb-3">
              <span className="text-xs font-semibold tracking-wider uppercase text-[#8A1C2C]">Governance & Policy</span>
              <h2 className="text-2xl font-serif font-bold text-[#191A1C]">Documented Initiatives & Public Programs</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.initiatives.map((init) => (
                <div
                  key={init.id}
                  className="p-5 rounded-xl border border-[#E5E5E0] bg-[#FAF8F5] space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#8A1C2C]">Public Initiative</span>
                    <span className="text-xs text-emerald-700 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified Record
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-[#191A1C]">{init.title}</h3>

                  <p className="text-xs sm:text-sm text-[#4A4B4F] leading-relaxed font-light">
                    {init.description}
                  </p>

                  {init.claimSources.length > 0 && (
                    <div className="pt-2 flex items-center gap-2 text-xs text-[#65676B]">
                      <span>Source:</span>
                      {init.claimSources.map((cs) => (
                        <a
                          key={cs.id}
                          href={cs.source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#8A1C2C] font-medium hover:underline inline-flex items-center gap-1"
                        >
                          <span>{cs.source.publisher}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 6.F: Sourced References & Citations */}
        <section className="bg-white rounded-2xl border border-[#E5E5E0] editorial-shadow p-6 sm:p-10 mb-10 space-y-6">
          <div className="border-b border-[#E5E5E0] pb-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-[#8A1C2C]">Source Registry</span>
              <h2 className="text-2xl font-serif font-bold text-[#191A1C]">Verified Sourced References</h2>
            </div>
            <Link
              href="/corrections"
              className="text-xs font-semibold text-[#8A1C2C] hover:underline"
            >
              Report a factual discrepancy
            </Link>
          </div>

          <p className="text-xs sm:text-sm text-[#5E6066]">
            Every biographical claim and ministerial milestone on this profile is mapped to the authoritative public
            references listed below.
          </p>

          <div className="divide-y divide-[#EFEFEA]">
            {uniqueSources.map((source, index) => (
              <div key={source.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#8A1C2C]">[{index + 1}]</span>
                    <h3 className="text-sm font-semibold text-[#191A1C]">{source.title}</h3>
                  </div>
                  <div className="text-xs text-[#707278] flex flex-wrap items-center gap-x-3">
                    <span>Publisher: <strong className="text-[#4A4B4F]">{source.publisher}</strong></span>
                    <span>•</span>
                    <span>Category: {source.sourceType.replace(/_/g, " ")}</span>
                    <span>•</span>
                    <span>Checked: {new Date(source.checkedAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</span>
                  </div>
                </div>

                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#E0E0DB] text-xs font-medium text-[#191A1C] hover:bg-[#FAF8F5] hover:text-[#8A1C2C] transition-colors shrink-0"
                >
                  <span>Open Source</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Back Link */}
        <div className="pt-4 flex items-center justify-between">
          <Link
            href="/leaders"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#8A1C2C] hover:text-[#721422] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Karnataka Leadership Directory</span>
          </Link>
          <Link
            href="/corrections"
            className="text-xs text-[#707278] hover:text-[#191A1C] underline"
          >
            Submit an update or correction for this profile
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
