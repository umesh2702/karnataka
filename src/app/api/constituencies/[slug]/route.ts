import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionFromRequest, requireAuth } from "@/lib/auth";
import { PublicationStatus, Role } from "@prisma/client";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params;

  try {
    const constituency = await prisma.constituency.findUnique({
      where: { slug },
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
            district: true,
            shortBio: true,
            portraitUrl: true,
            publicationStatus: true,
            roleLastVerifiedAt: true,
          },
        },
        projects: {
          where: {
            publicationStatus: PublicationStatus.PUBLISHED,
          },
          orderBy: { announcedDate: "desc" },
        },
      },
    });

    if (!constituency) {
      return NextResponse.json({ error: "Constituency not found" }, { status: 404 });
    }

    const session = await getSessionFromRequest(req);
    // Zero data leakage: if representative exists but is not published, hide from public
    if (constituency.representative && constituency.representative.publicationStatus !== "PUBLISHED" && !session) {
      constituency.representative = null;
    }

    return NextResponse.json({ constituency });
  } catch (error) {
    console.error("Error fetching constituency:", error);
    return NextResponse.json({ error: "Failed to fetch constituency" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  props: { params: Promise<{ slug: string }> }
) {
  const authRes = await requireAuth(req, [Role.PLATFORM_ADMIN, Role.ORGANISATION_ADMIN, Role.EDITOR]);
  if (authRes instanceof NextResponse) return authRes;

  const { slug } = await props.params;

  try {
    const body = await req.json();

    const updated = await prisma.constituency.update({
      where: { slug },
      data: {
        name: body.name,
        kannadaName: body.kannadaName,
        district: body.district,
        region: body.region,
        reservation: body.reservation,
        totalElectors: body.totalElectors ? parseInt(body.totalElectors, 10) : undefined,
        summary: body.summary,
        representativeId: body.representativeId || null,
        status: body.status,
      },
      include: {
        representative: true,
      },
    });

    return NextResponse.json({ constituency: updated });
  } catch (error) {
    console.error("Error updating constituency:", error);
    return NextResponse.json({ error: "Failed to update constituency" }, { status: 500 });
  }
}
