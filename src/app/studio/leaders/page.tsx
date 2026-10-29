import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PublicationStatus, Role } from "@prisma/client";
import LeaderAvatar from "@/components/profile/LeaderAvatar";
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
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E9F5EE] text-[#1A633F] border border-[#C2E2CE]">
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E1DA] pb-6">
        <div>
          <span className="text-xs font-semibold text-[#922036] uppercase tracking-wider">
            Directory Catalog
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#17191B] mt-1">
            Leadership Profile Manager
          </h1>
          <p className="text-xs sm:text-sm text-[#68645F]">
            Manage biographies, revisions, verification states, and publication status.
          </p>
        </div>

        <Link
          href="/studio/leaders/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#922036] text-white text-xs font-semibold hover:bg-[#7A1629] transition-colors shadow-2xs shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Profile</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E6E1DA] editorial-shadow flex flex-col sm:flex-row items-center justify-between gap-3">
        <form method="GET" action="/studio/leaders" className="flex items-center gap-3 w-full sm:w-auto flex-1">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              name="search"
              defaultValue={searchQuery}
              placeholder="Filter by name, slug or designation..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F8F6F2] border border-[#E6E1DA] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#922036] text-[#17191B]"
            />
            <Search className="w-3.5 h-3.5 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <select
            name="status"
            defaultValue={filterStatus}
            className="px-3 py-1.5 text-xs bg-[#F8F6F2] border border-[#E6E1DA] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#922036] text-[#17191B]"
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
            className="px-3 py-1.5 bg-[#922036] text-white rounded-lg text-xs font-semibold hover:bg-[#7A1629]"
          >
            Filter
          </button>
        </form>

        <span className="text-xs text-[#68645F] shrink-0">
          Showing <strong>{profiles.length}</strong> profiles
        </span>
      </div>

      {/* Profiles Table */}
      <div className="bg-white rounded-xl border border-[#E6E1DA] editorial-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-[#E6E1DA] text-[#68645F] uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Leader Profile</th>
                <th className="py-3 px-4">Current Public Role</th>
                <th className="py-3 px-4">Workflow Status</th>
                <th className="py-3 px-4 text-center">Milestones</th>
                <th className="py-3 px-4 text-center">Revisions</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E1DA]/60 text-[#17191B]">
              {profiles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#888] italic">
                    No leadership profiles found matching the current filter.
                  </td>
                </tr>
              ) : (
                profiles.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F8F6F2]/80 transition-colors">
                    {/* Leader Identity */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 shrink-0">
                          <LeaderAvatar
                            src={p.portraitUrl}
                            name={p.displayName}
                            kannadaName={p.kannadaName}
                            size="sm"
                            aspect="portrait"
                            className="w-full h-full"
                          />
                        </div>
                        <div>
                          <Link
                            href={`/studio/leaders/${p.id}/edit`}
                            className="font-bold text-sm text-[#17191B] hover:text-[#922036]"
                          >
                            {p.displayName}
                          </Link>
                          {p.kannadaName && (
                            <p className="text-[11px] font-kannada font-semibold text-[#922036]">
                              {p.kannadaName}
                            </p>
                          )}
                          <span className="text-[10px] text-[#68645F] font-mono">slug: {p.slug}</span>
                        </div>
                      </div>
                    </td>

                    {/* Role & Constituency */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold block text-xs">{p.currentRole}</span>
                      <span className="text-[11px] text-[#68645F]">{p.constituency || "Karnataka"}</span>
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
                          className="p-1.5 rounded border border-[#E6E1DA] hover:bg-white text-[#68645F] hover:text-[#922036] transition-colors"
                          title="Edit Profile & Milestones"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Link>

                        {p.publicationStatus === PublicationStatus.PUBLISHED ? (
                          <Link
                            href={`/leaders/${p.slug}`}
                            target="_blank"
                            className="p-1.5 rounded border border-[#E6E1DA] hover:bg-white text-[#1A633F] hover:text-emerald-800 transition-colors"
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
