import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionFromRequest, requireAuth } from "@/lib/auth";
import { ProjectStage, ProjectType, PublicationStatus, Role, VerificationStatus } from "@prisma/client";
import { z } from "zod";

const createProjectSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(15),
  constituencyId: z.string().optional().nullable(),
  leaderProfileId: z.string().optional().nullable(),
  location: z.string().optional(),
  department: z.string().optional(),
  initiativeType: z.nativeEnum(ProjectType).default(ProjectType.GOVERNMENT_PROJECT),
  stage: z.nativeEnum(ProjectStage).default(ProjectStage.APPROVED),
  budgetAmount: z.string().optional(),
  fundingSource: z.string().optional(),
  announcedDate: z.string().optional(),
  latestUpdateDate: z.string().optional(),
  evidenceUrl: z.string().url().optional().or(z.literal("")),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const stage = searchParams.get("stage");
  const type = searchParams.get("type");
  const constituencyId = searchParams.get("constituencyId");
  const leaderId = searchParams.get("leaderId");
  const search = searchParams.get("search");

  try {
    const session = await getSessionFromRequest(req);

    const where: Record<string, unknown> = {};
    if (!session) {
      where.publicationStatus = PublicationStatus.PUBLISHED;
    }

    if (stage && stage !== "ALL") {
      where.stage = stage as ProjectStage;
    }

    if (type && type !== "ALL") {
      where.initiativeType = type as ProjectType;
    }

    if (constituencyId) {
      where.constituencyId = constituencyId;
    }

    if (leaderId) {
      where.leaderProfileId = leaderId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
        { department: { contains: search, mode: "insensitive" } },
      ];
    }

    const projects = await prisma.workProject.findMany({
      where,
      include: {
        constituency: {
          select: {
            id: true,
            name: true,
            kannadaName: true,
            number: true,
            slug: true,
            district: true,
          },
        },
        leaderProfile: {
          select: {
            id: true,
            slug: true,
            displayName: true,
            kannadaName: true,
            currentRole: true,
            portraitUrl: true,
            publicationStatus: true,
          },
        },
      },
      orderBy: { announcedDate: "desc" },
    });

    // Zero unpublished leakage: mask unapproved leader references from public
    const sanitized = projects.map((p) => {
      if (p.leaderProfile && p.leaderProfile.publicationStatus !== "PUBLISHED" && !session) {
        return { ...p, leaderProfile: null };
      }
      return p;
    });

    return NextResponse.json({ projects: sanitized });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authRes = await requireAuth(req, [Role.PLATFORM_ADMIN, Role.ORGANISATION_ADMIN, Role.EDITOR]);
  if (authRes instanceof NextResponse) return authRes;
  const { session } = authRes;

  try {
    const body = await req.json();
    const result = createProjectSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = result.data;

    // Requirement: Approval/verification requires supporting source evidence
    const hasEvidence = !!data.evidenceUrl && data.evidenceUrl.length > 5;

    const project = await prisma.workProject.create({
      data: {
        organisationId: session.organisationId,
        title: data.title,
        description: data.description,
        constituencyId: data.constituencyId || null,
        leaderProfileId: data.leaderProfileId || null,
        location: data.location || null,
        department: data.department || null,
        initiativeType: data.initiativeType,
        stage: data.stage,
        budgetAmount: data.budgetAmount || null,
        fundingSource: data.fundingSource || null,
        announcedDate: data.announcedDate ? new Date(data.announcedDate) : new Date(),
        latestUpdateDate: data.latestUpdateDate ? new Date(data.latestUpdateDate) : new Date(),
        evidenceUrl: data.evidenceUrl || null,
        verificationStatus: hasEvidence ? VerificationStatus.VERIFIED : VerificationStatus.UNCHECKED,
        lastVerifiedAt: hasEvidence ? new Date() : null,
        publicationStatus: PublicationStatus.PUBLISHED,
      },
      include: {
        constituency: true,
        leaderProfile: true,
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
