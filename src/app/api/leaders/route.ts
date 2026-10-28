import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";
import { PublicationStatus, ReviewStatus, Role } from "@prisma/client";

const createLeaderSchema = z.object({
  displayName: z.string().min(2, "Display name must be at least 2 characters"),
  kannadaName: z.string().optional(),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
  currentRole: z.string().min(2, "Current role is required"),
  organisationName: z.string().optional().default("Government of Karnataka"),
  region: z.string().optional(),
  constituency: z.string().optional(),
  shortBio: z.string().min(10, "Short bio must be at least 10 characters"),
  biography: z.string().min(20, "Biography must be at least 20 characters"),
  portraitUrl: z.string().url().optional().or(z.literal("")),
});

export async function GET(req: NextRequest) {
  const authRes = await requireAuth(req);
  if (authRes instanceof NextResponse) return authRes;
  const { session } = authRes;

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status");

  try {
    const whereClause: Record<string, unknown> = {
      organisationId: session.organisationId,
    };

    if (status && status !== "ALL") {
      whereClause.publicationStatus = status as PublicationStatus;
    }

    if (search) {
      whereClause.OR = [
        { displayName: { contains: search, mode: "insensitive" } },
        { currentRole: { contains: search, mode: "insensitive" } },
        { constituency: { contains: search, mode: "insensitive" } },
      ];
    }

    const profiles = await prisma.leaderProfile.findMany({
      where: whereClause,
      include: {
        _count: {
          select: {
            milestones: true,
            initiatives: true,
            revisions: true,
            consentRecords: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ profiles });
  } catch (error) {
    console.error("Error listing admin profiles:", error);
    return NextResponse.json({ error: "Failed to list profiles" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authRes = await requireAuth(req, [Role.PLATFORM_ADMIN, Role.ORGANISATION_ADMIN, Role.EDITOR]);
  if (authRes instanceof NextResponse) return authRes;
  const { session } = authRes;

  try {
    const body = await req.json();
    const result = createLeaderSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = result.data;

    // Check slug uniqueness within organisation
    const existing = await prisma.leaderProfile.findUnique({
      where: {
        organisationId_slug: {
          organisationId: session.organisationId,
          slug: data.slug,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: `A profile with slug "${data.slug}" already exists in this organisation.` },
        { status: 409 }
      );
    }

    const profile = await prisma.leaderProfile.create({
      data: {
        organisationId: session.organisationId,
        slug: data.slug,
        displayName: data.displayName,
        kannadaName: data.kannadaName || null,
        currentRole: data.currentRole,
        organisationName: data.organisationName || "Government of Karnataka",
        region: data.region || null,
        constituency: data.constituency || null,
        shortBio: data.shortBio,
        biography: data.biography,
        portraitUrl: data.portraitUrl || null,
        publicationStatus: PublicationStatus.DRAFT,
        roleLastVerifiedAt: new Date(),
      },
    });

    // Create initial revision snapshot
    const initialSnapshot = {
      displayName: profile.displayName,
      kannadaName: profile.kannadaName,
      currentRole: profile.currentRole,
      shortBio: profile.shortBio,
      biography: profile.biography,
      region: profile.region,
      constituency: profile.constituency,
      milestones: [],
      initiatives: [],
      sources: [],
    };

    await prisma.revision.create({
      data: {
        profileId: profile.id,
        version: 1,
        contentSnapshot: initialSnapshot,
        reviewStatus: ReviewStatus.DRAFT,
        submittedById: session.userId,
      },
    });

    // Create default consent record requirement
    await prisma.consentRecord.create({
      data: {
        organisationId: session.organisationId,
        profileId: profile.id,
        grantedBy: "Pending Verification / Editorial Review",
        scope: "PROFILE_PUBLICATION",
        grantedAt: new Date(),
        reviewStatus: "NEEDS_REVIEW",
        notes: "Auto-generated consent record pending documentary verification.",
      },
    });

    await logAuditEvent({
      organisationId: session.organisationId,
      actorId: session.userId,
      action: "PROFILE_CREATED",
      entityType: "LeaderProfile",
      entityId: profile.id,
      metadata: { displayName: profile.displayName, slug: profile.slug },
    });

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("Error creating leader profile:", error);
    return NextResponse.json({ error: "Failed to create profile" }, { status: 500 });
  }
}
