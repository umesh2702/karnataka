import { PublicationStatus, ReviewStatus, ConsentStatus, ConsentScope } from "@prisma/client";
import prisma from "./prisma";

// Valid workflow transitions for PublicationStatus
const VALID_PUBLICATION_TRANSITIONS: Record<PublicationStatus, PublicationStatus[]> = {
  DRAFT: [PublicationStatus.IN_REVIEW, PublicationStatus.ARCHIVED],
  IN_REVIEW: [PublicationStatus.APPROVED, PublicationStatus.DRAFT, PublicationStatus.ARCHIVED],
  APPROVED: [PublicationStatus.PUBLISHED, PublicationStatus.DRAFT, PublicationStatus.ARCHIVED],
  PUBLISHED: [PublicationStatus.ARCHIVED, PublicationStatus.DRAFT],
  ARCHIVED: [PublicationStatus.DRAFT],
};

// Valid workflow transitions for ReviewStatus
const VALID_REVISION_TRANSITIONS: Record<ReviewStatus, ReviewStatus[]> = {
  DRAFT: [ReviewStatus.SUBMITTED, ReviewStatus.IN_REVIEW],
  SUBMITTED: [ReviewStatus.IN_REVIEW, ReviewStatus.DRAFT],
  IN_REVIEW: [ReviewStatus.APPROVED, ReviewStatus.REJECTED, ReviewStatus.DRAFT],
  APPROVED: [ReviewStatus.PUBLISHED, ReviewStatus.DRAFT],
  REJECTED: [ReviewStatus.DRAFT],
  PUBLISHED: [ReviewStatus.DRAFT],
};

export function isValidPublicationTransition(
  from: PublicationStatus,
  to: PublicationStatus
): boolean {
  return VALID_PUBLICATION_TRANSITIONS[from]?.includes(to) ?? false;
}

export function isValidRevisionTransition(from: ReviewStatus, to: ReviewStatus): boolean {
  return VALID_REVISION_TRANSITIONS[from]?.includes(to) ?? false;
}

/**
 * Checks consent records before publication:
 * Section 13: "Block publication when required permissions are missing, expired or revoked."
 */
export async function validatePublicationPrerequisites(profileId: string): Promise<{
  valid: boolean;
  reason?: string;
}> {
  const profile = await prisma.leaderProfile.findUnique({
    where: { id: profileId },
    include: {
      consentRecords: true,
      milestones: true,
      revisions: {
        where: { reviewStatus: ReviewStatus.APPROVED },
        orderBy: { version: "desc" },
        take: 1,
      },
    },
  });

  if (!profile) {
    return { valid: false, reason: "Leader profile not found." };
  }

  // 1. Must have an approved revision
  if (profile.revisions.length === 0) {
    return { valid: false, reason: "Profile cannot be published without an approved revision snapshot." };
  }

  // 2. Must have at least one valid PROFILE_PUBLICATION consent or documented fair-use public record
  const now = new Date();
  const validConsent = profile.consentRecords.find(
    (c) =>
      c.scope === ConsentScope.PROFILE_PUBLICATION &&
      c.reviewStatus === ConsentStatus.VALID &&
      !c.revokedAt &&
      (!c.expiresAt || c.expiresAt > now)
  );

  if (!validConsent) {
    return {
      valid: false,
      reason:
        "Publication blocked: Missing valid, active Consent Record for profile publication scope.",
    };
  }

  return { valid: true };
}
