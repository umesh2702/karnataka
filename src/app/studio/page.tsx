import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PublicationStatus, ReviewStatus, VerificationStatus, ConsentStatus, ConsentScope } from "@prisma/client";
import {
  Users,
  CheckCircle,
  FileEdit,
  Clock,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  PlusCircle,
  BookMarked,
  History,
  FileCheck2,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StudioDashboardPage() {
  const session = await getCurrentUser();
  if (!session) {
    redirect("/studio/login");
  }

  const orgId = session.organisationId;

  // Real Database Queries for Summary Metrics (Section 9)
  const [
    totalProfiles,
    publishedProfiles,
    draftProfiles,
    pendingReviews,
    unverifiedSources,
    allProfilesWithConsents,
    recentAuditEvents,
  ] = await Promise.all([
    // Total profiles
    prisma.leaderProfile.count({ where: { organisationId: orgId } }),
    // Published profiles
    prisma.leaderProfile.count({
      where: { organisationId: orgId, publicationStatus: PublicationStatus.PUBLISHED },
    }),
    // Draft profiles
    prisma.leaderProfile.count({
      where: { organisationId: orgId, publicationStatus: PublicationStatus.DRAFT },
    }),
    // Reviews pending
    prisma.revision.count({
      where: {
        reviewStatus: ReviewStatus.IN_REVIEW,
        profile: { organisationId: orgId },
      },
    }),
    // Profiles requiring source review / unverified sources
    prisma.source.count({
      where: {
        organisationId: orgId,
        verificationStatus: { in: [VerificationStatus.UNCHECKED, VerificationStatus.NEEDS_REVIEW] },
      },
    }),
    // Check profiles with missing or expired consent
    prisma.leaderProfile.findMany({
      where: { organisationId: orgId },
      include: {
        consentRecords: {
          where: {
            scope: ConsentScope.PROFILE_PUBLICATION,
            reviewStatus: ConsentStatus.VALID,
          },
        },
      },
    }),
    // Recent Audit Events
    prisma.auditEvent.findMany({
      where: { organisationId: orgId },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  // Calculate missing permissions count
  const profilesMissingConsentCount = allProfilesWithConsents.filter(
    (p) => p.consentRecords.length === 0
  ).length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white p-6 rounded-xl border border-[#E5E5E0] editorial-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-[#8A1C2C] uppercase tracking-wider">
            Leadership Publishing Desk
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#191A1C] mt-1">
            Studio Overview Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#5E6066] mt-1">
            Live database records for UCreates Karnataka Edition. All metrics derived dynamically from PostgreSQL.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/studio/leaders/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#8A1C2C] text-white text-xs font-semibold hover:bg-[#721422] transition-colors shadow-2xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Profile</span>
          </Link>
          <Link
            href="/studio/reviews"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#D5D5D0] bg-white text-[#191A1C] text-xs font-semibold hover:bg-[#FAF8F5] transition-colors"
          >
            <Clock className="w-4 h-4 text-[#8A1C2C]" />
            <span>Review Queue ({pendingReviews})</span>
          </Link>
        </div>
      </div>

      {/* Summary Cards Grid (Section 9) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Total Profiles */}
        <div className="bg-white p-5 rounded-xl border border-[#E5E5E0] editorial-shadow space-y-2">
          <div className="flex items-center justify-between text-xs text-[#65676B]">
            <span className="font-semibold uppercase tracking-wider">Total Profiles</span>
            <Users className="w-4 h-4 text-[#191A1C]" />
          </div>
          <p className="text-3xl font-serif font-bold text-[#191A1C]">{totalProfiles}</p>
          <div className="pt-2 border-t border-[#F0F0EB] flex items-center justify-between text-xs text-[#707278]">
            <span>Across all workflow states</span>
            <Link href="/studio/leaders" className="text-[#8A1C2C] font-semibold hover:underline">
              View all
            </Link>
          </div>
        </div>

        {/* Published Profiles */}
        <div className="bg-white p-5 rounded-xl border border-[#E5E5E0] editorial-shadow space-y-2">
          <div className="flex items-center justify-between text-xs text-emerald-700">
            <span className="font-semibold uppercase tracking-wider">Published Profiles</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-serif font-bold text-[#191A1C]">{publishedProfiles}</p>
          <div className="pt-2 border-t border-[#F0F0EB] flex items-center justify-between text-xs text-[#707278]">
            <span>Live on public website</span>
            <Link href="/leaders" target="_blank" className="text-[#8A1C2C] font-semibold hover:underline">
              Public site
            </Link>
          </div>
        </div>

        {/* Draft Profiles */}
        <div className="bg-white p-5 rounded-xl border border-[#E5E5E0] editorial-shadow space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-700">
            <span className="font-semibold uppercase tracking-wider">Draft Profiles</span>
            <FileEdit className="w-4 h-4 text-slate-600" />
          </div>
          <p className="text-3xl font-serif font-bold text-[#191A1C]">{draftProfiles}</p>
          <div className="pt-2 border-t border-[#F0F0EB] flex items-center justify-between text-xs text-[#707278]">
            <span>Under preparation</span>
            <Link href="/studio/leaders?status=DRAFT" className="text-[#8A1C2C] font-semibold hover:underline">
              Edit drafts
            </Link>
          </div>
        </div>

        {/* Pending Reviews */}
        <div className="bg-white p-5 rounded-xl border border-[#E5E5E0] editorial-shadow space-y-2">
          <div className="flex items-center justify-between text-xs text-amber-700">
            <span className="font-semibold uppercase tracking-wider">Reviews Pending</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-3xl font-serif font-bold text-[#191A1C]">{pendingReviews}</p>
          <div className="pt-2 border-t border-[#F0F0EB] flex items-center justify-between text-xs text-[#707278]">
            <span>Requires reviewer decision</span>
            <Link href="/studio/reviews" className="text-[#8A1C2C] font-semibold hover:underline">
              Open queue
            </Link>
          </div>
        </div>

        {/* Sources Requiring Review */}
        <div className="bg-white p-5 rounded-xl border border-[#E5E5E0] editorial-shadow space-y-2">
          <div className="flex items-center justify-between text-xs text-blue-700">
            <span className="font-semibold uppercase tracking-wider">Sources To Verify</span>
            <BookMarked className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-3xl font-serif font-bold text-[#191A1C]">{unverifiedSources}</p>
          <div className="pt-2 border-t border-[#F0F0EB] flex items-center justify-between text-xs text-[#707278]">
            <span>Unchecked / Needs review</span>
            <Link href="/studio/sources" className="text-[#8A1C2C] font-semibold hover:underline">
              Source desk
            </Link>
          </div>
        </div>

        {/* Missing / Expired Consent */}
        <div className="bg-white p-5 rounded-xl border border-[#E5E5E0] editorial-shadow space-y-2">
          <div className="flex items-center justify-between text-xs text-red-700">
            <span className="font-semibold uppercase tracking-wider">Consent Attention</span>
            <ShieldAlert className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-3xl font-serif font-bold text-[#191A1C]">{profilesMissingConsentCount}</p>
          <div className="pt-2 border-t border-[#F0F0EB] flex items-center justify-between text-xs text-[#707278]">
            <span>Missing verified rights</span>
            <Link href="/studio/permissions" className="text-[#8A1C2C] font-semibold hover:underline">
              Manage rights
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Activity Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Database Audit Events (Section 9) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-[#E5E5E0] editorial-shadow p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-[#F0F0EB] pb-4">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[#8A1C2C]" />
              <h2 className="font-serif font-bold text-lg text-[#191A1C]">Recent Audit Events</h2>
            </div>
            <Link href="/studio/audit" className="text-xs text-[#8A1C2C] font-semibold hover:underline">
              View full audit log
            </Link>
          </div>

          {recentAuditEvents.length === 0 ? (
            <p className="text-xs text-[#888] italic py-4">No audit events recorded yet.</p>
          ) : (
            <div className="divide-y divide-[#F0F0EB]">
              {recentAuditEvents.map((event) => (
                <div key={event.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#191A1C]">{event.action.replace(/_/g, " ")}</span>
                      <span className="px-1.5 py-0.2 rounded bg-[#FAF8F5] text-[10px] text-[#65676B] border border-[#E0E0DB]">
                        {event.entityType}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#707278] font-mono truncate max-w-md">
                      Entity ID: {event.entityId}
                    </p>
                  </div>
                  <span className="text-[11px] text-[#888] shrink-0">
                    {new Date(event.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions Hub (Section 9) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-[#E5E5E0] editorial-shadow p-6 space-y-5">
          <div className="border-b border-[#F0F0EB] pb-4">
            <h2 className="font-serif font-bold text-lg text-[#191A1C]">Editorial Quick Actions</h2>
            <p className="text-xs text-[#65676B]">Direct access to publishing tools</p>
          </div>

          <div className="space-y-2.5">
            <Link
              href="/studio/leaders/new"
              className="flex items-center justify-between p-3 rounded-lg border border-[#E5E5E0] hover:bg-[#FAF8F5] hover:border-[#8A1C2C] transition-colors text-xs font-semibold text-[#191A1C]"
            >
              <div className="flex items-center gap-2.5">
                <PlusCircle className="w-4 h-4 text-[#8A1C2C]" />
                <span>Create New Profile</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#888]" />
            </Link>

            <Link
              href="/studio/leaders"
              className="flex items-center justify-between p-3 rounded-lg border border-[#E5E5E0] hover:bg-[#FAF8F5] hover:border-[#8A1C2C] transition-colors text-xs font-semibold text-[#191A1C]"
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-[#8A1C2C]" />
                <span>Open Profile Manager</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#888]" />
            </Link>

            <Link
              href="/studio/reviews"
              className="flex items-center justify-between p-3 rounded-lg border border-[#E5E5E0] hover:bg-[#FAF8F5] hover:border-[#8A1C2C] transition-colors text-xs font-semibold text-[#191A1C]"
            >
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#8A1C2C]" />
                <span>Review Submissions ({pendingReviews})</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#888]" />
            </Link>

            <Link
              href="/studio/sources"
              className="flex items-center justify-between p-3 rounded-lg border border-[#E5E5E0] hover:bg-[#FAF8F5] hover:border-[#8A1C2C] transition-colors text-xs font-semibold text-[#191A1C]"
            >
              <div className="flex items-center gap-2.5">
                <BookMarked className="w-4 h-4 text-[#8A1C2C]" />
                <span>Manage Sources</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#888]" />
            </Link>

            <Link
              href="/studio/permissions"
              className="flex items-center justify-between p-3 rounded-lg border border-[#E5E5E0] hover:bg-[#FAF8F5] hover:border-[#8A1C2C] transition-colors text-xs font-semibold text-[#191A1C]"
            >
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-4 h-4 text-[#8A1C2C]" />
                <span>Manage Permissions</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#888]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
