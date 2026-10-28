"use client";

import React, { useState, useEffect } from "react";
import { UserCheck, Plus, ShieldCheck, Mail, AlertCircle, CheckCircle2 } from "lucide-react";

interface UserItem {
  membershipId: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joinedAt: string;
}

export const dynamic = "force-dynamic";

export default function UsersManagementPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "EDITOR",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch {}
    finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create user");

      setShowModal(false);
      setFormData({ name: "", email: "", password: "", role: "EDITOR" });
      await fetchUsers();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Error creating user");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E0] pb-5">
        <div>
          <span className="text-xs font-semibold text-[#8A1C2C] uppercase tracking-wider">
            Access Control & RBAC
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#191A1C] mt-1">
            Authorised Users & Role Management
          </h1>
          <p className="text-xs sm:text-sm text-[#5E6066]">
            Assign fine-grained privileges across Platform Admin, Organisation Admin, Reviewer, and Editor roles.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#8A1C2C] text-white text-xs font-semibold hover:bg-[#721422] transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Team Member</span>
        </button>
      </div>

      {/* Role Definitions Card */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-[#E5E5E0] space-y-1">
          <strong className="text-xs font-bold text-[#191A1C] block uppercase">Platform Admin</strong>
          <p className="text-[11px] text-[#5E6066]">Full platform control, multi-organisation management & overrides.</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-[#E5E5E0] space-y-1">
          <strong className="text-xs font-bold text-[#191A1C] block uppercase">Organisation Admin</strong>
          <p className="text-[11px] text-[#5E6066]">Manage team memberships, publish/unpublish, and organisation settings.</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-[#E5E5E0] space-y-1">
          <strong className="text-xs font-bold text-[#8A1C2C] block uppercase">Reviewer Desk</strong>
          <p className="text-[11px] text-[#5E6066]">Inspect submitted revisions, verify sources, approve or reject.</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-[#E5E5E0] space-y-1">
          <strong className="text-xs font-bold text-[#191A1C] block uppercase">Research Editor</strong>
          <p className="text-[11px] text-[#5E6066]">Create draft profiles, write milestones, attach sources, submit for review.</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-[#E5E5E0] editorial-shadow overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF8F5] border-b border-[#E5E5E0] text-[#65676B] uppercase font-semibold">
            <tr>
              <th className="py-3 px-4">Member Name</th>
              <th className="py-3 px-4">Email Address</th>
              <th className="py-3 px-4">Assigned Role</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Joined Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F0EB] text-[#191A1C]">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-[#888] italic">
                  Loading team members...
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.membershipId} className="hover:bg-[#FAF8F5]">
                  <td className="py-3 px-4 font-bold text-[#191A1C]">{u.name}</td>
                  <td className="py-3 px-4 text-[#707278] font-mono text-[11px]">{u.email}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAF0F2] text-[#8A1C2C]">
                      {u.role.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#707278]">
                    {new Date(u.joinedAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E5E0] pb-3">
              <h3 className="font-serif font-bold text-lg text-[#191A1C]">
                Add Team Member
              </h3>
              <button onClick={() => setShowModal(false)} className="text-[#888] font-bold">
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-800 text-xs rounded-lg border border-red-200">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#191A1C] uppercase mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E0E0DB] rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-[#191A1C] uppercase mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="name@ucreates.io"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E0E0DB] rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-[#191A1C] uppercase mb-1">Password *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E0E0DB] rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-[#191A1C] uppercase mb-1">Assigned Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E0E0DB] rounded-lg"
                >
                  <option value="EDITOR">Research Editor</option>
                  <option value="REVIEWER">Senior Reviewer</option>
                  <option value="ORGANISATION_ADMIN">Organisation Admin</option>
                  <option value="PLATFORM_ADMIN">Platform Admin</option>
                </select>
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
                  {submitting ? "Adding..." : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
