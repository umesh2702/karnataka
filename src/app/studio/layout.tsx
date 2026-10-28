import React from "react";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/studio/Sidebar";
import StudioHeader from "@/components/studio/StudioHeader";
import prisma from "@/lib/prisma";
import { ReviewStatus } from "@prisma/client";

export default async function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentUser();

  // If no session, allow login route, otherwise redirect to login
  if (!session) {
    // Note: in Next.js App router, layout applies to subroutes. We can render children if on login page,
    // or let login page handle itself if placed outside or checked.
    // Let's pass through if session is null so login page can render!
    return <div className="min-h-screen bg-[#F7F7F4]">{children}</div>;
  }

  // Count pending reviews in queue from PostgreSQL
  const pendingReviewsCount = await prisma.revision.count({
    where: {
      reviewStatus: ReviewStatus.IN_REVIEW,
      profile: { organisationId: session.organisationId },
    },
  });

  return (
    <div className="flex min-h-screen bg-[#FAF8F5]">
      <Sidebar pendingReviewsCount={pendingReviewsCount} />
      <div className="flex-1 flex flex-col min-w-0">
        <StudioHeader
          user={{
            id: session.userId,
            name: session.name,
            email: session.email,
            role: session.role,
          }}
        />
        <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full">{children}</main>
      </div>
    </div>
  );
}
