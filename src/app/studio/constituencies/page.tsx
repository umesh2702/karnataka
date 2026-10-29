import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ReservationType } from "@prisma/client";
import {
  MapPin,
  Search,
  ExternalLink,
  Users,
  Compass,
  Layers,
  Building2,
  CheckCircle2,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface ConstituenciesManagerProps {
  searchParams: Promise<{
    search?: string;
    district?: string;
    reservation?: string;
  }>;
}

export default async function ConstituenciesManagerPage({
  searchParams,
}: ConstituenciesManagerProps) {
  const session = await getCurrentUser();
  if (!session) redirect("/studio/login");

  const { search, district, reservation } = await searchParams;
  const searchQuery = search || "";
  const filterDistrict = district || "ALL";
  const filterReservation = reservation || "ALL";

  const where: Record<string, unknown> = {};

  if (filterDistrict !== "ALL") {
    where.district = { equals: filterDistrict, mode: "insensitive" };
  }

  if (filterReservation !== "ALL") {
    where.reservation = filterReservation as ReservationType;
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
            currentRole: true,
            publicationStatus: true,
          },
        },
        _count: {
          select: {
            projects: true,
            issues: true,
          },
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
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E6E1DA] gap-4">
        <div>
          <span className="text-xs font-semibold text-[#922036] uppercase tracking-wider">
            Delimitation & Cartographic Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#17191B] mt-1">
            Constituencies & Representatives
          </h1>
          <p className="text-xs text-[#68645F] mt-1">
            Manage Karnataka&apos;s 224 Assembly Constituencies, representative mappings, and local projects.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/constituencies"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-[#E6E1DA] rounded-lg text-xs font-semibold text-[#17191B] hover:bg-[#F8F6F2]"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Public Explorer</span>
          </Link>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-[#E6E1DA] editorial-shadow flex flex-wrap items-center justify-between gap-4">
        <form method="GET" className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              name="search"
              defaultValue={searchQuery}
              placeholder="Search constituency or MLA..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#E6E1DA] rounded-lg text-[#17191B] focus:outline-none focus:ring-1 focus:ring-[#922036]"
            />
            <Search className="w-3.5 h-3.5 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <select
            name="district"
            defaultValue={filterDistrict}
            className="px-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#E6E1DA] rounded-lg text-[#17191B]"
          >
            <option value="ALL">All Districts</option>
            {districtList.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <select
            name="reservation"
            defaultValue={filterReservation}
            className="px-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#E6E1DA] rounded-lg text-[#17191B]"
          >
            <option value="ALL">All Reservations</option>
            <option value="GENERAL">General</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
          </select>

          <button
            type="submit"
            className="px-3.5 py-1.5 bg-[#922036] text-white text-xs font-semibold rounded-lg hover:bg-[#7A1629]"
          >
            Filter
          </button>

          {(searchQuery || filterDistrict !== "ALL" || filterReservation !== "ALL") && (
            <Link
              href="/studio/constituencies"
              className="px-3 py-1.5 border border-[#E6E1DA] text-[#68645F] text-xs font-medium rounded-lg hover:bg-[#F8F6F2]"
            >
              Reset
            </Link>
          )}
        </form>

        <span className="text-xs text-[#68645F]">
          Total: <strong>{constituencies.length}</strong> constituencies
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E6E1DA] editorial-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-[#E6E1DA] text-[#17191B] font-semibold">
              <tr>
                <th className="py-3 px-4">AC No.</th>
                <th className="py-3 px-4">Constituency Name</th>
                <th className="py-3 px-4">District & Region</th>
                <th className="py-3 px-4">Reservation</th>
                <th className="py-3 px-4">Elected Representative</th>
                <th className="py-3 px-4">Works</th>
                <th className="py-3 px-4">Enquiries</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0ECE6]">
              {constituencies.map((c) => (
                <tr key={c.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#922036]">
                    {c.number}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-serif font-bold text-[#17191B] text-sm block">
                      {c.name}
                    </span>
                    {c.kannadaName && (
                      <span className="font-kannada text-[#922036] text-xs block">
                        {c.kannadaName}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-[#17191B] block">{c.district}</span>
                    <span className="text-[#888] text-[11px]">{c.region}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.reservation === "GENERAL"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-amber-50 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {c.reservation}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {c.representative ? (
                      <div>
                        <Link
                          href={`/studio/leaders/${c.representative.id}`}
                          className="font-medium text-[#17191B] hover:text-[#922036] block"
                        >
                          {c.representative.displayName}
                        </Link>
                        <span
                          className={`inline-block text-[10px] px-1.5 rounded ${
                            c.representative.publicationStatus === "PUBLISHED"
                              ? "bg-emerald-50 text-emerald-800"
                              : "bg-amber-50 text-amber-800"
                          }`}
                        >
                          {c.representative.publicationStatus}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[#A0A2A8] italic">Unassigned</span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-medium text-[#17191B]">
                    {c._count.projects}
                  </td>
                  <td className="py-3 px-4 font-medium text-[#17191B]">
                    {c._count.issues}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/constituencies/${c.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-[#922036] font-semibold hover:underline"
                    >
                      <span>Public</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
