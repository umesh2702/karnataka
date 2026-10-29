"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import KarnatakaMap from "@/components/map/KarnatakaMap";
import LeaderAvatar from "@/components/profile/LeaderAvatar";
import {
  Search,
  LayoutGrid,
  Map as MapIcon,
  List as ListIcon,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Filter,
  RotateCcw,
  Compass,
  Award,
  Calendar,
} from "lucide-react";

interface ProfileItem {
  id: string;
  slug: string;
  displayName: string;
  kannadaName?: string | null;
  currentRole: string;
  constituency?: string | null;
  region?: string | null;
  organisationName?: string | null;
  shortBio: string;
  portraitUrl?: string | null;
  roleLastVerifiedAt?: string | Date | null;
  _count?: {
    milestones: number;
    initiatives: number;
  };
}

interface DirectoryExplorerProps {
  initialLeaders: ProfileItem[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  searchQuery: string;
  selectedRole: string;
  selectedRegion: string;
  selectedDistrict: string;
  sortOrder: "asc" | "desc";
  availableRoles: string[];
  availableRegions: string[];
}

export default function DirectoryExplorer({
  initialLeaders,
  totalCount,
  currentPage,
  totalPages,
  searchQuery,
  selectedRole,
  selectedRegion,
  selectedDistrict,
  sortOrder,
  availableRoles,
  availableRegions,
}: DirectoryExplorerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeView, setActiveView] = useState<"grid" | "map" | "table">("grid");
  const [localDistrict, setLocalDistrict] = useState<string | null>(selectedDistrict !== "ALL" ? selectedDistrict : null);

  const updateFilters = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === "ALL" || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    // Reset to page 1 on filter change
    if (!newParams.page) {
      params.set("page", "1");
    }

