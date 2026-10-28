import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";
import { ConsentScope, ConsentStatus, Role } from "@prisma/client";

const consentSchema = z.object({
  profileId: z.string().min(1),
  grantedBy: z.string().min(2, "Grantor name or legal exemption basis is required"),
  scope: z.nativeEnum(ConsentScope),
  grantedAt: z.string().optional(),
  expiresAt: z.string().optional().nullable(),
  evidenceReference: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  reviewStatus: z.nativeEnum(ConsentStatus).default(ConsentStatus.VALID),
});

export async function GET(req: NextRequest) {
  const authRes = await requireAuth(req);
  if (authRes instanceof NextResponse) return authRes;
  const { session } = authRes;

  const { searchParams } = new URL(req.url);
  const profileId = searchParams.get("profileId");

  try {
    const where: Record<string, unknown> = {
      organisationId: session.organisationId,
    };
    if (profileId) where.profileId = profileId;

    const records = await prisma.consentRecord.findMany({
      where,
      include: {
        profile: { select: { id: true, displayName: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ records });
  } catch (error) {
    console.error("Error fetching consent records:", error);
    return NextResponse.json({ error: "Failed to fetch consent records" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authRes = await requireAuth(req, [Role.PLATFORM_ADMIN, Role.ORGANISATION_ADMIN, Role.REVIEWER]);
  if (authRes instanceof NextResponse) return authRes;
  const { session } = authRes;

  try {
    const body = await req.json();
    const result = consentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = result.data;

    const profile = await prisma.leaderProfile.findFirst({
      where: { id: data.profileId, organisationId: session.organisationId },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const record = await prisma.consentRecord.create({
      data: {
        organisationId: session.organisationId,
        profileId: data.profileId,
        grantedBy: data.grantedBy,
        scope: data.scope,
        grantedAt: data.grantedAt ? new Date(data.grantedAt) : new Date(),
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        evidenceReference: data.evidenceReference || null,
        notes: data.notes || null,
        reviewStatus: data.reviewStatus,
      },
    });

    await logAuditEvent({
      organisationId: session.organisationId,
      actorId: session.userId,
      action: "PERMISSION_RECORDED",
      entityType: "ConsentRecord",
      entityId: record.id,
      metadata: { profileId: profile.id, scope: data.scope, status: data.reviewStatus },
    });

    return NextResponse.json({ success: true, record });
  } catch (error) {
    console.error("Error recording permission:", error);
    return NextResponse.json({ error: "Failed to record permission" }, { status: 500 });
  }
}
