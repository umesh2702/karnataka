import { Role, MembershipStatus, PublicationStatus, VerificationStatus, SourceType, RightsStatus, ConsentScope, ConsentStatus, ReviewStatus, DecisionType } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("🌱 Starting idempotent database seed for UCreates Leadership Studio...");

  // 1. Create Default Organisation
  const org = await prisma.organisation.upsert({
    where: { slug: "ucreates-karnataka" },
    update: {},
    create: {
      name: "UCreates Karnataka Chapter",
      slug: "ucreates-karnataka",
      branding: {
        tagline: "Public Leadership. Clearly Documented.",
        primaryColor: "#8A1C2C",
        secondaryColor: "#191A1C",
        backgroundColor: "#F7F7F4",
        edition: "Karnataka Edition",
      },
    },
  });

  console.log(`✓ Organisation ready: ${org.name} (${org.id})`);

  // 2. Create Seed Users
  const passwordHash = await bcrypt.hash("Admin@12345", 10);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@ucreates.io" },
    update: { passwordHash },
    create: {
      name: "Platform Admin",
      email: "admin@ucreates.io",
      passwordHash,
      globalRole: "PLATFORM_ADMIN",
    },
  });

  const reviewerUser = await prisma.user.upsert({
    where: { email: "reviewer@ucreates.io" },
    update: { passwordHash },
    create: {
      name: "Senior Editorial Reviewer",
      email: "reviewer@ucreates.io",
      passwordHash,
      globalRole: "USER",
    },
  });

  const editorUser = await prisma.user.upsert({
    where: { email: "editor@ucreates.io" },
    update: { passwordHash },
    create: {
      name: "Research Editor",
      email: "editor@ucreates.io",
      passwordHash,
      globalRole: "USER",
    },
  });

  // Assign Memberships
  await prisma.membership.upsert({
    where: { organisationId_userId: { organisationId: org.id, userId: adminUser.id } },
    update: { role: Role.ORGANISATION_ADMIN, status: MembershipStatus.ACTIVE },
    create: { organisationId: org.id, userId: adminUser.id, role: Role.ORGANISATION_ADMIN, status: MembershipStatus.ACTIVE },
  });

  await prisma.membership.upsert({
    where: { organisationId_userId: { organisationId: org.id, userId: reviewerUser.id } },
    update: { role: Role.REVIEWER, status: MembershipStatus.ACTIVE },
    create: { organisationId: org.id, userId: reviewerUser.id, role: Role.REVIEWER, status: MembershipStatus.ACTIVE },
  });

  await prisma.membership.upsert({
    where: { organisationId_userId: { organisationId: org.id, userId: editorUser.id } },
    update: { role: Role.EDITOR, status: MembershipStatus.ACTIVE },
    create: { organisationId: org.id, userId: editorUser.id, role: Role.EDITOR, status: MembershipStatus.ACTIVE },
  });

  console.log("✓ Seed users and role memberships configured");

  // 3. Create Verified Sourced References in Registry
  const klaMinistersSource = await prisma.source.upsert({
    where: { id: "src-kla-council-ministers" },
    update: {},
    create: {
      id: "src-kla-council-ministers",
      organisationId: org.id,
      title: "Council of Ministers Portfolio Directory",
      url: "https://kla.kar.nic.in/council/govtminister.htm",
      publisher: "Karnataka Legislative Council Secretariat",
      sourceType: SourceType.OFFICIAL_GOVERNMENT,
      publicationDate: new Date("2023-05-28"),
      checkedAt: new Date("2026-10-25"),
      verificationStatus: VerificationStatus.VERIFIED,
      notes: "Official governmental gazette and legislative roster of cabinet designations and portfolios.",
      createdById: adminUser.id,
    },
  });

  const eciAffidavitDksSource = await prisma.source.upsert({
    where: { id: "src-eci-affidavit-dks-2023" },
    update: {},
    create: {
      id: "src-eci-affidavit-dks-2023",
      organisationId: org.id,
      title: "Form 26 Candidate Affidavit - Kanakapura Assembly Constituency",
      url: "https://affidavit.eci.gov.in/",
      publisher: "Election Commission of India",
      sourceType: SourceType.LEGISLATIVE_ELECTION,
      publicationDate: new Date("2023-04-17"),
      checkedAt: new Date("2026-10-20"),
      verificationStatus: VerificationStatus.VERIFIED,
      notes: "Sworn legal declaration verifying educational qualifications (B.A. APS College, M.A. KSOU) and public elective offices.",
      createdById: editorUser.id,
    },
  });

  const dksOfficialPortalSource = await prisma.source.upsert({
    where: { id: "src-dks-official-portal" },
    update: {},
    create: {
      id: "src-dks-official-portal",
      organisationId: org.id,
      title: "Official Public Profile of D. K. Shivakumar",
      url: "https://www.dkshivakumar.co.in/",
      publisher: "Office of D. K. Shivakumar",
      sourceType: SourceType.OFFICIAL_ORGANISATION,
      publicationDate: new Date("2024-01-15"),
      checkedAt: new Date("2026-10-26"),
      verificationStatus: VerificationStatus.VERIFIED,
      notes: "Documented public career milestones, public addresses, and constituency development chronicles.",
      createdById: editorUser.id,
    },
  });

  const theHinduBmrSource = await prisma.source.upsert({
    where: { id: "src-thehindu-brand-bengaluru" },
    update: {},
    create: {
      id: "src-thehindu-brand-bengaluru",
      organisationId: org.id,
      title: "Government of Karnataka unveils Brand Bengaluru roadmap for civic infrastructure",
      url: "https://www.thehindu.com/news/national/karnataka/brand-bengaluru-initiatives/article67000000.ece",
      publisher: "The Hindu",
      sourceType: SourceType.REPUTABLE_NEWS,
      publicationDate: new Date("2023-06-21"),
      checkedAt: new Date("2026-10-24"),
      verificationStatus: VerificationStatus.VERIFIED,
      notes: "Reporting on state cabinet decisions regarding Bengaluru metropolitan water security and mobility plans.",
      createdById: editorUser.id,
    },
  });

  const klaSiddaramaiahSource = await prisma.source.upsert({
    where: { id: "src-kla-siddaramaiah-bio" },
    update: {},
    create: {
      id: "src-kla-siddaramaiah-bio",
      organisationId: org.id,
      title: "Karnataka Legislative Assembly Biographical Sketch - Siddaramaiah",
      url: "https://kla.kar.nic.in/assembly/member/16kla/100.pdf",
      publisher: "Karnataka Legislative Assembly Secretariat",
      sourceType: SourceType.OFFICIAL_GOVERNMENT,
      publicationDate: new Date("2023-06-01"),
      checkedAt: new Date("2026-10-22"),
      verificationStatus: VerificationStatus.VERIFIED,
      notes: "Official bio noting legislative tenures, Finance Minister tenure, and Chief Minister terms.",
      createdById: reviewerUser.id,
    },
  });

  const diprKagaruSource = await prisma.source.upsert({
    where: { id: "src-dipr-guarantees-2023" },
    update: {},
    create: {
      id: "src-dipr-guarantees-2023",
      organisationId: org.id,
      title: "Implementation Order for Five Public Welfare Guarantees",
      url: "https://dipr.karnataka.gov.in/",
      publisher: "Department of Information and Public Relations, Karnataka",
      sourceType: SourceType.OFFICIAL_GOVERNMENT,
      publicationDate: new Date("2023-06-05"),
      checkedAt: new Date("2026-10-25"),
      verificationStatus: VerificationStatus.VERIFIED,
      notes: "State executive gazette orders on state welfare guarantee framework implementation.",
      createdById: adminUser.id,
    },
  });

  const klaParameshwaraSource = await prisma.source.upsert({
    where: { id: "src-kla-parameshwara-bio" },
    update: {},
    create: {
      id: "src-kla-parameshwara-bio",
      organisationId: org.id,
      title: "Biographical Sketch of Dr. G. Parameshwara",
      url: "https://kla.kar.nic.in/assembly/member/16kla/parameshwara.pdf",
      publisher: "Karnataka Legislative Assembly Secretariat",
      sourceType: SourceType.OFFICIAL_GOVERNMENT,
      publicationDate: new Date("2023-06-01"),
      checkedAt: new Date("2026-10-24"),
      verificationStatus: VerificationStatus.VERIFIED,
      notes: "Legislative record documenting Ph.D. from University of Adelaide and ministerial appointments.",
      createdById: adminUser.id,
    },
  });

  const decanHeraldKhargeSource = await prisma.source.upsert({
    where: { id: "src-dh-priyank-kharge-itbt" },
    update: {},
    create: {
      id: "src-dh-priyank-kharge-itbt",
      organisationId: org.id,
      title: "Karnataka's Innovation Agenda: IT/BT and Rural Governance Focus",
      url: "https://www.deccanherald.com/state/karnataka-politics/karnataka-cabinet-portfolios",
      publisher: "Deccan Herald",
      sourceType: SourceType.REPUTABLE_NEWS,
      publicationDate: new Date("2023-05-29"),
      checkedAt: new Date("2026-10-25"),
      verificationStatus: VerificationStatus.VERIFIED,
      notes: "Independent reporting on IT/BT and RDPR portfolios assigned to Priyank Kharge.",
      createdById: editorUser.id,
    },
  });

  console.log("✓ Sourced registry items populated");

  // ==========================================
  // PROFILE 1: D. K. Shivakumar (PUBLISHED)
  // ==========================================
  const dksProfile = await prisma.leaderProfile.upsert({
    where: { organisationId_slug: { organisationId: org.id, slug: "dk-shivakumar" } },
    update: {
      displayName: "D. K. Shivakumar",
      kannadaName: "ಡಿ. ಕೆ. ಶಿವಕುಮಾರ್",
      currentRole: "Deputy Chief Minister of Karnataka",
      organisationName: "Government of Karnataka",
      region: "Southern Karnataka / Bengaluru Region",
      constituency: "Kanakapura (Assembly Constituency No. 184)",
      shortBio: "Deputy Chief Minister of Karnataka holding Irrigation and Bengaluru City Development portfolios; President of Karnataka Pradesh Congress Committee and eight-term legislator.",
      biography: `Doddalahalli Kempegowda Shivakumar (born 15 May 1962) is an Indian politician and the current Deputy Chief Minister of Karnataka. He concurrently holds cabinet portfolios for Major and Medium Irrigation and Bengaluru City Development. An eight-term Member of the Karnataka Legislative Assembly, he represents the Kanakapura assembly constituency.\n\nEarly Life and Education:\nBorn in Kanakapura, Ramanagara district, Shivakumar was educated in Bengaluru, graduating with a Bachelor of Arts degree from APS College of Arts and Science, and subsequently earned a Master of Arts in Political Science from Karnataka State Open University (KSOU), as verified in public election filings.\n\nPublic Career:\nShivakumar entered active public service in student leadership, rising through the Karnataka Pradesh Youth Congress. In 1989, at age 27, he was elected to the Karnataka Legislative Assembly from the Sathanur constituency. He was subsequently re-elected in 1994, 1999, and 2004 from Sathanur, and following delimitation in 2008, has represented Kanakapura in 2008, 2013, 2018, and 2023.\n\nExecutive Portfolios:\nShivakumar has held multiple ministerial responsibilities in the Government of Karnataka:\n- Minister of State for Prisons (1991–1992)\n- Minister of State for Agriculture (1992–1994)\n- Minister for Urban Development (1999–2004)\n- Cabinet Minister for Energy (2014–2018), during which he oversaw the development of the 2,050 MW Pavagada Solar Park\n- Cabinet Minister for Major Water Resources and Medical Education (2018–2019)\n\nIn July 2020, Shivakumar assumed the presidency of the Karnataka Pradesh Congress Committee (KPCC), leading the organisation into the May 2023 state general elections. On 20 May 2023, he was sworn in as Deputy Chief Minister of Karnataka.`,
      portraitUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop", // high quality placeholder permitted portrait
      publicationStatus: PublicationStatus.PUBLISHED,
      roleLastVerifiedAt: new Date("2026-10-25"),
    },
    create: {
      organisationId: org.id,
      slug: "dk-shivakumar",
      displayName: "D. K. Shivakumar",
      kannadaName: "ಡಿ. ಕೆ. ಶಿವಕುಮಾರ್",
      currentRole: "Deputy Chief Minister of Karnataka",
      organisationName: "Government of Karnataka",
      region: "Southern Karnataka / Bengaluru Region",
      constituency: "Kanakapura (Assembly Constituency No. 184)",
      shortBio: "Deputy Chief Minister of Karnataka holding Irrigation and Bengaluru City Development portfolios; President of Karnataka Pradesh Congress Committee and eight-term legislator.",
      biography: `Doddalahalli Kempegowda Shivakumar (born 15 May 1962) is an Indian politician and the current Deputy Chief Minister of Karnataka. He concurrently holds cabinet portfolios for Major and Medium Irrigation and Bengaluru City Development. An eight-term Member of the Karnataka Legislative Assembly, he represents the Kanakapura assembly constituency.\n\nEarly Life and Education:\nBorn in Kanakapura, Ramanagara district, Shivakumar was educated in Bengaluru, graduating with a Bachelor of Arts degree from APS College of Arts and Science, and subsequently earned a Master of Arts in Political Science from Karnataka State Open University (KSOU), as verified in public election filings.\n\nPublic Career:\nShivakumar entered active public service in student leadership, rising through the Karnataka Pradesh Youth Congress. In 1989, at age 27, he was elected to the Karnataka Legislative Assembly from the Sathanur constituency. He was subsequently re-elected in 1994, 1999, and 2004 from Sathanur, and following delimitation in 2008, has represented Kanakapura in 2008, 2013, 2018, and 2023.\n\nExecutive Portfolios:\nShivakumar has held multiple ministerial responsibilities in the Government of Karnataka:\n- Minister of State for Prisons (1991–1992)\n- Minister of State for Agriculture (1992–1994)\n- Minister for Urban Development (1999–2004)\n- Cabinet Minister for Energy (2014–2018), during which he oversaw the development of the 2,050 MW Pavagada Solar Park\n- Cabinet Minister for Major Water Resources and Medical Education (2018–2019)\n\nIn July 2020, Shivakumar assumed the presidency of the Karnataka Pradesh Congress Committee (KPCC), leading the organisation into the May 2023 state general elections. On 20 May 2023, he was sworn in as Deputy Chief Minister of Karnataka.`,
      portraitUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop",
      publicationStatus: PublicationStatus.PUBLISHED,
      roleLastVerifiedAt: new Date("2026-10-25"),
    },
  });

  // Clear existing milestones and initiatives for clean idempotent refresh
  await prisma.claimSource.deleteMany({ where: { profileId: dksProfile.id } });
  await prisma.milestone.deleteMany({ where: { profileId: dksProfile.id } });
  await prisma.initiative.deleteMany({ where: { profileId: dksProfile.id } });

  const dksM1 = await prisma.milestone.create({
    data: {
      profileId: dksProfile.id,
      title: "First Elected to Karnataka Legislative Assembly (Sathanur)",
      description: "Elected as MLA from Sathanur assembly constituency during the 9th Karnataka Legislative Assembly elections at age 27.",
      eventYear: 1989,
      eventDate: new Date("1989-11-26"),
      sortOrder: 1,
      verificationStatus: VerificationStatus.VERIFIED,
    },
  });

  const dksM2 = await prisma.milestone.create({
    data: {
      profileId: dksProfile.id,
      title: "Appointed Minister for Urban Development",
      description: "Assumed cabinet charge of Urban Development in the S. M. Krishna ministry, overseeing municipal governance frameworks.",
      eventYear: 1999,
      eventDate: new Date("1999-10-17"),
      sortOrder: 2,
      verificationStatus: VerificationStatus.VERIFIED,
    },
  });

  const dksM3 = await prisma.milestone.create({
    data: {
      profileId: dksProfile.id,
      title: "Cabinet Minister for Energy — Pavagada Solar Initiative",
      description: "Held the Energy portfolio; initiated and oversaw the development of the 2,050 MW Pavagada Solar Park in Tumakuru district.",
      eventYear: 2014,
      eventDate: new Date("2014-01-01"),
      sortOrder: 3,
      verificationStatus: VerificationStatus.VERIFIED,
    },
  });

  const dksM4 = await prisma.milestone.create({
    data: {
      profileId: dksProfile.id,
      title: "Appointed President of Karnataka Pradesh Congress Committee",
      description: "Took charge as KPCC President in July 2020 during the COVID-19 pandemic, leading the party's statewide organisation.",
      eventYear: 2020,
      eventDate: new Date("2020-07-02"),
      sortOrder: 4,
      verificationStatus: VerificationStatus.VERIFIED,
    },
  });

  const dksM5 = await prisma.milestone.create({
    data: {
      profileId: dksProfile.id,
      title: "Sworn in as Deputy Chief Minister of Karnataka",
      description: "Took oath of office as Deputy Chief Minister of Karnataka alongside Chief Minister Siddaramaiah, allocated Irrigation and Bengaluru Development.",
      eventYear: 2023,
      eventDate: new Date("2023-05-20"),
      sortOrder: 5,
      verificationStatus: VerificationStatus.VERIFIED,
    },
  });

  // Attach Claims & Sources for DKS
  await prisma.claimSource.createMany({
    data: [
      { sourceId: klaMinistersSource.id, milestoneId: dksM5.id, relationshipNotes: "Verified via KLA Council of Ministers Gazette." },
      { sourceId: eciAffidavitDksSource.id, milestoneId: dksM1.id, relationshipNotes: "Affirmed in statutory election candidate filings." },
      { sourceId: dksOfficialPortalSource.id, milestoneId: dksM3.id, relationshipNotes: "Detailed in ministerial archives." },
      { sourceId: theHinduBmrSource.id, milestoneId: dksM5.id, relationshipNotes: "Press reporting on cabinet allocation." },
    ],
  });

  // Initiatives for DKS
  const dksI1 = await prisma.initiative.create({
    data: {
      profileId: dksProfile.id,
      title: "Brand Bengaluru Strategic Development Framework",
      description: "Integrated urban infrastructure initiative focusing on road decongestion, stormwater drain management, and public parks.",
      startDate: new Date("2023-06-21"),
      verificationStatus: VerificationStatus.VERIFIED,
    },
  });

  const dksI2 = await prisma.initiative.create({
    data: {
      profileId: dksProfile.id,
      title: "Mekedatu Balancing Reservoir Project Representation",
      description: "Documented governmental pursuit of approvals for the 67 TMC drinking water and hydel project for Bengaluru urban agglomeration.",
      startDate: new Date("2023-07-01"),
      verificationStatus: VerificationStatus.VERIFIED,
    },
  });

  await prisma.claimSource.create({
    data: { sourceId: theHinduBmrSource.id, initiativeId: dksI1.id, relationshipNotes: "Official civic consultative roadmap documented in press release." },
  });

  // Create Consent Record for DKS
  const dksConsent = await prisma.consentRecord.create({
    data: {
      organisationId: org.id,
      profileId: dksProfile.id,
      grantedBy: "Public Record & Standard Fair Editorial Exemption (Ref: Section 19(1)(a))",
      scope: ConsentScope.PROFILE_PUBLICATION,
      grantedAt: new Date("2024-01-01"),
      evidenceReference: "Publicly available legislative gazette and verified biographical domain records",
      notes: "Editorial public interest documentation compiled strictly from verifiable public records without official endorsement claim.",
      reviewStatus: ConsentStatus.VALID,
    },
  });

  // Create Published Revision Snapshot for DKS
  const dksSnapshot = {
    displayName: dksProfile.displayName,
    kannadaName: dksProfile.kannadaName,
    shortBio: dksProfile.shortBio,
    biography: dksProfile.biography,
    currentRole: dksProfile.currentRole,
    organisationName: dksProfile.organisationName,
    region: dksProfile.region,
    constituency: dksProfile.constituency,
    portraitUrl: dksProfile.portraitUrl,
    roleLastVerifiedAt: dksProfile.roleLastVerifiedAt?.toISOString(),
    milestones: [
      { title: dksM1.title, description: dksM1.description, eventYear: dksM1.eventYear, verificationStatus: dksM1.verificationStatus },
      { title: dksM2.title, description: dksM2.description, eventYear: dksM2.eventYear, verificationStatus: dksM2.verificationStatus },
      { title: dksM3.title, description: dksM3.description, eventYear: dksM3.eventYear, verificationStatus: dksM3.verificationStatus },
      { title: dksM4.title, description: dksM4.description, eventYear: dksM4.eventYear, verificationStatus: dksM4.verificationStatus },
      { title: dksM5.title, description: dksM5.description, eventYear: dksM5.eventYear, verificationStatus: dksM5.verificationStatus },
    ],
    initiatives: [
      { title: dksI1.title, description: dksI1.description, startDate: dksI1.startDate?.toISOString() },
      { title: dksI2.title, description: dksI2.description, startDate: dksI2.startDate?.toISOString() },
    ],
    sources: [
      { title: klaMinistersSource.title, url: klaMinistersSource.url, publisher: klaMinistersSource.publisher },
      { title: eciAffidavitDksSource.title, url: eciAffidavitDksSource.url, publisher: eciAffidavitDksSource.publisher },
      { title: theHinduBmrSource.title, url: theHinduBmrSource.url, publisher: theHinduBmrSource.publisher },
    ],
  };

  const dksRevision = await prisma.revision.create({
    data: {
      profileId: dksProfile.id,
      version: 1,
      contentSnapshot: dksSnapshot,
      reviewStatus: ReviewStatus.PUBLISHED,
      submittedById: editorUser.id,
      submittedAt: new Date("2026-10-25"),
    },
  });

  await prisma.reviewDecision.create({
    data: {
      revisionId: dksRevision.id,
      reviewerId: reviewerUser.id,
      decision: DecisionType.APPROVED,
      reason: "All 5 milestones, education records and current portfolios verified against official KLA gazette and ECI statutory filings.",
      createdAt: new Date("2026-10-26"),
    },
  });

  await prisma.leaderProfile.update({
    where: { id: dksProfile.id },
    data: { publishedRevisionId: dksRevision.id },
  });

  console.log("✓ Profile 1: D. K. Shivakumar (PUBLISHED) with immutable snapshot linked");

  // ==========================================
  // PROFILE 2: Siddaramaiah (PUBLISHED)
  // ==========================================
  const siddaProfile = await prisma.leaderProfile.upsert({
    where: { organisationId_slug: { organisationId: org.id, slug: "siddaramaiah" } },
    update: {
      displayName: "Siddaramaiah",
      kannadaName: "ಸಿದ್ದರಾಮಯ್ಯ",
      currentRole: "Chief Minister of Karnataka",
      organisationName: "Government of Karnataka",
      region: "Old Mysuru Region",
      constituency: "Varuna (Assembly Constituency No. 219)",
      shortBio: "22nd Chief Minister of Karnataka, nine-term legislator, veteran socialist parliamentarian and record 15-time state budget presenter.",
      biography: `Siddaramaiah (born 12 August 1948) is an Indian politician and administrator serving as the Chief Minister of Karnataka since May 2023, having previously held the office from 2013 to 2018. A senior leader of the Indian National Congress and prominent face of Ahinda social coalition politics, he has represented Varuna and Chamundeshwari in the Karnataka Legislative Assembly across nine legislative terms.\n\nEducation and Legal Career:\nBorn in Siddaramanahundi, Mysuru district, he graduated with a Bachelor of Science from Yuvaraja College, University of Mysore, and completed his Bachelor of Laws (LL.B.) from Vidyavardhaka Law College in Mysuru, practicing law briefly before entering active politics.\n\nLegislative Journey:\nFirst elected to the Karnataka Legislative Assembly in 1983 from Chamundeshwari on a Bharatiya Lok Dal ticket, Siddaramaiah later joined the Janata Dal, serving as Minister for Sericulture and Animal Husbandry, and subsequently as Finance Minister in the H. D. Deve Gowda and J. H. Patel cabinets. He served twice as Deputy Chief Minister (1996–1999 and 2004–2005).\n\nChief Ministerial Tenures:\nIn May 2013, he became the 22nd Chief Minister of Karnataka, completing a full five-year constitutional term (2013–2018). Following the 2023 assembly elections where Congress secured 135 seats, Siddaramaiah was sworn in for his second tenure as Chief Minister on 20 May 2023.`,
      portraitUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
      publicationStatus: PublicationStatus.PUBLISHED,
      roleLastVerifiedAt: new Date("2026-10-25"),
    },
    create: {
      organisationId: org.id,
      slug: "siddaramaiah",
      displayName: "Siddaramaiah",
      kannadaName: "ಸಿದ್ದರಾಮಯ್ಯ",
      currentRole: "Chief Minister of Karnataka",
      organisationName: "Government of Karnataka",
      region: "Old Mysuru Region",
      constituency: "Varuna (Assembly Constituency No. 219)",
      shortBio: "22nd Chief Minister of Karnataka, nine-term legislator, veteran socialist parliamentarian and record 15-time state budget presenter.",
      biography: `Siddaramaiah (born 12 August 1948) is an Indian politician and administrator serving as the Chief Minister of Karnataka since May 2023, having previously held the office from 2013 to 2018. A senior leader of the Indian National Congress and prominent face of Ahinda social coalition politics, he has represented Varuna and Chamundeshwari in the Karnataka Legislative Assembly across nine legislative terms.\n\nEducation and Legal Career:\nBorn in Siddaramanahundi, Mysuru district, he graduated with a Bachelor of Science from Yuvaraja College, University of Mysore, and completed his Bachelor of Laws (LL.B.) from Vidyavardhaka Law College in Mysuru, practicing law briefly before entering active politics.\n\nLegislative Journey:\nFirst elected to the Karnataka Legislative Assembly in 1983 from Chamundeshwari on a Bharatiya Lok Dal ticket, Siddaramaiah later joined the Janata Dal, serving as Minister for Sericulture and Animal Husbandry, and subsequently as Finance Minister in the H. D. Deve Gowda and J. H. Patel cabinets. He served twice as Deputy Chief Minister (1996–1999 and 2004–2005).\n\nChief Ministerial Tenures:\nIn May 2013, he became the 22nd Chief Minister of Karnataka, completing a full five-year constitutional term (2013–2018). Following the 2023 assembly elections where Congress secured 135 seats, Siddaramaiah was sworn in for his second tenure as Chief Minister on 20 May 2023.`,
      portraitUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
      publicationStatus: PublicationStatus.PUBLISHED,
      roleLastVerifiedAt: new Date("2026-10-25"),
    },
  });

  await prisma.claimSource.deleteMany({ where: { profileId: siddaProfile.id } });
  await prisma.milestone.deleteMany({ where: { profileId: siddaProfile.id } });
  await prisma.initiative.deleteMany({ where: { profileId: siddaProfile.id } });

  const siddaM1 = await prisma.milestone.create({
    data: {
      profileId: siddaProfile.id,
      title: "First Election to 7th Karnataka Legislative Assembly",
      description: "Won election from Chamundeshwari constituency on Bharatiya Lok Dal ticket, marking entry to state legislature.",
      eventYear: 1983,
      eventDate: new Date("1983-01-05"),
      sortOrder: 1,
      verificationStatus: VerificationStatus.VERIFIED,
    },
  });

  const siddaM2 = await prisma.milestone.create({
    data: {
      profileId: siddaProfile.id,
      title: "Minister for Finance and Deputy Chief Minister",
      description: "Served as Finance Minister in H. D. Deve Gowda ministry; presented maiden state budget of 15 career budgets.",
      eventYear: 1994,
      eventDate: new Date("1994-12-11"),
      sortOrder: 2,
      verificationStatus: VerificationStatus.VERIFIED,
    },
  });

  const siddaM3 = await prisma.milestone.create({
    data: {
      profileId: siddaProfile.id,
      title: "Sworn in as 22nd Chief Minister of Karnataka",
      description: "Assumed Chief Ministership of Karnataka following absolute majority in 2013 assembly elections, serving 2013–2018.",
      eventYear: 2013,
      eventDate: new Date("2013-05-13"),
      sortOrder: 3,
      verificationStatus: VerificationStatus.VERIFIED,
    },
  });

  const siddaM4 = await prisma.milestone.create({
    data: {
      profileId: siddaProfile.id,
      title: "Second Swearing-in as Chief Minister of Karnataka",
      description: "Sworn in at Kanteerava Stadium Bengaluru after Congress won 135 seats in 16th Karnataka Assembly election.",
      eventYear: 2023,
      eventDate: new Date("2023-05-20"),
      sortOrder: 4,
      verificationStatus: VerificationStatus.VERIFIED,
    },
  });

  const siddaI1 = await prisma.initiative.create({
    data: {
      profileId: siddaProfile.id,
      title: "Five Guarantee Schemes Citizen Welfare Program",
      description: "State policy rolling out Gruha Lakshmi (cash transfer), Gruha Jyothi (free electricity), Shakti (free bus travel for women), Yuva Nidhi, and Anna Bhagya.",
      startDate: new Date("2023-06-01"),
      verificationStatus: VerificationStatus.VERIFIED,
    },
  });

  await prisma.claimSource.createMany({
    data: [
      { sourceId: klaSiddaramaiahSource.id, milestoneId: siddaM3.id, relationshipNotes: "Official biographical gazette record." },
      { sourceId: diprKagaruSource.id, initiativeId: siddaI1.id, relationshipNotes: "Executive gazette order verified." },
    ],
  });

  const siddaSnapshot = {
    displayName: siddaProfile.displayName,
    kannadaName: siddaProfile.kannadaName,
    shortBio: siddaProfile.shortBio,
    biography: siddaProfile.biography,
    currentRole: siddaProfile.currentRole,
    organisationName: siddaProfile.organisationName,
    region: siddaProfile.region,
    constituency: siddaProfile.constituency,
    portraitUrl: siddaProfile.portraitUrl,
    roleLastVerifiedAt: siddaProfile.roleLastVerifiedAt?.toISOString(),
    milestones: [
      { title: siddaM1.title, description: siddaM1.description, eventYear: siddaM1.eventYear, verificationStatus: siddaM1.verificationStatus },
      { title: siddaM2.title, description: siddaM2.description, eventYear: siddaM2.eventYear, verificationStatus: siddaM2.verificationStatus },
      { title: siddaM3.title, description: siddaM3.description, eventYear: siddaM3.eventYear, verificationStatus: siddaM3.verificationStatus },
      { title: siddaM4.title, description: siddaM4.description, eventYear: siddaM4.eventYear, verificationStatus: siddaM4.verificationStatus },
    ],
    initiatives: [
      { title: siddaI1.title, description: siddaI1.description, startDate: siddaI1.startDate?.toISOString() },
    ],
    sources: [
      { title: klaSiddaramaiahSource.title, url: klaSiddaramaiahSource.url, publisher: klaSiddaramaiahSource.publisher },
      { title: diprKagaruSource.title, url: diprKagaruSource.url, publisher: diprKagaruSource.publisher },
    ],
  };

  const siddaRevision = await prisma.revision.create({
    data: {
      profileId: siddaProfile.id,
      version: 1,
      contentSnapshot: siddaSnapshot,
      reviewStatus: ReviewStatus.PUBLISHED,
      submittedById: editorUser.id,
      submittedAt: new Date("2026-10-24"),
    },
  });

  await prisma.reviewDecision.create({
    data: {
      revisionId: siddaRevision.id,
      reviewerId: reviewerUser.id,
      decision: DecisionType.APPROVED,
      reason: "Historical milestones and budget presentation records corroborated against Assembly records.",
      createdAt: new Date("2026-10-25"),
    },
  });

  await prisma.leaderProfile.update({
    where: { id: siddaProfile.id },
    data: { publishedRevisionId: siddaRevision.id },
  });

  console.log("✓ Profile 2: Siddaramaiah (PUBLISHED) with immutable snapshot linked");

  // ==========================================
  // PROFILE 3: G. Parameshwara (PUBLISHED)
  // ==========================================
  const parameshwaraProfile = await prisma.leaderProfile.upsert({
    where: { organisationId_slug: { organisationId: org.id, slug: "g-parameshwara" } },
    update: {
      displayName: "Dr. G. Parameshwara",
      kannadaName: "ಡಾ. ಜಿ. ಪರಮೇಶ್ವರ",
      currentRole: "Minister for Home Affairs",
      organisationName: "Government of Karnataka",
      region: "Central Karnataka / Tumakuru",
      constituency: "Koratagere (Assembly Constituency No. 133)",
      shortBio: "Cabinet Minister for Home Affairs in Karnataka; former Deputy Chief Minister, longest-serving KPCC President, and agricultural scientist with Ph.D. from Adelaide.",
      biography: `Dr. Gangadharaiah Parameshwara (born 6 August 1951) is an Indian politician, agricultural scientist, and educational administrator currently serving as the Minister for Home Affairs in the Government of Karnataka. He is a six-term legislator representing Koratagere constituency in Tumakuru district.\n\nAcademic Background:\nDr. Parameshwara holds a B.Sc. and M.Sc. in Agriculture from the University of Agricultural Sciences, Bangalore. He was awarded a Ph.D. in Plant Physiology from the Waite Agricultural Research Institute, University of Adelaide, Australia.\n\nPublic Service and Governance:\nFirst elected to the Karnataka Assembly in 1989 from Madhugiri, he has served in multiple ministerial portfolios including Sericulture (1993), Higher Education (1999–2004), and Home Affairs (2015–2017).\n\nHe served as the President of the Karnataka Pradesh Congress Committee for eight consecutive years (2010–2018), the longest tenure in modern state history. In 2018, he served as Deputy Chief Minister of Karnataka. In May 2023, he took charge as Cabinet Minister for Home Affairs.`,
      portraitUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
      publicationStatus: PublicationStatus.PUBLISHED,
      roleLastVerifiedAt: new Date("2026-10-25"),
    },
    create: {
      organisationId: org.id,
      slug: "g-parameshwara",
      displayName: "Dr. G. Parameshwara",
      kannadaName: "ಡಾ. ಜಿ. ಪರಮೇಶ್ವರ",
      currentRole: "Minister for Home Affairs",
      organisationName: "Government of Karnataka",
      region: "Central Karnataka / Tumakuru",
      constituency: "Koratagere (Assembly Constituency No. 133)",
      shortBio: "Cabinet Minister for Home Affairs in Karnataka; former Deputy Chief Minister, longest-serving KPCC President, and agricultural scientist with Ph.D. from Adelaide.",
      biography: `Dr. Gangadharaiah Parameshwara (born 6 August 1951) is an Indian politician, agricultural scientist, and educational administrator currently serving as the Minister for Home Affairs in the Government of Karnataka. He is a six-term legislator representing Koratagere constituency in Tumakuru district.\n\nAcademic Background:\nDr. Parameshwara holds a B.Sc. and M.Sc. in Agriculture from the University of Agricultural Sciences, Bangalore. He was awarded a Ph.D. in Plant Physiology from the Waite Agricultural Research Institute, University of Adelaide, Australia.\n\nPublic Service and Governance:\nFirst elected to the Karnataka Assembly in 1989 from Madhugiri, he has served in multiple ministerial portfolios including Sericulture (1993), Higher Education (1999–2004), and Home Affairs (2015–2017).\n\nHe served as the President of the Karnataka Pradesh Congress Committee for eight consecutive years (2010–2018), the longest tenure in modern state history. In 2018, he served as Deputy Chief Minister of Karnataka. In May 2023, he took charge as Cabinet Minister for Home Affairs.`,
      portraitUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
      publicationStatus: PublicationStatus.PUBLISHED,
      roleLastVerifiedAt: new Date("2026-10-25"),
    },
  });

  await prisma.claimSource.deleteMany({ where: { profileId: parameshwaraProfile.id } });
  await prisma.milestone.deleteMany({ where: { profileId: parameshwaraProfile.id } });
  await prisma.initiative.deleteMany({ where: { profileId: parameshwaraProfile.id } });

  const paramM1 = await prisma.milestone.create({
    data: {
      profileId: parameshwaraProfile.id,
      title: "Completion of Ph.D. at University of Adelaide, Australia",
      description: "Conducted doctoral research in plant drought physiology at Waite Agricultural Research Institute.",
      eventYear: 1984,
      sortOrder: 1,
      verificationStatus: VerificationStatus.VERIFIED,
    },
  });

  const paramM2 = await prisma.milestone.create({
    data: {
      profileId: parameshwaraProfile.id,
      title: "First Elected MLA from Madhugiri Constituency",
      description: "Elected to Karnataka Legislative Assembly; appointed Minister of State for Sericulture in 1993.",
      eventYear: 1989,
      sortOrder: 2,
      verificationStatus: VerificationStatus.VERIFIED,
    },
  });

  const paramM3 = await prisma.milestone.create({
    data: {
      profileId: parameshwaraProfile.id,
      title: "Sworn in as Deputy Chief Minister of Karnataka",
      description: "Assumed the office of Deputy Chief Minister in May 2018 along with the Home portfolio.",
      eventYear: 2018,
      eventDate: new Date("2018-05-23"),
      sortOrder: 3,
      verificationStatus: VerificationStatus.VERIFIED,
    },
  });

  const paramM4 = await prisma.milestone.create({
    data: {
      profileId: parameshwaraProfile.id,
      title: "Appointed Cabinet Minister for Home Affairs",
      description: "Sworn into Karnataka Cabinet with primary responsibility for state police administration and internal security.",
      eventYear: 2023,
      eventDate: new Date("2023-05-20"),
      sortOrder: 4,
      verificationStatus: VerificationStatus.VERIFIED,
    },
  });

  await prisma.claimSource.create({
    data: { sourceId: klaParameshwaraSource.id, milestoneId: paramM1.id, relationshipNotes: "Documented in official assembly dossier." },
  });

  const paramSnapshot = {
    displayName: parameshwaraProfile.displayName,
    kannadaName: parameshwaraProfile.kannadaName,
    shortBio: parameshwaraProfile.shortBio,
    biography: parameshwaraProfile.biography,
    currentRole: parameshwaraProfile.currentRole,
    organisationName: parameshwaraProfile.organisationName,
    region: parameshwaraProfile.region,
    constituency: parameshwaraProfile.constituency,
    portraitUrl: parameshwaraProfile.portraitUrl,
    roleLastVerifiedAt: parameshwaraProfile.roleLastVerifiedAt?.toISOString(),
    milestones: [
      { title: paramM1.title, description: paramM1.description, eventYear: paramM1.eventYear, verificationStatus: paramM1.verificationStatus },
      { title: paramM2.title, description: paramM2.description, eventYear: paramM2.eventYear, verificationStatus: paramM2.verificationStatus },
      { title: paramM3.title, description: paramM3.description, eventYear: paramM3.eventYear, verificationStatus: paramM3.verificationStatus },
      { title: paramM4.title, description: paramM4.description, eventYear: paramM4.eventYear, verificationStatus: paramM4.verificationStatus },
    ],
    initiatives: [],
    sources: [
      { title: klaParameshwaraSource.title, url: klaParameshwaraSource.url, publisher: klaParameshwaraSource.publisher },
      { title: klaMinistersSource.title, url: klaMinistersSource.url, publisher: klaMinistersSource.publisher },
    ],
  };

  const paramRevision = await prisma.revision.create({
    data: {
      profileId: parameshwaraProfile.id,
      version: 1,
      contentSnapshot: paramSnapshot,
      reviewStatus: ReviewStatus.PUBLISHED,
      submittedById: editorUser.id,
      submittedAt: new Date("2026-10-24"),
    },
  });

  await prisma.reviewDecision.create({
    data: {
      revisionId: paramRevision.id,
      reviewerId: reviewerUser.id,
      decision: DecisionType.APPROVED,
      reason: "Confirmed doctoral academic credentials and KLA ministerial gazettes.",
      createdAt: new Date("2026-10-25"),
    },
  });

  await prisma.leaderProfile.update({
    where: { id: parameshwaraProfile.id },
    data: { publishedRevisionId: paramRevision.id },
  });

  console.log("✓ Profile 3: Dr. G. Parameshwara (PUBLISHED)");

  // ==========================================
  // PROFILE 4: Priyank Kharge (IN_REVIEW)
  // Demonstrates the Review Queue in /studio/reviews!
  // ==========================================
  const khargeProfile = await prisma.leaderProfile.upsert({
    where: { organisationId_slug: { organisationId: org.id, slug: "priyank-kharge" } },
    update: {
      displayName: "Priyank Kharge",
      kannadaName: "ಪ್ರಿಯಾಂಕ್ ಎಂ. ಖರ್ಗೆ",
      currentRole: "Minister for IT/BT and RDPR",
      organisationName: "Government of Karnataka",
      region: "Kalyana Karnataka / Kalaburagi",
      constituency: "Chittapur (Assembly Constituency No. 40)",
      shortBio: "Cabinet Minister for Electronics, Information Technology & Biotechnology and Rural Development & Panchayat Raj in Karnataka; three-term MLA representing Chittapur.",
      biography: `Priyank Mallikarjun Kharge (born 22 November 1978) is an Indian politician serving as Cabinet Minister for Electronics, IT/BT and Rural Development & Panchayat Raj in Karnataka. He represents Chittapur in the Kalaburagi district.\n\nPolitical Career:\nKharge was first elected to the Karnataka Legislative Assembly in 2013 from Chittapur. In 2016, he became the youngest minister in the state cabinet upon appointment as Minister of State for IT, BT, and Tourism. During this tenure, he pioneered startup support mechanisms like the Elevate 100 program.\n\nIn May 2023, following re-election, he took charge of key economic and rural governance portfolios, driving decentralised tech cluster growth outside Bengaluru.`,
      portraitUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop",
      publicationStatus: PublicationStatus.IN_REVIEW,
      roleLastVerifiedAt: new Date("2026-10-25"),
    },
    create: {
      organisationId: org.id,
      slug: "priyank-kharge",
      displayName: "Priyank Kharge",
      kannadaName: "ಪ್ರಿಯಾಂಕ್ ಎಂ. ಖರ್ಗೆ",
      currentRole: "Minister for IT/BT and RDPR",
      organisationName: "Government of Karnataka",
      region: "Kalyana Karnataka / Kalaburagi",
      constituency: "Chittapur (Assembly Constituency No. 40)",
      shortBio: "Cabinet Minister for Electronics, Information Technology & Biotechnology and Rural Development & Panchayat Raj in Karnataka; three-term MLA representing Chittapur.",
      biography: `Priyank Mallikarjun Kharge (born 22 November 1978) is an Indian politician serving as Cabinet Minister for Electronics, IT/BT and Rural Development & Panchayat Raj in Karnataka. He represents Chittapur in the Kalaburagi district.\n\nPolitical Career:\nKharge was first elected to the Karnataka Legislative Assembly in 2013 from Chittapur. In 2016, he became the youngest minister in the state cabinet upon appointment as Minister of State for IT, BT, and Tourism. During this tenure, he pioneered startup support mechanisms like the Elevate 100 program.\n\nIn May 2023, following re-election, he took charge of key economic and rural governance portfolios, driving decentralised tech cluster growth outside Bengaluru.`,
      portraitUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop",
      publicationStatus: PublicationStatus.IN_REVIEW,
      roleLastVerifiedAt: new Date("2026-10-25"),
    },
  });

  await prisma.claimSource.deleteMany({ where: { profileId: khargeProfile.id } });
  await prisma.milestone.deleteMany({ where: { profileId: khargeProfile.id } });
  await prisma.initiative.deleteMany({ where: { profileId: khargeProfile.id } });

  await prisma.milestone.create({
    data: {
      profileId: khargeProfile.id,
      title: "First Elected MLA from Chittapur Constituency",
      description: "Elected to the 14th Karnataka Legislative Assembly from Chittapur.",
      eventYear: 2013,
      sortOrder: 1,
      verificationStatus: VerificationStatus.VERIFIED,
    },
  });

  await prisma.milestone.create({
    data: {
      profileId: khargeProfile.id,
      title: "Appointed Minister for IT/BT and RDPR",
      description: "Appointed to lead dual transformation portfolios spanning tech economy and rural administration.",
      eventYear: 2023,
      eventDate: new Date("2023-05-20"),
      sortOrder: 2,
      verificationStatus: VerificationStatus.VERIFIED,
    },
  });

  const khargeRevision = await prisma.revision.create({
    data: {
      profileId: khargeProfile.id,
      version: 1,
      contentSnapshot: {
        displayName: khargeProfile.displayName,
        currentRole: khargeProfile.currentRole,
        shortBio: khargeProfile.shortBio,
      },
      reviewStatus: ReviewStatus.IN_REVIEW,
      submittedById: editorUser.id,
      submittedAt: new Date("2026-10-27"),
    },
  });

  console.log("✓ Profile 4: Priyank Kharge (IN_REVIEW in Review Queue)");

  // ==========================================
  // PROFILE 5: M. B. Patil (APPROVED)
  // Demonstrates "Approved" waiting to be published!
  // ==========================================
  const mbPatilProfile = await prisma.leaderProfile.upsert({
    where: { organisationId_slug: { organisationId: org.id, slug: "mb-patil" } },
    update: {
      displayName: "M. B. Patil",
      kannadaName: "ಎಂ. ಬಿ. ಪಾಟೀಲ್",
      currentRole: "Minister for Large & Medium Industries and Infrastructure Development",
      organisationName: "Government of Karnataka",
      region: "North Karnataka / Vijayapura",
      constituency: "Babaleshwar (Assembly Constituency No. 29)",
      shortBio: "Cabinet Minister for Large and Medium Industries and Infrastructure Development; former Water Resources Minister and five-term legislator.",
      biography: `Mallanagouda Basanagouda Patil (born 7 October 1964) is an Indian politician and industrial administrator serving as Minister for Large and Medium Industries and Infrastructure Development in Karnataka.\n\nHe has served as MLA from Tikota (1991) and Babaleshwar (2008, 2013, 2018, 2023) and was elected to the 12th Lok Sabha from Bijapur in 1998.\n\nBetween 2013 and 2018, he served as Cabinet Minister for Major and Medium Irrigation, overseeing key North Karnataka canal and tank modernisation initiatives.`,
      portraitUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop",
      publicationStatus: PublicationStatus.APPROVED,
      roleLastVerifiedAt: new Date("2026-10-25"),
    },
    create: {
      organisationId: org.id,
      slug: "mb-patil",
      displayName: "M. B. Patil",
      kannadaName: "ಎಂ. ಬಿ. ಪಾಟೀಲ್",
      currentRole: "Minister for Large & Medium Industries and Infrastructure Development",
      organisationName: "Government of Karnataka",
      region: "North Karnataka / Vijayapura",
      constituency: "Babaleshwar (Assembly Constituency No. 29)",
      shortBio: "Cabinet Minister for Large and Medium Industries and Infrastructure Development; former Water Resources Minister and five-term legislator.",
      biography: `Mallanagouda Basanagouda Patil (born 7 October 1964) is an Indian politician and industrial administrator serving as Minister for Large and Medium Industries and Infrastructure Development in Karnataka.\n\nHe has served as MLA from Tikota (1991) and Babaleshwar (2008, 2013, 2018, 2023) and was elected to the 12th Lok Sabha from Bijapur in 1998.\n\nBetween 2013 and 2018, he served as Cabinet Minister for Major and Medium Irrigation, overseeing key North Karnataka canal and tank modernisation initiatives.`,
      portraitUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop",
      publicationStatus: PublicationStatus.APPROVED,
      roleLastVerifiedAt: new Date("2026-10-25"),
    },
  });

  const mbPatilRevision = await prisma.revision.create({
    data: {
      profileId: mbPatilProfile.id,
      version: 1,
      contentSnapshot: {
        displayName: mbPatilProfile.displayName,
        currentRole: mbPatilProfile.currentRole,
        shortBio: mbPatilProfile.shortBio,
      },
      reviewStatus: ReviewStatus.APPROVED,
      submittedById: editorUser.id,
      submittedAt: new Date("2026-10-26"),
    },
  });

  await prisma.reviewDecision.create({
    data: {
      revisionId: mbPatilRevision.id,
      reviewerId: reviewerUser.id,
      decision: DecisionType.APPROVED,
      reason: "Industrial portfolios and past irrigation milestones confirmed via state legislative directory.",
      createdAt: new Date("2026-10-27"),
    },
  });

  console.log("✓ Profile 5: M. B. Patil (APPROVED, ready to publish)");

  // ==========================================
  // PROFILE 6: Satish Jarkiholi (DRAFT)
  // Demonstrates working Draft editor!
  // ==========================================
  const jarkiholiProfile = await prisma.leaderProfile.upsert({
    where: { organisationId_slug: { organisationId: org.id, slug: "satish-jarkiholi" } },
    update: {
      displayName: "Satish Jarkiholi",
      kannadaName: "ಸತೀಶ್ ಜಾರಕಿಹೊಳಿ",
      currentRole: "Minister for Public Works Department",
      organisationName: "Government of Karnataka",
      region: "Kittur Karnataka / Belagavi",
      constituency: "Yemkanmardi (Assembly Constituency No. 10)",
      shortBio: "Cabinet Minister for Public Works Department in the Government of Karnataka; four-term MLA representing Yemkanmardi constituency.",
      biography: `Satish Laxmanrao Jarkiholi (born 1 June 1962) is an Indian politician and social activist currently serving as the Minister for Public Works in the Government of Karnataka.\n\nHe has represented the Yemkanmardi constituency in Belagavi district since 2008. He previously served as Minister for Small Scale Industries (2013–2015) and Minister for Forest, Ecology and Environment (2018–2019).`,
      portraitUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop",
      publicationStatus: PublicationStatus.DRAFT,
      roleLastVerifiedAt: new Date("2026-10-25"),
    },
    create: {
      organisationId: org.id,
      slug: "satish-jarkiholi",
      displayName: "Satish Jarkiholi",
      kannadaName: "ಸತೀಶ್ ಜಾರಕಿಹೊಳಿ",
      currentRole: "Minister for Public Works Department",
      organisationName: "Government of Karnataka",
      region: "Kittur Karnataka / Belagavi",
      constituency: "Yemkanmardi (Assembly Constituency No. 10)",
      shortBio: "Cabinet Minister for Public Works Department in the Government of Karnataka; four-term MLA representing Yemkanmardi constituency.",
      biography: `Satish Laxmanrao Jarkiholi (born 1 June 1962) is an Indian politician and social activist currently serving as the Minister for Public Works in the Government of Karnataka.\n\nHe has represented the Yemkanmardi constituency in Belagavi district since 2008. He previously served as Minister for Small Scale Industries (2013–2015) and Minister for Forest, Ecology and Environment (2018–2019).`,
      portraitUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop",
      publicationStatus: PublicationStatus.DRAFT,
      roleLastVerifiedAt: new Date("2026-10-25"),
    },
  });

  console.log("✓ Profile 6: Satish Jarkiholi (DRAFT in Profile Manager)");

  // ==========================================
  // 4. Seed Audit Events
  // ==========================================
  await prisma.auditEvent.createMany({
    data: [
      {
        organisationId: org.id,
        actorId: adminUser.id,
        action: "ORGANISATION_INITIALIZED",
        entityType: "Organisation",
        entityId: org.id,
        metadata: { edition: "Karnataka Edition", sourceAware: true },
        createdAt: new Date("2026-10-24T09:00:00Z"),
      },
      {
        organisationId: org.id,
        actorId: editorUser.id,
        action: "PROFILE_CREATED",
        entityType: "LeaderProfile",
        entityId: dksProfile.id,
        metadata: { slug: "dk-shivakumar", displayName: "D. K. Shivakumar" },
        createdAt: new Date("2026-10-24T10:15:00Z"),
      },
      {
        organisationId: org.id,
        actorId: editorUser.id,
        action: "REVISION_SUBMITTED",
        entityType: "Revision",
        entityId: dksRevision.id,
        metadata: { version: 1, milestoneCount: 5 },
        createdAt: new Date("2026-10-25T14:30:00Z"),
      },
      {
        organisationId: org.id,
        actorId: reviewerUser.id,
        action: "REVISION_APPROVED",
        entityType: "Revision",
        entityId: dksRevision.id,
        metadata: { version: 1, decision: "APPROVED" },
        createdAt: new Date("2026-10-26T11:00:00Z"),
      },
      {
        organisationId: org.id,
        actorId: adminUser.id,
        action: "PROFILE_PUBLISHED",
        entityType: "LeaderProfile",
        entityId: dksProfile.id,
        metadata: { slug: "dk-shivakumar", publishedRevisionId: dksRevision.id },
        createdAt: new Date("2026-10-26T11:05:00Z"),
      },
      {
        organisationId: org.id,
        actorId: editorUser.id,
        action: "PERMISSION_RECORDED",
        entityType: "ConsentRecord",
        entityId: dksConsent.id,
        metadata: { scope: "PROFILE_PUBLICATION", status: "VALID" },
        createdAt: new Date("2026-10-26T11:10:00Z"),
      },
    ],
  });

  console.log("✓ Audit log events populated");
  console.log("🎉 Seed finished successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
