import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Scale, AlertTriangle, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Terms of Service | UCreates Leadership Studio",
  description: "Terms and conditions of use for UCreates Leadership Studio — Karnataka Edition.",
};

export const dynamic = "force-dynamic";

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F7F7F4]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full">
        <div className="border-b border-[#E5E5E0] pb-6 mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#8A1C2C]/10 text-[#8A1C2C] text-xs font-semibold uppercase">
            Product Terms
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#191A1C]">
            Terms of Service & Usage Conditions
          </h1>
          <p className="text-sm sm:text-base text-[#5E6066] leading-relaxed font-light">
            Guidelines governing the use, quotation, and republication of data from UCreates Leadership Studio.
          </p>
        </div>

        <div className="space-y-8 text-sm sm:text-base text-[#3A3B3F] leading-relaxed font-light">
          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-[#191A1C]">1. Independent Editorial Platform</h2>
            <p>
              UCreates Leadership Studio is an independent civic research and digital publishing initiative developed by
              UCreates. Use of the website does not create any advisory, fiduciary, or commercial relationship with any
              government department or public officer.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-[#191A1C]">2. Attribution & Citation Guidelines</h2>
            <p>
              Researchers, journalists, and civic institutions may quote and cite individual profiles provided that
              attribution is clearly given to &quot;UCreates Leadership Studio (Karnataka Edition)&quot; accompanied by the
              relevant primary source citation referenced in the profile. Automated mass scraping without written
              authorisation is prohibited.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-[#191A1C]">3. Disclaimer of Warranties</h2>
            <p>
              While reasonable care is taken to verify biographical records and legislative service dates against
              official gazettes, records are subject to updates. Users should verify statutory filings directly with
              the appropriate legislative secretariat or election authority for official legal proceedings.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
