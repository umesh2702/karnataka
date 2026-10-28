import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";
import { PublicationStatus, Role } from "@prisma/client";

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
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const updated = await prisma.leaderProfile.update({
      where: { id },
      data: {
        publicationStatus: PublicationStatus.DRAFT,
        // We keep publishedRevisionId in history or clear it
        updatedAt: new Date(),
      },
    });

    await logAuditEvent({
      organisationId: session.organisationId,
      actorId: session.userId,
      action: "PROFILE_UNPUBLISHED",
      entityType: "LeaderProfile",
      entityId: id,
      metadata: { displayName: profile.displayName },
    });

    return NextResponse.json({
      success: true,
      message: `Profile "${profile.displayName}" has been unpublished and returned to Draft status.`,
      profile: updated,
    });
  } catch (error) {
    console.error("Error unpublishing profile:", error);
    return NextResponse.json({ error: "Failed to unpublish profile" }, { status: 500 });
  }
}
