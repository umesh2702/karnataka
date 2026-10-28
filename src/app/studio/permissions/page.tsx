"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, ShieldAlert, Plus, CheckCircle2, AlertCircle, FileText, Lock } from "lucide-react";

interface ConsentRecordItem {
  id: string;
  profileId: string;
  grantedBy: string;
  scope: string;
  grantedAt: string;
  expiresAt?: string | null;
  evidenceReference?: string | null;
  reviewStatus: string;
  profile: { displayName: string; slug: string };
}

export const dynamic = "force-dynamic";

export default function PermissionsManagementPage() {
  const [records, setRecords] = useState<ConsentRecordItem[]>([]);
  const [profiles, setProfiles] = useState<{ id: string; displayName: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form
  const [formData, setFormData] = useState({
    profileId: "",
    grantedBy: "",
    scope: "PROFILE_PUBLICATION",
    evidenceReference: "",
    notes: "",
    reviewStatus: "VALID",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRecords();
    fetchProfiles();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await fetch("/api/permissions");
      if (res.ok) {
        const data = await res.json();
        setRecords(data.records || []);
      }
    } catch {}
    finally {
      setLoading(false);
    }
  };

  const fetchProfiles = async () => {
    try {
      const res = await fetch("/api/leaders");
      if (res.ok) {
        const data = await res.json();
        setProfiles(data.profiles || []);
        if (data.profiles?.[0]) {
          setFormData((prev) => ({ ...prev, profileId: data.profiles[0].id }));
        }
      }
    } catch {}
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/permissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowModal(false);
        setFormData({
          profileId: profiles[0]?.id || "",
          grantedBy: "",
          scope: "PROFILE_PUBLICATION",
          evidenceReference: "",
          notes: "",
          reviewStatus: "VALID",
        });
        await fetchRecords();
      }
    } catch {}
    finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E0] pb-5">
        <div>
          <span className="text-xs font-semibold text-[#8A1C2C] uppercase tracking-wider">
            Legal & Rights Registry
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#191A1C] mt-1">
            Consent & Media Rights Management
          </h1>
          <p className="text-xs sm:text-sm text-[#5E6066]">
            Strict tracking of publication consent, fair-reporting public record exemptions, and portrait rights.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#8A1C2C] text-white text-xs font-semibold hover:bg-[#721422] transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Record Consent Document</span>
        </button>
      </div>

      {/* Security Privacy Callout */}
      <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E0E0DB] flex items-start gap-3 text-xs text-[#555]">
        <Lock className="w-4 h-4 text-[#8A1C2C] shrink-0 mt-0.5" />
        <p>
          Private Legal Protection: Consent records, statutory exemptions, and internal license agreements stored here
          are strictly confined to authenticated studio reviewers. They are never rendered or exposed on public profile routes.
        </p>
      </div>

      {/* Permissions Table */}
      <div className="bg-white rounded-xl border border-[#E5E5E0] editorial-shadow overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF8F5] border-b border-[#E5E5E0] text-[#65676B] uppercase font-semibold">
            <tr>
              <th className="py-3 px-4">Profile</th>
              <th className="py-3 px-4">Permission Scope</th>
              <th className="py-3 px-4">Granted By / Basis</th>
              <th className="py-3 px-4">Evidence / Reference</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Grant Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F0EB] text-[#191A1C]">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-[#888] italic">
                  Loading consent records...
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-[#888] italic">
                  No consent records on file.
                </td>
              </tr>
            ) : (
              records.map((r) => (
                <tr key={r.id} className="hover:bg-[#FAF8F5]">
                  <td className="py-3 px-4 font-bold text-[#191A1C]">{r.profile.displayName}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#EFEFEA] text-[#191A1C]">
                      {r.scope.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="py-3 px-4 max-w-xs truncate">{r.grantedBy}</td>
                  <td className="py-3 px-4 text-[#707278] max-w-xs truncate font-mono text-[11px]">
                    {r.evidenceReference || "Statutory record"}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded border ${
                        r.reviewStatus === "VALID"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }`}
                    >
                      {r.reviewStatus === "VALID" ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <AlertCircle className="w-3 h-3" />
                      )}
                      {r.reviewStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#707278]">
                    {new Date(r.grantedAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E5E0] pb-3">
              <h3 className="font-serif font-bold text-lg text-[#191A1C]">
                Record Consent or Usage Rights
              </h3>
              <button onClick={() => setShowModal(false)} className="text-[#888] font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#191A1C] uppercase mb-1">Leader Profile *</label>
                <select
                  value={formData.profileId}
                  onChange={(e) => setFormData({ ...formData, profileId: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E0E0DB] rounded-lg"
                >
                  {profiles.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.displayName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#191A1C] uppercase mb-1">
                  Granted By / Legal Exemption Basis *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Office of Leader or Section 19 Fair Use Doctrine"
                  value={formData.grantedBy}
                  onChange={(e) => setFormData({ ...formData, grantedBy: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E0E0DB] rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#191A1C] uppercase mb-1">Permission Scope</label>
                  <select
                    value={formData.scope}
                    onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E0E0DB] rounded-lg"
                  >
                    <option value="PROFILE_PUBLICATION">Profile Publication</option>
                    <option value="PORTRAIT_USAGE">Portrait Usage</option>
                    <option value="COPYRIGHTED_MEDIA">Copyrighted Media</option>
                    <option value="ORGANISATION_REPRESENTATION">Organisation Representation</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#191A1C] uppercase mb-1">Review Status</label>
                  <select
                    value={formData.reviewStatus}
                    onChange={(e) => setFormData({ ...formData, reviewStatus: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E0E0DB] rounded-lg"
                  >
                    <option value="VALID">Valid</option>
                    <option value="NEEDS_REVIEW">Needs Review</option>
                    <option value="EXPIRED">Expired</option>
                    <option value="REVOKED">Revoked</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#191A1C] uppercase mb-1">
                  Evidence Reference / Document ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. DOC-2024-KLA-PERM-01"
                  value={formData.evidenceReference}
                  onChange={(e) => setFormData({ ...formData, evidenceReference: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E0E0DB] rounded-lg"
                />
              </div>

              <div className="pt-3 border-t border-[#EFEFEA] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg text-[#555]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#8A1C2C] text-white rounded-lg font-semibold hover:bg-[#721422] disabled:opacity-50"
                >
                  {submitting ? "Recording..." : "Record Consent"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
