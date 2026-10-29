import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { IssueStatus } from "@prisma/client";
import {
  FileCheck2,
  Search,
  ExternalLink,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface IssuesManagerProps {
  searchParams: Promise<{
    status?: string;
    search?: string;
  }>;
}

export default async function IssuesManagerPage({
  searchParams,
}: IssuesManagerProps) {
  const session = await getCurrentUser();
  if (!session) redirect("/studio/login");

  const { status, search } = await searchParams;
  const filterStatus = status || "ALL";
  const searchQuery = search || "";

  const where: Record<string, unknown> = {};

  if (filterStatus !== "ALL") {
    where.status = filterStatus as IssueStatus;
  }

  if (searchQuery) {
    where.OR = [
      { trackingCode: { contains: searchQuery, mode: "insensitive" } },
      { subject: { contains: searchQuery, mode: "insensitive" } },
      { citizenName: { contains: searchQuery, mode: "insensitive" } },
      { category: { contains: searchQuery, mode: "insensitive" } },
    ];
  }

  const issues = await prisma.constituencyIssue.findMany({
    where,
    include: {
      constituency: {
        select: { name: true, number: true, district: true, slug: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E6E1DA] gap-4">
        <div>
          <span className="text-xs font-semibold text-[#922036] uppercase tracking-wider">
            Public Engagement & Constituency Inquiries
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#17191B] mt-1">
            Citizen Inquiries & Issues Desk
          </h1>
          <p className="text-xs text-[#68645F] mt-1">
            Review and track documented public requests and civic development concerns submitted across Karnataka constituencies.
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
              placeholder="Search by tracking code, citizen, subject..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#E6E1DA] rounded-lg text-[#17191B] focus:outline-none focus:ring-1 focus:ring-[#922036]"
            />
            <Search className="w-3.5 h-3.5 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <select
            name="status"
            defaultValue={filterStatus}
            className="px-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#E6E1DA] rounded-lg text-[#17191B]"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="ACKNOWLEDGED">Acknowledged</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>

          <button
            type="submit"
            className="px-3.5 py-1.5 bg-[#922036] text-white text-xs font-semibold rounded-lg hover:bg-[#7A1629]"
          >
            Filter
          </button>

          {(searchQuery || filterStatus !== "ALL") && (
            <Link
              href="/studio/issues"
              className="px-3 py-1.5 border border-[#E6E1DA] text-[#68645F] text-xs font-medium rounded-lg hover:bg-[#F8F6F2]"
            >
              Reset
            </Link>
          )}
        </form>

        <span className="text-xs text-[#68645F]">
          Total: <strong>{issues.length}</strong> recorded submissions
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E6E1DA] editorial-shadow overflow-hidden">
        {issues.length === 0 ? (
          <div className="p-12 text-center space-y-2 text-[#68645F]">
            <FileCheck2 className="w-8 h-8 mx-auto opacity-40 text-[#68645F]" />
            <p className="text-sm font-medium text-[#17191B]">No citizen inquiries recorded</p>
            <p className="text-xs">
              When citizens submit development concerns through constituency profiles, they will be listed here with tracking codes.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] border-b border-[#E6E1DA] text-[#17191B] font-semibold">
                <tr>
                  <th className="py-3 px-4">Tracking Code</th>
                  <th className="py-3 px-4">Constituency</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Subject & Description</th>
                  <th className="py-3 px-4">Citizen Details</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0ECE6]">
                {issues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#922036]">
                      {issue.trackingCode}
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        href={`/constituencies/${issue.constituency.slug}`}
                        className="font-medium text-[#17191B] hover:text-[#922036] block"
                      >
                        {issue.constituency.name}
                      </Link>
                      <span className="text-[11px] text-[#888]">{issue.constituency.district}</span>
                    </td>
                    <td className="py-3 px-4 text-[#17191B] font-medium">
                      {issue.category}
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <span className="font-bold text-[#17191B] block">{issue.subject}</span>
                      <span className="text-[#68645F] text-[11px] line-clamp-2 mt-0.5">
                        {issue.description}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-[#17191B] block">{issue.citizenName}</span>
                      {issue.citizenEmail && (
                        <span className="text-[11px] text-[#888] block">{issue.citizenEmail}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        {issue.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#888] whitespace-nowrap">
                      {new Date(issue.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
