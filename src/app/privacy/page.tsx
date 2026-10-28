import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ShieldCheck, Lock, Eye, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | UCreates Leadership Studio",
  description: "Privacy information, public data curation policies, and consent records management.",
};

export const dynamic = "force-dynamic";

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F7F7F4]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full">
        <div className="border-b border-[#E5E5E0] pb-6 mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#8A1C2C]/10 text-[#8A1C2C] text-xs font-semibold uppercase">
            Data Governance
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#191A1C]">
            Privacy Policy & Consent Governance
          </h1>
          <p className="text-sm sm:text-base text-[#5E6066] leading-relaxed font-light">
            How UCreates Leadership Studio collects, handles, and protects public data, consent records, and visitor
            privacy.
          </p>
        </div>

        <div className="space-y-8 text-sm sm:text-base text-[#3A3B3F] leading-relaxed font-light">
          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-[#191A1C]">1. Public Data Sources & Attribution</h2>
            <p>
              UCreates Leadership Studio aggregates information exclusively from public record sources, including
              official legislative proceedings, gazette notifications published by the Government of Karnataka, sworn
              candidate affidavits from the Election Commission of India, and attributed journalistic reports.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-[#191A1C]">2. Consent & Image Usage Rights</h2>
            <p>
              In accordance with Section 13 of our publishing protocol, portrait assets and biographical narratives
              require verified permission scopes. Where explicit photographic consent is on file, it is documented
              within our private studio registry. Historical public figures and public officials acting in their
              statutory capacity are documented under fair reporting standards without private personal intrusion.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-[#191A1C]">3. Analytics & Cookie Usage</h2>
            <p>
              We do not track visitors with third-party advertising cookies or cross-site data brokers. Essential
              cookies are used solely for language selection preferences (English vs Kannada) and secure session
              authentication for authorised studio administrators.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-[#191A1C]">4. Right to Rectification & Removal</h2>
            <p>
              Any public leader, statutory body, or copyright holder may contact our verification desk to review
              recorded biographical claims or request rectification through our{" "}
              <a href="/corrections" className="text-[#8A1C2C] font-semibold underline">
                Public Corrections Portal
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
