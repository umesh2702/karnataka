import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";
import { validatePublicationPrerequisites } from "@/lib/workflow";
import { PublicationStatus, ReviewStatus, Role } from "@prisma/client";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authRes = await requireAuth(req, [Role.PLATFORM_ADMIN, Role.ORGANISATION_ADMIN, Role.REVIEWER]);
  if (authRes instanceof NextResponse) return authRes;
  const { session } = authRes;
  const { id } = await params;

  try {
    const profile = await prisma.leaderProfile.findFirst({
      where: { id, organisationId: session.organisationId },
      include: {
        revisions: {
          where: { reviewStatus: ReviewStatus.APPROVED },
          orderBy: { version: "desc" },
          take: 1,
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Check prerequisites: approved revision & valid consent record
    const prereq = await validatePublicationPrerequisites(id);
    if (!prereq.valid) {
      return NextResponse.json({ error: prereq.reason }, { status: 422 });
    }

    const latestApprovedRevision = profile.revisions[0];

    // Atomically publish
    const updated = await prisma.$transaction(async (tx) => {
      // Mark revision as published
      await tx.revision.update({
        where: { id: latestApprovedRevision.id },
        data: { reviewStatus: ReviewStatus.PUBLISHED },
      });

      // Update profile status & snapshot pointer
      return await tx.leaderProfile.update({
        where: { id },
        data: {
          publicationStatus: PublicationStatus.PUBLISHED,
          publishedRevisionId: latestApprovedRevision.id,
          updatedAt: new Date(),
        },
      });
    });

    await logAuditEvent({
      organisationId: session.organisationId,
      actorId: session.userId,
      action: "PROFILE_PUBLISHED",
      entityType: "LeaderProfile",
      entityId: id,
      metadata: {
        publishedRevisionId: latestApprovedRevision.id,
        version: latestApprovedRevision.version,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Profile "${profile.displayName}" is now live and published!`,
      profile: updated,
    });
  } catch (error) {
    console.error("Error publishing profile:", error);
    return NextResponse.json({ error: "Failed to publish profile" }, { status: 500 });
  }
}
