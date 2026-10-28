import React from "react";
import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { PublicationStatus } from "@prisma/client";
import {
  ShieldCheck,
  FileText,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Scale,
  Award,
  Search,
  ExternalLink,
  MapPin,
  Calendar,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch real published leadership profiles from PostgreSQL
  const publishedProfiles = await prisma.leaderProfile.findMany({
    where: { publicationStatus: PublicationStatus.PUBLISHED },
    include: {
      _count: { select: { milestones: true, initiatives: true } },
    },
    orderBy: { displayName: "asc" },
  });

  // Featured profile: D. K. Shivakumar as specified in Section 5.C
  const featured =
    publishedProfiles.find((p) => p.slug === "dk-shivakumar") || publishedProfiles[0];

  // Directory preview: Other published leaders
  const previewLeaders = publishedProfiles.filter((p) => p.slug !== featured?.slug);

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F7F4]">
      <Navbar />

      <main className="flex-1">
        {/* Editorial Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28 border-b border-[#E5E5E0]">
          {/* Subtle architectural background texture */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#191A1C_1px,transparent_1px)] [background-size:24px_24px]"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8A1C2C]/10 text-[#8A1C2C] text-xs font-semibold tracking-wide uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8A1C2C]"></span>
                Karnataka Edition • Source-Verified Registry
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#191A1C] tracking-tight leading-[1.15]">
                Public Leadership. <br />
                <span className="italic font-normal text-[#8A1C2C]">Clearly Documented.</span>
              </h1>

              <p className="text-lg sm:text-xl text-[#4A4B4F] leading-relaxed max-w-2xl font-light">
                Explore public leadership profiles, verified career milestones, and documented legislative service
                across Karnataka through a structured, source-aware digital publication platform.
              </p>

              <div className="pt-3 flex flex-wrap items-center gap-4">
                <Link
                  href="/leaders"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-md bg-[#8A1C2C] text-white font-medium text-sm hover:bg-[#721422] transition-colors shadow-sm"
                >
                  <span>Explore Leaders Directory</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-md bg-white border border-[#D5D5D0] text-[#191A1C] font-medium text-sm hover:bg-[#EFEFEA] transition-colors"
                >
                  <FileText className="w-4 h-4 text-[#8A1C2C]" />
                  <span>Editorial Standards</span>
                </Link>
              </div>

              {/* Verified Integrity Trust Indicators */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-[#E5E5E0]/80">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h2 className="text-xs font-bold text-[#191A1C]">Official Gazette Citations</h2>
                    <p className="text-[11px] text-[#65676B]">Linked to legislative records</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#8A1C2C] shrink-0 mt-0.5" />
                  <div>
                    <h2 className="text-xs font-bold text-[#191A1C]">No Promotion Claims</h2>
                    <p className="text-[11px] text-[#65676B]">Independent editorial review</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Scale className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <h2 className="text-xs font-bold text-[#191A1C]">Open Corrections</h2>
                    <p className="text-[11px] text-[#65676B]">Public verification queue</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Profile Section (Section 5.C) */}
        {featured && (
          <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E5E5E0]">
              <div>
                <span className="text-xs font-semibold tracking-wider uppercase text-[#8A1C2C]">
                  Featured Leadership Record
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#191A1C] mt-1">
                  Karnataka State Cabinet Feature
                </h2>
              </div>
              <Link
                href="/leaders"
                className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-[#8A1C2C] hover:text-[#721422]"
              >
                <span>View all {publishedProfiles.length} verified leaders</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-white rounded-xl border border-[#E5E5E0] editorial-shadow overflow-hidden grid grid-cols-1 lg:grid-cols-12">
              {/* Leader Portrait */}
              <div className="lg:col-span-5 relative bg-[#EFEFEA] min-h-[380px] lg:min-h-full">
                {featured.portraitUrl ? (
                  <img
                    src={featured.portraitUrl}
                    alt={`Portrait of ${featured.displayName}`}
                    className="w-full h-full object-cover object-top min-h-[360px]"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#E5E5DE] text-[#888]">
                    Portrait placeholder
                  </div>
                )}
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded">
                  Permitted Public Editorial Attribution
                </div>
              </div>

              {/* Leader Verified Details */}
              <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified Published Profile
                    </span>
                    {featured.roleLastVerifiedAt && (
                      <span className="text-xs text-[#65676B]">
                        Checked: {new Date(featured.roleLastVerifiedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-3xl sm:text-4xl font-serif font-bold text-[#191A1C]">
                      {featured.displayName}
                    </h3>
                    {featured.kannadaName && (
                      <p className="text-xl font-kannada text-[#8A1C2C] font-semibold mt-1">
                        {featured.kannadaName}
                      </p>
                    )}
                  </div>

                  <p className="text-base font-semibold text-[#8A1C2C]">
                    {featured.currentRole}
                  </p>

                  <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-[#555]">
                    {featured.constituency && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#8A1C2C]" />
                        <span>{featured.constituency}</span>
                      </div>
                    )}
                    {featured.organisationName && (
                      <div className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-[#8A1C2C]" />
                        <span>{featured.organisationName}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-[#4A4B4F] leading-relaxed line-clamp-3">
                    {featured.shortBio}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EFEFEA] flex flex-wrap items-center justify-between gap-4">
                  <div className="text-xs text-[#65676B]">
                    <span>{featured._count.milestones} Documented Milestones</span> •{" "}
                    <span>{featured._count.initiatives} Initiatives</span>
                  </div>

                  <Link
                    href={`/leaders/${featured.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#8A1C2C] text-white text-xs font-semibold hover:bg-[#721422] transition-colors"
                  >
                    <span>View Profile & Sources</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Directory Preview Section (Section 5.D) */}
        {previewLeaders.length > 0 && (
          <section className="py-16 bg-[#F0F0EB] border-t border-b border-[#E5E5E0]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-10 pb-4 border-b border-[#DCDCD7]">
                <div>
                  <span className="text-xs font-semibold tracking-wider uppercase text-[#8A1C2C]">
                    Directory Records
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#191A1C] mt-1">
                    Published Karnataka Representatives
                  </h2>
                </div>
                <Link
                  href="/leaders"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-[#8A1C2C] hover:underline"
                >
                  <span>Explore full directory</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {previewLeaders.map((leader) => (
                  <article
                    key={leader.id}
                    className="bg-white rounded-lg border border-[#E0E0DB] p-6 card-hover-effect flex flex-col justify-between space-y-4"
                  >
                    <div className="flex items-start gap-4">
                      {leader.portraitUrl ? (
                        <img
                          src={leader.portraitUrl}
                          alt={leader.displayName}
                          className="w-16 h-16 rounded-full object-cover shrink-0 border border-[#D5D5CF]"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-[#EFEFEA] text-[#888] flex items-center justify-center text-xs shrink-0">
                          Photo
                        </div>
                      )}
                      <div>
                        <h3 className="font-serif font-bold text-lg text-[#191A1C] hover:text-[#8A1C2C] transition-colors">
                          <Link href={`/leaders/${leader.slug}`}>{leader.displayName}</Link>
                        </h3>
                        {leader.kannadaName && (
                          <p className="text-xs font-kannada font-semibold text-[#8A1C2C]">
                            {leader.kannadaName}
                          </p>
                        )}
                        <p className="text-xs font-medium text-[#4A4B4F] mt-1 line-clamp-1">
                          {leader.currentRole}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-[#5E6066] leading-relaxed line-clamp-2">
                      {leader.shortBio}
                    </p>

                    <div className="pt-3 border-t border-[#F0F0EB] flex items-center justify-between text-[11px] text-[#707278]">
                      <span>{leader.constituency || "Karnataka"}</span>
                      <Link
                        href={`/leaders/${leader.slug}`}
                        className="text-[#8A1C2C] font-semibold hover:underline flex items-center gap-1"
                      >
                        <span>View record</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Editorial Standards Showcase (Section 5.E) */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#8A1C2C]">
              Institutional Rigour
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#191A1C]">
              How Information is Verified
            </h2>
            <p className="text-sm sm:text-base text-[#5E6066] leading-relaxed font-light">
              UCreates Leadership Studio enforces a multi-tier verification process before any public leadership
              record or career milestone is published.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-white rounded-xl border border-[#E5E5E0] space-y-4">
              <div className="w-12 h-12 rounded-lg bg-[#8A1C2C]/10 text-[#8A1C2C] flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#191A1C]">Primary Legislative Gazettes</h3>
              <p className="text-sm text-[#5E6066] leading-relaxed">
                Cabinet appointments, constitutional portfolios, and election returns are corroborated against Karnataka
                Legislative Assembly (KLA) records and Election Commission statutory affidavits.
              </p>
            </div>

            <div className="p-8 bg-white rounded-xl border border-[#E5E5E0] space-y-4">
              <div className="w-12 h-12 rounded-lg bg-[#8A1C2C]/10 text-[#8A1C2C] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#191A1C]">Independent Review Queue</h3>
              <p className="text-sm text-[#5E6066] leading-relaxed">
                Editors submit draft revisions that must pass independent editorial review. Self-approval is strictly
                blocked by system permissions, maintaining publisher integrity.
              </p>
            </div>

            <div className="p-8 bg-white rounded-xl border border-[#E5E5E0] space-y-4">
              <div className="w-12 h-12 rounded-lg bg-[#8A1C2C]/10 text-[#8A1C2C] flex items-center justify-center">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#191A1C]">Open Public Corrections</h3>
              <p className="text-sm text-[#5E6066] leading-relaxed">
                Citizens, journalists, and public officers can submit factual corrections with documentary citations
                through our public verification desk for editorial investigation.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
