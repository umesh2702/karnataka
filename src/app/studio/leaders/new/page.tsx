"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, AlertCircle, CheckCircle2, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default function NewLeaderProfilePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    displayName: "",
    kannadaName: "",
    slug: "",
    currentRole: "",
    organisationName: "Government of Karnataka",
    region: "Southern Karnataka",
    constituency: "",
    shortBio: "",
    biography: "",
    portraitUrl: "",
  });

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const generatedSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    setFormData((prev) => ({
      ...prev,
      displayName: name,
      slug: prev.slug === "" || prev.slug === formData.slug ? generatedSlug : prev.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/leaders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create profile");
      }

      router.push(`/studio/leaders/${data.profile.id}/edit`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E6E1DA] pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/studio/leaders"
            className="p-1.5 rounded-md border border-[#E6E1DA] text-[#68645F] hover:text-[#17191B] hover:bg-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#17191B]">
              Create New Leadership Profile
            </h1>
            <p className="text-xs text-[#68645F]">
              New profiles start in DRAFT status with initial revision v1
            </p>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-xl border border-[#E6E1DA] editorial-shadow space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Display Name */}
          <div>
            <label className="block text-xs font-bold text-[#17191B] uppercase tracking-wider mb-1.5">
              Display Name (English) <span className="text-[#922036]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. D. K. Shivakumar"
              value={formData.displayName}
              onChange={handleNameChange}
              className="w-full px-3.5 py-2 text-sm bg-[#F8F6F2] border border-[#E6E1DA] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#922036]"
            />
          </div>

          {/* Kannada Name */}
          <div>
            <label className="block text-xs font-bold text-[#17191B] uppercase tracking-wider mb-1.5">
              Name in Kannada (Verified Script)
            </label>
            <input
              type="text"
              placeholder="e.g. ಡಿ. ಕೆ. ಶಿವಕುಮಾರ್"
              value={formData.kannadaName}
              onChange={(e) => setFormData({ ...formData, kannadaName: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-[#F8F6F2] border border-[#E6E1DA] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#922036] font-kannada"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-xs font-bold text-[#17191B] uppercase tracking-wider mb-1.5">
              Unique URL Slug <span className="text-[#922036]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="dk-shivakumar"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })}
              className="w-full px-3.5 py-2 text-sm bg-[#F8F6F2] border border-[#E6E1DA] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#922036] font-mono text-xs"
            />
            <span className="text-[10px] text-[#68645F] block mt-1">
              Public URL: /leaders/{formData.slug || "slug"}
            </span>
          </div>

          {/* Current Role */}
          <div>
            <label className="block text-xs font-bold text-[#17191B] uppercase tracking-wider mb-1.5">
              Current Public Role / Portfolio <span className="text-[#922036]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Chief Minister of Karnataka"
              value={formData.currentRole}
              onChange={(e) => setFormData({ ...formData, currentRole: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-[#F8F6F2] border border-[#E6E1DA] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#922036]"
            />
          </div>

          {/* Organisation */}
          <div>
            <label className="block text-xs font-bold text-[#17191B] uppercase tracking-wider mb-1.5">
              Public Organisation / Party
            </label>
            <input
              type="text"
              placeholder="Government of Karnataka"
              value={formData.organisationName}
              onChange={(e) => setFormData({ ...formData, organisationName: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-[#F8F6F2] border border-[#E6E1DA] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#922036]"
            />
          </div>

          {/* Constituency */}
          <div>
            <label className="block text-xs font-bold text-[#17191B] uppercase tracking-wider mb-1.5">
              Electoral Constituency
            </label>
            <input
              type="text"
              placeholder="e.g. Kanakapura (AC No. 184)"
              value={formData.constituency}
              onChange={(e) => setFormData({ ...formData, constituency: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-[#F8F6F2] border border-[#E6E1DA] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#922036]"
            />
          </div>

          {/* Region */}
          <div>
            <label className="block text-xs font-bold text-[#17191B] uppercase tracking-wider mb-1.5">
              Region / Administrative Division
            </label>
            <input
              type="text"
              placeholder="e.g. Southern Karnataka / Bengaluru Region"
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-[#F8F6F2] border border-[#E6E1DA] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#922036]"
            />
          </div>

          {/* Portrait URL */}
          <div>
            <label className="block text-xs font-bold text-[#17191B] uppercase tracking-wider mb-1.5">
              Portrait Image URL (Permitted Asset)
            </label>
            <input
              type="url"
              placeholder="https://... or /uploads/..."
              value={formData.portraitUrl}
              onChange={(e) => setFormData({ ...formData, portraitUrl: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-[#F8F6F2] border border-[#E6E1DA] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#922036]"
            />
          </div>
        </div>

        {/* Short Bio */}
        <div>
          <label className="block text-xs font-bold text-[#17191B] uppercase tracking-wider mb-1.5">
            Short Sourced Introduction (Summary) <span className="text-[#922036]">*</span>
          </label>
          <textarea
            required
            rows={2}
            placeholder="Concise 1-2 sentence verified summary for directory cards and header preview..."
            value={formData.shortBio}
            onChange={(e) => setFormData({ ...formData, shortBio: e.target.value })}
            className="w-full px-3.5 py-2 text-sm bg-[#F8F6F2] border border-[#E6E1DA] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#922036]"
          />
        </div>

        {/* Full Biography */}
        <div>
          <label className="block text-xs font-bold text-[#17191B] uppercase tracking-wider mb-1.5">
            Detailed Public Biography & Education Background <span className="text-[#922036]">*</span>
          </label>
          <textarea
            required
            rows={6}
            placeholder="Comprehensive documented biography covering academic degrees, early public service, legislative elections, and executive portfolios..."
            value={formData.biography}
            onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
            className="w-full px-3.5 py-2 text-sm bg-[#F8F6F2] border border-[#E6E1DA] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#922036]"
          />
        </div>

        {/* Form Actions */}
        <div className="pt-4 border-t border-[#E6E1DA] flex items-center justify-between">
          <Link
            href="/studio/leaders"
            className="px-4 py-2 border border-[#E6E1DA] rounded-lg text-xs font-semibold text-[#68645F] hover:bg-[#F8F6F2]"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#922036] text-white text-xs font-semibold hover:bg-[#78182a] transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Creating Draft..." : "Save Draft Profile"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
