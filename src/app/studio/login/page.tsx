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
    <div className="min-h-screen bg-[#F8F7F3] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-white border border-[#E5E1D8] shadow-xs flex items-center justify-center p-1">
            <img
              src="/images/inc-logo.svg"
              alt="Indian National Congress Symbol"
              className="w-8 h-8 object-contain"
            />
          </div>
          <span className="font-serif font-bold text-2xl tracking-tight text-[#242424]">
            Karnataka Congress <span className="font-sans font-semibold text-base text-[#173B65]">Digital Studio</span>
          </span>
        </Link>
        <h1 className="text-xl font-serif font-bold text-[#242424]">
          Authorised Administration Sign-In
        </h1>
        <p className="text-xs text-[#595959]">
          Institutional Content Governance & Review Desk · Technology Partner: UCreates
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-[#E5E1D8] rounded-xl sm:px-10 space-y-6">
          {errorMessage && (
            <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={submitForm} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#242424] uppercase tracking-wider mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@ucreates.io"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[#FAF8F5] border border-[#E5E1D8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#173B65] focus:border-[#173B65]"
                />
                <Mail className="w-4 h-4 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#242424] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[#FAF8F5] border border-[#E5E1D8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#173B65] focus:border-[#173B65]"
                />
                <Lock className="w-4 h-4 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-xs font-semibold text-white bg-[#173B65] hover:bg-[#0F2744] transition-colors disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Sign in to Studio"}
            </button>
          </form>

          {/* Institutional Access Information (No credentials exposed) */}
          <div className="pt-4 border-t border-[#EFEFEA] space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#173B65]">
              <ShieldCheck className="w-4 h-4 text-[#16864A]" />
              <span>Restricted Editorial Environment</span>
            </div>
            <p className="text-[11px] text-[#707278] leading-relaxed">
              Access is restricted to authorized Karnataka Pradesh Congress Committee (KPCC) editorial and verification personnel. Role-based access control (RBAC) and audit logging are strictly enforced on all sessions.
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-xs text-[#65676B] hover:text-[#173B65] inline-flex items-center gap-1">
            ← Return to Public Platform
          </Link>
        </div>
      </div>
    </div>
  );
}
