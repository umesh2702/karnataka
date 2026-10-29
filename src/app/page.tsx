import React from "react";
import prisma from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HomeHeroAndMap from "@/components/home/HomeHeroAndMap";
import { PublicationStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch real published leadership profiles from PostgreSQL
  const publishedProfiles = await prisma.leaderProfile.findMany({
    where: { publicationStatus: PublicationStatus.PUBLISHED },
    include: {
      _count: { select: { milestones: true, initiatives: true } },
    },
    orderBy: { displayName: "asc" },
  });

  // Featured profile: D. K. Shivakumar (Chief Minister of Karnataka) as specified in Section 3 & 5
  const featured =
    publishedProfiles.find((p) => p.slug === "dk-shivakumar") || publishedProfiles[0];

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F6F2]">
      <Navbar />

      <main className="flex-1">
        <HomeHeroAndMap
          publishedProfiles={publishedProfiles}
          featuredProfile={featured}
        />
      </main>

      <Footer />
    </div>
  );
}
