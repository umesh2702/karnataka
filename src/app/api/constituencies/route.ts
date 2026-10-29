import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionFromRequest, requireAuth } from "@/lib/auth";
import { ReservationType, Role } from "@prisma/client";
import { z } from "zod";

const createConstituencySchema = z.object({
  number: z.number().int().positive(),
  name: z.string().min(2),
  kannadaName: z.string().optional(),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  district: z.string().min(2),
  region: z.string().min(2),
  reservation: z.nativeEnum(ReservationType).default(ReservationType.GENERAL),
  totalElectors: z.number().int().positive().optional(),
  summary: z.string().optional(),
  representativeId: z.string().optional().nullable(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const district = searchParams.get("district");
  const region = searchParams.get("region");
  const reservation = searchParams.get("reservation");
  const search = searchParams.get("search");

  try {
    const where: Record<string, unknown> = {
      status: "ACTIVE",
    };

    if (district && district !== "ALL") {
      where.district = { contains: district, mode: "insensitive" };
    }

    if (region && region !== "ALL") {
      where.region = { contains: region, mode: "insensitive" };
    }

    if (reservation && reservation !== "ALL") {
      where.reservation = reservation as ReservationType;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { kannadaName: { contains: search, mode: "insensitive" } },
        { district: { contains: search, mode: "insensitive" } },
      ];
    }

    const constituencies = await prisma.constituency.findMany({
      where,
      include: {
        representative: {
          select: {
            id: true,
            slug: true,
            displayName: true,
            kannadaName: true,
            currentRole: true,
            party: true,
            portfolio: true,
            portraitUrl: true,
            publicationStatus: true,
          },
        },
        _count: {
          select: {
            projects: true,
          },
        },
      },
      orderBy: { number: "asc" },
    });

    // Security check: if representative is not PUBLISHED, mask it from public view unless admin
    const session = await getSessionFromRequest(req);
    const sanitized = constituencies.map((c) => {
      if (c.representative && c.representative.publicationStatus !== "PUBLISHED" && !session) {
        return { ...c, representative: null };
      }
      return c;
    });

    return NextResponse.json({ constituencies: sanitized });
  } catch (error) {
    console.error("Error fetching constituencies:", error);
    return NextResponse.json({ error: "Failed to fetch constituencies" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authRes = await requireAuth(req, [Role.PLATFORM_ADMIN, Role.ORGANISATION_ADMIN, Role.EDITOR]);
  if (authRes instanceof NextResponse) return authRes;
  const { session } = authRes;

  try {
    const body = await req.json();
    const result = createConstituencySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = result.data;

    const existing = await prisma.constituency.findFirst({
      where: {
        OR: [{ slug: data.slug }, { number: data.number }],
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: `A constituency with slug "${data.slug}" or number "${data.number}" already exists.` },
        { status: 409 }
      );
    }

    const constituency = await prisma.constituency.create({
      data: {
        organisationId: session.organisationId,
        number: data.number,
        name: data.name,
        kannadaName: data.kannadaName,
        slug: data.slug,
        district: data.district,
        region: data.region,
        reservation: data.reservation,
        totalElectors: data.totalElectors,
        summary: data.summary,
        representativeId: data.representativeId || null,
      },
      include: {
        representative: true,
      },
    });

    return NextResponse.json({ constituency }, { status: 201 });
  } catch (error) {
    console.error("Error creating constituency:", error);
    return NextResponse.json({ error: "Failed to create constituency" }, { status: 500 });
  }
}
