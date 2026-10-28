import React from "react";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Settings, ShieldCheck, Palette, Building2, Globe } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StudioSettingsPage() {
  const session = await getCurrentUser();
  if (!session) redirect("/studio/login");

  const org = await prisma.organisation.findUnique({
    where: { id: session.organisationId },
  });

  const branding = (org?.branding as Record<string, string>) || {};

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="border-b border-[#E5E5E0] pb-5 space-y-1">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase text-[#8A1C2C]">
          <Settings className="w-3.5 h-3.5" />
          <span>Configuration & Tenant Settings</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#191A1C]">
          Organisation & Editorial Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#5E6066]">
          Multi-tenancy configuration, regional edition branding, and public metadata parameters.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E5E5E0] editorial-shadow space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[#F0F0EB]">
          <div className="w-10 h-10 rounded-lg bg-[#8A1C2C]/10 text-[#8A1C2C] flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-lg text-[#191A1C]">
              {org?.name || "UCreates Karnataka Chapter"}
            </h2>
            <span className="text-xs text-[#707278] font-mono">Organisation Slug: {org?.slug}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
          <div>
            <label className="block font-bold text-[#191A1C] uppercase mb-1">
              Active Regional Edition
            </label>
            <input
              type="text"
              disabled
              value={branding.edition || "Karnataka Edition"}
              className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-[#E0E0DB] rounded-lg text-[#555]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#191A1C] uppercase mb-1">
              Primary Brand Accent
            </label>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-[#8A1C2C] border border-black/10 shrink-0"></span>
              <input
                type="text"
                disabled
                value={branding.primaryColor || "#8A1C2C (Deep Burgundy)"}
                className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-[#E0E0DB] rounded-lg text-[#555]"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-[#191A1C] uppercase mb-1">
              Published Tagline
            </label>
            <input
              type="text"
              disabled
              value={branding.tagline || "Public Leadership. Clearly Documented."}
              className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-[#E0E0DB] rounded-lg text-[#555]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-[#191A1C] uppercase mb-1">
              Database Persistence Endpoint
            </label>
            <input
              type="text"
              disabled
              value="PostgreSQL 17.6 (schema: public, database: leadership_studio)"
              className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-[#E0E0DB] rounded-lg text-[#555] font-mono text-[11px]"
            />
          </div>
        </div>

        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Enterprise Security Note: Database credentials and cryptographic keys are isolated strictly on the server
            environment.
          </span>
        </div>
      </div>
    </div>
  );
}
