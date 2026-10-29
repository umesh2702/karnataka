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
  AlertCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StudioDashboardPage() {
  const session = await getCurrentUser();
  if (!session) {
    redirect("/studio/login");
  }

  const orgId = session.organisationId;

  // Real Database Queries for Summary Metrics (Section 8)
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
    // Sources requiring verification / unverified sources
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
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E6E1DA] editorial-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-[#922036] uppercase tracking-wider">
            Leadership Publishing Desk
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#17191B] mt-1">
            Editorial Studio Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#68645F] mt-1">
            Real-time database statistics and verification workflows for UCreates Karnataka Edition.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/studio/leaders/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#922036] text-white text-xs font-semibold hover:bg-[#7A1629] transition-colors shadow-2xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Profile</span>
          </Link>
          <Link
            href="/studio/reviews"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#E6E1DA] bg-white text-[#17191B] text-xs font-semibold hover:bg-[#F8F6F2] transition-colors"
          >
            <Clock className="w-4 h-4 text-[#922036]" />
            <span>Review Queue ({pendingReviews})</span>
          </Link>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Total Profiles */}
        <div className="bg-white p-5 rounded-2xl border border-[#E6E1DA] editorial-shadow space-y-2">
          <div className="flex items-center justify-between text-xs text-[#68645F]">
            <span className="font-semibold uppercase tracking-wider">Total Profiles</span>
            <Users className="w-4 h-4 text-[#17191B]" />
          </div>
          <p className="text-3xl font-serif font-bold text-[#17191B]">{totalProfiles}</p>
          <div className="pt-2 border-t border-[#E6E1DA]/60 flex items-center justify-between text-xs text-[#68645F]">
            <span>Across all workflow states</span>
            <Link href="/studio/leaders" className="text-[#922036] font-semibold hover:underline">
              View all
            </Link>
          </div>
        </div>

        {/* Published Profiles */}
        <div className="bg-white p-5 rounded-2xl border border-[#E6E1DA] editorial-shadow space-y-2">
          <div className="flex items-center justify-between text-xs text-[#1A633F]">
            <span className="font-semibold uppercase tracking-wider">Published Records</span>
            <CheckCircle className="w-4 h-4 text-[#1A633F]" />
          </div>
          <p className="text-3xl font-serif font-bold text-[#17191B]">{publishedProfiles}</p>
          <div className="pt-2 border-t border-[#E6E1DA]/60 flex items-center justify-between text-xs text-[#68645F]">
            <span>Live on public website</span>
            <Link href="/leaders" target="_blank" className="text-[#922036] font-semibold hover:underline">
              View public directory
            </Link>
          </div>
        </div>

        {/* Draft Profiles */}
        <div className="bg-white p-5 rounded-2xl border border-[#E6E1DA] editorial-shadow space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-700">
            <span className="font-semibold uppercase tracking-wider">Draft Profiles</span>
            <FileEdit className="w-4 h-4 text-slate-600" />
          </div>
          <p className="text-3xl font-serif font-bold text-[#17191B]">{draftProfiles}</p>
          <div className="pt-2 border-t border-[#E6E1DA]/60 flex items-center justify-between text-xs text-[#68645F]">
            <span>Under research & preparation</span>
            <Link href="/studio/leaders?status=DRAFT" className="text-[#922036] font-semibold hover:underline">
              Edit drafts
            </Link>
          </div>
        </div>

        {/* Pending Reviews */}
        <div className="bg-white p-5 rounded-2xl border border-[#E6E1DA] editorial-shadow space-y-2">
          <div className="flex items-center justify-between text-xs text-amber-700">
            <span className="font-semibold uppercase tracking-wider">Pending Reviews</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-3xl font-serif font-bold text-[#17191B]">{pendingReviews}</p>
          <div className="pt-2 border-t border-[#E6E1DA]/60 flex items-center justify-between text-xs text-[#68645F]">
            <span>Awaiting independent reviewer decision</span>
            <Link href="/studio/reviews" className="text-[#922036] font-semibold hover:underline">
              Open queue
            </Link>
          </div>
        </div>

        {/* Sources Requiring Review */}
        <div className="bg-white p-5 rounded-2xl border border-[#E6E1DA] editorial-shadow space-y-2">
          <div className="flex items-center justify-between text-xs text-blue-700">
            <span className="font-semibold uppercase tracking-wider">Sources To Audit</span>
            <BookMarked className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-3xl font-serif font-bold text-[#17191B]">{unverifiedSources}</p>
          <div className="pt-2 border-t border-[#E6E1DA]/60 flex items-center justify-between text-xs text-[#68645F]">
            <span>Unchecked / needs verification</span>
            <Link href="/studio/sources" className="text-[#922036] font-semibold hover:underline">
              Source desk
            </Link>
          </div>
        </div>

        {/* Consent Gaps */}
        <div className="bg-white p-5 rounded-2xl border border-[#E6E1DA] editorial-shadow space-y-2">
          <div className="flex items-center justify-between text-xs text-red-700">
            <span className="font-semibold uppercase tracking-wider">Consent Attention</span>
            <ShieldAlert className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-3xl font-serif font-bold text-[#17191B]">{profilesMissingConsentCount}</p>
          <div className="pt-2 border-t border-[#E6E1DA]/60 flex items-center justify-between text-xs text-[#68645F]">
            <span>Missing statutory/fair use consent</span>
            <Link href="/studio/permissions" className="text-[#922036] font-semibold hover:underline">
              Manage rights
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Shortcuts Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Audit Events */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E6E1DA] editorial-shadow p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between border-b border-[#E6E1DA] pb-4">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[#922036]" />
              <h2 className="font-serif font-bold text-lg text-[#17191B]">Recent Audit Trail</h2>
            </div>
            <Link href="/studio/audit" className="text-xs text-[#922036] font-semibold hover:underline">
              View full audit log
            </Link>
          </div>

          {recentAuditEvents.length === 0 ? (
            <p className="text-xs text-[#888] italic py-4">No audit events recorded yet.</p>
          ) : (
            <div className="divide-y divide-[#E6E1DA]/60">
              {recentAuditEvents.map((event) => (
                <div key={event.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#17191B]">{event.action.replace(/_/g, " ")}</span>
                      <span className="px-1.5 py-0.5 rounded bg-[#F8F6F2] text-[10px] text-[#68645F] border border-[#E6E1DA]">
                        {event.entityType}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#68645F] font-mono truncate max-w-md">
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

        {/* Editorial Shortcuts Hub */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E6E1DA] editorial-shadow p-6 sm:p-8 space-y-5">
          <div className="border-b border-[#E6E1DA] pb-4">
            <h2 className="font-serif font-bold text-lg text-[#17191B]">Editorial Shortcuts</h2>
            <p className="text-xs text-[#68645F]">Direct tools for verification workflows</p>
          </div>

          <div className="space-y-2.5">
            <Link
              href="/studio/leaders/new"
              className="flex items-center justify-between p-3 rounded-xl border border-[#E6E1DA] hover:bg-[#F8F6F2] hover:border-[#922036] transition-colors text-xs font-semibold text-[#17191B]"
            >
              <div className="flex items-center gap-2.5">
                <PlusCircle className="w-4 h-4 text-[#922036]" />
                <span>Create New Profile</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#888]" />
            </Link>

            <Link
              href="/studio/leaders"
              className="flex items-center justify-between p-3 rounded-xl border border-[#E6E1DA] hover:bg-[#F8F6F2] hover:border-[#922036] transition-colors text-xs font-semibold text-[#17191B]"
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-[#922036]" />
                <span>Profile Manager</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#888]" />
            </Link>

            <Link
              href="/studio/reviews"
              className="flex items-center justify-between p-3 rounded-xl border border-[#E6E1DA] hover:bg-[#F8F6F2] hover:border-[#922036] transition-colors text-xs font-semibold text-[#17191B]"
            >
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#922036]" />
                <span>Review Queue ({pendingReviews})</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#888]" />
            </Link>

            <Link
              href="/studio/sources"
              className="flex items-center justify-between p-3 rounded-xl border border-[#E6E1DA] hover:bg-[#F8F6F2] hover:border-[#922036] transition-colors text-xs font-semibold text-[#17191B]"
            >
              <div className="flex items-center gap-2.5">
                <BookMarked className="w-4 h-4 text-[#922036]" />
                <span>Source Registry</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#888]" />
            </Link>

            <Link
              href="/studio/permissions"
              className="flex items-center justify-between p-3 rounded-xl border border-[#E6E1DA] hover:bg-[#F8F6F2] hover:border-[#922036] transition-colors text-xs font-semibold text-[#17191B]"
            >
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-4 h-4 text-[#922036]" />
                <span>Consent & Rights</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#888]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
