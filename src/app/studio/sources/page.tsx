"use client";

import React, { useState, useEffect } from "react";
import { BookMarked, Plus, Search, ExternalLink, CheckCircle2, AlertCircle, Filter } from "lucide-react";

interface SourceItem {
  id: string;
  title: string;
  url: string;
  publisher: string;
  sourceType: string;
  checkedAt: string;
  verificationStatus: string;
  notes?: string;
  claimSources: { id: string }[];
}

export const dynamic = "force-dynamic";

export default function SourceRegistryPage() {
  const [sources, setSources] = useState<SourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    publisher: "",
    sourceType: "OFFICIAL_GOVERNMENT",
    verificationStatus: "VERIFIED",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchSources = async () => {
    try {
      const url = `/api/sources?status=${statusFilter}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setSources(data.sources || []);
      }
    } catch {}
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSources();
  }, [statusFilter]);

  const handleCreateSource = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowAddModal(false);
        setFormData({
          title: "",
          url: "",
          publisher: "",
          sourceType: "OFFICIAL_GOVERNMENT",
          verificationStatus: "VERIFIED",
          notes: "",
        });
        await fetchSources();
      }
    } catch {}
    finally {
      setSubmitting(false);
    }
  };

  const filteredSources = sources.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return s.title.toLowerCase().includes(q) || s.publisher.toLowerCase().includes(q) || s.url.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E1DA] pb-5">
        <div>
          <span className="text-xs font-semibold text-[#922036] uppercase tracking-wider">
            Verification Registry
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#17191B] mt-1">
            Source Registry
          </h1>
          <p className="text-xs sm:text-sm text-[#68645F]">
            Authoritative documents, official gazettes, statutory candidate affidavits, and news citations.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#922036] text-white text-xs font-semibold hover:bg-[#78182a] transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Source</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E6E1DA] editorial-shadow flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, publisher or domain..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F8F6F2] border border-[#E6E1DA] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#922036]"
          />
          <Search className="w-3.5 h-3.5 text-[#68645F] absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-[#F8F6F2] border border-[#E6E1DA] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#922036]"
          >
            <option value="ALL">All Verification States</option>
            <option value="VERIFIED">Verified</option>
            <option value="REVIEWED">Reviewed</option>
            <option value="NEEDS_REVIEW">Needs Review</option>
            <option value="UNCHECKED">Unchecked</option>
          </select>

          <span className="text-xs text-[#68645F] shrink-0">
            Total: <strong>{filteredSources.length}</strong> sources
          </span>
        </div>
      </div>

      {/* Sources Table */}
      <div className="bg-white rounded-xl border border-[#E6E1DA] editorial-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F6F2] border-b border-[#E6E1DA] text-[#68645F] uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Source Title & Publisher</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Verification Status</th>
                <th className="py-3 px-4 text-center">Citations</th>
                <th className="py-3 px-4">Last Checked</th>
                <th className="py-3 px-4 text-right">Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E1DA]/60 text-[#17191B]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#68645F] italic">
                    Loading source registry...
                  </td>
                </tr>
              ) : filteredSources.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#68645F] italic">
                    No sources found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredSources.map((s) => (
                  <tr key={s.id} className="hover:bg-[#F8F6F2]">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#17191B]">{s.title}</div>
                      <div className="text-[11px] text-[#68645F]">Publisher: {s.publisher}</div>
                      {s.notes && (
                        <div className="text-[10px] text-[#68645F] italic mt-0.5 max-w-md line-clamp-1">
                          {s.notes}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-[#EFEFEA] text-[#17191B]">
                        {s.sourceType.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        {s.verificationStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-bold">
                      {s.claimSources.length} claims
                    </td>
                    <td className="py-3 px-4 text-[#68645F]">
                      {new Date(s.checkedAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 p-1.5 rounded border border-[#E6E1DA] hover:bg-white text-[#922036]"
                        title="Open external source"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Source Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E6E1DA] pb-3">
              <h3 className="font-serif font-bold text-lg text-[#17191B]">
                Register Verified Source
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#68645F] hover:text-[#17191B] font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSource} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#17191B] uppercase mb-1">Source Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Karnataka Legislative Assembly Gazette Roster"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8F6F2] border border-[#E6E1DA] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#922036]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#17191B] uppercase mb-1">Source URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://kla.kar.nic.in/..."
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8F6F2] border border-[#E6E1DA] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#922036]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#17191B] uppercase mb-1">Publisher *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Karnataka Legislative Council Secretariat"
                  value={formData.publisher}
                  onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8F6F2] border border-[#E6E1DA] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#922036]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#17191B] uppercase mb-1">Source Category</label>
                  <select
                    value={formData.sourceType}
                    onChange={(e) => setFormData({ ...formData, sourceType: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F8F6F2] border border-[#E6E1DA] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#922036]"
                  >
                    <option value="OFFICIAL_GOVERNMENT">Official Government</option>
                    <option value="LEGISLATIVE_ELECTION">Legislative / Election</option>
                    <option value="OFFICIAL_ORGANISATION">Official Organisation</option>
                    <option value="REPUTABLE_NEWS">Reputable News</option>
                    <option value="DIRECT_SUBMISSION">Direct Submission</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#17191B] uppercase mb-1">Verification Status</label>
                  <select
                    value={formData.verificationStatus}
                    onChange={(e) => setFormData({ ...formData, verificationStatus: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F8F6F2] border border-[#E6E1DA] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#922036]"
                  >
                    <option value="VERIFIED">Verified</option>
                    <option value="REVIEWED">Reviewed</option>
                    <option value="NEEDS_REVIEW">Needs Review</option>
                    <option value="UNCHECKED">Unchecked</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#17191B] uppercase mb-1">Verification Notes</label>
                <textarea
                  rows={2}
                  placeholder="Notes regarding checked facts..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8F6F2] border border-[#E6E1DA] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#922036]"
                />
              </div>

              <div className="pt-3 border-t border-[#E6E1DA] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-[#E6E1DA] rounded-lg text-[#68645F] hover:bg-[#F8F6F2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#922036] text-white rounded-lg font-semibold hover:bg-[#78182a] disabled:opacity-50"
                >
                  {submitting ? "Registering..." : "Register Source"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
