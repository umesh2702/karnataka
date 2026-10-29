import { describe, it, expect } from "vitest";
import { isValidPublicationTransition, isValidRevisionTransition, validatePublicationPrerequisites } from "@/lib/workflow";
import { canApproveRevision, signSession, verifySession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { PublicationStatus, ReviewStatus, Role, ReservationType } from "@prisma/client";

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

describe("Karnataka Congress Platform — Verified Leadership & Portfolios", () => {
  it("verifies Siddaramaiah is currently Chief Minister of Karnataka representing Varuna (AC #221)", async () => {
    const profile = await prisma.leaderProfile.findFirst({
      where: { slug: "siddaramaiah" },
      include: { milestones: true, initiatives: true },
    });

    expect(profile).not.toBeNull();
    expect(profile?.displayName).toBe("Siddaramaiah");
    expect(profile?.kannadaName).toBe("ಸಿದ್ದರಾಮಯ್ಯ");
    expect(profile?.currentRole).toBe("Chief Minister of Karnataka");
    expect(profile?.party).toBe("Indian National Congress");
    expect(profile?.assemblyNumber).toBe(221);
    expect(profile?.district).toBe("Mysuru");
    expect(profile?.portfolio).toContain("Finance");
    expect(profile?.publicationStatus).toBe(PublicationStatus.PUBLISHED);
    expect(profile?.portraitUrl).toBe("/images/portraits/siddaramaiah.jpg");
  });

  it("verifies D. K. Shivakumar is Deputy Chief Minister of Karnataka & KPCC President representing Kanakapura (AC #184)", async () => {
    const profile = await prisma.leaderProfile.findFirst({
      where: { slug: "dk-shivakumar" },
      include: { milestones: true, initiatives: true },
    });

    expect(profile).not.toBeNull();
    expect(profile?.displayName).toBe("D. K. Shivakumar");
    expect(profile?.kannadaName).toBe("ಡಿ. ಕೆ. ಶಿವಕುಮಾರ್");
    expect(profile?.currentRole).toBe("Deputy Chief Minister of Karnataka & KPCC President");
    expect(profile?.party).toBe("Indian National Congress");
    expect(profile?.assemblyNumber).toBe(184);
    expect(profile?.district).toBe("Ramanagara");
    expect(profile?.portfolio).toContain("Irrigation");
    expect(profile?.portfolio).toContain("Bengaluru");
    expect(profile?.publicationStatus).toBe(PublicationStatus.PUBLISHED);
    expect(profile?.portraitUrl).toBe("/images/portraits/dk-shivakumar.jpg");
  });

  it("verifies Dr. G. Parameshwara is Minister for Home Affairs representing Koratagere (SC #132)", async () => {
    const profile = await prisma.leaderProfile.findFirst({
      where: { slug: "g-parameshwara" },
    });

    expect(profile).not.toBeNull();
    expect(profile?.displayName).toBe("Dr. G. Parameshwara");
    expect(profile?.currentRole).toBe("Minister for Home Affairs");
    expect(profile?.assemblyNumber).toBe(132);
    expect(profile?.district).toBe("Tumakuru");
    expect(profile?.publicationStatus).toBe(PublicationStatus.PUBLISHED);
  });

  it("verifies Priyank Kharge is Minister for RDPR and IT/BT representing Chittapur (SC #44)", async () => {
    const profile = await prisma.leaderProfile.findFirst({
      where: { slug: "priyank-kharge" },
    });

    expect(profile).not.toBeNull();
    expect(profile?.displayName).toBe("Priyank Kharge");
    expect(profile?.currentRole).toBe("Minister for RDPR, IT & BT");
    expect(profile?.assemblyNumber).toBe(44);
    expect(profile?.district).toBe("Kalaburagi");
    expect(profile?.publicationStatus).toBe(PublicationStatus.PUBLISHED);
  });

  it("verifies Satish Jarkiholi has null portrait for safe initials monogram fallback (no stock photo)", async () => {
    const profile = await prisma.leaderProfile.findFirst({
      where: { slug: "satish-jarkiholi" },
    });

    expect(profile).not.toBeNull();
    expect(profile?.currentRole).toBe("Minister for Public Works Department");
    expect(profile?.assemblyNumber).toBe(11);
    expect(profile?.district).toBe("Belagavi");
    expect(profile?.portraitUrl).toBeNull(); // Neutral monogram avatar fallback
    expect(profile?.publicationStatus).toBe(PublicationStatus.PUBLISHED);
  });

  it("verifies Draft and In-Review profiles are kept strictly unexposed on public published queries", async () => {
    // Tanveer Sait is DRAFT
    const draftLeader = await prisma.leaderProfile.findFirst({
      where: { slug: "tanveer-sait" },
    });
    expect(draftLeader?.publicationStatus).toBe(PublicationStatus.DRAFT);

    // Rizwan Arshad is IN_REVIEW
    const inReviewLeader = await prisma.leaderProfile.findFirst({
      where: { slug: "rizwan-arshad" },
    });
    expect(inReviewLeader?.publicationStatus).toBe(PublicationStatus.IN_REVIEW);

    // Public query MUST NOT return either
    const publicQuery = await prisma.leaderProfile.findMany({
      where: {
        publicationStatus: PublicationStatus.PUBLISHED,
        slug: { in: ["tanveer-sait", "rizwan-arshad"] },
      },
    });
    expect(publicQuery.length).toBe(0);
  });
});

describe("Constituency Mappings & Five Guarantees Verification", () => {
  it("verifies Varuna and Kanakapura constituencies are linked to CM and DCM", async () => {
    const varuna = await prisma.constituency.findUnique({
      where: { slug: "varuna" },
      include: { representative: true },
    });
    expect(varuna).not.toBeNull();
    expect(varuna?.number).toBe(221);
    expect(varuna?.district).toBe("Mysuru");
    expect(varuna?.representative?.displayName).toBe("Siddaramaiah");

    const kanakapura = await prisma.constituency.findUnique({
      where: { slug: "kanakapura" },
      include: { representative: true },
    });
    expect(kanakapura).not.toBeNull();
    expect(kanakapura?.number).toBe(184);
    expect(kanakapura?.district).toBe("Ramanagara");
    expect(kanakapura?.representative?.displayName).toBe("D. K. Shivakumar");
  });

  it("verifies all Five Guarantees are stored with verified government departments and application links", async () => {
    const guarantees = await prisma.governmentScheme.findMany({
      where: { publicationStatus: PublicationStatus.PUBLISHED },
      orderBy: { sortOrder: "asc" },
    });

    expect(guarantees.length).toBe(5);
    const slugs = guarantees.map((g) => g.slug);
    expect(slugs).toEqual([
      "gruha-lakshmi",
      "gruha-jyothi",
      "shakthi-scheme",
      "anna-bhagya",
      "yuva-nidhi",
    ]);

    for (const g of guarantees) {
      expect(g.department.length).toBeGreaterThan(5);
      expect(g.eligibility.length).toBeGreaterThan(10);
      expect(g.benefits.length).toBeGreaterThan(10);
      expect(g.officialSourceUrl).toMatch(/^https?:\/\//);
    }
  });

  it("verifies documented works and initiatives have valid project stages and departments", async () => {
    const projects = await prisma.workProject.findMany({
      where: { publicationStatus: PublicationStatus.PUBLISHED },
    });

    expect(projects.length).toBeGreaterThanOrEqual(5);
    for (const p of projects) {
      expect(["PROPOSED", "APPROVED", "ONGOING", "COMPLETED", "DELAYED", "CANCELLED"]).toContain(p.stage);
      expect(p.title.length).toBeGreaterThan(5);
      expect(p.evidenceUrl).not.toBeNull();
    }
  });
});
