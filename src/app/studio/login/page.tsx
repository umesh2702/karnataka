"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, User, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default function StudioLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (loginEmail?: string, loginPassword?: string) => {
    setLoading(true);
    setErrorMessage("");

    const targetEmail = loginEmail || email;
    const targetPassword = loginPassword || password;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail, password: targetPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      router.push("/studio");
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("An unexpected error occurred during login.");
      }
    } finally {
      setLoading(false);
    }
  };

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className="min-h-screen bg-[#F7F7F4] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-lg bg-[#8A1C2C] text-white flex items-center justify-center font-serif font-bold text-xl shadow-sm">
            U
          </div>
          <span className="font-serif font-bold text-2xl tracking-tight text-[#191A1C]">
            UCreates <span className="font-sans font-normal text-base text-[#8A1C2C]">Leadership Studio</span>
          </span>
        </Link>
        <h1 className="text-xl font-serif font-bold text-[#191A1C]">
          Authorised Editorial Sign-In
        </h1>
        <p className="text-xs text-[#5E6066]">
          Karnataka Edition • Multi-Tier Role-Based Access Control
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-[#E5E5E0] rounded-xl sm:px-10 space-y-6">
          {errorMessage && (
            <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={submitForm} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#191A1C] uppercase tracking-wider mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@ucreates.io"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[#FAF8F5] border border-[#E0E0DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8A1C2C]"
                />
                <Mail className="w-4 h-4 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#191A1C] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[#FAF8F5] border border-[#E0E0DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8A1C2C]"
                />
                <Lock className="w-4 h-4 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-xs font-semibold text-white bg-[#8A1C2C] hover:bg-[#721422] transition-colors disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Sign in to Studio"}
            </button>
          </form>

          {/* Quick-Access Demo Accounts */}
          <div className="pt-4 border-t border-[#EFEFEA] space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8A1C2C]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Development Seed Accounts (1-Click Test Login)</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleLogin("admin@ucreates.io", "Admin@12345")}
                className="w-full py-2 px-3 text-left border border-[#E0E0DB] rounded-lg text-xs hover:bg-[#FAF8F5] flex items-center justify-between transition-colors"
              >
                <div>
                  <strong className="block text-[#191A1C]">Platform Admin</strong>
                  <span className="text-[10px] text-[#707278]">admin@ucreates.io (Full Privileges)</span>
                </div>
                <ArrowRight className="w-3 h-3 text-[#8A1C2C]" />
              </button>

              <button
                type="button"
                onClick={() => handleLogin("reviewer@ucreates.io", "Admin@12345")}
                className="w-full py-2 px-3 text-left border border-[#E0E0DB] rounded-lg text-xs hover:bg-[#FAF8F5] flex items-center justify-between transition-colors"
              >
                <div>
                  <strong className="block text-[#191A1C]">Senior Reviewer</strong>
                  <span className="text-[10px] text-[#707278]">reviewer@ucreates.io (Review & Approval Desk)</span>
                </div>
                <ArrowRight className="w-3 h-3 text-[#8A1C2C]" />
              </button>

              <button
                type="button"
                onClick={() => handleLogin("editor@ucreates.io", "Admin@12345")}
                className="w-full py-2 px-3 text-left border border-[#E0E0DB] rounded-lg text-xs hover:bg-[#FAF8F5] flex items-center justify-between transition-colors"
              >
                <div>
                  <strong className="block text-[#191A1C]">Research Editor</strong>
                  <span className="text-[10px] text-[#707278]">editor@ucreates.io (Draft Creation & Submissions)</span>
                </div>
                <ArrowRight className="w-3 h-3 text-[#8A1C2C]" />
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-xs text-[#65676B] hover:text-[#191A1C]">
            ← Return to Public Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
