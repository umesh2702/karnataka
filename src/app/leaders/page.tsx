import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { PublicationStatus } from "@prisma/client";
import {
  Search,
  CheckCircle2,
  MapPin,
  Award,
  ArrowRight,
  Filter,
  RotateCcw,
  Calendar,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface DirectoryPageProps {
  searchParams: Promise<{
    search?: string;
    role?: string;
    region?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function LeadersDirectoryPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = props.searchParams ? await props.searchParams : {};

  const searchQuery = (typeof sp.search === "string" ? sp.search : "") || "";
  const selectedRole = (typeof sp.role === "string" ? sp.role : "") || "ALL";
  const selectedRegion = (typeof sp.region === "string" ? sp.region : "") || "ALL";
  const sortOrder = sp.sort === "desc" ? "desc" : "asc";
  const currentPage = parseInt((typeof sp.page === "string" ? sp.page : "1") || "1", 10);
  const pageSize = 12;

  // Build Prisma query condition
  const where: Record<string, unknown> = {
    publicationStatus: PublicationStatus.PUBLISHED,
  };

  if (searchQuery) {
    where.OR = [
      { displayName: { contains: searchQuery, mode: "insensitive" } },
      { kannadaName: { contains: searchQuery, mode: "insensitive" } },
      { currentRole: { contains: searchQuery, mode: "insensitive" } },
      { constituency: { contains: searchQuery, mode: "insensitive" } },
    ];
  }

  if (selectedRole !== "ALL") {
    where.currentRole = { contains: selectedRole, mode: "insensitive" };
  }

  if (selectedRegion !== "ALL") {
    where.region = { contains: selectedRegion, mode: "insensitive" };
  }

  // Get total count & paginated records
  const [totalCount, leaders] = await Promise.all([
    prisma.leaderProfile.count({ where }),
    prisma.leaderProfile.findMany({
      where,
      orderBy: { displayName: sortOrder },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
      include: {
        _count: { select: { milestones: true, initiatives: true } },
      },
    }),
  ]);

  // Extract distinct regions & roles for dynamic filter dropdowns
  const allPublished = await prisma.leaderProfile.findMany({
    where: { publicationStatus: PublicationStatus.PUBLISHED },
    select: { currentRole: true, region: true },
  });

  const availableRoles = Array.from(new Set(allPublished.map((p) => p.currentRole))).filter(Boolean);
  const availableRegions = Array.from(new Set(allPublished.map((p) => p.region))).filter(Boolean) as string[];

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F7F4]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Page Header */}
        <div className="border-b border-[#E5E5E0] pb-8 mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#8A1C2C]/10 text-[#8A1C2C] text-xs font-semibold uppercase">
            Statewide Public Directory
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#191A1C]">
            Karnataka Leadership Directory
          </h1>
          <p className="text-sm sm:text-base text-[#5E6066] max-w-3xl leading-relaxed">
            Verified public representatives, cabinet ministers, and state leaders. Each profile links documented
            career milestones and initiatives directly to official gazettes and statutory filings.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-5 rounded-xl border border-[#E5E5E0] editorial-shadow mb-8 space-y-4">
          <form method="GET" action="/leaders" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="lg:col-span-5 relative">
              <input
                type="text"
                name="search"
                defaultValue={searchQuery}
                placeholder="Search by name, constituency or role..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-[#FAF8F5] border border-[#E0E0DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8A1C2C] focus:border-[#8A1C2C]"
              />
              <Search className="w-4 h-4 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Filter by Role */}
            <div className="lg:col-span-3">
              <select
                name="role"
                defaultValue={selectedRole}
                className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-[#E0E0DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8A1C2C]"
              >
                <option value="ALL">All Portfolios & Roles</option>
                {availableRoles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Region */}
            <div className="lg:col-span-2">
              <select
                name="region"
                defaultValue={selectedRegion}
                className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-[#E0E0DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8A1C2C]"
              >
                <option value="ALL">All Regions</option>
                {availableRegions.map((reg) => (
                  <option key={reg} value={reg}>
                    {reg}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Order */}
            <div className="lg:col-span-2 flex items-center gap-2">
              <select
                name="sort"
                defaultValue={sortOrder}
                className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-[#E0E0DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8A1C2C]"
              >
                <option value="asc">Name (A-Z)</option>
                <option value="desc">Name (Z-A)</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 bg-[#8A1C2C] text-white rounded-lg text-sm font-semibold hover:bg-[#721422] transition-colors shrink-0"
              >
                Apply
              </button>
            </div>
          </form>

          {/* Active Filter Indicators */}
          {(searchQuery || selectedRole !== "ALL" || selectedRegion !== "ALL") && (
            <div className="flex items-center justify-between pt-3 border-t border-[#F0F0EB] text-xs text-[#65676B]">
              <div className="flex flex-wrap items-center gap-2">
                <span>Active filters:</span>
                {searchQuery && (
                  <span className="px-2 py-0.5 bg-[#EFEFEA] rounded text-[#191A1C]">
                    Keyword: &quot;{searchQuery}&quot;
                  </span>
                )}
                {selectedRole !== "ALL" && (
                  <span className="px-2 py-0.5 bg-[#EFEFEA] rounded text-[#191A1C]">
                    Role: {selectedRole}
                  </span>
                )}
                {selectedRegion !== "ALL" && (
                  <span className="px-2 py-0.5 bg-[#EFEFEA] rounded text-[#191A1C]">
                    Region: {selectedRegion}
                  </span>
                )}
              </div>
              <Link
                href="/leaders"
                className="inline-flex items-center gap-1 text-[#8A1C2C] font-semibold hover:underline"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear all</span>
              </Link>
            </div>
          )}
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 text-xs text-[#65676B]">
          <span>
            Showing <strong className="text-[#191A1C]">{leaders.length}</strong> of{" "}
            <strong className="text-[#191A1C]">{totalCount}</strong> published leaders
          </span>
          <span>Karnataka Edition v1.0</span>
        </div>

        {/* Directory Grid */}
        {leaders.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E5E5E0] p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#FAF8F5] text-[#888] mx-auto flex items-center justify-center">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#191A1C]">No matching leadership profiles found</h3>
            <p className="text-sm text-[#5E6066] max-w-md mx-auto">
              We couldn&apos;t find any verified leader records matching your search filters. Try adjusting your search
              query or clearing selected filters.
            </p>
            <div className="pt-2">
              <Link
                href="/leaders"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#8A1C2C] text-white rounded-md text-xs font-semibold"
              >
                Reset Directory Filters
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leaders.map((leader) => (
              <article
                key={leader.id}
                className="bg-white rounded-xl border border-[#E5E5E0] editorial-shadow overflow-hidden card-hover-effect flex flex-col justify-between"
              >
                <div className="p-6 space-y-4">
                  {/* Portrait & Core Identifiers */}
                  <div className="flex items-start gap-4">
                    {leader.portraitUrl ? (
                      <img
                        src={leader.portraitUrl}
                        alt={leader.displayName}
                        className="w-18 h-18 rounded-lg object-cover object-top shrink-0 border border-[#E5E5E0]"
                      />
                    ) : (
                      <div className="w-18 h-18 rounded-lg bg-[#EFEFEA] text-[#888] flex items-center justify-center text-xs shrink-0">
                        Portrait
                      </div>
                    )}
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified
                        </span>
                      </div>
                      <h2 className="font-serif font-bold text-xl text-[#191A1C] hover:text-[#8A1C2C] transition-colors leading-tight truncate">
                        <Link href={`/leaders/${leader.slug}`}>{leader.displayName}</Link>
                      </h2>
                      {leader.kannadaName && (
                        <p className="text-xs font-kannada font-semibold text-[#8A1C2C]">
                          {leader.kannadaName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Public Designation */}
                  <p className="text-sm font-semibold text-[#8A1C2C] line-clamp-2">
                    {leader.currentRole}
                  </p>

                  {/* Metadata: Constituency & Region */}
                  <div className="space-y-1 text-xs text-[#555]">
                    {leader.constituency && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#8A1C2C] shrink-0" />
                        <span className="truncate">{leader.constituency}</span>
                      </div>
                    )}
                    {leader.organisationName && (
                      <div className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-[#8A1C2C] shrink-0" />
                        <span className="truncate">{leader.organisationName}</span>
                      </div>
                    )}
                  </div>

                  {/* Summary */}
                  <p className="text-xs text-[#5E6066] leading-relaxed line-clamp-3">
                    {leader.shortBio}
                  </p>
                </div>

                {/* Footer with Last Verification Date & Profile CTA */}
                <div className="px-6 py-4 bg-[#FAF8F5] border-t border-[#EFEFEA] flex items-center justify-between text-xs">
                  {leader.roleLastVerifiedAt ? (
                    <span className="text-[11px] text-[#65676B]">
                      Verified: {new Date(leader.roleLastVerifiedAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                    </span>
                  ) : (
                    <span className="text-[11px] text-[#888]">Checked via KLA</span>
                  )}

                  <Link
                    href={`/leaders/${leader.slug}`}
                    className="inline-flex items-center gap-1.5 font-semibold text-[#8A1C2C] hover:text-[#721422] transition-colors"
                  >
                    <span>View Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => {
              const pNum = i + 1;
              const isActive = pNum === currentPage;
              return (
                <Link
                  key={pNum}
                  href={`/leaders?page=${pNum}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ""}${selectedRole !== "ALL" ? `&role=${encodeURIComponent(selectedRole)}` : ""}${selectedRegion !== "ALL" ? `&region=${encodeURIComponent(selectedRegion)}` : ""}`}
                  className={`w-9 h-9 rounded-md text-xs font-semibold flex items-center justify-center border transition-colors ${
                    isActive
                      ? "bg-[#8A1C2C] text-white border-[#8A1C2C]"
                      : "bg-white text-[#191A1C] border-[#E0E0DB] hover:bg-[#EFEFEA]"
                  }`}
                >
                  {pNum}
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
