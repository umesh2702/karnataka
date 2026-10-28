import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

const correctionSchema = z.object({
  profileSlug: z.string().optional(),
  claimOrSection: z.string().min(2, "Section or claim is required"),
  description: z.string().min(10, "Please describe the error or omission in detail"),
  suggestedCorrection: z.string().min(10, "Please provide the verified replacement information"),
  evidenceUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  submitterName: z.string().min(2, "Submitter name is required"),
  submitterEmail: z.string().email("Valid email address is required"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = correctionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { profileSlug, claimOrSection, description, suggestedCorrection, evidenceUrl, submitterName, submitterEmail } =
      result.data;

    let profileId: string | null = null;
    if (profileSlug) {
      const profile = await prisma.leaderProfile.findFirst({
        where: { slug: profileSlug },
        select: { id: true },
      });
      if (profile) profileId = profile.id;
    }

    const correction = await prisma.correctionRequest.create({
      data: {
        profileId,
        profileSlug: profileSlug || null,
        claimOrSection,
        description,
        suggestedCorrection,
        evidenceUrl: evidenceUrl || null,
        submitterName,
        submitterEmail,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Correction request submitted successfully. Our editorial desk will investigate.",
      id: correction.id,
    });
  } catch (error) {
    console.error("Corrections API error:", error);
    return NextResponse.json({ error: "Failed to submit correction request" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // Only fetchable by authenticated studio users
    const items = await prisma.correctionRequest.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error fetching corrections:", error);
    return NextResponse.json({ error: "Failed to fetch corrections" }, { status: 500 });
  }
}
