"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Send,
  Eye,
  CheckCircle2,
  Plus,
  Trash2,
  AlertCircle,
  ExternalLink,
  BookMarked,
  ShieldAlert,
  Clock,
  Sparkles,
  Upload,
} from "lucide-react";

interface MilestoneItem {
  id?: string;
  title: string;
  description: string;
  eventYear?: number | null;
  sortOrder: number;
  verificationStatus: "UNCHECKED" | "REVIEWED" | "VERIFIED" | "NEEDS_REVIEW" | "INVALID";
  sourceIds?: string[];
}

interface InitiativeItem {
  id?: string;
  title: string;
  description: string;
  startDate?: string | null;
  verificationStatus: "UNCHECKED" | "REVIEWED" | "VERIFIED" | "NEEDS_REVIEW" | "INVALID";
}

export const dynamic = "force-dynamic";

export default function EditLeaderProfilePage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"basic" | "milestones" | "initiatives" | "workflow" | "preview">("basic");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submittingRev, setSubmittingRev] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [unpublishing, setUnpublishing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Available sources from database for linking
  const [availableSources, setAvailableSources] = useState<{ id: string; title: string; publisher: string }[]>([]);

  // Profile data
  const [profile, setProfile] = useState<{
    id: string;
    slug: string;
    displayName: string;
    kannadaName?: string | null;
    currentRole: string;
    organisationName?: string | null;
    region?: string | null;
    constituency?: string | null;
    shortBio: string;
    biography: string;
    portraitUrl?: string | null;
    publicationStatus: string;
    publishedRevisionId?: string | null;
    roleLastVerifiedAt?: string | null;
    milestones: MilestoneItem[];
    initiatives: InitiativeItem[];
    revisions: { id: string; version: number; reviewStatus: string; submittedAt?: string }[];
    consentRecords: { id: string; scope: string; reviewStatus: string }[];
  } | null>(null);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/leaders/${id}`);
      if (!res.ok) throw new Error("Failed to load profile");
      const data = await res.json();
      setProfile({
        ...data.profile,
        milestones: data.profile.milestones || [],
        initiatives: data.profile.initiatives || [],
      });
    } catch (err: unknown) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Error loading profile",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSources = async () => {
    try {
      const res = await fetch("/api/sources");
      if (res.ok) {
        const data = await res.json();
        setAvailableSources(data.sources || []);
      }
    } catch {}
  };

  useEffect(() => {
    fetchProfile();
    fetchSources();
  }, [id]);

  const handleSaveDraft = async () => {
    if (!profile) return;
    setSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch(`/api/leaders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: profile.displayName,
          kannadaName: profile.kannadaName,
          currentRole: profile.currentRole,
          organisationName: profile.organisationName,
          region: profile.region,
          constituency: profile.constituency,
          shortBio: profile.shortBio,
          biography: profile.biography,
          portraitUrl: profile.portraitUrl,
          milestones: profile.milestones,
          initiatives: profile.initiatives,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save draft");

      setStatusMessage({ type: "success", text: "Draft changes saved successfully to database!" });
      await fetchProfile();
    } catch (err: unknown) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to save changes",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitForReview = async () => {
    if (!profile) return;
    setSubmittingRev(true);
    setStatusMessage(null);

    try {
      // First save current edits
      await handleSaveDraft();

      const res = await fetch("/api/revisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId: id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit revision");

      setStatusMessage({
        type: "success",
        text: `${data.message} The revision is now queued in the editorial review queue.`,
      });
      await fetchProfile();
      setActiveTab("workflow");
    } catch (err: unknown) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to submit revision",
      });
    } finally {
      setSubmittingRev(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    setStatusMessage(null);

    try {
      const res = await fetch(`/api/leaders/${id}/publish`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to publish");

      setStatusMessage({ type: "success", text: data.message });
      await fetchProfile();
    } catch (err: unknown) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to publish profile",
      });
    } finally {
      setPublishing(false);
    }
  };

  const handleUnpublish = async () => {
    setUnpublishing(true);
    setStatusMessage(null);

    try {
      const res = await fetch(`/api/leaders/${id}/unpublish`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to unpublish");

      setStatusMessage({ type: "success", text: data.message });
      await fetchProfile();
    } catch (err: unknown) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to unpublish profile",
      });
    } finally {
      setUnpublishing(false);
    }
  };

  // Milestone helpers
  const addMilestone = () => {
    if (!profile) return;
    const newM: MilestoneItem = {
      title: "New Career Milestone",
      description: "Description of verified public service milestone...",
      eventYear: new Date().getFullYear(),
      sortOrder: profile.milestones.length + 1,
      verificationStatus: "VERIFIED",
      sourceIds: availableSources.length > 0 ? [availableSources[0].id] : [],
    };
    setProfile({ ...profile, milestones: [...profile.milestones, newM] });
  };

  const removeMilestone = (idx: number) => {
    if (!profile) return;
    const updated = profile.milestones.filter((_, i) => i !== idx);
    setProfile({ ...profile, milestones: updated });
  };

  // Initiative helpers
  const addInitiative = () => {
    if (!profile) return;
    const newI: InitiativeItem = {
      title: "New Public Initiative",
      description: "Documented policy, governance, or regional development initiative...",
      verificationStatus: "VERIFIED",
    };
    setProfile({ ...profile, initiatives: [...profile.initiatives, newI] });
  };

  const removeInitiative = (idx: number) => {
    if (!profile) return;
    const updated = profile.initiatives.filter((_, i) => i !== idx);
    setProfile({ ...profile, initiatives: updated });
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-sm text-[#707278]">
        Loading leader profile from database...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-12 text-center text-sm text-red-600">
        Profile not found or access denied.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E1DA] pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/studio/leaders"
            className="p-1.5 rounded-md border border-[#E0E0DB] text-[#555] hover:text-[#17191B] hover:bg-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#17191B]">
                {profile.displayName}
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#922036]/10 text-[#922036]">
                {profile.publicationStatus}
              </span>
            </div>
            <p className="text-xs text-[#707278] font-mono">slug: {profile.slug}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#D5D5D0] rounded-lg bg-white text-xs font-semibold text-[#17191B] hover:bg-[#F8F6F2] transition-colors disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5 text-[#922036]" />
            <span>{saving ? "Saving..." : "Save Draft"}</span>
          </button>

          <button
            type="button"
            onClick={handleSubmitForReview}
            disabled={submittingRev}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#922036] text-white text-xs font-semibold hover:bg-[#78182a] transition-colors disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{submittingRev ? "Submitting..." : "Submit Revision"}</span>
          </button>
        </div>
      </div>

      {/* Status Alert */}
      {statusMessage && (
        <div
          className={`p-4 rounded-lg text-xs flex items-center justify-between gap-2 ${
            statusMessage.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-xs font-bold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-[#E6E1DA] text-xs font-semibold overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("basic")}
          className={`py-2.5 px-4 border-b-2 transition-colors shrink-0 ${
            activeTab === "basic"
              ? "border-[#922036] text-[#922036]"
              : "border-transparent text-[#65676B] hover:text-[#17191B]"
          }`}
        >
          Basic Information
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("milestones")}
          className={`py-2.5 px-4 border-b-2 transition-colors shrink-0 ${
            activeTab === "milestones"
              ? "border-[#922036] text-[#922036]"
              : "border-transparent text-[#65676B] hover:text-[#17191B]"
          }`}
        >
          Milestones & Citations ({profile.milestones.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("initiatives")}
          className={`py-2.5 px-4 border-b-2 transition-colors shrink-0 ${
            activeTab === "initiatives"
              ? "border-[#922036] text-[#922036]"
              : "border-transparent text-[#65676B] hover:text-[#17191B]"
          }`}
        >
          Initiatives ({profile.initiatives.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("workflow")}
          className={`py-2.5 px-4 border-b-2 transition-colors shrink-0 ${
            activeTab === "workflow"
              ? "border-[#922036] text-[#922036]"
              : "border-transparent text-[#65676B] hover:text-[#17191B]"
          }`}
        >
          Workflow & Revisions ({profile.revisions?.length || 0})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("preview")}
          className={`py-2.5 px-4 border-b-2 transition-colors shrink-0 ${
            activeTab === "preview"
              ? "border-[#922036] text-[#922036]"
              : "border-transparent text-[#65676B] hover:text-[#17191B]"
          }`}
        >
          Profile Live Preview
        </button>
      </div>

      {/* Tab 1: Basic Information */}
      {activeTab === "basic" && (
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E6E1DA] editorial-shadow space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#17191B] uppercase tracking-wider mb-1">
                Display Name (English)
              </label>
              <input
                type="text"
                value={profile.displayName}
                onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-[#F8F6F2] border border-[#E0E0DB] rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17191B] uppercase tracking-wider mb-1">
                Name in Kannada (Verified Script)
              </label>
              <input
                type="text"
                value={profile.kannadaName || ""}
                onChange={(e) => setProfile({ ...profile, kannadaName: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-[#F8F6F2] border border-[#E0E0DB] rounded-lg font-kannada"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17191B] uppercase tracking-wider mb-1">
                Current Role / Executive Portfolio
              </label>
              <input
                type="text"
                value={profile.currentRole}
                onChange={(e) => setProfile({ ...profile, currentRole: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-[#F8F6F2] border border-[#E0E0DB] rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17191B] uppercase tracking-wider mb-1">
                Constituency
              </label>
              <input
                type="text"
                value={profile.constituency || ""}
                onChange={(e) => setProfile({ ...profile, constituency: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-[#F8F6F2] border border-[#E0E0DB] rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17191B] uppercase tracking-wider mb-1">
                Public Organisation / Party
              </label>
              <input
                type="text"
                value={profile.organisationName || ""}
                onChange={(e) => setProfile({ ...profile, organisationName: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-[#F8F6F2] border border-[#E0E0DB] rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17191B] uppercase tracking-wider mb-1">
                Region
              </label>
              <input
                type="text"
                value={profile.region || ""}
                onChange={(e) => setProfile({ ...profile, region: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-[#F8F6F2] border border-[#E0E0DB] rounded-lg"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#17191B] uppercase tracking-wider mb-1">
                Portrait Image URL
              </label>
              <input
                type="url"
                value={profile.portraitUrl || ""}
                onChange={(e) => setProfile({ ...profile, portraitUrl: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-[#F8F6F2] border border-[#E0E0DB] rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#17191B] uppercase tracking-wider mb-1">
              Short Sourced Summary
            </label>
            <textarea
              rows={2}
              value={profile.shortBio}
              onChange={(e) => setProfile({ ...profile, shortBio: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-[#F8F6F2] border border-[#E0E0DB] rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#17191B] uppercase tracking-wider mb-1">
              Comprehensive Public Biography
            </label>
            <textarea
              rows={8}
              value={profile.biography}
              onChange={(e) => setProfile({ ...profile, biography: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-[#F8F6F2] border border-[#E0E0DB] rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Tab 2: Milestones & Citations */}
      {activeTab === "milestones" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#5E6066]">
              Milestones represent key career events verified against legislative records or statutory affidavits.
            </p>
            <button
              type="button"
              onClick={addMilestone}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#922036] text-white text-xs font-semibold hover:bg-[#78182a]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Milestone</span>
            </button>
          </div>

          {profile.milestones.length === 0 ? (
            <div className="p-8 bg-white rounded-xl border border-[#E6E1DA] text-center text-xs text-[#888] italic">
              No milestones added yet. Click &quot;Add Milestone&quot; to attach public career milestones.
            </div>
          ) : (
            <div className="space-y-4">
              {profile.milestones.map((m, idx) => (
                <div key={idx} className="bg-white p-5 rounded-xl border border-[#E6E1DA] editorial-shadow space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#922036]">Milestone #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeMilestone(idx)}
                      className="text-red-500 hover:text-red-700 text-xs p-1"
                      title="Remove Milestone"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-semibold text-[#17191B] uppercase mb-1">
                        Milestone Title
                      </label>
                      <input
                        type="text"
                        value={m.title}
                        onChange={(e) => {
                          const updated = [...profile.milestones];
                          updated[idx].title = e.target.value;
                          setProfile({ ...profile, milestones: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs bg-[#F8F6F2] border border-[#E0E0DB] rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#17191B] uppercase mb-1">
                        Year
                      </label>
                      <input
                        type="number"
                        value={m.eventYear || ""}
                        onChange={(e) => {
                          const updated = [...profile.milestones];
                          updated[idx].eventYear = e.target.value ? parseInt(e.target.value, 10) : null;
                          setProfile({ ...profile, milestones: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs bg-[#F8F6F2] border border-[#E0E0DB] rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#17191B] uppercase mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={m.description}
                      onChange={(e) => {
                        const updated = [...profile.milestones];
                        updated[idx].description = e.target.value;
                        setProfile({ ...profile, milestones: updated });
                      }}
                      className="w-full px-3 py-1.5 text-xs bg-[#F8F6F2] border border-[#E0E0DB] rounded-lg"
                    />
                  </div>

                  {/* Attached Sources Selection */}
                  <div>
                    <label className="block text-[11px] font-semibold text-[#17191B] uppercase mb-1">
                      Attached Citations (from Source Registry)
                    </label>
                    <select
                      value={m.sourceIds?.[0] || ""}
                      onChange={(e) => {
                        const updated = [...profile.milestones];
                        updated[idx].sourceIds = e.target.value ? [e.target.value] : [];
                        setProfile({ ...profile, milestones: updated });
                      }}
                      className="w-full px-3 py-1.5 text-xs bg-[#F8F6F2] border border-[#E0E0DB] rounded-lg"
                    >
                      <option value="">No source linked</option>
                      {availableSources.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.title} ({s.publisher})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Initiatives */}
      {activeTab === "initiatives" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#5E6066]">
              Documented public initiatives, welfare frameworks, and infrastructure programs.
            </p>
            <button
              type="button"
              onClick={addInitiative}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#922036] text-white text-xs font-semibold hover:bg-[#78182a]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Initiative</span>
            </button>
          </div>

          {profile.initiatives.length === 0 ? (
            <div className="p-8 bg-white rounded-xl border border-[#E6E1DA] text-center text-xs text-[#888] italic">
              No public initiatives recorded for this leader yet.
            </div>
          ) : (
            <div className="space-y-4">
              {profile.initiatives.map((init, idx) => (
                <div key={idx} className="bg-white p-5 rounded-xl border border-[#E6E1DA] editorial-shadow space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#922036]">Initiative #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeInitiative(idx)}
                      className="text-red-500 hover:text-red-700 text-xs p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#17191B] uppercase mb-1">
                      Initiative Title
                    </label>
                    <input
                      type="text"
                      value={init.title}
                      onChange={(e) => {
                        const updated = [...profile.initiatives];
                        updated[idx].title = e.target.value;
                        setProfile({ ...profile, initiatives: updated });
                      }}
                      className="w-full px-3 py-1.5 text-xs bg-[#F8F6F2] border border-[#E0E0DB] rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#17191B] uppercase mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={init.description}
                      onChange={(e) => {
                        const updated = [...profile.initiatives];
                        updated[idx].description = e.target.value;
                        setProfile({ ...profile, initiatives: updated });
                      }}
                      className="w-full px-3 py-1.5 text-xs bg-[#F8F6F2] border border-[#E0E0DB] rounded-lg"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Workflow & Revisions */}
      {activeTab === "workflow" && (
        <div className="space-y-6">
          {/* Publication Control Card */}
          <div className="bg-white p-6 rounded-xl border border-[#E6E1DA] editorial-shadow space-y-4">
            <h2 className="font-serif font-bold text-lg text-[#17191B]">
              Publication Status & Controls
            </h2>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs text-[#65676B]">Current State:</span>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-[#922036]/10 text-[#922036]">
                {profile.publicationStatus}
              </span>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              {profile.publicationStatus === "APPROVED" && (
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={publishing}
                  className="px-5 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
                >
                  {publishing ? "Publishing..." : "Publish to Live Website"}
                </button>
              )}

              {profile.publicationStatus === "PUBLISHED" && (
                <>
                  <Link
                    href={`/leaders/${profile.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold"
                  >
                    <span>View Live Profile</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    type="button"
                    onClick={handleUnpublish}
                    disabled={unpublishing}
                    className="px-4 py-2 rounded-lg border border-red-300 bg-white text-red-700 text-xs font-semibold hover:bg-red-50"
                  >
                    {unpublishing ? "Unpublishing..." : "Unpublish Profile"}
                  </button>
                </>
              )}

              {profile.publicationStatus === "DRAFT" && (
                <button
                  type="button"
                  onClick={handleSubmitForReview}
                  disabled={submittingRev}
                  className="px-5 py-2 rounded-lg bg-[#922036] text-white text-xs font-semibold hover:bg-[#78182a]"
                >
                  Submit Revision for Review
                </button>
              )}
            </div>
          </div>

          {/* Revisions History */}
          <div className="bg-white p-6 rounded-xl border border-[#E6E1DA] editorial-shadow space-y-4">
            <h3 className="font-serif font-bold text-base text-[#17191B]">
              Immutable Revisions History
            </h3>
            <div className="divide-y divide-[#F0F0EB] text-xs">
              {profile.revisions.map((rev) => (
                <div key={rev.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#17191B]">Version {rev.version}</span>
                    <span className="ml-2 text-[10px] text-[#707278] uppercase">{rev.reviewStatus}</span>
                  </div>
                  <span className="text-[11px] text-[#888]">
                    {rev.submittedAt
                      ? new Date(rev.submittedAt).toLocaleDateString("en-IN")
                      : "Draft snapshot"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Live Profile Preview */}
      {activeTab === "preview" && (
        <div className="bg-white p-6 sm:p-10 rounded-xl border border-[#E6E1DA] editorial-shadow space-y-6">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center gap-2">
            <Eye className="w-4 h-4 shrink-0 text-amber-600" />
            <span>
              Private Preview: This demonstrates how this leader will appear to the public once published.
            </span>
          </div>

          <div className="space-y-4 border-b border-[#E6E1DA] pb-6">
            <div className="flex items-start gap-5">
              {profile.portraitUrl ? (
                <img
                  src={profile.portraitUrl}
                  alt={profile.displayName}
                  className="w-24 h-24 rounded-lg object-cover object-top border border-[#E0E0DB]"
                />
              ) : (
                <div className="w-24 h-24 rounded-lg bg-[#EFEFEA] text-[#888] flex items-center justify-center font-bold">
                  Portrait
                </div>
              )}
              <div className="space-y-1">
                <h2 className="text-2xl font-serif font-bold text-[#17191B]">{profile.displayName}</h2>
                {profile.kannadaName && (
                  <p className="text-lg font-kannada font-bold text-[#922036]">{profile.kannadaName}</p>
                )}
                <p className="text-sm font-semibold text-[#922036]">{profile.currentRole}</p>
                <p className="text-xs text-[#555]">{profile.constituency} • {profile.organisationName}</p>
              </div>
            </div>

            <p className="text-xs text-[#4A4B4F] leading-relaxed">{profile.shortBio}</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-serif font-bold text-base text-[#17191B]">Biography</h3>
            <p className="text-xs text-[#4A4B4F] leading-relaxed whitespace-pre-line">{profile.biography}</p>
          </div>
        </div>
      )}
    </div>
  );
}
