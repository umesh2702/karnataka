import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { logAuditEvent } from "@/lib/audit";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  const authRes = await requireAuth(req);
  if (authRes instanceof NextResponse) return authRes;
  const { session } = authRes;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const altText = (formData.get("altText") as string) || "Leader portrait asset";
    const attribution = (formData.get("attribution") as string) || "Permitted public domain reference";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Supported formats: JPEG, PNG, WebP, AVIF." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File exceeds 5MB size limit." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const ext = file.name.split(".").pop() || "jpg";
    const safeFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
    const filePath = path.join(uploadsDir, safeFilename);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${safeFilename}`;

    const mediaAsset = await prisma.mediaAsset.create({
      data: {
        organisationId: session.organisationId,
        storageKey: safeFilename,
        url: publicUrl,
        mimeType: file.type,
        sizeBytes: file.size,
        altText,
        attribution,
        rightsStatus: "PERMITTED",
      },
    });

    await logAuditEvent({
      organisationId: session.organisationId,
      actorId: session.userId,
      action: "MEDIA_UPLOADED",
      entityType: "MediaAsset",
      entityId: mediaAsset.id,
      metadata: { filename: safeFilename, sizeBytes: file.size },
    });

    return NextResponse.json({
      success: true,
      url: publicUrl,
      mediaAsset,
    });
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
