import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";
import { PublicationStatus, Role, VerificationStatus } from "@prisma/client";

const updateLeaderSchema = z.object({
  displayName: z.string().min(2).optional(),
  kannadaName: z.string().optional().nullable(),
  currentRole: z.string().min(2).optional(),
  organisationName: z.string().optional().nullable(),
  region: z.string().optional().nullable(),
  constituency: z.string().optional().nullable(),
  shortBio: z.string().min(10).optional(),
  biography: z.string().min(20).optional(),
  portraitUrl: z.string().optional().nullable(),
  roleLastVerifiedAt: z.string().optional().nullable(),
  milestones: z
    .array(
      z.object({
        id: z.string().optional(),
        title: z.string().min(2),
        description: z.string().min(5),
        eventYear: z.number().int().optional().nullable(),
        eventDate: z.string().optional().nullable(),
        sortOrder: z.number().int().default(0),
        verificationStatus: z.nativeEnum(VerificationStatus).default(VerificationStatus.UNCHECKED),
        sourceIds: z.array(z.string()).optional(),
      })
    )
    .optional(),
  initiatives: z
    .array(
      z.object({
        id: z.string().optional(),
        title: z.string().min(2),
        description: z.string().min(5),
        startDate: z.string().optional().nullable(),
        endDate: z.string().optional().nullable(),
        verificationStatus: z.nativeEnum(VerificationStatus).default(VerificationStatus.UNCHECKED),
      })
    )
    .optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authRes = await requireAuth(req);
  if (authRes instanceof NextResponse) return authRes;
  const { session } = authRes;
  const { id } = await params;

  try {
    const profile = await prisma.leaderProfile.findFirst({
      where: {
        id,
        organisationId: session.organisationId,
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
        revisions: {
          orderBy: { version: "desc" },
          include: {
            submittedBy: { select: { id: true, name: true, email: true } },
            decisions: {
              include: { reviewer: { select: { id: true, name: true } } },
            },
          },
        },
        consentRecords: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "Leader profile not found" }, { status: 404 });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Error fetching leader profile:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authRes = await requireAuth(req, [Role.PLATFORM_ADMIN, Role.ORGANISATION_ADMIN, Role.EDITOR]);
  if (authRes instanceof NextResponse) return authRes;
  const { session } = authRes;
  const { id } = await params;

  try {
    const body = await req.json();
    const result = updateLeaderSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = result.data;

    const existing = await prisma.leaderProfile.findFirst({
      where: { id, organisationId: session.organisationId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Leader profile not found" }, { status: 404 });
    }

    // Update core fields conditionally
    const updatePayload: Record<string, unknown> = {};
    if (data.displayName !== undefined) updatePayload.displayName = data.displayName;
    if (data.kannadaName !== undefined) updatePayload.kannadaName = data.kannadaName;
    if (data.currentRole !== undefined) updatePayload.currentRole = data.currentRole;
    if (data.organisationName !== undefined) updatePayload.organisationName = data.organisationName;
    if (data.region !== undefined) updatePayload.region = data.region;
    if (data.constituency !== undefined) updatePayload.constituency = data.constituency;
    if (data.shortBio !== undefined) updatePayload.shortBio = data.shortBio;
    if (data.biography !== undefined) updatePayload.biography = data.biography;
    if (data.portraitUrl !== undefined) updatePayload.portraitUrl = data.portraitUrl;
    if (data.roleLastVerifiedAt !== undefined) {
      updatePayload.roleLastVerifiedAt = data.roleLastVerifiedAt ? new Date(data.roleLastVerifiedAt) : new Date();
    }

    let updated = await prisma.leaderProfile.update({
      where: { id },
      data: updatePayload,
      include: { milestones: true, initiatives: true },
    });

    // Handle Milestones updates if provided
    if (data.milestones) {
      // Re-sync milestones
      await prisma.claimSource.deleteMany({
        where: { milestone: { profileId: id } },
      });
      await prisma.milestone.deleteMany({
        where: { profileId: id },
      });

      for (let i = 0; i < data.milestones.length; i++) {
        const m = data.milestones[i];
        const createdM = await prisma.milestone.create({
          data: {
            profileId: id,
            title: m.title,
            description: m.description,
            eventYear: m.eventYear || null,
            eventDate: m.eventDate ? new Date(m.eventDate) : null,
            sortOrder: i + 1,
            verificationStatus: m.verificationStatus,
          },
        });

        if (m.sourceIds && m.sourceIds.length > 0) {
          for (const sId of m.sourceIds) {
            await prisma.claimSource.create({
              data: {
                sourceId: sId,
                milestoneId: createdM.id,
              },
            });
          }
        }
      }
    }

    // Handle Initiatives updates if provided
    if (data.initiatives) {
      await prisma.claimSource.deleteMany({
        where: { initiative: { profileId: id } },
      });
      await prisma.initiative.deleteMany({
        where: { profileId: id },
      });

      for (const init of data.initiatives) {
        await prisma.initiative.create({
          data: {
            profileId: id,
            title: init.title,
            description: init.description,
            startDate: init.startDate ? new Date(init.startDate) : null,
            endDate: init.endDate ? new Date(init.endDate) : null,
            verificationStatus: init.verificationStatus,
          },
        });
      }
    }

    updated = (await prisma.leaderProfile.findUnique({
      where: { id },
      include: { milestones: true, initiatives: true },
    })) as typeof updated;

    await logAuditEvent({
      organisationId: session.organisationId,
      actorId: session.userId,
      action: "DRAFT_UPDATED",
      entityType: "LeaderProfile",
      entityId: id,
      metadata: { displayName: updated.displayName },
    });

    return NextResponse.json({ success: true, profile: updated });
  } catch (error) {
    console.error("Error updating leader profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authRes = await requireAuth(req, [Role.PLATFORM_ADMIN, Role.ORGANISATION_ADMIN]);
  if (authRes instanceof NextResponse) return authRes;
  const { session } = authRes;
  const { id } = await params;

  try {
    const existing = await prisma.leaderProfile.findFirst({
      where: { id, organisationId: session.organisationId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    await prisma.leaderProfile.update({
      where: { id },
      data: {
        publicationStatus: PublicationStatus.ARCHIVED,
        archivedAt: new Date(),
      },
    });

    await logAuditEvent({
      organisationId: session.organisationId,
      actorId: session.userId,
      action: "PROFILE_ARCHIVED",
      entityType: "LeaderProfile",
      entityId: id,
    });

    return NextResponse.json({ success: true, message: "Profile archived successfully" });
  } catch (error) {
    console.error("Error archiving profile:", error);
    return NextResponse.json({ error: "Failed to archive profile" }, { status: 500 });
  }
}
