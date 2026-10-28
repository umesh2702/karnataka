import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const authRes = await requireAuth(req);
  if (authRes instanceof NextResponse) return authRes;
  const { session } = authRes;

  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "50", 10);

  try {
    const events = await prisma.auditEvent.findMany({
      where: { organisationId: session.organisationId },
      orderBy: { createdAt: "desc" },
      take: Math.min(limit, 100),
    });

    // Populate actor names if actorId present
    const actorIds = events.map((e) => e.actorId).filter(Boolean) as string[];
    const users = await prisma.user.findMany({
      where: { id: { in: actorIds } },
      select: { id: true, name: true, email: true },
    });
    const userMap = new Map(users.map((u) => [u.id, u]));

    const enriched = events.map((e) => ({
      ...e,
      actor: e.actorId ? userMap.get(e.actorId) || null : null,
    }));

    return NextResponse.json({ events: enriched });
  } catch (error) {
    console.error("Error fetching audit events:", error);
    return NextResponse.json({ error: "Failed to fetch audit events" }, { status: 500 });
  }
}
