import React from "react";
import prisma from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import LeaderAvatar from "@/components/profile/LeaderAvatar";
import CitizenIssueForm from "@/components/constituency/CitizenIssueForm";
import { PublicationStatus } from "@prisma/client";
import {
  MapPin,
  Users,
  Award,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Calendar,
  Building2,
  Compass,
  FileCheck2,
  Clock,
  Layers,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: Props) {
  const { slug } = await props.params;
  const c = await prisma.constituency.findUnique({
    where: { slug },
    include: { representative: true },
  });

  if (!c) {
    return { title: "Constituency Not Found | UCreates" };
  }

  return {
    title: `${c.name} (AC No. ${c.number}) Assembly Constituency | Karnataka Congress Platform`,
    description: `Official constituency documentation for ${c.name} in ${c.district} district. Representative: ${c.representative?.displayName || "To be updated"}.`,
  };
}

export default async function ConstituencyDetailPage(props: Props) {
  const { slug } = await props.params;

  const constituency = await prisma.constituency.findUnique({
    where: { slug },
    include: {
      representative: {
        select: {
          id: true,
          slug: true,
          displayName: true,
          kannadaName: true,
          currentRole: true,
          party: true,
          portfolio: true,
          district: true,
          shortBio: true,
          portraitUrl: true,
          publicationStatus: true,
          roleLastVerifiedAt: true,
        },
      },
      projects: {
        where: {
          publicationStatus: PublicationStatus.PUBLISHED,
        },
        orderBy: { announcedDate: "desc" },
      },
    },
  });

  if (!constituency) {
    notFound();
  }

  const rep = constituency.representative;
  const isPublishedRep = rep && rep.publicationStatus === PublicationStatus.PUBLISHED;

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F6F2]">
      <Navbar />

      <main className="flex-1 py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="text-xs text-[#68645F] flex items-center gap-2">
            <Link href="/" className="hover:text-[#17191B]">Home</Link>
            <span>/</span>
            <Link href="/constituencies" className="hover:text-[#17191B]">Constituencies</Link>
            <span>/</span>
            <span className="text-[#17191B] font-semibold">{constituency.name}</span>
          </nav>

          {/* Constituency Hero Header */}
          <div className="bg-white rounded-2xl border border-[#E6E1DA] p-6 sm:p-10 editorial-shadow">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded bg-[#922036] text-white text-xs font-mono font-bold">
                Assembly Constituency No. {constituency.number}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#EFECE6] text-[#17191B] text-xs font-semibold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#922036]" />
                {constituency.district} District · {constituency.region}
              </span>
              {constituency.reservation !== "GENERAL" && (
                <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
                  {constituency.reservation} Reserved Category
                </span>
              )}
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-2">
              <div>
                <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#17191B] tracking-tight">
                  {constituency.name}
                </h1>
                {constituency.kannadaName && (
                  <p className="text-2xl font-kannada font-semibold text-[#922036] mt-1">
                    {constituency.kannadaName}
                  </p>
                )}
                <p className="text-sm sm:text-base text-[#4A4B4F] mt-3 max-w-3xl leading-relaxed font-light">
                  {constituency.summary ||
                    `${constituency.name} is a verified legislative assembly constituency in the ${constituency.district} district of Karnataka, representing citizens under statutory Election Commission delimitations.`}
                </p>
              </div>

              {constituency.totalElectors && (
                <div className="shrink-0 p-4 bg-[#FAF8F5] rounded-xl border border-[#E6E1DA] text-right">
                  <span className="text-xs uppercase tracking-wider text-[#68645F] block font-semibold">
                    Registered Electorate
                  </span>
                  <span className="text-2xl font-serif font-bold text-[#17191B] block mt-0.5">
                    {constituency.totalElectors.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[11px] text-[#82848A]">Verified statutory voter roll</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 7 cols: Documented Projects & Initiatives */}
            <div className="lg:col-span-7 space-y-8">
              <div className="bg-white rounded-2xl border border-[#E6E1DA] p-6 sm:p-8 editorial-shadow space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#E6E1DA]">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#922036]">
                      Civic Infrastructure & Works
                    </span>
                    <h2 className="text-2xl font-serif font-bold text-[#17191B] mt-0.5">
                      Published Constituency Works & Initiatives
                    </h2>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 bg-[#F4EFEB] rounded-full text-[#17191B]">
                    {constituency.projects.length} Works
                  </span>
                </div>

                {constituency.projects.length === 0 ? (
                  <div className="text-center py-10 space-y-2 text-[#68645F]">
                    <Layers className="w-8 h-8 mx-auto opacity-40 text-[#68645F]" />
                    <p className="text-sm font-medium">No projects currently published for this constituency</p>
                    <p className="text-xs">
                      Public works records are published strictly after verifying official administrative sanctions and department tenders.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {constituency.projects.map((project) => {
                      const stageColors: Record<string, string> = {
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
                          className="p-5 rounded-xl border border-[#E6E1DA] bg-[#FAF8F5] space-y-3"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                                stageColors[project.stage] || "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {project.stage}
                            </span>
                            {project.budgetAmount && (
                              <span className="text-xs font-bold font-mono text-[#17191B] bg-white px-2.5 py-1 rounded border border-[#E6E1DA]">
                                Outlay: {project.budgetAmount}
                              </span>
                            )}
                          </div>

                          <h3 className="font-serif font-bold text-lg text-[#17191B]">
                            {project.title}
                          </h3>

                          <p className="text-xs text-[#4A4B4F] leading-relaxed">
                            {project.description}
                          </p>

                          <div className="pt-2 border-t border-[#E6E1DA] flex flex-wrap items-center justify-between gap-2 text-xs text-[#68645F]">
                            <span>
                              <strong>Department:</strong> {project.department || "Government of Karnataka"}
                            </span>
                            {project.evidenceUrl && (
                              <a
                                href={project.evidenceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 font-semibold text-[#922036] hover:underline"
                              >
                                <span>Evidence Citation</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Citizen Issue Tracker Form */}
              <CitizenIssueForm
                constituencyId={constituency.id}
                constituencyName={constituency.name}
              />
            </div>

            {/* Right 5 cols: Representative & Constituency Quick Facts */}
            <div className="lg:col-span-5 space-y-8">
              {/* Representative Card */}
              <div className="bg-white rounded-2xl border border-[#E6E1DA] p-6 sm:p-8 editorial-shadow space-y-6">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#922036]">
                    Legislative Leadership
                  </span>
                  <h3 className="text-xl font-serif font-bold text-[#17191B] mt-0.5">
                    Elected Representative
                  </h3>
                </div>

                {isPublishedRep ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-24 shrink-0">
                        <LeaderAvatar
                          src={rep.portraitUrl}
                          name={rep.displayName}
                          kannadaName={rep.kannadaName}
                          size="md"
                          aspect="portrait"
                          className="w-full h-full"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="font-serif font-bold text-lg text-[#17191B] hover:text-[#922036]">
                          <Link href={`/leaders/${rep.slug}`}>{rep.displayName}</Link>
                        </h4>
                        {rep.kannadaName && (
                          <p className="text-sm font-kannada font-semibold text-[#922036]">
                            {rep.kannadaName}
                          </p>
                        )}
                        <p className="text-xs font-semibold text-[#17191B] mt-1">
                          {rep.currentRole}
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FAF8F5] border border-[#E6E1DA] text-[#68645F]">
                          {rep.party}
                        </span>
                      </div>
                    </div>

                    {rep.portfolio && (
                      <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E6E1DA] text-xs">
                        <span className="font-semibold text-[#17191B] block mb-0.5">
                          Executive Ministerial Portfolios:
                        </span>
                        <p className="text-[#68645F] leading-relaxed">{rep.portfolio}</p>
                      </div>
                    )}

                    <p className="text-xs text-[#68645F] leading-relaxed line-clamp-3">
                      {rep.shortBio}
                    </p>

                    <div className="pt-3 border-t border-[#E6E1DA] flex items-center justify-between">
                      {rep.roleLastVerifiedAt && (
                        <span className="text-[11px] text-[#82848A]">
                          Verified: {new Date(rep.roleLastVerifiedAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                        </span>
                      )}
                      <Link
                        href={`/leaders/${rep.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#922036] hover:text-[#7A1629]"
                      >
                        <span>Full Biography & Milestones</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-[#FAF8F5] rounded-xl border border-[#E6E1DA] text-center space-y-2">
                    <Building2 className="w-8 h-8 text-[#A0A2A8] mx-auto" />
                    <p className="text-sm font-serif font-bold text-[#17191B]">
                      Representative Profile Pending Editorial Review
                    </p>
                    <p className="text-xs text-[#68645F]">
                      In accordance with UCreates editorial standards, records are only displayed publicly once fully verified against official legislative gazettes.
                    </p>
                  </div>
                )}
              </div>

              {/* Administrative Overview */}
              <div className="bg-white rounded-2xl border border-[#E6E1DA] p-6 sm:p-8 editorial-shadow space-y-4">
                <h3 className="font-serif font-bold text-lg text-[#17191B] pb-2 border-b border-[#E6E1DA]">
                  Constituency Facts
                </h3>

                <dl className="space-y-3 text-xs">
                  <div className="flex justify-between py-1 border-b border-[#F0ECE6]">
                    <dt className="text-[#68645F]">Assembly Number</dt>
                    <dd className="font-mono font-bold text-[#17191B]">AC {constituency.number}</dd>
                  </div>

                  <div className="flex justify-between py-1 border-b border-[#F0ECE6]">
                    <dt className="text-[#68645F]">District</dt>
                    <dd className="font-semibold text-[#17191B]">{constituency.district}</dd>
                  </div>

                  <div className="flex justify-between py-1 border-b border-[#F0ECE6]">
                    <dt className="text-[#68645F]">Administrative Region</dt>
                    <dd className="text-[#17191B]">{constituency.region}</dd>
                  </div>

                  <div className="flex justify-between py-1 border-b border-[#F0ECE6]">
                    <dt className="text-[#68645F]">Reservation Category</dt>
                    <dd className="font-semibold text-[#17191B]">{constituency.reservation}</dd>
                  </div>

                  {constituency.totalElectors && (
                    <div className="flex justify-between py-1 border-b border-[#F0ECE6]">
                      <dt className="text-[#68645F]">Total Electors</dt>
                      <dd className="font-mono text-[#17191B]">{constituency.totalElectors.toLocaleString("en-IN")}</dd>
                    </div>
                  )}
                </dl>

                <div className="pt-2 text-[11px] text-[#82848A] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified against official legislative delimitation records</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
