"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AlertCircle, CheckCircle2, Send, FileCheck2, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default function CorrectionsPage() {
  const [profiles, setProfiles] = useState<{ id: string; slug: string; displayName: string }[]>([]);
  const [formData, setFormData] = useState({
    profileSlug: "",
    claimOrSection: "",
    description: "",
    suggestedCorrection: "",
    evidenceUrl: "",
    submitterName: "",
    submitterEmail: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Fetch published leaders list for dropdown
    fetch("/api/leaders")
      .then((res) => (res.ok ? res.json() : { profiles: [] }))
      .then((data) => {
        if (data.profiles) {
          setProfiles(
            data.profiles.map((p: { id: string; slug: string; displayName: string }) => ({
              id: p.id,
              slug: p.slug,
              displayName: p.displayName,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/corrections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit correction");
      }

      setSubmitted(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F7F4]">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full">
        <div className="border-b border-[#E5E5E0] pb-6 mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#8A1C2C]/10 text-[#8A1C2C] text-xs font-semibold uppercase">
            Public Integrity Desk
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#191A1C]">
            Submit a Factual Correction
          </h1>
          <p className="text-sm sm:text-base text-[#5E6066] leading-relaxed font-light">
            We are committed to factual precision. If you have identified an inaccurate designation, misattributed
            date, or missing statutory reference, please submit documentation below.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white rounded-2xl border border-emerald-200 p-8 sm:p-10 editorial-shadow text-center space-y-5">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#191A1C]">
              Correction Request Logged
            </h2>
            <p className="text-sm text-[#5E6066] max-w-md mx-auto leading-relaxed">
              Thank you for contributing to public factual accuracy. Our editorial verification desk will review the
              submitted source and update the profile accordingly.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    profileSlug: "",
                    claimOrSection: "",
                    description: "",
                    suggestedCorrection: "",
                    evidenceUrl: "",
                    submitterName: "",
                    submitterEmail: "",
                  });
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#8A1C2C] text-white text-xs font-semibold hover:bg-[#721422] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Submit Another Request</span>
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl border border-[#E5E5E0] p-6 sm:p-10 editorial-shadow space-y-6"
          >
            {errorMessage && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#191A1C] uppercase tracking-wider mb-1.5">
                  Associated Leadership Profile (Optional)
                </label>
                <select
                  value={formData.profileSlug}
                  onChange={(e) => setFormData({ ...formData, profileSlug: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F5] border border-[#E0E0DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8A1C2C]"
                >
                  <option value="">General Platform Record / Other</option>
                  {profiles.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.displayName} ({p.slug})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#191A1C] uppercase tracking-wider mb-1.5">
                  Section, Milestone, or Claim Requiring Review <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2014 Energy Minister tenure dates or Assembly election year"
                  value={formData.claimOrSection}
                  onChange={(e) => setFormData({ ...formData, claimOrSection: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F5] border border-[#E0E0DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8A1C2C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#191A1C] uppercase tracking-wider mb-1.5">
                  Detailed Description of Discrepancy <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the inaccurate detail currently published..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F5] border border-[#E0E0DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8A1C2C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#191A1C] uppercase tracking-wider mb-1.5">
                  Verified Replacement Information <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide the accurate text, date, or portfolio designation..."
                  value={formData.suggestedCorrection}
                  onChange={(e) => setFormData({ ...formData, suggestedCorrection: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F5] border border-[#E0E0DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8A1C2C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#191A1C] uppercase tracking-wider mb-1.5">
                  Verifiable Evidence URL (Gazette, Official Portal, Statutory Affidavit)
                </label>
                <input
                  type="url"
                  placeholder="https://kla.kar.nic.in/... or https://affidavit.eci.gov.in/..."
                  value={formData.evidenceUrl}
                  onChange={(e) => setFormData({ ...formData, evidenceUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F5] border border-[#E0E0DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8A1C2C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-[#191A1C] uppercase tracking-wider mb-1.5">
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Researcher / Citizen Name"
                    value={formData.submitterName}
                    onChange={(e) => setFormData({ ...formData, submitterName: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F5] border border-[#E0E0DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8A1C2C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#191A1C] uppercase tracking-wider mb-1.5">
                    Your Contact Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.submitterEmail}
                    onChange={(e) => setFormData({ ...formData, submitterEmail: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F5] border border-[#E0E0DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8A1C2C]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#EFEFEA] flex items-center justify-between">
              <span className="text-xs text-[#707278]">All submissions are logged to the audit registry.</span>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#8A1C2C] text-white text-xs font-semibold hover:bg-[#721422] transition-colors disabled:opacity-50"
              >
                {submitting ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Correction</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
