import { describe, it, expect } from "vitest";
import { isValidPublicationTransition, isValidRevisionTransition, validatePublicationPrerequisites } from "@/lib/workflow";
import { canApproveRevision, signSession, verifySession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { PublicationStatus, ReviewStatus, Role } from "@prisma/client";

describe("UCreates Leadership Studio — Editorial Workflow State Machine", () => {
  it("allows valid publication transitions: DRAFT -> IN_REVIEW -> APPROVED -> PUBLISHED", () => {
    expect(isValidPublicationTransition(PublicationStatus.DRAFT, PublicationStatus.IN_REVIEW)).toBe(true);
    expect(isValidPublicationTransition(PublicationStatus.IN_REVIEW, PublicationStatus.APPROVED)).toBe(true);
    expect(isValidPublicationTransition(PublicationStatus.APPROVED, PublicationStatus.PUBLISHED)).toBe(true);
  });

  it("allows unpublishing transition: PUBLISHED -> DRAFT", () => {
    expect(isValidPublicationTransition(PublicationStatus.PUBLISHED, PublicationStatus.DRAFT)).toBe(true);
  });

  it("rejects invalid direct transitions: DRAFT cannot jump directly to PUBLISHED without review and approval", () => {
    expect(isValidPublicationTransition(PublicationStatus.DRAFT, PublicationStatus.PUBLISHED)).toBe(false);
  });

  it("enforces revision transitions: DRAFT -> SUBMITTED -> IN_REVIEW -> APPROVED", () => {
    expect(isValidRevisionTransition(ReviewStatus.DRAFT, ReviewStatus.SUBMITTED)).toBe(true);
    expect(isValidRevisionTransition(ReviewStatus.SUBMITTED, ReviewStatus.IN_REVIEW)).toBe(true);
    expect(isValidRevisionTransition(ReviewStatus.IN_REVIEW, ReviewStatus.APPROVED)).toBe(true);
    expect(isValidRevisionTransition(ReviewStatus.IN_REVIEW, ReviewStatus.REJECTED)).toBe(true);
  });
});

describe("Security & Self-Approval Prevention", () => {
  it("strictly prevents editors from approving their own submissions", () => {
    const editorId = "user-editor-123";
    const reviewerId = "user-reviewer-456";

    // Self-approval attempt must fail
    expect(canApproveRevision(editorId, editorId)).toBe(false);

    // Independent reviewer approval must pass
    expect(canApproveRevision(reviewerId, editorId)).toBe(true);
  });

  it("signs and securely verifies session JWT tokens with RBAC payload", async () => {
    const payload = {
      userId: "user-1",
      email: "reviewer@ucreates.io",
      name: "Senior Reviewer",
      role: Role.REVIEWER,
      organisationId: "org-karnataka-1",
    };

    const token = await signSession(payload);
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(20);

    const decoded = await verifySession(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.email).toBe("reviewer@ucreates.io");
    expect(decoded?.role).toBe(Role.REVIEWER);
  });
});

describe("PostgreSQL Database Persistence & Seed Data Verification", () => {
  it("verifies D. K. Shivakumar profile exists in PostgreSQL with PUBLISHED status", async () => {
    const profile = await prisma.leaderProfile.findFirst({
      where: { slug: "dk-shivakumar" },
      include: { milestones: true, initiatives: true },
    });

    expect(profile).not.toBeNull();
    expect(profile?.displayName).toBe("D. K. Shivakumar");
    expect(profile?.publicationStatus).toBe(PublicationStatus.PUBLISHED);
    expect(profile?.milestones.length).toBeGreaterThanOrEqual(4);
    expect(profile?.initiatives.length).toBeGreaterThanOrEqual(1);
    expect(profile?.kannadaName).toBe("ಡಿ. ಕೆ. ಶಿವಕುಮಾರ್");
  });

  it("verifies Siddaramaiah profile exists with PUBLISHED status", async () => {
    const profile = await prisma.leaderProfile.findFirst({
      where: { slug: "siddaramaiah" },
      include: { milestones: true },
    });

    expect(profile).not.toBeNull();
    expect(profile?.publicationStatus).toBe(PublicationStatus.PUBLISHED);
    expect(profile?.currentRole).toBe("Chief Minister of Karnataka");
  });

  it("verifies Draft profile (Satish Jarkiholi) is not published and remains private", async () => {
    const profile = await prisma.leaderProfile.findFirst({
      where: { slug: "satish-jarkiholi" },
    });

    expect(profile).not.toBeNull();
    expect(profile?.publicationStatus).toBe(PublicationStatus.DRAFT);
  });

  it("verifies In Review profile (Priyank Kharge) is queued in review state", async () => {
    const profile = await prisma.leaderProfile.findFirst({
      where: { slug: "priyank-kharge" },
    });

    expect(profile).not.toBeNull();
    expect(profile?.publicationStatus).toBe(PublicationStatus.IN_REVIEW);
  });

  it("verifies Approved profile (M. B. Patil) is approved and ready for publication", async () => {
    const profile = await prisma.leaderProfile.findFirst({
      where: { slug: "mb-patil" },
    });

    expect(profile).not.toBeNull();
    expect(profile?.publicationStatus).toBe(PublicationStatus.APPROVED);
  });

  it("verifies Source Registry has verified sources linked to legislative gazettes", async () => {
    const sources = await prisma.source.findMany();
    expect(sources.length).toBeGreaterThanOrEqual(4);

    const klaSource = sources.find((s) => s.url.includes("kla.kar.nic.in"));
    expect(klaSource).toBeDefined();
    expect(klaSource?.verificationStatus).toBe("VERIFIED");
  });

  it("verifies Audit Events are stored in PostgreSQL", async () => {
    const events = await prisma.auditEvent.findMany();
    expect(events.length).toBeGreaterThanOrEqual(3);
  });
});
