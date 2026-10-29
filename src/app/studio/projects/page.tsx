import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ProjectStage } from "@prisma/client";
import {
  Layers,
  Search,
  ExternalLink,
  MapPin,
  CheckCircle2,
  Calendar,
  AlertCircle,
  FileCheck2,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface ProjectsManagerProps {
  searchParams: Promise<{
    stage?: string;
    search?: string;
  }>;
}

export default async function ProjectsManagerPage({
  searchParams,
}: ProjectsManagerProps) {
  const session = await getCurrentUser();
  if (!session) redirect("/studio/login");

  const { stage, search } = await searchParams;
  const filterStage = stage || "ALL";
  const searchQuery = search || "";

  const where: Record<string, unknown> = {};

  if (filterStage !== "ALL") {
    where.stage = filterStage as ProjectStage;
  }

  if (searchQuery) {
    where.OR = [
      { title: { contains: searchQuery, mode: "insensitive" } },
      { description: { contains: searchQuery, mode: "insensitive" } },
      { location: { contains: searchQuery, mode: "insensitive" } },
      { department: { contains: searchQuery, mode: "insensitive" } },
    ];
  }

  const projects = await prisma.workProject.findMany({
    where,
    include: {
      constituency: {
        select: { name: true, number: true, district: true, slug: true },
      },
      leaderProfile: {
        select: { displayName: true, slug: true, currentRole: true },
      },
    },
    orderBy: { announcedDate: "desc" },
  });

  const stageBadgeColors: Record<string, string> = {
    COMPLETED: "bg-emerald-50 text-emerald-800 border-emerald-200",
    ONGOING: "bg-blue-50 text-blue-800 border-blue-200",
    APPROVED: "bg-purple-50 text-purple-800 border-purple-200",
    PROPOSED: "bg-amber-50 text-amber-800 border-amber-200",
    DELAYED: "bg-orange-50 text-orange-800 border-orange-200",
    CANCELLED: "bg-red-50 text-red-800 border-red-200",
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E6E1DA] gap-4">
        <div>
          <span className="text-xs font-semibold text-[#922036] uppercase tracking-wider">
            Infrastructure & Public Initiatives
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#17191B] mt-1">
            Works & Initiatives Registry
          </h1>
          <p className="text-xs text-[#68645F] mt-1">
            Manage documented constituency projects, budget allocations, execution stages, and evidence citations.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-[#E6E1DA] editorial-shadow flex flex-wrap items-center justify-between gap-4">
        <form method="GET" className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              name="search"
              defaultValue={searchQuery}
              placeholder="Search works, department, location..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#E6E1DA] rounded-lg text-[#17191B] focus:outline-none focus:ring-1 focus:ring-[#922036]"
            />
            <Search className="w-3.5 h-3.5 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <select
            name="stage"
            defaultValue={filterStage}
            className="px-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#E6E1DA] rounded-lg text-[#17191B]"
          >
            <option value="ALL">All Stages</option>
            <option value="PROPOSED">Proposed</option>
            <option value="APPROVED">Approved</option>
            <option value="ONGOING">Ongoing</option>
            <option value="COMPLETED">Completed</option>
            <option value="DELAYED">Delayed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <button
            type="submit"
            className="px-3.5 py-1.5 bg-[#922036] text-white text-xs font-semibold rounded-lg hover:bg-[#7A1629]"
          >
            Filter
          </button>

          {(searchQuery || filterStage !== "ALL") && (
            <Link
              href="/studio/projects"
              className="px-3 py-1.5 border border-[#E6E1DA] text-[#68645F] text-xs font-medium rounded-lg hover:bg-[#F8F6F2]"
            >
              Reset
            </Link>
          )}
        </form>

        <span className="text-xs text-[#68645F]">
          Total: <strong>{projects.length}</strong> works documented
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E6E1DA] editorial-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-[#E6E1DA] text-[#17191B] font-semibold">
              <tr>
                <th className="py-3 px-4">Project Title & Description</th>
                <th className="py-3 px-4">Constituency & Location</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Representative</th>
                <th className="py-3 px-4">Stage</th>
                <th className="py-3 px-4">Budget</th>
                <th className="py-3 px-4">Evidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0ECE6]">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                  <td className="py-3 px-4 max-w-xs">
                    <span className="font-serif font-bold text-sm text-[#17191B] block">
                      {p.title}
                    </span>
                    <span className="text-[#68645F] text-[11px] line-clamp-2 mt-0.5">
                      {p.description}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {p.constituency ? (
                      <div>
                        <Link
                          href={`/constituencies/${p.constituency.slug}`}
                          className="font-medium text-[#17191B] hover:text-[#922036] block"
                        >
                          {p.constituency.name}
                        </Link>
                        <span className="text-[11px] text-[#888]">{p.constituency.district}</span>
                      </div>
                    ) : (
                      <span className="text-[#888]">{p.location || "Statewide"}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-[#68645F] max-w-[150px] truncate">
                    {p.department || "Government of Karnataka"}
                  </td>
                  <td className="py-3 px-4">
                    {p.leaderProfile ? (
                      <span className="font-medium text-[#17191B]">
                        {p.leaderProfile.displayName}
                      </span>
                    ) : (
                      <span className="text-[#888] italic">Government Project</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        stageBadgeColors[p.stage] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {p.stage}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-[#17191B]">
                    {p.budgetAmount || "N/A"}
                  </td>
                  <td className="py-3 px-4">
                    {p.evidenceUrl ? (
                      <a
                        href={p.evidenceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#922036] font-semibold hover:underline"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Source</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-amber-700 text-[11px] flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Unverified</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
