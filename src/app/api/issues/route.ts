import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { IssueStatus, Role } from "@prisma/client";
import { z } from "zod";

const createIssueSchema = z.object({
  constituencyId: z.string().min(1, "Constituency is required"),
  category: z.string().min(2, "Category is required"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  description: z.string().min(20, "Detailed description must be at least 20 characters"),
  citizenName: z.string().min(2, "Name is required"),
  citizenEmail: z.string().email("Valid email required").optional().or(z.literal("")),
  citizenPhone: z.string().min(10, "10-digit mobile number").max(15).optional().or(z.literal("")),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = createIssueSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = result.data;

    // Verify constituency exists
    const constituency = await prisma.constituency.findUnique({
      where: { id: data.constituencyId },
    });

    if (!constituency) {
      return NextResponse.json({ error: "Constituency not found" }, { status: 404 });
    }

    // Generate readable unique tracking code: KAR-<YEAR>-<RANDOM-HEX>
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    const trackingCode = `KAR-${new Date().getFullYear()}-${randomHex}`;

    const issue = await prisma.constituencyIssue.create({
      data: {
        constituencyId: data.constituencyId,
        trackingCode,
        category: data.category,
        subject: data.subject,
        description: data.description,
        citizenName: data.citizenName,
        citizenEmail: data.citizenEmail || null,
        citizenPhone: data.citizenPhone || null,
        status: IssueStatus.SUBMITTED,
      },
    });

    return NextResponse.json(
      {
        success: true,
        trackingCode: issue.trackingCode,
        message: "Your issue has been recorded under Karnataka citizen governance documentation. Please preserve your tracking code.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating citizen issue:", error);
    return NextResponse.json({ error: "Failed to record issue" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const authRes = await requireAuth(req, [Role.PLATFORM_ADMIN, Role.ORGANISATION_ADMIN, Role.REVIEWER, Role.EDITOR]);
  if (authRes instanceof NextResponse) return authRes;

  const { searchParams } = new URL(req.url);
  const constituencyId = searchParams.get("constituencyId");
  const status = searchParams.get("status");

  try {
    const where: Record<string, unknown> = {};
    if (constituencyId) where.constituencyId = constituencyId;
    if (status && status !== "ALL") where.status = status as IssueStatus;

    const issues = await prisma.constituencyIssue.findMany({
      where,
      include: {
        constituency: {
          select: {
            name: true,
            number: true,
            district: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ issues });
  } catch (error) {
    console.error("Error fetching issues:", error);
    return NextResponse.json({ error: "Failed to fetch issues" }, { status: 500 });
  }
}
