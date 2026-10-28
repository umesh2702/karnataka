import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";
import { SourceType, VerificationStatus, Role } from "@prisma/client";

const sourceSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  url: z.string().url("Must be a valid URL"),
  publisher: z.string().min(2, "Publisher is required"),
  sourceType: z.nativeEnum(SourceType),
  publicationDate: z.string().optional().nullable(),
  verificationStatus: z.nativeEnum(VerificationStatus).default(VerificationStatus.UNCHECKED),
  notes: z.string().optional().nullable(),
});

export async function GET(req: NextRequest) {
  const authRes = await requireAuth(req);
  if (authRes instanceof NextResponse) return authRes;
  const { session } = authRes;

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status");

  try {
    const where: Record<string, unknown> = {
      organisationId: session.organisationId,
    };

    if (status && status !== "ALL") {
      where.verificationStatus = status as VerificationStatus;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { publisher: { contains: search, mode: "insensitive" } },
        { url: { contains: search, mode: "insensitive" } },
      ];
    }

    const sources = await prisma.source.findMany({
      where,
      include: {
        createdBy: { select: { id: true, name: true } },
        claimSources: {
          include: {
            milestone: {
              include: { profile: { select: { id: true, displayName: true, slug: true } } },
            },
            initiative: {
              include: { profile: { select: { id: true, displayName: true, slug: true } } },
            },
            profile: { select: { id: true, displayName: true, slug: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ sources });
  } catch (error) {
    console.error("Error fetching sources:", error);
    return NextResponse.json({ error: "Failed to fetch sources" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authRes = await requireAuth(req, [Role.PLATFORM_ADMIN, Role.ORGANISATION_ADMIN, Role.EDITOR, Role.REVIEWER]);
  if (authRes instanceof NextResponse) return authRes;
  const { session } = authRes;

  try {
    const body = await req.json();
    const result = sourceSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = result.data;

    const source = await prisma.source.create({
      data: {
        organisationId: session.organisationId,
        title: data.title,
        url: data.url,
        publisher: data.publisher,
        sourceType: data.sourceType,
        publicationDate: data.publicationDate ? new Date(data.publicationDate) : null,
        checkedAt: new Date(),
        verificationStatus: data.verificationStatus,
        notes: data.notes || null,
        createdById: session.userId,
      },
    });

    await logAuditEvent({
      organisationId: session.organisationId,
      actorId: session.userId,
      action: "SOURCE_REGISTERED",
      entityType: "Source",
      entityId: source.id,
      metadata: { title: source.title, publisher: source.publisher, status: source.verificationStatus },
    });

    return NextResponse.json({ success: true, source });
  } catch (error) {
    console.error("Error creating source:", error);
    return NextResponse.json({ error: "Failed to create source" }, { status: 500 });
  }
}
