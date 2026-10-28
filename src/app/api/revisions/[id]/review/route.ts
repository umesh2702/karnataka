import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { requireAuth, canApproveRevision } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";
import { DecisionType, PublicationStatus, ReviewStatus, Role } from "@prisma/client";

const reviewSchema = z.object({
  decision: z.nativeEnum(DecisionType),
  reason: z.string().min(5, "A review reason of at least 5 characters is required"),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authRes = await requireAuth(req, [Role.PLATFORM_ADMIN, Role.ORGANISATION_ADMIN, Role.REVIEWER]);
  if (authRes instanceof NextResponse) return authRes;
  const { session } = authRes;
  const { id } = await params;

  try {
    const body = await req.json();
    const result = reviewSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { decision, reason } = result.data;

    const revision = await prisma.revision.findUnique({
      where: { id },
      include: {
        profile: true,
        submittedBy: true,
      },
    });

    if (!revision || revision.profile.organisationId !== session.organisationId) {
      return NextResponse.json({ error: "Revision not found" }, { status: 404 });
    }

    // Critical Security & Workflow Rule: Prevent self-approval
    if (decision === DecisionType.APPROVED && !canApproveRevision(session.userId, revision.submittedById)) {
      // Platform admins may override, but editors/reviewers cannot approve their own submission
      if (session.role !== Role.PLATFORM_ADMIN) {
        return NextResponse.json(
          { error: "Self-approval is forbidden. An independent reviewer must approve this revision." },
          { status: 403 }
        );
      }
    }

    const newRevStatus =
      decision === DecisionType.APPROVED
        ? ReviewStatus.APPROVED
        : decision === DecisionType.REJECTED
        ? ReviewStatus.REJECTED
        : ReviewStatus.DRAFT;

    const newProfileStatus =
      decision === DecisionType.APPROVED
        ? PublicationStatus.APPROVED
        : PublicationStatus.DRAFT;

    const [reviewDecision, updatedRev] = await prisma.$transaction(async (tx) => {
      const dec = await tx.reviewDecision.create({
        data: {
          revisionId: revision.id,
          reviewerId: session.userId,
          decision,
          reason,
        },
      });

      const rev = await tx.revision.update({
        where: { id: revision.id },
        data: { reviewStatus: newRevStatus },
      });

      await tx.leaderProfile.update({
        where: { id: revision.profileId },
        data: { publicationStatus: newProfileStatus },
      });

      return [dec, rev];
    });

    await logAuditEvent({
      organisationId: session.organisationId,
      actorId: session.userId,
      action: `REVISION_${decision}`,
      entityType: "Revision",
      entityId: revision.id,
      metadata: {
        profileId: revision.profileId,
        decision,
        reason,
        version: revision.version,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Revision v${revision.version} has been ${decision.toLowerCase().replace(/_/g, " ")}.`,
      reviewDecision,
      revision: updatedRev,
    });
  } catch (error) {
    console.error("Error processing review decision:", error);
    return NextResponse.json({ error: "Failed to process review decision" }, { status: 500 });
  }
}
