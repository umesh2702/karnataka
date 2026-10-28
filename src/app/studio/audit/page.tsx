"use client";

import React, { useState, useEffect } from "react";
import { History, Search, Clock, User, ShieldCheck } from "lucide-react";

interface AuditItem {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  actor?: { name: string; email: string } | null;
}

export const dynamic = "force-dynamic";

export default function AuditLogPage() {
  const [events, setEvents] = useState<AuditItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/audit");
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch {}
    finally {
      setLoading(false);
    }
  };

  const filtered = events.filter((e) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      e.action.toLowerCase().includes(q) ||
      e.entityType.toLowerCase().includes(q) ||
      e.entityId.toLowerCase().includes(q) ||
      (e.actor?.name && e.actor.name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-[#E5E5E0] pb-5 space-y-1">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase text-[#8A1C2C]">
          <History className="w-3.5 h-3.5" />
          <span>Security & Provenance Traceability</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#191A1C]">
          System Audit Log
        </h1>
        <p className="text-xs sm:text-sm text-[#5E6066]">
          Immutable chronological ledger of profile creation, revision submissions, review decisions, and publication events.
        </p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-[#E5E5E0] editorial-shadow flex items-center justify-between">
        <div className="relative max-w-md w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by action, actor, or entity..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#E0E0DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8A1C2C]"
          />
          <Search className="w-3.5 h-3.5 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        <span className="text-xs text-[#65676B]">
          Showing <strong>{filtered.length}</strong> recorded audit events
        </span>
      </div>

      <div className="bg-white rounded-xl border border-[#E5E5E0] editorial-shadow overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF8F5] border-b border-[#E5E5E0] text-[#65676B] uppercase font-semibold">
            <tr>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4">Actor</th>
              <th className="py-3 px-4">Entity Type</th>
              <th className="py-3 px-4">Entity ID</th>
              <th className="py-3 px-4">Sanitized Metadata</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F0EB] text-[#191A1C]">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-[#888] italic">
                  Loading audit logs from database...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-[#888] italic">
                  No audit events recorded.
                </td>
              </tr>
            ) : (
              filtered.map((e) => (
                <tr key={e.id} className="hover:bg-[#FAF8F5]">
                  <td className="py-3 px-4 text-[#707278] font-mono text-[11px] whitespace-nowrap">
                    {new Date(e.createdAt).toLocaleString("en-IN")}
                  </td>
                  <td className="py-3 px-4 font-bold text-[#191A1C]">
                    <span className="px-2 py-0.5 rounded bg-[#FAF0F2] text-[#8A1C2C]">
                      {e.action}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {e.actor ? (
                      <div>
                        <span className="font-semibold block">{e.actor.name}</span>
                        <span className="text-[10px] text-[#707278]">{e.actor.email}</span>
                      </div>
                    ) : (
                      <span className="text-[#888] italic">System / Seeder</span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#555]">{e.entityType}</td>
                  <td className="py-3 px-4 font-mono text-[10px] text-[#707278] max-w-[120px] truncate">
                    {e.entityId}
                  </td>
                  <td className="py-3 px-4 text-[#65676B] font-mono text-[10px] max-w-xs truncate">
                    {e.metadata ? JSON.stringify(e.metadata) : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
