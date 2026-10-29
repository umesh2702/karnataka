import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Sparkles,
  ExternalLink,
  CheckCircle2,
  BookOpen,
  Award,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SchemesManagerPage() {
  const session = await getCurrentUser();
  if (!session) redirect("/studio/login");

  const schemes = await prisma.governmentScheme.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E6E1DA] gap-4">
        <div>
          <span className="text-xs font-semibold text-[#922036] uppercase tracking-wider">
            Flagship Social Contract
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#17191B] mt-1">
            Five Guarantees & Welfare Framework
          </h1>
          <p className="text-xs text-[#68645F] mt-1">
            Document and audit official government welfare schemes, statutory department rules, and public Seva Sindhu application portals.
          </p>
        </div>

        <Link
          href="/schemes"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3 py-2 border border-[#E6E1DA] rounded-lg text-xs font-semibold text-[#17191B] hover:bg-[#F8F6F2]"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Public Schemes Guide</span>
        </Link>
      </div>

      {/* Schemes Grid */}
      <div className="space-y-6">
        {schemes.map((scheme, i) => (
          <div
            key={scheme.id}
            className="bg-white rounded-xl border border-[#E6E1DA] p-6 editorial-shadow space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-[#922036]/10 text-[#922036]">
                    GUARANTEE 0{i + 1}
                  </span>
                  <span className="text-xs font-medium text-[#68645F]">
                    {scheme.department}
                  </span>
                </div>
                <h2 className="text-xl font-serif font-bold text-[#17191B]">
                  {scheme.name}
                </h2>
                {scheme.kannadaName && (
                  <p className="text-sm font-kannada font-semibold text-[#922036]">
                    {scheme.kannadaName}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {scheme.publicationStatus}
                </span>
                {scheme.applicationUrl && (
                  <a
                    href={scheme.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 border border-[#E6E1DA] rounded hover:bg-[#F8F6F2] text-[#922036]"
                    title="Seva Sindhu Portal"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            <p className="text-xs text-[#4A4B4F] leading-relaxed">
              {scheme.tagline}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E6E1DA] space-y-1">
                <span className="font-bold text-[#17191B] block">Eligibility Criteria:</span>
                <p className="text-[#68645F]">{scheme.eligibility}</p>
              </div>

              <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E6E1DA] space-y-1">
                <span className="font-bold text-[#17191B] block">Citizen Benefits:</span>
                <p className="text-[#68645F]">{scheme.benefits}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#F0ECE6] flex flex-wrap items-center justify-between text-xs text-[#68645F] gap-2">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#922036]" />
                <span>
                  Source:{" "}
                  <a
                    href={scheme.officialSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-[#17191B]"
                  >
                    Gazette Order
                  </a>
                </span>
              </div>

              <span>Verified: {new Date(scheme.verifiedAt).toLocaleDateString("en-IN")}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
