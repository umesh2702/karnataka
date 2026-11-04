import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Scale, AlertTriangle, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Terms of Service | Karnataka Congress Official Digital Platform",
  description: "Terms and conditions of use for Karnataka Congress Official Digital Platform.",
};

export const dynamic = "force-dynamic";

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8F6F2]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full">
        <div className="border-b border-[#E5E1D8] pb-6 mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#173B65]/10 text-[#173B65] text-xs font-semibold uppercase">
            Institutional Terms
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#191A1C]">
            Terms of Service & Usage Conditions
          </h1>
          <p className="text-sm sm:text-base text-[#5E6066] leading-relaxed font-light">
            Guidelines governing the use, quotation, and access to data from Karnataka Congress Official Digital Platform.
          </p>
        </div>

        <div className="space-y-8 text-sm sm:text-base text-[#3A3B3F] leading-relaxed font-light">
          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-[#191A1C]">1. Institutional Platform Purpose</h2>
            <p>
              The Karnataka Congress Official Digital Platform is developed for the Karnataka Pradesh Congress Committee (KPCC) with technology architecture provided by UCreates as technology development partner. Information on this platform is organized to ensure verifiable public governance transparency.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-[#191A1C]">2. Attribution & Citation Guidelines</h2>
            <p>
              Researchers, journalists, and civic institutions may quote and cite individual profiles provided that
              attribution is clearly given to &quot;Karnataka Congress Digital Platform&quot; accompanied by the
              relevant primary legislative source citation referenced in the profile. Automated mass scraping without written
              authorisation is prohibited.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-[#191A1C]">3. Verification & Statutory Sources</h2>
            <p>
              All published portfolios, legislative records, and scheme details are cross-referenced against
              official legislative gazettes and department notices. Records are continually audited and updated as official publications are gazetted.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
