import React from "react";
import prisma from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import LeaderAvatar from "@/components/profile/LeaderAvatar";
import { ReservationType } from "@prisma/client";
import {
  MapPin,
  Users,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Compass,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Karnataka Assembly Constituencies Directory | UCreates",
  description:
    "Explore Karnataka's 224 Legislative Assembly constituencies with verified representative details, reservations, and localized infrastructure projects.",
};

export default async function ConstituenciesPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = props.searchParams ? await props.searchParams : {};
  const searchQuery = (typeof sp.search === "string" ? sp.search : "") || "";
  const selectedDistrict = (typeof sp.district === "string" ? sp.district : "") || "ALL";
  const selectedReservation = (typeof sp.reservation === "string" ? sp.reservation : "") || "ALL";
  const selectedRegion = (typeof sp.region === "string" ? sp.region : "") || "ALL";

  const where: Record<string, unknown> = {
    status: "ACTIVE",
  };

  if (selectedDistrict !== "ALL" && selectedDistrict) {
    where.district = { equals: selectedDistrict, mode: "insensitive" };
  }

  if (selectedReservation !== "ALL" && selectedReservation) {
    where.reservation = selectedReservation as ReservationType;
  }

  if (selectedRegion !== "ALL" && selectedRegion) {
    where.region = { contains: selectedRegion, mode: "insensitive" };
  }

  if (searchQuery) {
    where.OR = [
      { name: { contains: searchQuery, mode: "insensitive" } },
      { kannadaName: { contains: searchQuery, mode: "insensitive" } },
      { district: { contains: searchQuery, mode: "insensitive" } },
      {
        representative: {
          displayName: { contains: searchQuery, mode: "insensitive" },
        },
      },
    ];
  }

  const [constituencies, allDistricts] = await Promise.all([
    prisma.constituency.findMany({
      where,
      include: {
        representative: {
          select: {
            id: true,
            slug: true,
            displayName: true,
            kannadaName: true,
            currentRole: true,
            party: true,
            portfolio: true,
            portraitUrl: true,
            publicationStatus: true,
          },
        },
        _count: {
          select: { projects: true },
        },
      },
      orderBy: { number: "asc" },
    }),
    prisma.constituency.findMany({
      select: { district: true },
      distinct: ["district"],
      orderBy: { district: "asc" },
    }),
  ]);

  const districtList = Array.from(new Set(allDistricts.map((d) => d.district)));

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F6F2]">
      <Navbar />

      <main className="flex-1 py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 pb-6 border-b border-[#E6E1DA]">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#922036]/10 text-[#922036] text-xs font-semibold uppercase tracking-wider mb-3">
              <Compass className="w-3.5 h-3.5" />
              Karnataka Legislative Assembly · 224 Constituencies
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#17191B] tracking-tight">
              Constituency Explorer
            </h1>
            <p className="text-base text-[#68645F] mt-2 max-w-2xl font-light">
              Verified assembly constituencies across Karnataka with documented representatives,
              reservation classifications, and local public development initiatives.
            </p>
          </div>

          {/* Filters & Search Toolbar */}
          <div className="bg-white p-5 rounded-xl border border-[#E6E1DA] editorial-shadow mb-8 space-y-4">
            <form method="GET" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  defaultValue={searchQuery}
                  placeholder="Search constituency or MLA..."
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[#FAF8F5] border border-[#E6E1DA] rounded-lg text-[#17191B] focus:outline-none focus:ring-1 focus:ring-[#922036]"
                />
                <Search className="w-4 h-4 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              {/* District Filter */}
              <div>
                <select
                  name="district"
                  defaultValue={selectedDistrict}
                  className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-[#E6E1DA] rounded-lg text-[#17191B] focus:outline-none focus:ring-1 focus:ring-[#922036]"
                >
                  <option value="ALL">All Districts</option>
                  {districtList.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reservation Filter */}
              <div>
                <select
                  name="reservation"
                  defaultValue={selectedReservation}
                  className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-[#E6E1DA] rounded-lg text-[#17191B] focus:outline-none focus:ring-1 focus:ring-[#922036]"
                >
                  <option value="ALL">All Category Reservations</option>
                  <option value="GENERAL">General</option>
                  <option value="SC">Scheduled Caste (SC)</option>
                  <option value="ST">Scheduled Tribe (ST)</option>
                </select>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#922036] text-white text-sm font-semibold rounded-lg hover:bg-[#7A1629] transition-colors"
                >
                  Filter
                </button>
                {(searchQuery || selectedDistrict !== "ALL" || selectedReservation !== "ALL") && (
                  <Link
                    href="/constituencies"
                    className="px-3 py-2 border border-[#E6E1DA] text-[#68645F] text-sm font-medium rounded-lg hover:bg-[#F8F6F2]"
                  >
                    Reset
                  </Link>
                )}
              </div>
            </form>

            <div className="flex items-center justify-between text-xs text-[#68645F] pt-2 border-t border-[#F0ECE6]">
              <span>
                Showing <strong>{constituencies.length}</strong> verified assembly constituencies
              </span>
              <span className="hidden sm:inline">Official Election Commission of India delimitations</span>
            </div>
          </div>

          {/* Constituencies Grid */}
          {constituencies.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#E6E1DA] p-12 text-center space-y-3">
              <Compass className="w-10 h-10 text-[#68645F] mx-auto opacity-40" />
              <h3 className="font-serif font-bold text-lg text-[#17191B]">No matching constituencies found</h3>
              <p className="text-sm text-[#68645F] max-w-md mx-auto">
                No constituencies match your search and filter criteria. Try clearing the filters or searching by a different term.
              </p>
              <Link
                href="/constituencies"
                className="inline-block px-4 py-2 bg-[#922036] text-white text-xs font-semibold rounded-lg hover:bg-[#7A1629]"
              >
                Clear all filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {constituencies.map((c) => {
                const rep = c.representative;
                const isPublishedRep = rep && rep.publicationStatus === "PUBLISHED";

                return (
                  <div
                    key={c.id}
                    className="bg-white rounded-xl border border-[#E6E1DA] p-5 editorial-shadow flex flex-col justify-between hover:border-[#922036]/50 transition-all group"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2.5 py-0.5 text-xs font-bold font-mono rounded bg-[#F4EFEB] text-[#17191B] border border-[#E6E1DA]">
                          AC No. {c.number}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {c.reservation !== "GENERAL" && (
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                              {c.reservation} Reserved
                            </span>
                          )}
                          <span className="text-xs text-[#68645F] flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#922036]" />
                            {c.district}
                          </span>
                        </div>
                      </div>

                      {/* Constituency Title */}
                      <h3 className="text-xl font-serif font-bold text-[#17191B] group-hover:text-[#922036] transition-colors">
                        <Link href={`/constituencies/${c.slug}`}>{c.name}</Link>
                      </h3>
                      {c.kannadaName && (
                        <p className="text-sm font-kannada font-semibold text-[#922036] mt-0.5">
                          {c.kannadaName}
                        </p>
                      )}

                      <p className="text-xs text-[#68645F] mt-2 line-clamp-2 leading-relaxed">
                        {c.summary || `${c.name} is an active assembly constituency in ${c.district} district of Karnataka.`}
                      </p>

                      {/* Representative Box */}
                      <div className="mt-4 p-3 bg-[#FAF8F5] rounded-lg border border-[#F0ECE6]">
                        {isPublishedRep ? (
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-13 shrink-0">
                              <LeaderAvatar
                                src={rep.portraitUrl}
                                name={rep.displayName}
                                kannadaName={rep.kannadaName}
                                size="sm"
                                aspect="portrait"
                                className="w-full h-full"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="text-[10px] uppercase tracking-wider text-[#68645F] font-semibold block">
                                Elected Representative
                              </span>
                              <Link
                                href={`/leaders/${rep.slug}`}
                                className="font-serif font-bold text-sm text-[#17191B] hover:text-[#922036] truncate block"
                              >
                                {rep.displayName}
                              </Link>
                              <span className="text-[11px] font-medium text-[#922036] block truncate">
                                {rep.currentRole}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-xs text-[#82848A] py-1 flex items-center gap-1.5">
                            <Building2 className="w-4 h-4 text-[#A0A2A8]" />
                            <span>Representative verification in progress</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer Stats & Profile Link */}
                    <div className="mt-5 pt-3 border-t border-[#F0ECE6] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3 text-[#68645F]">
                        {c.totalElectors && (
                          <span className="flex items-center gap-1" title="Total registered voters">
                            <Users className="w-3.5 h-3.5 text-[#888]" />
                            {c.totalElectors.toLocaleString("en-IN")} Electors
                          </span>
                        )}
                        <span>{c._count.projects} Documented Works</span>
                      </div>

                      <Link
                        href={`/constituencies/${c.slug}`}
                        className="inline-flex items-center gap-1 font-semibold text-[#922036] hover:text-[#7A1629]"
                      >
                        <span>View Profile</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
