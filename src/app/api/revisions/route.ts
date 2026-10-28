import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";
import { PublicationStatus, ReviewStatus, Role, Prisma } from "@prisma/client";

const submitRevisionSchema = z.object({
  profileId: z.string().min(1),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const authRes = await requireAuth(req, [Role.PLATFORM_ADMIN, Role.ORGANISATION_ADMIN, Role.EDITOR]);
  if (authRes instanceof NextResponse) return authRes;
  const { session } = authRes;

  try {
    const body = await req.json();
    const result = submitRevisionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid profile ID" }, { status: 400 });
    }

    const { profileId } = result.data;

    const profile = await prisma.leaderProfile.findFirst({
      where: { id: profileId, organisationId: session.organisationId },
      include: {
        milestones: {
          orderBy: { sortOrder: "asc" },
          include: { claimSources: { include: { source: true } } },
        },
        initiatives: {
          orderBy: { startDate: "desc" },
          include: { claimSources: { include: { source: true } } },
        },
        revisions: {
          orderBy: { version: "desc" },
          take: 1,
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const nextVersion = (profile.revisions[0]?.version || 0) + 1;

    // Build immutable content snapshot
    const contentSnapshot = {
      displayName: profile.displayName,
      kannadaName: profile.kannadaName,
      shortBio: profile.shortBio,
      biography: profile.biography,
      currentRole: profile.currentRole,
      organisationName: profile.organisationName,
      region: profile.region,
      constituency: profile.constituency,
      portraitUrl: profile.portraitUrl,
      roleLastVerifiedAt: profile.roleLastVerifiedAt?.toISOString(),
      milestones: profile.milestones.map((m) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        eventYear: m.eventYear,
        eventDate: m.eventDate?.toISOString(),
        verificationStatus: m.verificationStatus,
        sources: m.claimSources.map((cs) => ({
          title: cs.source.title,
          url: cs.source.url,
          publisher: cs.source.publisher,
        })),
      })),
      initiatives: profile.initiatives.map((i) => ({
        id: i.id,
        title: i.title,
        description: i.description,
        startDate: i.startDate?.toISOString(),
        endDate: i.endDate?.toISOString(),
        verificationStatus: i.verificationStatus,
      })),
    };

    const revision = await prisma.$transaction(async (tx) => {
      const rev = await tx.revision.create({
        data: {
          profileId,
          version: nextVersion,
          contentSnapshot: contentSnapshot as unknown as Prisma.InputJsonValue,
          reviewStatus: ReviewStatus.IN_REVIEW,
          submittedById: session.userId,
          submittedAt: new Date(),
        },
      });

      await tx.leaderProfile.update({
        where: { id: profileId },
        data: { publicationStatus: PublicationStatus.IN_REVIEW },
      });

      return rev;
    });

    await logAuditEvent({
      organisationId: session.organisationId,
      actorId: session.userId,
      action: "REVISION_SUBMITTED",
      entityType: "Revision",
      entityId: revision.id,
      metadata: { profileId, version: nextVersion, displayName: profile.displayName },
    });

    return NextResponse.json({
      success: true,
      message: `Revision v${nextVersion} submitted for editorial review.`,
      revision,
    });
  } catch (error) {
    console.error("Error submitting revision:", error);
    return NextResponse.json({ error: "Failed to submit revision" }, { status: 500 });
  }
}
