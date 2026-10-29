import React from "react";
import prisma from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DirectoryExplorer from "@/components/leaders/DirectoryExplorer";
import { PublicationStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function LeadersDirectoryPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = props.searchParams ? await props.searchParams : {};

  const searchQuery = (typeof sp.search === "string" ? sp.search : "") || "";
  const selectedRole = (typeof sp.role === "string" ? sp.role : "") || "ALL";
  const selectedRegion = (typeof sp.region === "string" ? sp.region : "") || "ALL";
  const selectedDistrict = (typeof sp.district === "string" ? sp.district : "") || "ALL";
  const sortOrder = sp.sort === "desc" ? "desc" : "asc";
  const currentPage = parseInt((typeof sp.page === "string" ? sp.page : "1") || "1", 10);
  const pageSize = 12;

  // Build Prisma query condition
  const where: Record<string, unknown> = {
    publicationStatus: PublicationStatus.PUBLISHED,
  };

  const orConditions: Record<string, unknown>[] = [];

  if (searchQuery) {
    orConditions.push(
      { displayName: { contains: searchQuery, mode: "insensitive" } },
      { kannadaName: { contains: searchQuery, mode: "insensitive" } },
      { currentRole: { contains: searchQuery, mode: "insensitive" } },
      { constituency: { contains: searchQuery, mode: "insensitive" } },
      { region: { contains: searchQuery, mode: "insensitive" } }
    );
  }

  if (selectedDistrict !== "ALL" && selectedDistrict) {
    const dist = selectedDistrict.toLowerCase();
    // Match constituency or region for known district aliases
    const districtTerms: string[] = [dist];
    if (dist === "ramanagara") districtTerms.push("kanakapura");
    if (dist === "bangalore") districtTerms.push("bengaluru");
    if (dist === "mysore") districtTerms.push("varuna", "mysuru");
    if (dist === "tumkur") districtTerms.push("koratagere", "tumakuru");
    if (dist === "gulbarga") districtTerms.push("chittapur", "kalaburagi");
    if (dist === "bijapur") districtTerms.push("babaleshwar", "vijayapura");
    if (dist === "belgaum") districtTerms.push("yemkanmardi", "belagavi");

    orConditions.push(
      ...districtTerms.map((term) => ({
        constituency: { contains: term, mode: "insensitive" },
      })),
      ...districtTerms.map((term) => ({
        region: { contains: term, mode: "insensitive" },
      }))
    );
  }

  if (orConditions.length > 0) {
    where.OR = orConditions;
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
    <div className="flex flex-col min-h-screen bg-[#F8F6F2]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Page Header */}
        <div className="border-b border-[#E6E1DA] pb-8 mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#922036]/10 text-[#922036] text-xs font-semibold uppercase tracking-wider">
            Statewide Public Leadership Directory
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#17191B]">
            Karnataka Leadership Directory
          </h1>
          <p className="text-sm sm:text-base text-[#68645F] max-w-3xl leading-relaxed font-light">
            Verified public representatives, executive leaders, and ministers. All profiles link directly to
            official Karnataka legislative gazettes, assembly rolls, and statutory election candidate filings.
          </p>
        </div>

        {/* Directory Explorer Component (with Map/Card/Table View Switcher) */}
        <DirectoryExplorer
          initialLeaders={leaders}
          totalCount={totalCount}
          currentPage={currentPage}
          totalPages={totalPages}
          searchQuery={searchQuery}
          selectedRole={selectedRole}
          selectedRegion={selectedRegion}
          selectedDistrict={selectedDistrict}
          sortOrder={sortOrder}
          availableRoles={availableRoles}
          availableRegions={availableRegions}
        />
      </main>

      <Footer />
    </div>
  );
}
