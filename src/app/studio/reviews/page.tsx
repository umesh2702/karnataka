"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  GitPullRequest,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Clock,
  User,
  BookOpen,
  Calendar,
  AlertCircle,
  ShieldCheck,
  Eye,
  Check,
} from "lucide-react";

interface RevisionItem {
  id: string;
  version: number;
  reviewStatus: string;
  submittedAt?: string;
  submittedById?: string;
  contentSnapshot: {
    displayName: string;
    currentRole: string;
    shortBio?: string;
    milestones?: { title: string; eventYear?: number }[];
    sources?: { title: string; publisher: string; url: string }[];
  };
  profile: {
    id: string;
    displayName: string;
    slug: string;
    currentRole: string;
    publicationStatus: string;
    consentRecords: { id: string; scope: string; reviewStatus: string }[];
  };
  submittedBy?: { id: string; name: string; email: string };
  decisions?: { id: string; decision: string; reason: string; createdAt: string; reviewer: { name: string } }[];
}

export const dynamic = "force-dynamic";

export default function ReviewQueuePage() {
  const [revisions, setRevisions] = useState<RevisionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRev, setSelectedRev] = useState<RevisionItem | null>(null);

  // Review decision form
  const [decision, setDecision] = useState<"APPROVED" | "REJECTED" | "RETURNED_FOR_CORRECTION">("APPROVED");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchRevisions();
  }, []);

  const fetchRevisions = async () => {
    try {
      const res = await fetch("/api/leaders");
      if (res.ok) {
        // Fetch detailed profile for leaders to extract revisions
        const data = await res.json();
        const allRevs: RevisionItem[] = [];

        for (const p of data.profiles || []) {
          const detailRes = await fetch(`/api/leaders/${p.id}`);
          if (detailRes.ok) {
            const detail = await detailRes.json();
            const prof = detail.profile;
            (prof.revisions || []).forEach((rev: RevisionItem) => {
              allRevs.push({
                ...rev,
                profile: {
                  id: prof.id,
                  displayName: prof.displayName,
                  slug: prof.slug,
                  currentRole: prof.currentRole,
                  publicationStatus: prof.publicationStatus,
                  consentRecords: prof.consentRecords || [],
                },
              });
            });
          }
        }

        // Sort: IN_REVIEW first, then newest submitted
        allRevs.sort((a, b) => {
          if (a.reviewStatus === "IN_REVIEW" && b.reviewStatus !== "IN_REVIEW") return -1;
          if (b.reviewStatus === "IN_REVIEW" && a.reviewStatus !== "IN_REVIEW") return 1;
          return b.version - a.version;
        });

        setRevisions(allRevs);
      }
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRev) return;
    setSubmitting(true);
    setAlert(null);

    try {
      const res = await fetch(`/api/revisions/${selectedRev.id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, reason }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to process review decision");
      }

      setAlert({
        type: "success",
        text: `Review decision "${decision}" recorded successfully.`,
      });
      setSelectedRev(null);
      setReason("");
      await fetchRevisions();
    } catch (err: unknown) {
      setAlert({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to record review",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const pendingRevs = revisions.filter((r) => r.reviewStatus === "IN_REVIEW");
  const pastRevs = revisions.filter((r) => r.reviewStatus !== "IN_REVIEW");

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="border-b border-[#E5E5E0] pb-5 space-y-1">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase text-[#8A1C2C]">
          <GitPullRequest className="w-3.5 h-3.5" />
          <span>Independent Editorial Governance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#191A1C]">
          Editorial Review Queue
        </h1>
        <p className="text-xs sm:text-sm text-[#5E6066]">
          Inspect draft snapshots, verify primary source citations, and record formal approval decisions.
        </p>
      </div>

      {alert && (
        <div
          className={`p-4 rounded-lg text-xs flex items-center justify-between ${
            alert.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          <span>{alert.text}</span>
          <button onClick={() => setAlert(null)} className="font-bold underline text-xs">
            Dismiss
          </button>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-xs text-[#888]">Loading review queue from database...</div>
      ) : (
        <div className="space-y-8">
          {/* Pending Submissions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-serif font-bold text-[#191A1C] flex items-center gap-2">
                <span>Pending Editorial Review</span>
                <span className="px-2 py-0.5 rounded-full text-xs bg-[#8A1C2C] text-white">
                  {pendingRevs.length}
                </span>
              </h2>
            </div>

            {pendingRevs.length === 0 ? (
              <div className="bg-white p-8 rounded-xl border border-[#E5E5E0] text-center text-xs text-[#707278] italic">
                No submissions currently waiting in the review queue. All revisions are up to date.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {pendingRevs.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-white rounded-xl border border-[#E5E5E0] p-6 editorial-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 uppercase">
                          IN REVIEW
                        </span>
                        <span className="text-xs font-semibold text-[#8A1C2C]">
                          Revision v{rev.version}
                        </span>
                      </div>

                      <h3 className="text-xl font-serif font-bold text-[#191A1C]">
                        {rev.profile.displayName}
                      </h3>

                      <p className="text-xs text-[#4A4B4F]">{rev.profile.currentRole}</p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#707278] pt-1">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          <span>Submitted by: <strong>{rev.submittedBy?.name || "Editor Desk"}</strong></span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>
                            {rev.submittedAt
                              ? new Date(rev.submittedAt).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "Recent"}
                          </span>
                        </span>
                        <span className="flex items-center gap-1 text-emerald-700">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Consent: {rev.profile.consentRecords.length > 0 ? "Documented" : "Missing"}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        type="button"
                        onClick={() => setSelectedRev(rev)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#8A1C2C] text-white text-xs font-semibold hover:bg-[#721422] transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect & Decide</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past Review Decisions */}
          {pastRevs.length > 0 && (
            <div className="space-y-3 pt-6 border-t border-[#E5E5E0]">
              <h2 className="text-base font-serif font-bold text-[#191A1C]">
                Past Review Decisions ({pastRevs.length})
              </h2>

              <div className="bg-white rounded-xl border border-[#E5E5E0] overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] border-b border-[#E5E5E0] text-[#65676B] uppercase font-semibold">
                    <tr>
                      <th className="py-2.5 px-4">Profile</th>
                      <th className="py-2.5 px-4">Revision</th>
                      <th className="py-2.5 px-4">Status</th>
                      <th className="py-2.5 px-4">Latest Decision Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0F0EB]">
                    {pastRevs.map((rev) => (
                      <tr key={rev.id} className="hover:bg-[#FAF8F5]">
                        <td className="py-2.5 px-4 font-bold text-[#191A1C]">{rev.profile.displayName}</td>
                        <td className="py-2.5 px-4">v{rev.version}</td>
                        <td className="py-2.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#EFEFEA] text-[#191A1C]">
                            {rev.reviewStatus}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-[#5E6066]">
                          {rev.decisions?.[0]?.reason || "Approved during initialization"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Decision Modal */}
      {selectedRev && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="border-b border-[#E5E5E0] pb-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#8A1C2C] uppercase">
                  Revision v{selectedRev.version} Review
                </span>
                <h3 className="text-xl font-serif font-bold text-[#191A1C]">
                  {selectedRev.profile.displayName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRev(null)}
                className="text-[#888] hover:text-[#191A1C] text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Snapshot Snapshot Inspection */}
            <div className="space-y-3 bg-[#FAF8F5] p-4 rounded-xl border border-[#E0E0DB] text-xs">
              <span className="font-bold text-[#191A1C] block uppercase tracking-wider text-[11px]">
                Snapshot Content Details
              </span>
              <p><strong>Designation:</strong> {selectedRev.contentSnapshot?.currentRole || selectedRev.profile.currentRole}</p>
              <p><strong>Short Bio:</strong> {selectedRev.contentSnapshot?.shortBio || "None provided"}</p>
              <div>
                <strong>Milestones in Snapshot:</strong>{" "}
                {selectedRev.contentSnapshot?.milestones?.length || 0} documented items
              </div>
            </div>

            {/* Decision Form */}
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#191A1C] uppercase tracking-wider mb-2">
                  Review Decision
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setDecision("APPROVED")}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      decision === "APPROVED"
                        ? "bg-emerald-50 border-emerald-500 text-emerald-800"
                        : "border-[#E0E0DB] hover:bg-[#FAF8F5]"
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDecision("RETURNED_FOR_CORRECTION")}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      decision === "RETURNED_FOR_CORRECTION"
                        ? "bg-amber-50 border-amber-500 text-amber-800"
                        : "border-[#E0E0DB] hover:bg-[#FAF8F5]"
                    }`}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Return</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDecision("REJECTED")}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      decision === "REJECTED"
                        ? "bg-red-50 border-red-500 text-red-800"
                        : "border-[#E0E0DB] hover:bg-[#FAF8F5]"
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#191A1C] uppercase tracking-wider mb-1.5">
                  Editorial Justification / Review Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Record verification rationale (e.g. Sourced against KLA directory, degrees verified via ECI affidavit)..."
                  className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E0E0DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8A1C2C]"
                />
              </div>

              <div className="pt-3 border-t border-[#EFEFEA] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedRev(null)}
                  className="px-4 py-2 border border-[#D5D5D0] rounded-lg text-xs font-semibold text-[#555]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg bg-[#8A1C2C] text-white text-xs font-semibold hover:bg-[#721422] disabled:opacity-50"
                >
                  {submitting ? "Processing Decision..." : "Submit Review Decision"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
