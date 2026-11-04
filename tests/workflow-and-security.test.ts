import { describe, it, expect } from "vitest";
import { isValidPublicationTransition, isValidRevisionTransition } from "@/lib/workflow";
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

describe("Karnataka Congress Platform — Verified Leadership Showcase (6 Leaders)", () => {
  it("verifies D. K. Shivakumar is Chief Minister of Karnataka with canonical Cabinet Affairs, Finance & Planning portfolios", async () => {
    const profile = await prisma.leaderProfile.findFirst({
      where: { slug: "dk-shivakumar" },
      include: { milestones: true, initiatives: true },
    });

    expect(profile).not.toBeNull();
    expect(profile?.displayName).toBe("D. K. Shivakumar");
    expect(profile?.kannadaName).toBe("ಡಿ. ಕೆ. ಶಿವಕುಮಾರ್");
    expect(profile?.currentRole).toBe("Chief Minister of Karnataka");
    expect(profile?.party).toBe("Indian National Congress");
    expect(profile?.assemblyNumber).toBe(184);
    expect(profile?.district).toBe("Ramanagara");
    expect(profile?.portfolio).toContain("Cabinet Affairs");
    expect(profile?.portfolio).toContain("Finance");
    expect(profile?.portfolio).toContain("Planning");
    expect(profile?.portfolio).not.toContain("Irrigation");
    expect(profile?.publicationStatus).toBe(PublicationStatus.PUBLISHED);
    expect(profile?.portraitUrl).toBe("/images/portraits/dk-shivakumar.jpg");
  });

  it("verifies Dr. G. Parameshwara is Deputy Chief Minister with Revenue and Sports portfolios", async () => {
    const profile = await prisma.leaderProfile.findFirst({
      where: { slug: "g-parameshwara" },
    });

    expect(profile).not.toBeNull();
    expect(profile?.displayName).toBe("Dr. G. Parameshwara");
    expect(profile?.currentRole).toBe("Deputy Chief Minister of Karnataka");
    expect(profile?.portfolio).toContain("Revenue");
    expect(profile?.portfolio).toContain("Sports");
    expect(profile?.portfolio).not.toContain("Home");
    expect(profile?.assemblyNumber).toBe(132);
    expect(profile?.district).toBe("Tumakuru");
    expect(profile?.publicationStatus).toBe(PublicationStatus.PUBLISHED);
    expect(profile?.portraitUrl).toBe("/images/portraits/g-parameshwara.jpg");
  });

  it("verifies Priyank Kharge is Cabinet Minister for Home (excl. Intelligence), IT & BT, and E-Governance", async () => {
    const profile = await prisma.leaderProfile.findFirst({
      where: { slug: "priyank-kharge" },
    });

    expect(profile).not.toBeNull();
    expect(profile?.displayName).toBe("Priyank Kharge");
    expect(profile?.currentRole).toBe("Cabinet Minister for Home (excl. Intelligence), IT & BT, and E-Governance");
    expect(profile?.portfolio).toContain("Home (excluding Intelligence)");
    expect(profile?.portfolio).toContain("IT & BT");
    expect(profile?.assemblyNumber).toBe(40);
    expect(profile?.district).toBe("Kalaburagi");
    expect(profile?.publicationStatus).toBe(PublicationStatus.PUBLISHED);
    expect(profile?.portraitUrl).toBe("/images/portraits/priyank-kharge.jpg");
  });

  it("verifies M. B. Patil is Cabinet Minister for Large & Medium Industries representing Babaleshwar (AC #29)", async () => {
    const profile = await prisma.leaderProfile.findFirst({
      where: { slug: "mb-patil" },
    });

    expect(profile).not.toBeNull();
    expect(profile?.displayName).toBe("M. B. Patil");
    expect(profile?.currentRole).toBe("Cabinet Minister for Large & Medium Industries");
    expect(profile?.portfolio).toContain("Large and Medium Industries");
    expect(profile?.assemblyNumber).toBe(29);
    expect(profile?.district).toBe("Vijayapura");
    expect(profile?.portraitUrl).toBe("/images/portraits/mb-patil.jpg");
    expect(profile?.publicationStatus).toBe(PublicationStatus.PUBLISHED);
  });

  it("verifies Satish Jarkiholi is Cabinet Minister for Public Works representing Yemkanmardi (ST #11)", async () => {
    const profile = await prisma.leaderProfile.findFirst({
      where: { slug: "satish-jarkiholi" },
    });

    expect(profile).not.toBeNull();
    expect(profile?.displayName).toBe("Satish Jarkiholi");
    expect(profile?.currentRole).toBe("Cabinet Minister for Public Works");
    expect(profile?.portfolio).toContain("Public Works");
    expect(profile?.assemblyNumber).toBe(11);
    expect(profile?.district).toBe("Belagavi");
    expect(profile?.portraitUrl).toBe("/images/portraits/satish-jarkiholi.jpg");
    expect(profile?.publicationStatus).toBe(PublicationStatus.PUBLISHED);
  });

  it("verifies Krishna Byre Gowda is Cabinet Minister for Greater Bengaluru Development & Parliamentary Affairs", async () => {
    const profile = await prisma.leaderProfile.findFirst({
      where: { slug: "krishna-byre-gowda" },
    });

    expect(profile).not.toBeNull();
    expect(profile?.displayName).toBe("Krishna Byre Gowda");
    expect(profile?.currentRole).toBe("Cabinet Minister for Greater Bengaluru Development & Parliamentary Affairs");
    expect(profile?.portfolio).toContain("Greater Bengaluru Development");
    expect(profile?.portfolio).not.toContain("Revenue");
    expect(profile?.assemblyNumber).toBe(152);
    expect(profile?.district).toBe("Bengaluru Urban");
    expect(profile?.portraitUrl).toBe("/images/portraits/krishna-byre-gowda.jpg");
    expect(profile?.publicationStatus).toBe(PublicationStatus.PUBLISHED);
  });

  it("verifies Siddaramaiah is designated as Former Chief Minister and not current Chief Minister", async () => {
    const profile = await prisma.leaderProfile.findFirst({
      where: { slug: "siddaramaiah" },
    });

    expect(profile).not.toBeNull();
    expect(profile?.currentRole).toBe("Former Chief Minister & Senior CLP Leader");
    expect(profile?.isMinister).toBe(false);
    expect(profile?.assemblyNumber).toBe(221);
    expect(profile?.district).toBe("Mysuru");
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
  it("verifies Kanakapura and Koratagere constituencies are linked to CM and DCM", async () => {
    const kanakapura = await prisma.constituency.findUnique({
      where: { slug: "kanakapura" },
      include: { representative: true },
    });
    expect(kanakapura).not.toBeNull();
    expect(kanakapura?.number).toBe(184);
    expect(kanakapura?.district).toBe("Ramanagara");
    expect(kanakapura?.representative?.displayName).toBe("D. K. Shivakumar");

    const koratagere = await prisma.constituency.findUnique({
      where: { slug: "koratagere" },
      include: { representative: true },
    });
    expect(koratagere).not.toBeNull();
    expect(koratagere?.number).toBe(132);
    expect(koratagere?.district).toBe("Tumakuru");
    expect(koratagere?.representative?.displayName).toBe("Dr. G. Parameshwara");
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
