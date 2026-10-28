import prisma from "./prisma";
import { Prisma } from "@prisma/client";

export interface LogAuditOptions {
  organisationId: string;
  actorId?: string | null;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
}

export async function logAuditEvent({
  organisationId,
  actorId,
  action,
  entityType,
  entityId,
  metadata = {},
}: LogAuditOptions) {
  try {
    // Sanitize metadata to never contain passwords, tokens, or private secrets
    const sanitizedMeta = { ...metadata };
    delete sanitizedMeta.password;
    delete sanitizedMeta.passwordHash;
    delete sanitizedMeta.token;
    delete sanitizedMeta.secret;

    return await prisma.auditEvent.create({
      data: {
        organisationId,
        actorId: actorId || null,
        action,
        entityType,
        entityId,
        metadata: sanitizedMeta as Prisma.InputJsonValue,
      },
    });
  } catch (error) {
    console.error("Failed to write audit event:", error);
  }
}
