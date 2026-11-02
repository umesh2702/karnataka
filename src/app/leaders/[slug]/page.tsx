import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ChiefMinisterProfileView from "@/components/profile/ChiefMinisterProfileView";
import DeputyChiefMinisterProfileView from "@/components/profile/DeputyChiefMinisterProfileView";
import CabinetMinisterProfileView from "@/components/profile/CabinetMinisterProfileView";
import { PublicationStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

interface LeaderPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: LeaderPageProps): Promise<Metadata> {
  const { slug } = await params;

  const profile = await prisma.leaderProfile.findFirst({
    where: {
      slug,
      publicationStatus: PublicationStatus.PUBLISHED,
    },
  });

  if (!profile) {
    return { title: "Profile Not Found | UCreates Leadership Showcase" };
  }

  const title = `${profile.displayName} — ${profile.currentRole} | Karnataka Congress Platform`;
  const description = profile.shortBio;
  const canonicalUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3002"}/leaders/${profile.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: profile.portraitUrl ? [{ url: profile.portraitUrl }] : [],
      type: "profile",
    },
  };
}

export default async function LeaderProfilePage({ params }: LeaderPageProps) {
  const { slug } = await params;

  // Retrieve published profile only (zero data leakage for drafts/in-review)
  const profile = await prisma.leaderProfile.findFirst({
    where: {
      slug,
      publicationStatus: PublicationStatus.PUBLISHED,
    },
    include: {
      milestones: {
        orderBy: { sortOrder: "asc" },
        include: {
          claimSources: {
            include: { source: true },
          },
        },
      },
      initiatives: {
        orderBy: { startDate: "desc" },
        include: {
          claimSources: {
            include: { source: true },
          },
        },
      },
      projects: {
        where: { publicationStatus: PublicationStatus.PUBLISHED },
        orderBy: { announcedDate: "desc" },
      },
      revisions: {
        where: { reviewStatus: "PUBLISHED" },
        orderBy: { version: "desc" },
        take: 1,
      },
    },
  });

  if (!profile) {
    notFound();
  }

  // The 6 showcase leadership slugs for smooth profile-to-profile cross-navigation
  const showcaseSlugs = [
    "dk-shivakumar",
    "g-parameshwara",
    "priyank-kharge",
    "mb-patil",
    "satish-jarkiholi",
    "krishna-byre-gowda",
  ];

  const relatedLeaders = await prisma.leaderProfile.findMany({
    where: {
      publicationStatus: PublicationStatus.PUBLISHED,
      slug: {
        in: showcaseSlugs.filter((s) => s !== profile.slug),
      },
    },
    select: {
      id: true,
      slug: true,
      displayName: true,
      kannadaName: true,
      currentRole: true,
      portraitUrl: true,
      constituency: true,
    },
    take: 5,
  });

  // Collect all verified sources attached to milestones and initiatives
  const allSourcesMap = new Map<
    string,
    {
      id: string;
      title: string;
      url: string;
      publisher: string;
      sourceType: string;
      publicationDate?: Date | string | null;
      checkedAt: Date | string;
      notes?: string | null;
    }
  >();

  profile.milestones.forEach((m) => {
    m.claimSources.forEach((cs) => {
      allSourcesMap.set(cs.source.id, cs.source);
    });
  });

  profile.initiatives.forEach((i) => {
    i.claimSources.forEach((cs) => {
      allSourcesMap.set(cs.source.id, cs.source);
    });
  });

  const uniqueSources = Array.from(allSourcesMap.values());

  // Structured Data (JSON-LD) for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.displayName,
    alternateName: profile.kannadaName || undefined,
    jobTitle: profile.currentRole,
    worksFor: {
      "@type": "Organization",
      name: profile.organisationName || "Government of Karnataka",
    },
    description: profile.shortBio,
    image: profile.portraitUrl || undefined,
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F6F2]">
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <main className="flex-1 w-full">
        {/* Render Unique Profile Experience based on designation */}
        {profile.slug === "dk-shivakumar" ? (
          <ChiefMinisterProfileView
            profile={profile}
            sources={uniqueSources}
            relatedLeaders={relatedLeaders}
          />
        ) : profile.slug === "g-parameshwara" ? (
          <DeputyChiefMinisterProfileView
            profile={profile}
            sources={uniqueSources}
            relatedLeaders={relatedLeaders}
          />
        ) : (
          <CabinetMinisterProfileView
            profile={profile}
            sources={uniqueSources}
            relatedLeaders={relatedLeaders}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
