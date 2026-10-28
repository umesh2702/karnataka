import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PublicationStatus, Role } from "@prisma/client";
import {
  PlusCircle,
  Search,
  CheckCircle2,
  FileEdit,
  Clock,
  Archive,
  ExternalLink,
  Edit3,
  Award,
  Filter,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface ProfileManagerProps {
  searchParams: Promise<{
    status?: string;
    search?: string;
  }>;
}

export default async function LeadersManagerPage({ searchParams }: ProfileManagerProps) {
  const session = await getCurrentUser();
  if (!session) redirect("/studio/login");

  const { status, search } = await searchParams;
  const filterStatus = status || "ALL";
  const searchQuery = search || "";

  const where: Record<string, unknown> = {
    organisationId: session.organisationId,
  };

  if (filterStatus !== "ALL") {
    where.publicationStatus = filterStatus as PublicationStatus;
  }

  if (searchQuery) {
    where.OR = [
      { displayName: { contains: searchQuery, mode: "insensitive" } },
      { currentRole: { contains: searchQuery, mode: "insensitive" } },
      { slug: { contains: searchQuery, mode: "insensitive" } },
    ];
  }

  const profiles = await prisma.leaderProfile.findMany({
    where,
    include: {
      _count: {
        select: {
          milestones: true,
          initiatives: true,
          revisions: true,
          consentRecords: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  const getStatusBadge = (st: PublicationStatus) => {
    switch (st) {
      case PublicationStatus.PUBLISHED:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Published
          </span>
        );
      case PublicationStatus.APPROVED:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Award className="w-3 h-3" />
            Approved
          </span>
        );
      case PublicationStatus.IN_REVIEW:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" />
            In Review
          </span>
        );
      case PublicationStatus.DRAFT:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200">
            <FileEdit className="w-3 h-3" />
            Draft
          </span>
        );
      case PublicationStatus.ARCHIVED:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-50 text-gray-700 border border-gray-200">
            <Archive className="w-3 h-3" />
            Archived
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E0] pb-6">
        <div>
          <span className="text-xs font-semibold text-[#8A1C2C] uppercase tracking-wider">
            Directory Catalog
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#191A1C] mt-1">
            Leadership Profile Manager
          </h1>
          <p className="text-xs sm:text-sm text-[#5E6066]">
            Manage biographies, revisions, verification states, and publication status.
          </p>
        </div>

        <Link
          href="/studio/leaders/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#8A1C2C] text-white text-xs font-semibold hover:bg-[#721422] transition-colors shadow-2xs shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Profile</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E5E5E0] editorial-shadow flex flex-col sm:flex-row items-center justify-between gap-3">
        <form method="GET" action="/studio/leaders" className="flex items-center gap-3 w-full sm:w-auto flex-1">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              name="search"
              defaultValue={searchQuery}
              placeholder="Filter by name, slug or designation..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#E0E0DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8A1C2C]"
            />
            <Search className="w-3.5 h-3.5 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <select
            name="status"
            defaultValue={filterStatus}
            className="px-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#E0E0DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8A1C2C]"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="APPROVED">Approved</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>

          <button
            type="submit"
            className="px-3 py-1.5 bg-[#8A1C2C] text-white rounded-lg text-xs font-semibold hover:bg-[#721422]"
          >
            Filter
          </button>
        </form>

        <span className="text-xs text-[#65676B] shrink-0">
          Showing <strong>{profiles.length}</strong> profiles
        </span>
      </div>

      {/* Profiles Table */}
      <div className="bg-white rounded-xl border border-[#E5E5E0] editorial-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-[#E5E5E0] text-[#65676B] uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Leader Profile</th>
                <th className="py-3 px-4">Current Public Role</th>
                <th className="py-3 px-4">Workflow Status</th>
                <th className="py-3 px-4 text-center">Milestones</th>
                <th className="py-3 px-4 text-center">Revisions</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F0EB] text-[#191A1C]">
              {profiles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#888] italic">
                    No leadership profiles found matching the current filter.
                  </td>
                </tr>
              ) : (
                profiles.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    {/* Leader Identity */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {p.portraitUrl ? (
                          <img
                            src={p.portraitUrl}
                            alt={p.displayName}
                            className="w-10 h-10 rounded-lg object-cover object-top border border-[#E0E0DB]"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-[#EFEFEA] text-[#888] flex items-center justify-center font-bold">
                            {p.displayName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <Link
                            href={`/studio/leaders/${p.id}/edit`}
                            className="font-bold text-sm text-[#191A1C] hover:text-[#8A1C2C]"
                          >
                            {p.displayName}
                          </Link>
                          {p.kannadaName && (
                            <p className="text-[11px] font-kannada font-semibold text-[#8A1C2C]">
                              {p.kannadaName}
                            </p>
                          )}
                          <span className="text-[10px] text-[#707278] font-mono">slug: {p.slug}</span>
                        </div>
                      </div>
                    </td>

                    {/* Role & Constituency */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold block text-xs">{p.currentRole}</span>
                      <span className="text-[11px] text-[#65676B]">{p.constituency || "Karnataka"}</span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">{getStatusBadge(p.publicationStatus)}</td>

                    {/* Counts */}
                    <td className="py-3.5 px-4 text-center font-medium">{p._count.milestones}</td>
                    <td className="py-3.5 px-4 text-center font-medium">{p._count.revisions}</td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/studio/leaders/${p.id}/edit`}
                          className="p-1.5 rounded border border-[#E0E0DB] hover:bg-white text-[#4A4B4F] hover:text-[#8A1C2C] transition-colors"
                          title="Edit Profile & Milestones"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Link>

                        {p.publicationStatus === PublicationStatus.PUBLISHED ? (
                          <Link
                            href={`/leaders/${p.slug}`}
                            target="_blank"
                            className="p-1.5 rounded border border-[#E0E0DB] hover:bg-white text-emerald-700 hover:text-emerald-800 transition-colors"
                            title="View Public Profile"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