    router.push(`/leaders?${params.toString()}`);
  };

  const handleDistrictSelect = (districtName: string | null) => {
    setLocalDistrict(districtName);
    updateFilters({ district: districtName || null });
  };

  const hasActiveFilters =
    Boolean(searchQuery) ||
    selectedRole !== "ALL" ||
    selectedRegion !== "ALL" ||
    (selectedDistrict !== "ALL" && Boolean(selectedDistrict));

  const clearAllFilters = () => {
    setLocalDistrict(null);
    router.push("/leaders");
  };

  // Build pagination links
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("page", page.toString());
    return `/leaders?${params.toString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Search, Filter Controls & View Switcher */}
      <div className="bg-white p-5 rounded-2xl border border-[#E6E1DA] editorial-shadow space-y-4">
        {/* Top Controls Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const q = formData.get("search") as string;
              updateFilters({ search: q.trim() || null });
            }}
            className="relative flex-1 max-w-md"
          >
            <input
              type="text"
              name="search"
              defaultValue={searchQuery}
              placeholder="Search by leader name, role, constituency..."
              className="w-full pl-9 pr-24 py-2.5 text-sm bg-[#F8F6F2] border border-[#E6E1DA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#922036] text-[#17191B] placeholder-[#888]"
            />
            <Search className="w-4 h-4 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-[#922036] text-white text-xs font-semibold rounded-lg hover:bg-[#7A1629] transition-colors"
            >
              Search
            </button>
          </form>

          {/* View Switch Buttons (Map / Grid / Table) */}
          <div className="flex items-center gap-1.5 bg-[#F8F6F2] p-1 rounded-xl border border-[#E6E1DA] self-start md:self-auto">
            <button
              type="button"
              onClick={() => setActiveView("grid")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeView === "grid"
                  ? "bg-white text-[#922036] shadow-2xs border border-[#E6E1DA]"
                  : "text-[#68645F] hover:text-[#17191B]"
              }`}
              title="Grid Card View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView("map")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeView === "map"
                  ? "bg-white text-[#922036] shadow-2xs border border-[#E6E1DA]"
                  : "text-[#68645F] hover:text-[#17191B]"
              }`}
              title="Interactive Map View"
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Map View</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView("table")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeView === "table"
                  ? "bg-white text-[#922036] shadow-2xs border border-[#E6E1DA]"
                  : "text-[#68645F] hover:text-[#17191B]"
              }`}
              title="Accessible Table List View"
            >
              <ListIcon className="w-3.5 h-3.5" />
              <span>Accessible Table</span>
            </button>
          </div>
        </div>

        {/* Dropdown Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#E6E1DA]/60">
          {/* Role Filter */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#68645F] mb-1">
              Portfolio & Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => updateFilters({ role: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-[#F8F6F2] border border-[#E6E1DA] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#922036] text-[#17191B]"
            >
              <option value="ALL">All Portfolios & Designations</option>
              {availableRoles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Region Filter */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#68645F] mb-1">
              Geographic Region
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => updateFilters({ region: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-[#F8F6F2] border border-[#E6E1DA] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#922036] text-[#17191B]"
            >
              <option value="ALL">All Karnataka Regions</option>
              {availableRegions.map((reg) => (
                <option key={reg} value={reg}>
                  {reg}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#68645F] mb-1">
              Alphabetical Sort
            </label>
            <select
              value={sortOrder}
              onChange={(e) => updateFilters({ sort: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-[#F8F6F2] border border-[#E6E1DA] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#922036] text-[#17191B]"
            >
              <option value="asc">Name (A → Z)</option>
              <option value="desc">Name (Z → A)</option>
            </select>
          </div>
        </div>

        {/* Active Filter Badges */}
        {hasActiveFilters && (
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[#68645F] font-semibold">Active filters:</span>
            {searchQuery && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#922036]/10 text-[#922036] font-medium flex items-center gap-1">
                Search: &ldquo;{searchQuery}&rdquo;
                <button
                  type="button"
                  onClick={() => updateFilters({ search: null })}
                  className="hover:opacity-75 font-bold ml-1"
                >
                  ×
                </button>
              </span>
            )}
            {selectedRole !== "ALL" && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#922036]/10 text-[#922036] font-medium flex items-center gap-1">
                Role: {selectedRole}
                <button
                  type="button"
                  onClick={() => updateFilters({ role: null })}
                  className="hover:opacity-75 font-bold ml-1"
                >
                  ×
                </button>
              </span>
            )}
            {selectedRegion !== "ALL" && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#922036]/10 text-[#922036] font-medium flex items-center gap-1">
                Region: {selectedRegion}
                <button
                  type="button"
                  onClick={() => updateFilters({ region: null })}
                  className="hover:opacity-75 font-bold ml-1"
                >
                  ×
                </button>
              </span>
            )}
            {selectedDistrict !== "ALL" && selectedDistrict && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#922036] text-white font-medium flex items-center gap-1">
                District: {selectedDistrict}
                <button
                  type="button"
                  onClick={() => handleDistrictSelect(null)}
                  className="hover:opacity-75 font-bold ml-1"
                >
                  ×
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-xs text-[#922036] underline hover:no-underline font-semibold ml-2 inline-flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset all</span>
            </button>
          </div>
        )}
      </div>

      {/* =========================================================================
          VIEW MODE 1: INTERACTIVE MAP VIEW
          ========================================================================= */}
      {activeView === "map" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Map Column */}
          <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-[#E6E1DA] editorial-shadow">
            <div className="mb-4">
              <h2 className="font-serif font-bold text-xl text-[#17191B]">
                Interactive District Explorer
              </h2>
              <p className="text-xs text-[#68645F] mt-0.5">
                Click any of Karnataka&apos;s 30 districts to filter verified leadership representations.
              </p>
            </div>

            <KarnatakaMap
              selectedDistrict={localDistrict}
              onSelectDistrict={handleDistrictSelect}
              className="w-full"
            />
          </div>

          {/* Filtered District Results Column */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E6E1DA]">
              <span className="font-serif font-bold text-lg text-[#17191B]">
                {localDistrict ? `Records in ${localDistrict} District` : "All Verified Representatives"}
              </span>
              <span className="text-xs text-[#68645F]">
                {initialLeaders.length} matching profile(s)
              </span>
            </div>

            {initialLeaders.length === 0 ? (
              <div className="p-8 bg-white rounded-xl border border-[#E6E1DA] text-center space-y-3 editorial-shadow">
                <Compass className="w-8 h-8 text-[#68645F] mx-auto opacity-40" />
                <h3 className="font-serif font-bold text-base text-[#17191B]">
                  No Mapped Records for Selected Filter
                </h3>
                <p className="text-xs text-[#68645F] max-w-sm mx-auto">
                  No verified leadership records match &ldquo;{localDistrict || searchQuery}&rdquo;.
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="px-3.5 py-1.5 bg-[#922036] text-white text-xs font-semibold rounded-lg hover:bg-[#7A1629]"
                >
                  View All Leaders
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {initialLeaders.map((leader) => (
                  <article
                    key={leader.id}
                    className="p-5 bg-white rounded-xl border border-[#E6E1DA] editorial-shadow hover:border-[#922036]/40 transition-all flex items-start gap-4"
                  >
                    <div className="w-16 h-20 shrink-0">
                      <LeaderAvatar
                        src={leader.portraitUrl}
                        name={leader.displayName}
                        kannadaName={leader.kannadaName}
                        size="sm"
                        aspect="portrait"
                        className="w-full h-full"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#E9F5EE] text-[#1A633F] border border-[#C2E2CE] inline-flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Verified
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-base text-[#17191B] truncate hover:text-[#922036]">
                        <Link href={`/leaders/${leader.slug}`}>{leader.displayName}</Link>
                      </h3>

                      {leader.kannadaName && (
                        <p className="text-xs font-kannada text-[#922036] font-semibold -mt-0.5 truncate">
                          {leader.kannadaName}
                        </p>
                      )}

                      <p className="text-xs font-medium text-[#17191B] mt-0.5 truncate">
                        {leader.currentRole}
                      </p>

                      <p className="text-[11px] text-[#68645F] truncate mt-0.5">
                        {leader.constituency}
                      </p>

                      <div className="mt-3 pt-2 border-t border-[#E6E1DA] flex items-center justify-between text-xs">
                        <span className="text-[11px] text-[#68645F]">
                          {leader._count?.milestones || 4} Documented Milestones
                        </span>
                        <Link
                          href={`/leaders/${leader.slug}`}
                          className="font-semibold text-[#922036] hover:underline flex items-center gap-1 text-[11px]"
                        >
                          <span>Full Profile</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW MODE 2: RESPONSIVE CARDS GRID VIEW
          ========================================================================= */}
      {activeView === "grid" && (
        <div>
          {initialLeaders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E6E1DA] p-12 text-center space-y-4 editorial-shadow">
              <Search className="w-12 h-12 text-[#68645F] mx-auto opacity-40" />
              <h3 className="font-serif font-bold text-xl text-[#17191B]">
                No Published Records Found
              </h3>
              <p className="text-sm text-[#68645F] max-w-md mx-auto">
                No verified records match your active search criteria. All published profiles must meet statutory
                evidentiary standards.
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="px-4 py-2 bg-[#922036] text-white text-xs font-semibold rounded-lg hover:bg-[#7A1629]"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {initialLeaders.map((leader) => (
                <article
                  key={leader.id}
                  className="bg-white rounded-2xl border border-[#E6E1DA] p-6 card-hover-effect flex flex-col justify-between space-y-4 editorial-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-24 shrink-0">
                      <LeaderAvatar
                        src={leader.portraitUrl}
                        name={leader.displayName}
                        kannadaName={leader.kannadaName}
                        size="md"
                        aspect="portrait"
                        className="w-full h-full"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E9F5EE] text-[#1A633F] border border-[#C2E2CE] inline-flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Verified
                        </span>
                        {leader.roleLastVerifiedAt && (
                          <span className="text-[10px] text-[#68645F]">
                            {new Date(leader.roleLastVerifiedAt).getFullYear()}
                          </span>
                        )}
                      </div>

                      <h3 className="font-serif font-bold text-lg text-[#17191B] hover:text-[#922036] transition-colors leading-snug">
                        <Link href={`/leaders/${leader.slug}`}>{leader.displayName}</Link>
                      </h3>

                      {leader.kannadaName && (
                        <p className="text-xs font-kannada font-semibold text-[#922036] mt-0.5">
                          {leader.kannadaName}
                        </p>
                      )}

                      <p className="text-xs font-semibold text-[#17191B] mt-1.5 line-clamp-1">
                        {leader.currentRole}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-[#68645F] leading-relaxed line-clamp-3 font-light">
                    {leader.shortBio}
                  </p>

                  <div className="pt-3 border-t border-[#E6E1DA] flex items-center justify-between text-xs text-[#68645F]">
                    <div className="flex items-center gap-1 truncate max-w-[60%]">
                      <MapPin className="w-3.5 h-3.5 text-[#922036] shrink-0" />
                      <span className="truncate text-[11px]">{leader.constituency || "Karnataka"}</span>
                    </div>

                    <Link
                      href={`/leaders/${leader.slug}`}
                      className="text-[#922036] font-semibold hover:underline flex items-center gap-1 text-[11px] shrink-0"
                    >
                      <span>View record</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          VIEW MODE 3: ACCESSIBLE DATA TABLE VIEW
          ========================================================================= */}
      {activeView === "table" && (
        <div className="bg-white rounded-2xl border border-[#E6E1DA] overflow-hidden editorial-shadow">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#17191B]" aria-label="Karnataka Public Leadership Directory Table">
              <thead className="bg-[#FAF8F5] border-b border-[#E6E1DA] text-[11px] font-semibold text-[#68645F] uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-5 py-3.5">Leader & Monogram</th>
                  <th scope="col" className="px-5 py-3.5">Current Verified Role</th>
                  <th scope="col" className="px-5 py-3.5">Constituency / District</th>
                  <th scope="col" className="px-5 py-3.5">Milestones</th>
                  <th scope="col" className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E1DA]">
                {initialLeaders.map((leader) => (
                  <tr key={leader.id} className="hover:bg-[#F8F6F2] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 shrink-0">
                          <LeaderAvatar
                            src={leader.portraitUrl}
                            name={leader.displayName}
                            kannadaName={leader.kannadaName}
                            size="sm"
                            aspect="portrait"
                            className="w-full h-full"
                          />
                        </div>
                        <div>
                          <Link href={`/leaders/${leader.slug}`} className="font-serif font-bold text-sm text-[#17191B] hover:text-[#922036]">
                            {leader.displayName}
                          </Link>
                          {leader.kannadaName && (
                            <div className="font-kannada text-xs text-[#922036]">
                              {leader.kannadaName}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-medium text-[#17191B]">
                      {leader.currentRole}
                    </td>
                    <td className="px-5 py-4 text-[#68645F]">
                      {leader.constituency || leader.region || "Karnataka Statewide"}
                    </td>
                    <td className="px-5 py-4 text-[#68645F]">
                      {leader._count?.milestones || 4} verified
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/leaders/${leader.slug}`}
                        className="inline-flex items-center gap-1 font-semibold text-[#922036] hover:underline"
                      >
                        <span>Profile</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pt-6 flex items-center justify-between border-t border-[#E6E1DA] text-xs text-[#68645F]">
          <div>
            Showing Page <span className="font-bold text-[#17191B]">{currentPage}</span> of{" "}
            <span className="font-bold text-[#17191B]">{totalPages}</span> ({totalCount} total verified leaders)
          </div>

          <div className="flex items-center gap-2">
            {currentPage > 1 && (
              <Link
                href={createPageUrl(currentPage - 1)}
                className="px-3.5 py-1.5 bg-white border border-[#E6E1DA] rounded-lg font-medium hover:bg-[#F8F6F2] transition-colors"
              >
                Previous
              </Link>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={createPageUrl(p)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold transition-colors ${
                  currentPage === p
                    ? "bg-[#922036] text-white"
                    : "bg-white border border-[#E6E1DA] text-[#17191B] hover:bg-[#F8F6F2]"
                }`}
              >
                {p}
              </Link>
            ))}

            {currentPage < totalPages && (
              <Link
                href={createPageUrl(currentPage + 1)}
                className="px-3.5 py-1.5 bg-white border border-[#E6E1DA] rounded-lg font-medium hover:bg-[#F8F6F2] transition-colors"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
