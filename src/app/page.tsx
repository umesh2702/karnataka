import React from "react";
import prisma from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HomeHeroAndMap from "@/components/home/HomeHeroAndMap";
import { PublicationStatus, VerificationStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Karnataka Congress — Official Digital Platform | ಕರ್ನಾಟಕ ಪ್ರದೇಶ ಕಾಂಗ್ರೆಸ್ ಸಮಿತಿ",
  description:
    "Official digital leadership, governance and citizen engagement platform of the Karnataka Pradesh Congress Committee (KPCC). Documenting executive leadership portfolios, flagship welfare guarantees, and verifiable public service records.",
};

export default async function HomePage() {
  const showcaseSlugs = [
    "dk-shivakumar",
    "g-parameshwara",
    "priyank-kharge",
    "mb-patil",
    "satish-jarkiholi",
    "krishna-byre-gowda",
  ];

  const [publishedProfiles, schemes, projects] = await Promise.all([
    prisma.leaderProfile.findMany({
      where: {
        publicationStatus: PublicationStatus.PUBLISHED,
        slug: { in: showcaseSlugs },
      },
      include: {
        _count: { select: { milestones: true, initiatives: true, projects: true } },
      },
      orderBy: { displayName: "asc" },
    }),
    prisma.governmentScheme.findMany({
      where: { publicationStatus: PublicationStatus.PUBLISHED },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.workProject.findMany({
      where: {
        publicationStatus: PublicationStatus.PUBLISHED,
        verificationStatus: VerificationStatus.VERIFIED,
      },
      include: {
        constituency: {
          select: { name: true, number: true, district: true, slug: true },
        },
        leaderProfile: {
          select: { displayName: true, slug: true, currentRole: true },
        },
      },
      orderBy: { announcedDate: "desc" },
      take: 8,
    }),
  ]);

  // CM & DCM records
  const cmProfile = publishedProfiles.find((p) => p.slug === "dk-shivakumar") || null;
  const dcmProfile = publishedProfiles.find((p) => p.slug === "g-parameshwara") || null;

  // Selected 4 Cabinet Ministers
  const cabinetMinisters = publishedProfiles.filter((p) =>
    ["priyank-kharge", "mb-patil", "satish-jarkiholi", "krishna-byre-gowda"].includes(p.slug)
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F6F2]">
      <Navbar />

      <main className="flex-1">
        <HomeHeroAndMap
          publishedProfiles={publishedProfiles}
          cmProfile={cmProfile}
          dcmProfile={dcmProfile}
          cabinetMinisters={cabinetMinisters}
          schemes={schemes}
          projects={projects}
        />
      </main>

      <Footer />
    </div>
  );
}
