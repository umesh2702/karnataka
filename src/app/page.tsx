import React from "react";
import prisma from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HomeHeroAndMap from "@/components/home/HomeHeroAndMap";
import { PublicationStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "UCreates — Karnataka Congress Leadership & Constituency Platform",
  description:
    "Institutional governance, assembly constituency documentation and public-engagement platform for the Indian National Congress in Karnataka, powered by UCreates.",
};

export default async function HomePage() {
  const [publishedProfiles, constituencies, schemes, projects] = await Promise.all([
    prisma.leaderProfile.findMany({
      where: { publicationStatus: PublicationStatus.PUBLISHED },
      include: {
        _count: { select: { milestones: true, initiatives: true, projects: true } },
      },
      orderBy: { displayName: "asc" },
    }),
    prisma.constituency.findMany({
      where: { status: "ACTIVE" },
      include: {
        representative: {
          select: {
            id: true,
            slug: true,
            displayName: true,
            kannadaName: true,
            currentRole: true,
            party: true,
            portraitUrl: true,
            publicationStatus: true,
          },
        },
        _count: { select: { projects: true } },
      },
      orderBy: { number: "asc" },
    }),
    prisma.governmentScheme.findMany({
      where: { publicationStatus: PublicationStatus.PUBLISHED },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.workProject.findMany({
      where: { publicationStatus: PublicationStatus.PUBLISHED },
      include: {
        constituency: {
          select: { name: true, number: true, district: true, slug: true },
        },
        leaderProfile: {
          select: { displayName: true, slug: true, currentRole: true },
        },
      },
      orderBy: { announcedDate: "desc" },
      take: 6,
    }),
  ]);

  // CM & DCM records
  const cmProfile = publishedProfiles.find((p) => p.slug === "siddaramaiah") || null;
  const dcmProfile = publishedProfiles.find((p) => p.slug === "dk-shivakumar") || null;

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F6F2]">
      <Navbar />

      <main className="flex-1">
        <HomeHeroAndMap
          publishedProfiles={publishedProfiles}
          cmProfile={cmProfile}
          dcmProfile={dcmProfile}
          constituencies={constituencies}
          schemes={schemes}
          projects={projects}
        />
      </main>

      <Footer />
    </div>
  );
}
