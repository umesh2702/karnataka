"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Copy, Check } from "lucide-react";

interface CitizenIssueFormProps {
  constituencyId: string;
  constituencyName: string;
}

export default function CitizenIssueForm({
  constituencyId,
  constituencyName,
}: CitizenIssueFormProps) {
  const [citizenName, setCitizenName] = useState("");
  const [citizenEmail, setCitizenEmail] = useState("");
  const [citizenPhone, setCitizenPhone] = useState("");
  const [category, setCategory] = useState("Infrastructure & Roads");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successCode, setSuccessCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          constituencyId,
          citizenName,
          citizenEmail: citizenEmail || undefined,
          citizenPhone: citizenPhone || undefined,
          category,
          subject,
          description,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit enquiry");
      }

      setSuccessCode(data.trackingCode);
      setCitizenName("");
      setCitizenEmail("");
      setCitizenPhone("");
      setSubject("");
      setDescription("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyTrackingCode = () => {
    if (successCode) {
      navigator.clipboard.writeText(successCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E6E1DA] p-6 sm:p-8 editorial-shadow">
      <div className="mb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#922036]">
          Citizen Engagement & Transparency
        </span>
        <h3 className="text-2xl font-serif font-bold text-[#17191B] mt-1">
          Constituency Issue & Public Request Submission
        </h3>
        <p className="text-sm text-[#68645F] mt-1 leading-relaxed">
          Submit documented civic feedback, local developmental priorities, or constituency concerns for {constituencyName}.
          Each submission receives an official tracking code for administrative review.
        </p>
      </div>

      {successCode ? (
        <div className="p-6 bg-[#E9F5EE] border border-[#C2E2CE] rounded-xl space-y-4 text-center">
          <div className="w-12 h-12 rounded-full bg-[#1A633F]/10 text-[#1A633F] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-lg text-[#17191B]">Issue Successfully Recorded</h4>
            <p className="text-xs text-[#1A633F] mt-1 font-medium">
              Your inquiry has been stored under Karnataka citizen governance documentation.
            </p>
          </div>

          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white rounded-lg border border-[#C2E2CE] font-mono text-sm font-bold text-[#17191B]">
            <span>Tracking Code: {successCode}</span>
            <button
              type="button"
              onClick={copyTrackingCode}
              className="p-1 text-[#68645F] hover:text-[#17191B] transition-colors"
              title="Copy tracking code"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <p className="text-xs text-[#68645F] max-w-md mx-auto">
            Please preserve this tracking code for future status verification. Personal information is processed in strict accordance with platform privacy protections.
          </p>

          <button
            type="button"
            onClick={() => setSuccessCode(null)}
            className="px-4 py-2 text-xs font-semibold text-[#922036] hover:underline"
          >
            Submit Another Issue
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#17191B] mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={citizenName}
                onChange={(e) => setCitizenName(e.target.value)}
                placeholder="Citizen Name"
                className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-[#E6E1DA] rounded-lg text-[#17191B] focus:outline-none focus:ring-1 focus:ring-[#922036]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17191B] mb-1">
                Issue Category <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-[#E6E1DA] rounded-lg text-[#17191B] focus:outline-none focus:ring-1 focus:ring-[#922036]"
              >
                <option value="Infrastructure & Roads">Infrastructure & Roads</option>
                <option value="Water Supply & Irrigation">Water Supply & Irrigation</option>
                <option value="Health & Medical Centers">Health & Medical Centers</option>
                <option value="Education & Schools">Education & Schools</option>
                <option value="Welfare & Guarantees Support">Welfare & Guarantees Support</option>
                <option value="Electricity & Power Supply">Electricity & Power Supply</option>
                <option value="Other Civic Concerns">Other Civic Concerns</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#17191B] mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={citizenEmail}
                onChange={(e) => setCitizenEmail(e.target.value)}
                placeholder="citizen@example.com"
                className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-[#E6E1DA] rounded-lg text-[#17191B] focus:outline-none focus:ring-1 focus:ring-[#922036]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17191B] mb-1">
                Contact Mobile (Optional)
              </label>
              <input
                type="tel"
                value={citizenPhone}
                onChange={(e) => setCitizenPhone(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-[#E6E1DA] rounded-lg text-[#17191B] focus:outline-none focus:ring-1 focus:ring-[#922036]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17191B] mb-1">
              Issue Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              minLength={5}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief summary of the issue or proposal"
              className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-[#E6E1DA] rounded-lg text-[#17191B] focus:outline-none focus:ring-1 focus:ring-[#922036]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17191B] mb-1">
              Detailed Description & Location Details <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              minLength={20}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide specific details, ward or village location, and factual context..."
              className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-[#E6E1DA] rounded-lg text-[#17191B] focus:outline-none focus:ring-1 focus:ring-[#922036]"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-[#82848A]">
              Protected under privacy standards. No commercial marketing.
            </span>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#922036] text-white text-sm font-semibold rounded-lg hover:bg-[#7A1629] disabled:opacity-50 transition-colors shadow-2xs"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? "Recording Issue..." : "Submit Constituency Issue"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
