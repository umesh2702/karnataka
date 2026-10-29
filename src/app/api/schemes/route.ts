import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionFromRequest, requireAuth } from "@/lib/auth";
import { PublicationStatus, Role, VerificationStatus } from "@prisma/client";
import { z } from "zod";

const createSchemeSchema = z.object({
  name: z.string().min(2),
  kannadaName: z.string().optional(),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  tagline: z.string().min(5),
  description: z.string().min(20),
  department: z.string().min(2),
  eligibility: z.string().min(10),
  benefits: z.string().min(10),
  applicationUrl: z.string().url().optional().or(z.literal("")),
  officialSourceUrl: z.string().url(),
  sortOrder: z.number().int().optional().default(0),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);

    // If authenticated admin/editor/reviewer, allow seeing drafts; otherwise only PUBLISHED
    const where: Record<string, unknown> = {};
    if (!session) {
      where.publicationStatus = PublicationStatus.PUBLISHED;
    }

    const schemes = await prisma.governmentScheme.findMany({
      where,
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({ schemes });
  } catch (error) {
    console.error("Error fetching schemes:", error);
    return NextResponse.json({ error: "Failed to fetch schemes" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authRes = await requireAuth(req, [Role.PLATFORM_ADMIN, Role.ORGANISATION_ADMIN, Role.EDITOR]);
  if (authRes instanceof NextResponse) return authRes;
  const { session } = authRes;

  try {
    const body = await req.json();
    const result = createSchemeSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = result.data;

    const existing = await prisma.governmentScheme.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: `A scheme with slug "${data.slug}" already exists.` },
        { status: 409 }
      );
    }

    const scheme = await prisma.governmentScheme.create({
      data: {
        organisationId: session.organisationId,
        slug: data.slug,
        name: data.name,
        kannadaName: data.kannadaName,
        tagline: data.tagline,
        description: data.description,
        department: data.department,
        eligibility: data.eligibility,
        benefits: data.benefits,
        applicationUrl: data.applicationUrl || null,
        officialSourceUrl: data.officialSourceUrl,
        verificationStatus: VerificationStatus.VERIFIED,
        publicationStatus: PublicationStatus.PUBLISHED,
        sortOrder: data.sortOrder,
      },
    });

    return NextResponse.json({ scheme }, { status: 201 });
  } catch (error) {
    console.error("Error creating scheme:", error);
    return NextResponse.json({ error: "Failed to create scheme" }, { status: 500 });
  }
}
