import {
  Role,
  MembershipStatus,
  PublicationStatus,
  VerificationStatus,
  SourceType,
  RightsStatus,
  ConsentScope,
  ConsentStatus,
  ReviewStatus,
  DecisionType,
  ReservationType,
  ProjectStage,
  ProjectType,
} from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("🌱 Starting idempotent database seed for UCreates Karnataka Congress Platform...");

  // 1. Create Default Organisation
  const org = await prisma.organisation.upsert({
    where: { slug: "ucreates-karnataka" },
    update: {
      name: "Karnataka Pradesh Congress Committee (KPCC) Digital Platform",
      branding: {
        tagline: "Karnataka Congress Official Digital Leadership & Governance Platform",
        primaryColor: "#173B65",
        secondaryColor: "#F47A20",
        tertiaryColor: "#16864A",
        backgroundColor: "#F8F6F2",
        edition: "Karnataka Official Edition",
      },
    },
    create: {
      name: "Karnataka Pradesh Congress Committee (KPCC) Digital Platform",
      slug: "ucreates-karnataka",
      branding: {
        tagline: "Karnataka Congress Official Digital Leadership & Governance Platform",
        primaryColor: "#173B65",
        secondaryColor: "#F47A20",
        tertiaryColor: "#16864A",
        backgroundColor: "#F8F6F2",
        edition: "Karnataka Official Edition",
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
    update: {
      title: "Council of Ministers Portfolio Directory",
      url: "https://kla.kar.nic.in/council/govtminister.htm",
      checkedAt: new Date("2026-10-28"),
    },
    create: {
      id: "src-kla-council-ministers",
      organisationId: org.id,
      title: "Council of Ministers Portfolio Directory",
      url: "https://kla.kar.nic.in/council/govtminister.htm",
      publisher: "Karnataka Legislative Secretariat",
      sourceType: SourceType.OFFICIAL_GOVERNMENT,
      publicationDate: new Date("2023-05-28"),
      checkedAt: new Date("2026-10-28"),
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
      title: "Form 26 Candidate Affidavit - Kanakapura Assembly Constituency (No. 184)",
      url: "https://affidavit.eci.gov.in/",
      publisher: "Election Commission of India",
      sourceType: SourceType.LEGISLATIVE_ELECTION,
      publicationDate: new Date("2023-04-17"),
      checkedAt: new Date("2026-10-20"),
      verificationStatus: VerificationStatus.VERIFIED,
      notes: "Sworn legal declaration verifying educational qualifications and elective offices.",
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
      checkedAt: new Date("2026-10-28"),
      verificationStatus: VerificationStatus.VERIFIED,
      notes: "Official bio noting legislative tenures, Finance Minister tenure, and Chief Minister terms.",
      createdById: reviewerUser.id,
    },
  });

  const diprGuaranteesSource = await prisma.source.upsert({
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
      checkedAt: new Date("2026-10-28"),
      verificationStatus: VerificationStatus.VERIFIED,
      notes: "State executive gazette orders on the implementation of the 5 Guarantees framework.",
      createdById: adminUser.id,
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
      notes: "Reporting on state cabinet decisions regarding Bengaluru metropolitan infrastructure.",
      createdById: editorUser.id,
    },
  });

  const klaParameshwaraSource = await prisma.source.upsert({
    where: { id: "src-kla-parameshwara-bio" },
    update: {},
    create: {
      id: "src-kla-parameshwara-bio",
      organisationId: org.id,
      title: "Biographical Sketch of Dr. G. Parameshwara, Home Minister",
      url: "https://kla.kar.nic.in/assembly/member/16kla/parameshwara.pdf",
      publisher: "Karnataka Legislative Assembly Secretariat",
      sourceType: SourceType.OFFICIAL_GOVERNMENT,
      publicationDate: new Date("2023-06-01"),
      checkedAt: new Date("2026-10-28"),
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
      title: "Karnataka Innovation Agenda: IT/BT and RDPR Portfolios",
      url: "https://www.deccanherald.com/state/karnataka-politics/karnataka-cabinet-portfolios",
      publisher: "Deccan Herald",
      sourceType: SourceType.REPUTABLE_NEWS,
      publicationDate: new Date("2023-05-29"),
      checkedAt: new Date("2026-10-28"),
      verificationStatus: VerificationStatus.VERIFIED,
      notes: "Independent reporting on IT/BT and RDPR portfolios assigned to Priyank Kharge.",
      createdById: editorUser.id,
    },
  });

  console.log("✓ Sourced registry items populated");

  // ==========================================
  // 4. SEED CORE LEADERSHIP PROFILES
  // ==========================================

  // Leader 1: Siddaramaiah (Chief Minister of Karnataka)
  const siddaProfile = await prisma.leaderProfile.upsert({
    where: { organisationId_slug: { organisationId: org.id, slug: "siddaramaiah" } },
    update: {
      displayName: "Siddaramaiah",
      kannadaName: "ಸಿದ್ದರಾಮಯ್ಯ",
      currentRole: "Former Chief Minister & Senior CLP Leader",
      party: "Indian National Congress",
      portfolio: "Former Chief Minister of Karnataka (2013–2018, 2023–2026), Congress Legislature Party Senior Leader",
      organisationName: "Government of Karnataka",
      district: "Mysuru",
      region: "Old Mysuru Region",
      constituency: "Varuna (Assembly Constituency No. 221)",
      assemblyNumber: 221,
      isMinister: false,
      isMla: true,
      isMlc: false,
      shortBio: "Former Chief Minister of Karnataka (2013–2018, 2023–2026) and senior CLP leader; veteran parliamentarian and record 15-time state budget presenter representing Varuna.",
      biography: `Siddaramaiah (born 12 August 1948) is an Indian politician and administrator serving as the Chief Minister of Karnataka. A senior leader of the Indian National Congress and champion of social justice, he has represented Varuna and Chamundeshwari in the Karnataka Legislative Assembly across nine legislative terms.\n\nEducation and Legal Career:\nBorn in Siddaramanahundi, Mysuru district, he graduated with a Bachelor of Science from Yuvaraja College, University of Mysore, and earned a Bachelor of Laws (LL.B.) from Vidyavardhaka Law College in Mysuru, practicing law briefly before entering active public life.\n\nLegislative Journey:\nFirst elected to the Karnataka Legislative Assembly in 1983 from Chamundeshwari, Siddaramaiah has served as Minister for Sericulture and Animal Husbandry, Finance Minister, and twice as Deputy Chief Minister (1996–1999 and 2004–2005). He has presented 15 state budgets—a record in Karnataka legislative history.\n\nChief Ministerial Tenures:\nIn May 2013, he became the 22nd Chief Minister of Karnataka, completing a full five-year term (2013–2018). Following the 2023 assembly elections in which the Congress party won a decisive majority of 135 seats, Siddaramaiah was sworn in for his second tenure as Chief Minister on 20 May 2023. Under his leadership, the state launched the landmark Five Guarantees citizen welfare architecture.`,
      portraitUrl: "/images/portraits/siddaramaiah.jpg",
      publicationStatus: PublicationStatus.PUBLISHED,
      roleLastVerifiedAt: new Date("2026-10-28"),
    },
    create: {
      organisationId: org.id,
      slug: "siddaramaiah",
      displayName: "Siddaramaiah",
      kannadaName: "ಸಿದ್ದರಾಮಯ್ಯ",
      currentRole: "Former Chief Minister & Senior CLP Leader",
      party: "Indian National Congress",
      portfolio: "Former Chief Minister of Karnataka (2013–2018, 2023–2026), Congress Legislature Party Senior Leader",
      organisationName: "Government of Karnataka",
      district: "Mysuru",
      region: "Old Mysuru Region",
      constituency: "Varuna (Assembly Constituency No. 221)",
      assemblyNumber: 221,
      isMinister: false,
      isMla: true,
      isMlc: false,
      shortBio: "Former Chief Minister of Karnataka (2013–2018, 2023–2026) and senior CLP leader; veteran parliamentarian and record 15-time state budget presenter representing Varuna.",
      biography: `Siddaramaiah (born 12 August 1948) is an Indian politician and administrator serving as the Chief Minister of Karnataka. A senior leader of the Indian National Congress and champion of social justice, he has represented Varuna and Chamundeshwari in the Karnataka Legislative Assembly across nine legislative terms.\n\nEducation and Legal Career:\nBorn in Siddaramanahundi, Mysuru district, he graduated with a Bachelor of Science from Yuvaraja College, University of Mysore, and earned a Bachelor of Laws (LL.B.) from Vidyavardhaka Law College in Mysuru, practicing law briefly before entering active public life.\n\nLegislative Journey:\nFirst elected to the Karnataka Legislative Assembly in 1983 from Chamundeshwari, Siddaramaiah has served as Minister for Sericulture and Animal Husbandry, Finance Minister, and twice as Deputy Chief Minister (1996–1999 and 2004–2005). He has presented 15 state budgets—a record in Karnataka legislative history.\n\nChief Ministerial Tenures:\nIn May 2013, he became the 22nd Chief Minister of Karnataka, completing a full five-year term (2013–2018). Following the 2023 assembly elections in which the Congress party won a decisive majority of 135 seats, Siddaramaiah was sworn in for his second tenure as Chief Minister on 20 May 2023. Under his leadership, the state launched the landmark Five Guarantees citizen welfare architecture.`,
      portraitUrl: "/images/portraits/siddaramaiah.jpg",
      publicationStatus: PublicationStatus.PUBLISHED,
      roleLastVerifiedAt: new Date("2026-10-28"),
    },
  });

  // Clear existing milestones and initiatives for clean idempotent refresh
  await prisma.claimSource.deleteMany({ where: { profileId: siddaProfile.id } });
  await prisma.milestone.deleteMany({ where: { profileId: siddaProfile.id } });
  await prisma.initiative.deleteMany({ where: { profileId: siddaProfile.id } });

  const siddaM1 = await prisma.milestone.create({
    data: {
      profileId: siddaProfile.id,
      title: "First Elected to Karnataka Legislative Assembly (Chamundeshwari)",
      description: "Won election from Chamundeshwari constituency during the 7th Assembly election, marking entry into state legislature.",
      eventYear: 1983,
      sortOrder: 1,
      verificationStatus: VerificationStatus.VERIFIED,
    },
  });

  const siddaM2 = await prisma.milestone.create({
    data: {
      profileId: siddaProfile.id,
      title: "Finance Minister & Deputy Chief Minister",
      description: "Appointed Finance Minister and presented maiden state budget, beginning an unprecedented 15-budget record in Karnataka.",
      eventYear: 1994,
      sortOrder: 2,
      verificationStatus: VerificationStatus.VERIFIED,
    },
  });

  const siddaM3 = await prisma.milestone.create({
    data: {
      profileId: siddaProfile.id,
      title: "Sworn in as 22nd Chief Minister of Karnataka",
      description: "Led Congress to absolute majority in 2013 assembly elections and completed full 5-year constitutional tenure (2013–2018).",
      eventYear: 2013,
      sortOrder: 3,
      verificationStatus: VerificationStatus.VERIFIED,
    },
  });

  const siddaM4 = await prisma.milestone.create({
    data: {
      profileId: siddaProfile.id,
      title: "Sworn in for Second Tenure as Chief Minister of Karnataka",
      description: "Took oath of office as Chief Minister on 20 May 2023 at Kanteerava Stadium, Bengaluru after Congress won 135 seats in 16th Assembly.",
      eventYear: 2023,
      eventDate: new Date("2023-05-20"),
      sortOrder: 4,
      verificationStatus: VerificationStatus.VERIFIED,
    },
  });

  const siddaI1 = await prisma.initiative.create({
    data: {
      profileId: siddaProfile.id,
      title: "Five Guarantees Welfare Architecture",
      description: "Rollout of Gruha Lakshmi, Gruha Jyothi, Shakthi, Anna Bhagya, and Yuva Nidhi reaching over 1.2 crore households across Karnataka.",
      startDate: new Date("2023-06-01"),
      verificationStatus: VerificationStatus.VERIFIED,
    },
  });

  await prisma.claimSource.createMany({
    data: [
      { sourceId: klaSiddaramaiahSource.id, milestoneId: siddaM3.id, relationshipNotes: "Official biographical gazette record." },
      { sourceId: klaMinistersSource.id, milestoneId: siddaM4.id, relationshipNotes: "Sworn in as Chief Minister per KLA Council of Ministers roster." },
      { sourceId: diprGuaranteesSource.id, initiativeId: siddaI1.id, relationshipNotes: "Executive gazette orders for 5 Guarantees." },
    ],
  });

  // Revision & Review for Siddaramaiah
  const siddaRevision = await prisma.revision.create({
    data: {
      profileId: siddaProfile.id,
      version: 1,
      contentSnapshot: {
        displayName: siddaProfile.displayName,
        kannadaName: siddaProfile.kannadaName,
        currentRole: siddaProfile.currentRole,
        party: siddaProfile.party,
        portfolio: siddaProfile.portfolio,
        district: siddaProfile.district,
        constituency: siddaProfile.constituency,
        portraitUrl: siddaProfile.portraitUrl,
        shortBio: siddaProfile.shortBio,
      },
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
      reason: "Confirmed current Chief Ministership, Varuna (AC #221) constituency and Finance portfolio against KLA directory.",
      createdAt: new Date("2026-10-25"),
    },
  });

  await prisma.leaderProfile.update({
    where: { id: siddaProfile.id },
    data: { publishedRevisionId: siddaRevision.id },
  });

  console.log("✓ Profile 1: Siddaramaiah (Former Chief Minister - PUBLISHED)");

  // Leader 2: D. K. Shivakumar (Deputy Chief Minister & KPCC President)
  const dksProfile = await prisma.leaderProfile.upsert({
    where: { organisationId_slug: { organisationId: org.id, slug: "dk-shivakumar" } },
    update: {
      displayName: "D. K. Shivakumar",
      kannadaName: "ಡಿ. ಕೆ. ಶಿವಕುಮಾರ್",
      currentRole: "Chief Minister of Karnataka",
      party: "Indian National Congress",
      portfolio: "Finance; Cabinet Affairs; Department of Personnel and Administrative Reforms (DPAR); Intelligence; Information and Public Relations (DIPR); Law, Justice and Human Rights; Parliamentary Affairs and Legislation; Agriculture Marketing; Commissionerate of Town & Country Planning; Urban Local Bodies (BDA & BMRDA areas); Planning & Statistics; All Unallocated Portfolios",
      organisationName: "Government of Karnataka",
      district: "Ramanagara",
      region: "Southern Karnataka / Bengaluru Region",
      constituency: "Kanakapura (Assembly Constituency No. 184)",
      assemblyNumber: 184,
      isMinister: true,
      isMla: true,
      isMlc: false,
      shortBio: "Chief Minister of Karnataka and President of KPCC; eight-term legislator representing Kanakapura (AC No. 184) leading state executive governance, Finance, Cabinet Affairs, DPAR, and State Intelligence.",
      biography: `Doddalahalli Kempegowda Shivakumar (born 15 May 1962) is an Indian politician and administrator serving as the Chief Minister of Karnataka. He concurrently serves as the President of the Karnataka Pradesh Congress Committee (KPCC). An eight-term Member of the Karnataka Legislative Assembly, he represents the Kanakapura assembly constituency in Ramanagara district.\n\nEarly Life and Education:\nBorn in Kanakapura, Shivakumar graduated with a Bachelor of Arts degree from APS College of Arts and Science, Bengaluru, and subsequently earned a Master of Arts in Political Science from Karnataka State Open University (KSOU), as verified in statutory Election Commission affidavits.\n\nPublic Career:\nShivakumar entered active public life through student leadership, rising through the National Students' Union of India (NSUI) and Karnataka Pradesh Youth Congress. In 1989, at age 27, he was elected to the Karnataka Legislative Assembly from Sathanur. Following the 2008 delimitation, he has represented Kanakapura continuously in 2008, 2013, 2018, and 2023.\n\nExecutive Governance:\nOver a distinguished legislative career, Shivakumar has held major ministerial portfolios in the Government of Karnataka:\n- Minister of State for Prisons (1991–1992)\n- Minister of State for Agriculture (1992–1994)\n- Minister for Urban Development (1999–2004)\n- Cabinet Minister for Energy (2014–2018), overseeing the 2,050 MW Pavagada Solar Park\n- Cabinet Minister for Major Water Resources and Medical Education (2018–2019)\n- Deputy Chief Minister of Karnataka (sworn in May 2023)\n- Chief Minister of Karnataka, with portfolios including Finance, Cabinet Affairs, DPAR, Intelligence, DIPR, Planning, and Town & Country Planning.\n\nHe has served as President of the Karnataka Pradesh Congress Committee (KPCC) since July 2020.`,
      portraitUrl: "/images/portraits/dk-shivakumar.jpg",
      publicationStatus: PublicationStatus.PUBLISHED,
      roleLastVerifiedAt: new Date("2026-11-03"),
    },
    create: {
      organisationId: org.id,
      slug: "dk-shivakumar",
      displayName: "D. K. Shivakumar",
      kannadaName: "ಡಿ. ಕೆ. ಶಿವಕುಮಾರ್",
      currentRole: "Chief Minister of Karnataka",
      party: "Indian National Congress",
      portfolio: "Finance; Cabinet Affairs; Department of Personnel and Administrative Reforms (DPAR); Intelligence; Information and Public Relations (DIPR); Law, Justice and Human Rights; Parliamentary Affairs and Legislation; Agriculture Marketing; Commissionerate of Town & Country Planning; Urban Local Bodies (BDA & BMRDA areas); Planning & Statistics; All Unallocated Portfolios",
      organisationName: "Government of Karnataka",
      district: "Ramanagara",
      region: "Southern Karnataka / Bengaluru Region",
      constituency: "Kanakapura (Assembly Constituency No. 184)",
      assemblyNumber: 184,
      isMinister: true,
      isMla: true,
      isMlc: false,
      shortBio: "Chief Minister of Karnataka and President of KPCC; eight-term legislator representing Kanakapura (AC No. 184) leading state executive governance, Finance, Cabinet Affairs, DPAR, and State Intelligence.",
      biography: `Doddalahalli Kempegowda Shivakumar (born 15 May 1962) is an Indian politician and administrator serving as the Chief Minister of Karnataka. He concurrently serves as the President of the Karnataka Pradesh Congress Committee (KPCC). An eight-term Member of the Karnataka Legislative Assembly, he represents the Kanakapura assembly constituency in Ramanagara district.\n\nEarly Life and Education:\nBorn in Kanakapura, Shivakumar graduated with a Bachelor of Arts degree from APS College of Arts and Science, Bengaluru, and subsequently earned a Master of Arts in Political Science from Karnataka State Open University (KSOU), as verified in statutory Election Commission affidavits.\n\nPublic Career:\nShivakumar entered active public life through student leadership, rising through the National Students' Union of India (NSUI) and Karnataka Pradesh Youth Congress. In 1989, at age 27, he was elected to the Karnataka Legislative Assembly from Sathanur. Following the 2008 delimitation, he has represented Kanakapura continuously in 2008, 2013, 2018, and 2023.\n\nExecutive Governance:\nOver a distinguished legislative career, Shivakumar has held major ministerial portfolios in the Government of Karnataka:\n- Minister of State for Prisons (1991–1992)\n- Minister of State for Agriculture (1992–1994)\n- Minister for Urban Development (1999–2004)\n- Cabinet Minister for Energy (2014–2018), overseeing the 2,050 MW Pavagada Solar Park\n- Cabinet Minister for Major Water Resources and Medical Education (2018–2019)\n- Deputy Chief Minister of Karnataka (sworn in May 2023)\n- Chief Minister of Karnataka, with portfolios including Finance, Cabinet Affairs, DPAR, Intelligence, DIPR, Planning, and Town & Country Planning.\n\nHe has served as President of the Karnataka Pradesh Congress Committee (KPCC) since July 2020.`,
      portraitUrl: "/images/portraits/dk-shivakumar.jpg",
      publicationStatus: PublicationStatus.PUBLISHED,
      roleLastVerifiedAt: new Date("2026-11-03"),
    },
  });

  await prisma.claimSource.deleteMany({ where: { profileId: dksProfile.id } });
  await prisma.milestone.deleteMany({ where: { profileId: dksProfile.id } });
  await prisma.initiative.deleteMany({ where: { profileId: dksProfile.id } });

  const dksM1 = await prisma.milestone.create({
    data: {
      profileId: dksProfile.id,
      title: "First Elected to Karnataka Legislative Assembly (Sathanur)",
      description: "Elected as MLA from Sathanur assembly constituency during the 9th Karnataka Legislative Assembly elections at age 27.",
      eventYear: 1989,
      sortOrder: 1,
      verificationStatus: VerificationStatus.VERIFIED,
    },
  });

  const dksM2 = await prisma.milestone.create({
    data: {
      profileId: dksProfile.id,
      title: "Cabinet Minister for Energy — Pavagada Solar Initiative",
      description: "Initiated and oversaw development of the 2,050 MW Pavagada Solar Park in Tumakuru district, then one of the largest solar parks globally.",
      eventYear: 2014,
      sortOrder: 2,
      verificationStatus: VerificationStatus.VERIFIED,
    },
  });

  const dksM3 = await prisma.milestone.create({
    data: {
      profileId: dksProfile.id,
      title: "Appointed President of Karnataka Pradesh Congress Committee",
      description: "Took charge as KPCC President in July 2020, revitalizing grassroots party organization across all 224 assembly constituencies.",
      eventYear: 2020,
      eventDate: new Date("2020-07-02"),
      sortOrder: 3,
      verificationStatus: VerificationStatus.VERIFIED,
    },
  });

  const dksM4 = await prisma.milestone.create({
    data: {
      profileId: dksProfile.id,
      title: "Sworn in as Deputy Chief Minister of Karnataka",
      description: "Took oath of office as Deputy Chief Minister alongside Chief Minister Siddaramaiah on 20 May 2023, allocated Irrigation and Bengaluru Development.",
      eventYear: 2023,
      eventDate: new Date("2023-05-20"),
      sortOrder: 4,
      verificationStatus: VerificationStatus.VERIFIED,
    },
  });

  const dksI1 = await prisma.initiative.create({
    data: {
      profileId: dksProfile.id,
      title: "Brand Bengaluru Strategic Urban Development Framework",
      description: "Integrated infrastructure initiative focusing on road decongestion, stormwater drain management, solid waste management, and green spaces.",
      startDate: new Date("2023-06-21"),
      verificationStatus: VerificationStatus.VERIFIED,
    },
  });

  const dksI2 = await prisma.initiative.create({
    data: {
      profileId: dksProfile.id,
      title: "Mekedatu Balancing Reservoir Project Pursuit",
      description: "Statutory advancement of the 67 TMC drinking water and hydel project for the Bengaluru metropolitan region.",
      startDate: new Date("2023-07-01"),
      verificationStatus: VerificationStatus.VERIFIED,
    },
  });

  await prisma.claimSource.createMany({
    data: [
      { sourceId: klaMinistersSource.id, milestoneId: dksM4.id, relationshipNotes: "Gazette roster verifying Deputy Chief Minister and portfolios." },
      { sourceId: eciAffidavitDksSource.id, milestoneId: dksM1.id, relationshipNotes: "Election affidavit certifying elective milestones." },
      { sourceId: theHinduBmrSource.id, initiativeId: dksI1.id, relationshipNotes: "Press reporting on Brand Bengaluru launch." },
    ],
  });

  const dksRevision = await prisma.revision.create({
    data: {
      profileId: dksProfile.id,
      version: 1,
      contentSnapshot: {
        displayName: dksProfile.displayName,
        kannadaName: dksProfile.kannadaName,
        currentRole: dksProfile.currentRole,
        party: dksProfile.party,
        portfolio: dksProfile.portfolio,
        district: dksProfile.district,
        constituency: dksProfile.constituency,
        portraitUrl: dksProfile.portraitUrl,
        shortBio: dksProfile.shortBio,
      },
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
      reason: "Deputy Chief Minister designation, Kanakapura (AC #184) constituency and Irrigation/Bengaluru portfolios verified.",
      createdAt: new Date("2026-10-26"),
    },
  });

  await prisma.leaderProfile.update({
    where: { id: dksProfile.id },
    data: { publishedRevisionId: dksRevision.id },
  });

  console.log("✓ Profile 2: D. K. Shivakumar (Chief Minister of Karnataka - PUBLISHED)");

  // Leader 3: Dr. G. Parameshwara (Home Minister)
  const parameshwaraProfile = await prisma.leaderProfile.upsert({
    where: { organisationId_slug: { organisationId: org.id, slug: "g-parameshwara" } },
    update: {
      displayName: "Dr. G. Parameshwara",
      kannadaName: "ಡಾ. ಜಿ. ಪರಮೇಶ್ವರ",
      currentRole: "Deputy Chief Minister of Karnataka",
      party: "Indian National Congress",
      portfolio: "Revenue and Sports",
      organisationName: "Government of Karnataka",
      district: "Tumakuru",
      region: "Central Karnataka / Tumakuru",
      constituency: "Koratagere (SC) (Assembly Constituency No. 132)",
      assemblyNumber: 132,
      isMinister: true,
      isMla: true,
      isMlc: false,
      shortBio: "Deputy Chief Minister of Karnataka; veteran statesman, longest-serving KPCC President, six-term legislator representing Koratagere (SC), with executive ministerial charge of Revenue and Sports, and agricultural scientist with Ph.D. from Adelaide.",
      biography: `Dr. Gangadharaiah Parameshwara (born 6 August 1951) is an Indian politician, agricultural scientist, and educational administrator serving as Deputy Chief Minister of Karnataka with ministerial charge of Revenue and Sports. He is a six-term legislator representing Koratagere (SC) in Tumakuru district.\n\nAcademic Background:\nDr. Parameshwara holds a B.Sc. and M.Sc. in Agriculture from the University of Agricultural Sciences, Bangalore. He was awarded a Ph.D. in Plant Physiology from the Waite Agricultural Research Institute, University of Adelaide, Australia.\n\nPublic Service and Governance:\nFirst elected to the Karnataka Assembly in 1989 from Madhugiri, he previously served in ministerial portfolios including Sericulture (1993), Higher Education (1999–2004), and Home Affairs (2015–2017; 2018–2019) in prior administrations.\n\nHe served as the President of the Karnataka Pradesh Congress Committee for eight consecutive years (2010–2018), the longest tenure in state party history. In the current government, he serves as Deputy Chief Minister holding executive portfolios for Revenue and Youth Empowerment & Sports.`,
      portraitUrl: "/images/portraits/g-parameshwara.jpg",
      publicationStatus: PublicationStatus.PUBLISHED,
      roleLastVerifiedAt: new Date("2026-11-03"),
    },
    create: {
      organisationId: org.id,
      slug: "g-parameshwara",
      displayName: "Dr. G. Parameshwara",
      kannadaName: "ಡಾ. ಜಿ. ಪರಮೇಶ್ವರ",
      currentRole: "Deputy Chief Minister of Karnataka",
      party: "Indian National Congress",
      portfolio: "Revenue and Sports",
      organisationName: "Government of Karnataka",
      district: "Tumakuru",
      region: "Central Karnataka / Tumakuru",
      constituency: "Koratagere (SC) (Assembly Constituency No. 132)",
      assemblyNumber: 132,
      isMinister: true,
      isMla: true,
      isMlc: false,
      shortBio: "Deputy Chief Minister of Karnataka; veteran statesman, longest-serving KPCC President, six-term legislator representing Koratagere (SC), with executive ministerial charge of Revenue and Sports, and agricultural scientist with Ph.D. from Adelaide.",
      biography: `Dr. Gangadharaiah Parameshwara (born 6 August 1951) is an Indian politician, agricultural scientist, and educational administrator serving as Deputy Chief Minister of Karnataka with ministerial charge of Revenue and Sports. He is a six-term legislator representing Koratagere (SC) in Tumakuru district.\n\nAcademic Background:\nDr. Parameshwara holds a B.Sc. and M.Sc. in Agriculture from the University of Agricultural Sciences, Bangalore. He was awarded a Ph.D. in Plant Physiology from the Waite Agricultural Research Institute, University of Adelaide, Australia.\n\nPublic Service and Governance:\nFirst elected to the Karnataka Assembly in 1989 from Madhugiri, he previously served in ministerial portfolios including Sericulture (1993), Higher Education (1999–2004), and Home Affairs (2015–2017; 2018–2019) in prior administrations.\n\nHe served as the President of the Karnataka Pradesh Congress Committee for eight consecutive years (2010–2018), the longest tenure in state party history. In the current government, he serves as Deputy Chief Minister holding executive portfolios for Revenue and Youth Empowerment & Sports.`,
      portraitUrl: "/images/portraits/g-parameshwara.jpg",
      publicationStatus: PublicationStatus.PUBLISHED,
      roleLastVerifiedAt: new Date("2026-11-03"),
    },
  });

  await prisma.claimSource.deleteMany({ where: { profileId: parameshwaraProfile.id } });
  await prisma.milestone.deleteMany({ where: { profileId: parameshwaraProfile.id } });
  await prisma.initiative.deleteMany({ where: { profileId: parameshwaraProfile.id } });

  const paramM1 = await prisma.milestone.create({
    data: {
      profileId: parameshwaraProfile.id,
      title: "Doctoral Degree in Agriculture (University of Adelaide)",
      description: "Conducted doctoral research in plant drought physiology at Waite Agricultural Research Institute, Adelaide, Australia.",
      eventYear: 1984,
      sortOrder: 1,
      verificationStatus: VerificationStatus.VERIFIED,
    },
  });

  const paramM2 = await prisma.milestone.create({
    data: {
      profileId: parameshwaraProfile.id,
      title: "Appointed Cabinet Minister for Revenue and Sports",
      description: "Assumed executive ministerial responsibilities for Revenue land administration and Youth Empowerment & Sports in the Government of Karnataka.",
      eventYear: 2023,
      eventDate: new Date("2023-05-20"),
      sortOrder: 2,
      verificationStatus: VerificationStatus.VERIFIED,
    },
  });

  await prisma.claimSource.createMany({
    data: [
      { sourceId: klaParameshwaraSource.id, milestoneId: paramM1.id, relationshipNotes: "Biographical dossier verified." },
      { sourceId: klaMinistersSource.id, milestoneId: paramM2.id, relationshipNotes: "KLA Council of Ministers Gazette." },
    ],
  });

  const paramRevision = await prisma.revision.create({
    data: {
      profileId: parameshwaraProfile.id,
      version: 1,
      contentSnapshot: {
        displayName: parameshwaraProfile.displayName,
        kannadaName: parameshwaraProfile.kannadaName,
        currentRole: parameshwaraProfile.currentRole,
        portfolio: parameshwaraProfile.portfolio,
        district: parameshwaraProfile.district,
        constituency: parameshwaraProfile.constituency,
      },
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
      reason: "Confirmed Deputy Chief Minister designation, Revenue and Sports portfolios, and Koratagere (SC #132) constituency.",
      createdAt: new Date("2026-10-25"),
    },
  });

  await prisma.leaderProfile.update({
    where: { id: parameshwaraProfile.id },
    data: { publishedRevisionId: paramRevision.id },
  });

  console.log("✓ Profile 3: Dr. G. Parameshwara (Deputy Chief Minister - PUBLISHED)");

  // Leader 4: Priyank Kharge (Minister for RDPR, IT & BT)
  const khargeProfile = await prisma.leaderProfile.upsert({
    where: { organisationId_slug: { organisationId: org.id, slug: "priyank-kharge" } },
    update: {
      displayName: "Priyank Kharge",
      kannadaName: "ಪ್ರಿಯಾಂಕ್ ಎಂ. ಖರ್ಗೆ",
      currentRole: "Cabinet Minister for Home (excl. Intelligence), IT & BT, and E-Governance",
      party: "Indian National Congress",
      portfolio: "Home (excluding Intelligence), Information Technology & Biotechnology (IT & BT), and E-Governance",
      organisationName: "Government of Karnataka",
      district: "Kalaburagi",
      region: "Kalyana Karnataka / Kalaburagi",
      constituency: "Chittapur (SC) (Assembly Constituency No. 40)",
      assemblyNumber: 40,
      isMinister: true,
      isMla: true,
      isMlc: false,
      shortBio: "Cabinet Minister for Home (excluding Intelligence), IT & BT, and E-Governance; three-term MLA representing Chittapur (SC) leading state police oversight, digital e-governance, and tech cluster innovation.",
      biography: `Priyank Mallikarjun Kharge (born 22 November 1978) is an Indian politician serving as Cabinet Minister for Home (excluding Intelligence), Information Technology & Biotechnology, and E-Governance in Karnataka. He represents Chittapur (SC) in Kalaburagi district.\n\nPolitical Career:\nKharge was first elected to the Karnataka Legislative Assembly in 2013 from Chittapur. In 2016, he became the youngest minister in the state cabinet upon appointment as Minister of State for IT, BT, and Tourism, pioneering startup initiatives like Elevate 100.\n\nIn May 2023, he assumed leadership of the Home (excluding Intelligence), IT & BT, and E-Governance departments, spearheading state police modernization, digital public service delivery, and innovation.`,
      portraitUrl: "/images/portraits/priyank-kharge.jpg",
      publicationStatus: PublicationStatus.PUBLISHED,
      roleLastVerifiedAt: new Date("2026-10-28"),
    },
    create: {
      organisationId: org.id,
      slug: "priyank-kharge",
      displayName: "Priyank Kharge",
      kannadaName: "ಪ್ರಿಯಾಂಕ್ ಎಂ. ಖರ್ಗೆ",
      currentRole: "Cabinet Minister for Home (excl. Intelligence), IT & BT, and E-Governance",
      party: "Indian National Congress",
      portfolio: "Home (excluding Intelligence), Information Technology & Biotechnology (IT & BT), and E-Governance",
      organisationName: "Government of Karnataka",
      district: "Kalaburagi",
      region: "Kalyana Karnataka / Kalaburagi",
      constituency: "Chittapur (SC) (Assembly Constituency No. 40)",
      assemblyNumber: 40,
      isMinister: true,
      isMla: true,
      isMlc: false,
      shortBio: "Cabinet Minister for Home (excluding Intelligence), IT & BT, and E-Governance; three-term MLA representing Chittapur (SC) leading state police oversight, digital e-governance, and tech cluster innovation.",
      biography: `Priyank Mallikarjun Kharge (born 22 November 1978) is an Indian politician serving as Cabinet Minister for Home (excluding Intelligence), Information Technology & Biotechnology, and E-Governance in Karnataka. He represents Chittapur (SC) in Kalaburagi district.\n\nPolitical Career:\nKharge was first elected to the Karnataka Legislative Assembly in 2013 from Chittapur. In 2016, he became the youngest minister in the state cabinet upon appointment as Minister of State for IT, BT, and Tourism, pioneering startup initiatives like Elevate 100.\n\nIn May 2023, he assumed leadership of the Home (excluding Intelligence), IT & BT, and E-Governance departments, spearheading state police modernization, digital public service delivery, and innovation.`,
      portraitUrl: "/images/portraits/priyank-kharge.jpg",
      publicationStatus: PublicationStatus.PUBLISHED,
      roleLastVerifiedAt: new Date("2026-10-28"),
    },
  });

  await prisma.claimSource.deleteMany({ where: { profileId: khargeProfile.id } });
  await prisma.milestone.deleteMany({ where: { profileId: khargeProfile.id } });
  await prisma.initiative.deleteMany({ where: { profileId: khargeProfile.id } });

  const khargeM1 = await prisma.milestone.create({
    data: {
      profileId: khargeProfile.id,
      title: "First Elected MLA from Chittapur (SC)",
      description: "Elected to the 14th Karnataka Legislative Assembly from Chittapur constituency.",
      eventYear: 2013,
      sortOrder: 1,
      verificationStatus: VerificationStatus.VERIFIED,
    },
  });

  const khargeM2 = await prisma.milestone.create({
    data: {
      profileId: khargeProfile.id,
      title: "Appointed Cabinet Minister for Home, IT & BT, and E-Governance",
      description: "Appointed to lead state internal security oversight, IT/BT innovation ecosystem, and paperless digital e-governance administration.",
      eventYear: 2023,
      eventDate: new Date("2023-05-20"),
      sortOrder: 2,
      verificationStatus: VerificationStatus.VERIFIED,
    },
  });

  await prisma.claimSource.createMany({
    data: [
      { sourceId: decanHeraldKhargeSource.id, milestoneId: khargeM2.id, relationshipNotes: "Portfolio verified in news coverage." },
      { sourceId: klaMinistersSource.id, milestoneId: khargeM2.id, relationshipNotes: "KLA Council of Ministers Gazette." },
    ],
  });

  const khargeRevision = await prisma.revision.create({
    data: {
      profileId: khargeProfile.id,
      version: 1,
      contentSnapshot: {
        displayName: khargeProfile.displayName,
        currentRole: khargeProfile.currentRole,
        portfolio: khargeProfile.portfolio,
        district: khargeProfile.district,
        constituency: khargeProfile.constituency,
      },
      reviewStatus: ReviewStatus.PUBLISHED,
      submittedById: editorUser.id,
      submittedAt: new Date("2026-10-27"),
    },
  });

  await prisma.reviewDecision.create({
    data: {
      revisionId: khargeRevision.id,
      reviewerId: reviewerUser.id,
      decision: DecisionType.APPROVED,
      reason: "Confirmed Chittapur (SC #44) constituency and RDPR / IT-BT ministerial roles.",
      createdAt: new Date("2026-10-27"),
    },
  });

  await prisma.leaderProfile.update({
    where: { id: khargeProfile.id },
    data: { publishedRevisionId: khargeRevision.id },
  });

  console.log("✓ Profile 4: Priyank Kharge (Minister for RDPR, IT & BT - PUBLISHED)");

  // Leader 5: M. B. Patil (Large & Medium Industries & Infrastructure)
  const mbPatilProfile = await prisma.leaderProfile.upsert({
    where: { organisationId_slug: { organisationId: org.id, slug: "mb-patil" } },
    update: {
      displayName: "M. B. Patil",
      kannadaName: "ಎಂ. ಬಿ. ಪಾಟೀಲ್",
      currentRole: "Cabinet Minister for Large & Medium Industries",
      party: "Indian National Congress",
      portfolio: "Large and Medium Industries, Infrastructure Development",
      organisationName: "Government of Karnataka",
      district: "Vijayapura",
      region: "Kittur Karnataka / Vijayapura",
      constituency: "Babaleshwar (Assembly Constituency No. 29)",
      assemblyNumber: 29,
      isMinister: true,
      isMla: true,
      isMlc: false,
      shortBio: "Cabinet Minister for Large & Medium Industries and Infrastructure Development; former Water Resources Minister and five-term MLA representing Babaleshwar.",
      biography: `Mallanagouda Basanagouda Patil (born 7 October 1964) is an Indian politician and industrial administrator serving as Minister for Large and Medium Industries and Infrastructure Development in Karnataka.\n\nHe has represented Babaleshwar in Vijayapura district since 2008 and previously served as MLA from Tikota (1991) and MP for Bijapur (1998).\n\nBetween 2013 and 2018, he served as Cabinet Minister for Major and Medium Irrigation, spearheading major North Karnataka irrigation canal projects. In May 2023, he assumed charge of the Industries and Infrastructure Development portfolio.`,
      portraitUrl: "/images/portraits/mb-patil.jpg",
      publicationStatus: PublicationStatus.PUBLISHED,
      roleLastVerifiedAt: new Date("2026-10-28"),
    },
    create: {
      organisationId: org.id,
      slug: "mb-patil",
      displayName: "M. B. Patil",
      kannadaName: "ಎಂ. ಬಿ. ಪಾಟೀಲ್",
      currentRole: "Cabinet Minister for Large & Medium Industries",
      party: "Indian National Congress",
      portfolio: "Large and Medium Industries, Infrastructure Development",
      organisationName: "Government of Karnataka",
      district: "Vijayapura",
      region: "Kittur Karnataka / Vijayapura",
      constituency: "Babaleshwar (Assembly Constituency No. 29)",
      assemblyNumber: 29,
      isMinister: true,
      isMla: true,
      isMlc: false,
      shortBio: "Cabinet Minister for Large & Medium Industries and Infrastructure Development; former Water Resources Minister and five-term MLA representing Babaleshwar.",
      biography: `Mallanagouda Basanagouda Patil (born 7 October 1964) is an Indian politician and industrial administrator serving as Minister for Large and Medium Industries and Infrastructure Development in Karnataka.\n\nHe has represented Babaleshwar in Vijayapura district since 2008 and previously served as MLA from Tikota (1991) and MP for Bijapur (1998).\n\nBetween 2013 and 2018, he served as Cabinet Minister for Major and Medium Irrigation, spearheading major North Karnataka irrigation canal projects. In May 2023, he assumed charge of the Industries and Infrastructure Development portfolio.`,
      portraitUrl: "/images/portraits/mb-patil.jpg",
      publicationStatus: PublicationStatus.PUBLISHED,
      roleLastVerifiedAt: new Date("2026-10-28"),
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
      reviewStatus: ReviewStatus.PUBLISHED,
      submittedById: editorUser.id,
      submittedAt: new Date("2026-10-26"),
    },
  });

  await prisma.reviewDecision.create({
    data: {
      revisionId: mbPatilRevision.id,
      reviewerId: reviewerUser.id,
      decision: DecisionType.APPROVED,
      reason: "Industrial portfolios and Babaleshwar (AC #29) confirmed via KLA directory.",
      createdAt: new Date("2026-10-27"),
    },
  });

  await prisma.leaderProfile.update({
    where: { id: mbPatilProfile.id },
    data: { publishedRevisionId: mbPatilRevision.id },
  });

  console.log("✓ Profile 5: M. B. Patil (Minister for Large & Medium Industries - PUBLISHED)");

  // Leader 6: Satish Jarkiholi (PWD Minister)
  const jarkiholiProfile = await prisma.leaderProfile.upsert({
    where: { organisationId_slug: { organisationId: org.id, slug: "satish-jarkiholi" } },
    update: {
      displayName: "Satish Jarkiholi",
      kannadaName: "ಸತೀಶ್ ಜಾರಕಿಹೊಳಿ",
      currentRole: "Cabinet Minister for Public Works",
      party: "Indian National Congress",
      portfolio: "Public Works Department (PWD)",
      organisationName: "Government of Karnataka",
      district: "Belagavi",
      region: "Kittur Karnataka / Belagavi",
      constituency: "Yemkanmardi (ST) (Assembly Constituency No. 11)",
      assemblyNumber: 11,
      isMinister: true,
      isMla: true,
      isMlc: false,
      shortBio: "Cabinet Minister for Public Works Department in the Government of Karnataka; four-term MLA representing Yemkanmardi (ST) in Belagavi district.",
      biography: `Satish Laxmanrao Jarkiholi (born 1 June 1962) is an Indian politician and social activist serving as Cabinet Minister for Public Works in Karnataka.\n\nHe has represented Yemkanmardi (ST) in Belagavi district since 2008. He previously served as Minister for Small Scale Industries (2013–2015) and Minister for Forest, Ecology and Environment (2018–2019).\n\nIn May 2023, he assumed charge of the Public Works Department, directing statewide road connectivity and infrastructure modernization.`,
      portraitUrl: "/images/portraits/satish-jarkiholi.jpg",
      publicationStatus: PublicationStatus.PUBLISHED,
      roleLastVerifiedAt: new Date("2026-10-28"),
    },
    create: {
      organisationId: org.id,
      slug: "satish-jarkiholi",
      displayName: "Satish Jarkiholi",
      kannadaName: "ಸತೀಶ್ ಜಾರಕಿಹೊಳಿ",
      currentRole: "Cabinet Minister for Public Works",
      party: "Indian National Congress",
      portfolio: "Public Works Department (PWD)",
      organisationName: "Government of Karnataka",
      district: "Belagavi",
      region: "Kittur Karnataka / Belagavi",
      constituency: "Yemkanmardi (ST) (Assembly Constituency No. 11)",
      assemblyNumber: 11,
      isMinister: true,
      isMla: true,
      isMlc: false,
      shortBio: "Cabinet Minister for Public Works Department in the Government of Karnataka; four-term MLA representing Yemkanmardi (ST) in Belagavi district.",
      biography: `Satish Laxmanrao Jarkiholi (born 1 June 1962) is an Indian politician and social activist serving as Cabinet Minister for Public Works in Karnataka.\n\nHe has represented Yemkanmardi (ST) in Belagavi district since 2008. He previously served as Minister for Small Scale Industries (2013–2015) and Minister for Forest, Ecology and Environment (2018–2019).\n\nIn May 2023, he assumed charge of the Public Works Department, directing statewide road connectivity and infrastructure modernization.`,
      portraitUrl: "/images/portraits/satish-jarkiholi.jpg",
      publicationStatus: PublicationStatus.PUBLISHED,
      roleLastVerifiedAt: new Date("2026-10-28"),
    },
  });

  const jarkiholiRevision = await prisma.revision.create({
    data: {
      profileId: jarkiholiProfile.id,
      version: 1,
      contentSnapshot: {
        displayName: jarkiholiProfile.displayName,
        currentRole: jarkiholiProfile.currentRole,
        shortBio: jarkiholiProfile.shortBio,
      },
      reviewStatus: ReviewStatus.PUBLISHED,
      submittedById: editorUser.id,
      submittedAt: new Date("2026-10-26"),
    },
  });

  await prisma.reviewDecision.create({
    data: {
      revisionId: jarkiholiRevision.id,
      reviewerId: reviewerUser.id,
      decision: DecisionType.APPROVED,
      reason: "Confirmed PWD Minister role and Yemkanmardi (ST #11) constituency.",
      createdAt: new Date("2026-10-27"),
    },
  });

  await prisma.leaderProfile.update({
    where: { id: jarkiholiProfile.id },
    data: { publishedRevisionId: jarkiholiRevision.id },
  });

  console.log("✓ Profile 6: Satish Jarkiholi (Minister for PWD - PUBLISHED)");

  // Leader 7: Krishna Byre Gowda (Revenue Minister)
  const kbgProfile = await prisma.leaderProfile.upsert({
    where: { organisationId_slug: { organisationId: org.id, slug: "krishna-byre-gowda" } },
    update: {
      displayName: "Krishna Byre Gowda",
      kannadaName: "ಕೃಷ್ಣ ಬೈರೇಗೌಡ",
      currentRole: "Cabinet Minister for Greater Bengaluru Development & Parliamentary Affairs",
      party: "Indian National Congress",
      portfolio: "Greater Bengaluru Development and Parliamentary Affairs and Legislation",
      organisationName: "Government of Karnataka",
      district: "Bengaluru Urban",
      region: "Bengaluru Region",
      constituency: "Byatarayanapura (Assembly Constituency No. 152)",
      assemblyNumber: 152,
      isMinister: true,
      isMla: true,
      isMlc: false,
      shortBio: "Cabinet Minister for Greater Bengaluru Development and Parliamentary Affairs and Legislation; five-term legislator representing Byatarayanapura (AC No. 152).",
      biography: `Krishna Byre Gowda (born 4 April 1973) is an Indian politician and administrator serving as Cabinet Minister for Greater Bengaluru Development and Parliamentary Affairs and Legislation in Karnataka. He represents Byatarayanapura in Bengaluru Urban district.\n\nHe holds a Master's degree from the School of International Service at American University in Washington, D.C.\n\nHe served as Minister for Agriculture (2013–2018) and Minister for Rural Development, Law and Parliamentary Affairs (2018–2019). In May 2023, he was appointed Minister for Greater Bengaluru Development and Parliamentary Affairs and Legislation, directing metropolitan governance and legislative business.`,
      portraitUrl: "/images/portraits/krishna-byre-gowda.jpg",
      publicationStatus: PublicationStatus.PUBLISHED,
      roleLastVerifiedAt: new Date("2026-10-28"),
    },
    create: {
      organisationId: org.id,
      slug: "krishna-byre-gowda",
      displayName: "Krishna Byre Gowda",
      kannadaName: "ಕೃಷ್ಣ ಬೈರೇಗೌಡ",
      currentRole: "Cabinet Minister for Greater Bengaluru Development & Parliamentary Affairs",
      party: "Indian National Congress",
      portfolio: "Greater Bengaluru Development and Parliamentary Affairs and Legislation",
      organisationName: "Government of Karnataka",
      district: "Bengaluru Urban",
      region: "Bengaluru Region",
      constituency: "Byatarayanapura (Assembly Constituency No. 152)",
      assemblyNumber: 152,
      isMinister: true,
      isMla: true,
      isMlc: false,
      shortBio: "Cabinet Minister for Greater Bengaluru Development and Parliamentary Affairs and Legislation; five-term legislator representing Byatarayanapura (AC No. 152).",
      biography: `Krishna Byre Gowda (born 4 April 1973) is an Indian politician and administrator serving as Cabinet Minister for Greater Bengaluru Development and Parliamentary Affairs and Legislation in Karnataka. He represents Byatarayanapura in Bengaluru Urban district.\n\nHe holds a Master's degree from the School of International Service at American University in Washington, D.C.\n\nHe served as Minister for Agriculture (2013–2018) and Minister for Rural Development, Law and Parliamentary Affairs (2018–2019). In May 2023, he was appointed Minister for Greater Bengaluru Development and Parliamentary Affairs and Legislation, directing metropolitan governance and legislative business.`,
      portraitUrl: "/images/portraits/krishna-byre-gowda.jpg",
      publicationStatus: PublicationStatus.PUBLISHED,
      roleLastVerifiedAt: new Date("2026-10-28"),
    },
  });

  const kbgRevision = await prisma.revision.create({
    data: {
      profileId: kbgProfile.id,
      version: 1,
      contentSnapshot: {
        displayName: kbgProfile.displayName,
        currentRole: kbgProfile.currentRole,
        shortBio: kbgProfile.shortBio,
      },
      reviewStatus: ReviewStatus.PUBLISHED,
      submittedById: editorUser.id,
      submittedAt: new Date("2026-10-26"),
    },
  });

  await prisma.reviewDecision.create({
    data: {
      revisionId: kbgRevision.id,
      reviewerId: reviewerUser.id,
      decision: DecisionType.APPROVED,
      reason: "Confirmed Greater Bengaluru Development and Parliamentary Affairs portfolios and Byatarayanapura (AC #152) constituency.",
      createdAt: new Date("2026-10-27"),
    },
  });

  await prisma.leaderProfile.update({
    where: { id: kbgProfile.id },
    data: { publishedRevisionId: kbgRevision.id },
  });

  console.log("✓ Profile 7: Krishna Byre Gowda (Cabinet Minister for Greater Bengaluru Development - PUBLISHED)");

  // Leader 8: Dinesh Gundu Rao (Health Minister)
  const dgrProfile = await prisma.leaderProfile.upsert({
    where: { organisationId_slug: { organisationId: org.id, slug: "dinesh-gundu-rao" } },
    update: {
      displayName: "Dinesh Gundu Rao",
      kannadaName: "ದಿನೇಶ್ ಗುಂಡೂರಾವ್",
      currentRole: "Minister for Health & Family Welfare",
      party: "Indian National Congress",
      portfolio: "Health and Family Welfare (excluding Medical Education)",
      organisationName: "Government of Karnataka",
      district: "Bengaluru Urban",
      region: "Bengaluru Region",
      constituency: "Gandhinagar (Assembly Constituency No. 164)",
      assemblyNumber: 164,
      isMinister: true,
      isMla: true,
      isMlc: false,
      shortBio: "Cabinet Minister for Health and Family Welfare; six-term MLA representing Gandhinagar and former KPCC President.",
      biography: `Dinesh Gundu Rao (born 9 October 1969) is an Indian politician serving as Cabinet Minister for Health and Family Welfare in Karnataka. He represents Gandhinagar in Bengaluru Urban.\n\nHe has served as MLA from Gandhinagar continuously since 1999. In May 2023, he assumed charge of the Health portfolio, driving public primary healthcare center upgradations and maternal health programs.`,
      portraitUrl: null,
      publicationStatus: PublicationStatus.PUBLISHED,
      roleLastVerifiedAt: new Date("2026-10-28"),
    },
    create: {
      organisationId: org.id,
      slug: "dinesh-gundu-rao",
      displayName: "Dinesh Gundu Rao",
      kannadaName: "ದಿನೇಶ್ ಗುಂಡೂರಾವ್",
      currentRole: "Minister for Health & Family Welfare",
      party: "Indian National Congress",
      portfolio: "Health and Family Welfare (excluding Medical Education)",
      organisationName: "Government of Karnataka",
      district: "Bengaluru Urban",
      region: "Bengaluru Region",
      constituency: "Gandhinagar (Assembly Constituency No. 164)",
      assemblyNumber: 164,
      isMinister: true,
      isMla: true,
      isMlc: false,
      shortBio: "Cabinet Minister for Health and Family Welfare; six-term MLA representing Gandhinagar and former KPCC President.",
      biography: `Dinesh Gundu Rao (born 9 October 1969) is an Indian politician serving as Cabinet Minister for Health and Family Welfare in Karnataka. He represents Gandhinagar in Bengaluru Urban.\n\nHe has served as MLA from Gandhinagar continuously since 1999. In May 2023, he assumed charge of the Health portfolio, driving public primary healthcare center upgradations and maternal health programs.`,
      portraitUrl: null,
      publicationStatus: PublicationStatus.PUBLISHED,
      roleLastVerifiedAt: new Date("2026-10-28"),
    },
  });

  // Leader 9: K. J. George (Energy Minister)
  const kjGeorgeProfile = await prisma.leaderProfile.upsert({
    where: { organisationId_slug: { organisationId: org.id, slug: "kj-george" } },
    update: {
      displayName: "K. J. George",
      kannadaName: "ಕೆ. ಜೆ. ಜಾರ್ಜ್",
      currentRole: "Minister for Energy",
      party: "Indian National Congress",
      portfolio: "Energy Department",
      organisationName: "Government of Karnataka",
      district: "Bengaluru Urban",
      region: "Bengaluru Region",
      constituency: "Sarvagnanagar (Assembly Constituency No. 160)",
      assemblyNumber: 160,
      isMinister: true,
      isMla: true,
      isMlc: false,
      shortBio: "Cabinet Minister for Energy in Karnataka; six-term legislator representing Sarvagnanagar and former Home Minister.",
      biography: `Kelachandra Joseph George (born 24 August 1949) is an Indian politician serving as Cabinet Minister for Energy in Karnataka. He represents Sarvagnanagar in Bengaluru Urban.\n\nIn May 2023, he assumed charge of the Energy Department, overseeing the implementation of the Gruha Jyothi free power guarantee and renewable energy additions across Karnataka.`,
      portraitUrl: null,
      publicationStatus: PublicationStatus.PUBLISHED,
      roleLastVerifiedAt: new Date("2026-10-28"),
    },
    create: {
      organisationId: org.id,
      slug: "kj-george",
      displayName: "K. J. George",
      kannadaName: "ಕೆ. ಜೆ. ಜಾರ್ಜ್",
      currentRole: "Minister for Energy",
      party: "Indian National Congress",
      portfolio: "Energy Department",
      organisationName: "Government of Karnataka",
      district: "Bengaluru Urban",
      region: "Bengaluru Region",
      constituency: "Sarvagnanagar (Assembly Constituency No. 160)",
      assemblyNumber: 160,
      isMinister: true,
      isMla: true,
      isMlc: false,
      shortBio: "Cabinet Minister for Energy in Karnataka; six-term legislator representing Sarvagnanagar and former Home Minister.",
      biography: `Kelachandra Joseph George (born 24 August 1949) is an Indian politician serving as Cabinet Minister for Energy in Karnataka. He represents Sarvagnanagar in Bengaluru Urban.\n\nIn May 2023, he assumed charge of the Energy Department, overseeing the implementation of the Gruha Jyothi free power guarantee and renewable energy additions across Karnataka.`,
      portraitUrl: null,
      publicationStatus: PublicationStatus.PUBLISHED,
      roleLastVerifiedAt: new Date("2026-10-28"),
    },
  });

  // Leader 10: Ramalinga Reddy (Transport & Muzrai)
  const ramalingaProfile = await prisma.leaderProfile.upsert({
    where: { organisationId_slug: { organisationId: org.id, slug: "ramalinga-reddy" } },
    update: {
      displayName: "Ramalinga Reddy",
      kannadaName: "ರಾಮಲಿಂಗಾ ರೆಡ್ಡಿ",
      currentRole: "Minister for Transport & Muzrai",
      party: "Indian National Congress",
      portfolio: "Transport and Muzrai",
      organisationName: "Government of Karnataka",
      district: "Bengaluru Urban",
      region: "Bengaluru Region",
      constituency: "BTM Layout (Assembly Constituency No. 174)",
      assemblyNumber: 174,
      isMinister: true,
      isMla: true,
      isMlc: false,
      shortBio: "Cabinet Minister for Transport and Muzrai; eight-term MLA representing BTM Layout and former Home Minister.",
      biography: `Ramalinga Reddy is an Indian politician serving as Cabinet Minister for Transport and Muzrai in Karnataka. He is an eight-term Member of the Legislative Assembly representing BTM Layout in Bengaluru.\n\nIn May 2023, he took charge of the Transport portfolio, successfully executing the Shakthi scheme providing zero-fare bus travel for women across state transport utilities.`,
      portraitUrl: null,
      publicationStatus: PublicationStatus.PUBLISHED,
      roleLastVerifiedAt: new Date("2026-10-28"),
    },
    create: {
      organisationId: org.id,
      slug: "ramalinga-reddy",
      displayName: "Ramalinga Reddy",
      kannadaName: "ರಾಮಲಿಂಗಾ ರೆಡ್ಡಿ",
      currentRole: "Minister for Transport & Muzrai",
      party: "Indian National Congress",
      portfolio: "Transport and Muzrai",
      organisationName: "Government of Karnataka",
      district: "Bengaluru Urban",
      region: "Bengaluru Region",
      constituency: "BTM Layout (Assembly Constituency No. 174)",
      assemblyNumber: 174,
      isMinister: true,
      isMla: true,
      isMlc: false,
      shortBio: "Cabinet Minister for Transport and Muzrai; eight-term MLA representing BTM Layout and former Home Minister.",
      biography: `Ramalinga Reddy is an Indian politician serving as Cabinet Minister for Transport and Muzrai in Karnataka. He is an eight-term Member of the Legislative Assembly representing BTM Layout in Bengaluru.\n\nIn May 2023, he took charge of the Transport portfolio, successfully executing the Shakthi scheme providing zero-fare bus travel for women across state transport utilities.`,
      portraitUrl: null,
      publicationStatus: PublicationStatus.PUBLISHED,
      roleLastVerifiedAt: new Date("2026-10-28"),
    },
  });

  // Leader 11: Laxmi Hebbalkar (Women & Child Development)
  const hebbalkarProfile = await prisma.leaderProfile.upsert({
    where: { organisationId_slug: { organisationId: org.id, slug: "laxmi-hebbalkar" } },
    update: {
      displayName: "Laxmi Hebbalkar",
      kannadaName: "ಲಕ್ಷ್ಮಿ ಹೆಬ್ಬಾಳ್ಕರ್",
      currentRole: "Minister for Women & Child Development",
      party: "Indian National Congress",
      portfolio: "Women and Child Development, Disabled & Senior Citizens Empowerment",
      organisationName: "Government of Karnataka",
      district: "Belagavi",
      region: "Kittur Karnataka / Belagavi",
      constituency: "Belgaum Rural (Assembly Constituency No. 13)",
      assemblyNumber: 13,
      isMinister: true,
      isMla: true,
      isMlc: false,
      shortBio: "Cabinet Minister for Women and Child Development; two-term MLA representing Belgaum Rural and lead minister implementing the Gruha Lakshmi guarantee.",
      biography: `Laxmi Hebbalkar is an Indian politician serving as Cabinet Minister for Women and Child Development, Disabled & Senior Citizens Empowerment in Karnataka. She represents Belgaum Rural in the Karnataka Legislative Assembly.\n\nIn May 2023, she took charge of the WCD department, leading the statewide rollout of Gruha Lakshmi, which transfers ₹2,000 monthly to over 1.2 crore female heads of household.`,
      portraitUrl: null,
      publicationStatus: PublicationStatus.PUBLISHED,
      roleLastVerifiedAt: new Date("2026-10-28"),
    },
    create: {
      organisationId: org.id,
      slug: "laxmi-hebbalkar",
      displayName: "Laxmi Hebbalkar",
      kannadaName: "ಲಕ್ಷ್ಮಿ ಹೆಬ್ಬಾಳ್ಕರ್",
      currentRole: "Minister for Women & Child Development",
      party: "Indian National Congress",
      portfolio: "Women and Child Development, Disabled & Senior Citizens Empowerment",
      organisationName: "Government of Karnataka",
      district: "Belagavi",
      region: "Kittur Karnataka / Belagavi",
      constituency: "Belgaum Rural (Assembly Constituency No. 13)",
      assemblyNumber: 13,
      isMinister: true,
      isMla: true,
      isMlc: false,
      shortBio: "Cabinet Minister for Women and Child Development; two-term MLA representing Belgaum Rural and lead minister implementing the Gruha Lakshmi guarantee.",
      biography: `Laxmi Hebbalkar is an Indian politician serving as Cabinet Minister for Women and Child Development, Disabled & Senior Citizens Empowerment in Karnataka. She represents Belgaum Rural in the Karnataka Legislative Assembly.\n\nIn May 2023, she took charge of the WCD department, leading the statewide rollout of Gruha Lakshmi, which transfers ₹2,000 monthly to over 1.2 crore female heads of household.`,
      portraitUrl: null,
      publicationStatus: PublicationStatus.PUBLISHED,
      roleLastVerifiedAt: new Date("2026-10-28"),
    },
  });

  // Leader 12: Eshwar Khandre (Forest, Ecology & Environment)
  const khandreProfile = await prisma.leaderProfile.upsert({
    where: { organisationId_slug: { organisationId: org.id, slug: "eshwar-khandre" } },
    update: {
      displayName: "Eshwar Khandre",
      kannadaName: "ಈಶ್ವರ್ ಖಂಡ್ರೆ",
      currentRole: "Minister for Forest, Ecology & Environment",
      party: "Indian National Congress",
      portfolio: "Forest, Ecology and Environment",
      organisationName: "Government of Karnataka",
      district: "Bidar",
      region: "Kalyana Karnataka / Bidar",
      constituency: "Bhalki (Assembly Constituency No. 51)",
      assemblyNumber: 51,
      isMinister: true,
      isMla: true,
      isMlc: false,
      shortBio: "Cabinet Minister for Forest, Ecology and Environment; working president of KPCC and four-term MLA representing Bhalki.",
      biography: `Eshwar Bheemanna Khandre is an Indian politician serving as Cabinet Minister for Forest, Ecology and Environment in Karnataka. He represents Bhalki in Bidar district.\n\nIn May 2023, he assumed charge of the Forest and Environment department, driving initiatives for human-wildlife conflict mitigation, Western Ghats conservation, and afforestation.`,
      portraitUrl: null,
      publicationStatus: PublicationStatus.PUBLISHED,
      roleLastVerifiedAt: new Date("2026-10-28"),
    },
    create: {
      organisationId: org.id,
      slug: "eshwar-khandre",
      displayName: "Eshwar Khandre",
      kannadaName: "ಈಶ್ವರ್ ಖಂಡ್ರೆ",
      currentRole: "Minister for Forest, Ecology & Environment",
      party: "Indian National Congress",
      portfolio: "Forest, Ecology and Environment",
      organisationName: "Government of Karnataka",
      district: "Bidar",
      region: "Kalyana Karnataka / Bidar",
      constituency: "Bhalki (Assembly Constituency No. 51)",
      assemblyNumber: 51,
      isMinister: true,
      isMla: true,
      isMlc: false,
      shortBio: "Cabinet Minister for Forest, Ecology and Environment; working president of KPCC and four-term MLA representing Bhalki.",
      biography: `Eshwar Bheemanna Khandre is an Indian politician serving as Cabinet Minister for Forest, Ecology and Environment in Karnataka. He represents Bhalki in Bidar district.\n\nIn May 2023, he assumed charge of the Forest and Environment department, driving initiatives for human-wildlife conflict mitigation, Western Ghats conservation, and afforestation.`,
      portraitUrl: null,
      publicationStatus: PublicationStatus.PUBLISHED,
      roleLastVerifiedAt: new Date("2026-10-28"),
    },
  });

  // Leader 13: H. K. Patil (Law, Parliamentary Affairs & Tourism)
  const hkPatilProfile = await prisma.leaderProfile.upsert({
    where: { organisationId_slug: { organisationId: org.id, slug: "hk-patil" } },
    update: {
      displayName: "H. K. Patil",
      kannadaName: "ಎಚ್. ಕೆ. ಪಾಟೀಲ್",
      currentRole: "Minister for Law, Parliamentary Affairs & Tourism",
      party: "Indian National Congress",
      portfolio: "Law, Parliamentary Affairs and Legislation, Tourism",
      organisationName: "Government of Karnataka",
      district: "Gadag",
      region: "Kittur Karnataka / Gadag",
      constituency: "Gadag (Assembly Constituency No. 66)",
      assemblyNumber: 66,
      isMinister: true,
      isMla: true,
      isMlc: false,
      shortBio: "Cabinet Minister for Law, Parliamentary Affairs and Tourism; veteran parliamentarian and MLA representing Gadag.",
      biography: `Hanamantagouda Krishnagouda Patil (born 15 August 1953) is an Indian politician and veteran administrator serving as Cabinet Minister for Law, Parliamentary Affairs and Tourism in Karnataka.\n\nHe has previously served as Minister for Rural Development & Panchayat Raj and Leader of the Opposition in the Karnataka Legislative Council.`,
      portraitUrl: null,
      publicationStatus: PublicationStatus.PUBLISHED,
      roleLastVerifiedAt: new Date("2026-10-28"),
    },
    create: {
      organisationId: org.id,
      slug: "hk-patil",
      displayName: "H. K. Patil",
      kannadaName: "ಎಚ್. ಕೆ. ಪಾಟೀಲ್",
      currentRole: "Minister for Law, Parliamentary Affairs & Tourism",
      party: "Indian National Congress",
      portfolio: "Law, Parliamentary Affairs and Legislation, Tourism",
      organisationName: "Government of Karnataka",
      district: "Gadag",
      region: "Kittur Karnataka / Gadag",
      constituency: "Gadag (Assembly Constituency No. 66)",
      assemblyNumber: 66,
      isMinister: true,
      isMla: true,
      isMlc: false,
      shortBio: "Cabinet Minister for Law, Parliamentary Affairs and Tourism; veteran parliamentarian and MLA representing Gadag.",
      biography: `Hanamantagouda Krishnagouda Patil (born 15 August 1953) is an Indian politician and veteran administrator serving as Cabinet Minister for Law, Parliamentary Affairs and Tourism in Karnataka.\n\nHe has previously served as Minister for Rural Development & Panchayat Raj and Leader of the Opposition in the Karnataka Legislative Council.`,
      portraitUrl: null,
      publicationStatus: PublicationStatus.PUBLISHED,
      roleLastVerifiedAt: new Date("2026-10-28"),
    },
  });

  // Leader 14: Rizwan Arshad (IN_REVIEW status to demonstrate review workflow in /studio/reviews)
  const rizwanProfile = await prisma.leaderProfile.upsert({
    where: { organisationId_slug: { organisationId: org.id, slug: "rizwan-arshad" } },
    update: {
      displayName: "Rizwan Arshad",
      kannadaName: "ರಿಜ್ವಾನ್ ಅರ್ಷದ್",
      currentRole: "Member of the Legislative Assembly (MLA)",
      party: "Indian National Congress",
      portfolio: "Legislative Representative",
      organisationName: "Government of Karnataka",
      district: "Bengaluru Urban",
      region: "Bengaluru Region",
      constituency: "Shivajinagar (Assembly Constituency No. 162)",
      assemblyNumber: 162,
      isMinister: false,
      isMla: true,
      isMlc: false,
      shortBio: "Two-term MLA representing Shivajinagar constituency in Bengaluru Urban; former Youth Congress President.",
      biography: `Rizwan Arshad is an Indian politician representing the Shivajinagar constituency in Bengaluru Urban as a Member of the Karnataka Legislative Assembly.\n\nFirst elected in the 2019 by-election, he was re-elected in May 2023.`,
      portraitUrl: null,
      publicationStatus: PublicationStatus.IN_REVIEW,
      roleLastVerifiedAt: new Date("2026-10-28"),
    },
    create: {
      organisationId: org.id,
      slug: "rizwan-arshad",
      displayName: "Rizwan Arshad",
      kannadaName: "ರಿಜ್ವಾನ್ ಅರ್ಷದ್",
      currentRole: "Member of the Legislative Assembly (MLA)",
      party: "Indian National Congress",
      portfolio: "Legislative Representative",
      organisationName: "Government of Karnataka",
      district: "Bengaluru Urban",
      region: "Bengaluru Region",
      constituency: "Shivajinagar (Assembly Constituency No. 162)",
      assemblyNumber: 162,
      isMinister: false,
      isMla: true,
      isMlc: false,
      shortBio: "Two-term MLA representing Shivajinagar constituency in Bengaluru Urban; former Youth Congress President.",
      biography: `Rizwan Arshad is an Indian politician representing the Shivajinagar constituency in Bengaluru Urban as a Member of the Karnataka Legislative Assembly.\n\nFirst elected in the 2019 by-election, he was re-elected in May 2023.`,
      portraitUrl: null,
      publicationStatus: PublicationStatus.IN_REVIEW,
      roleLastVerifiedAt: new Date("2026-10-28"),
    },
  });

  await prisma.revision.create({
    data: {
      profileId: rizwanProfile.id,
      version: 1,
      contentSnapshot: {
        displayName: rizwanProfile.displayName,
        currentRole: rizwanProfile.currentRole,
        shortBio: rizwanProfile.shortBio,
      },
      reviewStatus: ReviewStatus.IN_REVIEW,
      submittedById: editorUser.id,
      submittedAt: new Date("2026-10-28"),
    },
  });

  // Leader 15: Tanveer Sait (DRAFT status to demonstrate draft management in /studio/leaders)
  await prisma.leaderProfile.upsert({
    where: { organisationId_slug: { organisationId: org.id, slug: "tanveer-sait" } },
    update: {
      displayName: "Tanveer Sait",
      kannadaName: "ತನ್ವೀರ್ ಸೇಟ್",
      currentRole: "Member of the Legislative Assembly (MLA)",
      party: "Indian National Congress",
      portfolio: "Legislative Representative",
      organisationName: "Government of Karnataka",
      district: "Mysuru",
      region: "Old Mysuru Region",
      constituency: "Narasimharaja (Assembly Constituency No. 218)",
      assemblyNumber: 218,
      isMinister: false,
      isMla: true,
      isMlc: false,
      shortBio: "Six-term MLA representing Narasimharaja constituency in Mysuru; former Minister for Primary and Secondary Education.",
      biography: `Tanveer Sait is a senior Indian politician and six-term MLA representing Narasimharaja in Mysuru city. He previously served as Minister for Primary & Secondary Education and Wakf.`,
      portraitUrl: null,
      publicationStatus: PublicationStatus.DRAFT,
      roleLastVerifiedAt: new Date("2026-10-28"),
    },
    create: {
      organisationId: org.id,
      slug: "tanveer-sait",
      displayName: "Tanveer Sait",
      kannadaName: "ತನ್ವೀರ್ ಸೇಟ್",
      currentRole: "Member of the Legislative Assembly (MLA)",
      party: "Indian National Congress",
      portfolio: "Legislative Representative",
      organisationName: "Government of Karnataka",
      district: "Mysuru",
      region: "Old Mysuru Region",
      constituency: "Narasimharaja (Assembly Constituency No. 218)",
      assemblyNumber: 218,
      isMinister: false,
      isMla: true,
      isMlc: false,
      shortBio: "Six-term MLA representing Narasimharaja constituency in Mysuru; former Minister for Primary and Secondary Education.",
      biography: `Tanveer Sait is a senior Indian politician and six-term MLA representing Narasimharaja in Mysuru city. He previously served as Minister for Primary & Secondary Education and Wakf.`,
      portraitUrl: null,
      publicationStatus: PublicationStatus.DRAFT,
      roleLastVerifiedAt: new Date("2026-10-28"),
    },
  });

  console.log("✓ Core verified Congress leadership profiles seeded (Ministers, MLAs, and review/draft samples)");

  // ==========================================
  // 5. SEED CONSTITUENCIES TABLE
  // ==========================================
  const constituenciesData = [
    {
      slug: "varuna",
      assemblyNumber: 221,
      name: "Varuna",
      kannadaName: "ವರುಣಾ",
      district: "Mysuru",
      region: "Old Mysuru Region",
      reservation: ReservationType.GENERAL,
      totalElectors: 234120,
      description: "Varuna is an assembly constituency in Mysuru district of Karnataka. Represented by Chief Minister Siddaramaiah, who won in 2008, 2013, and 2023.",
      representativeId: siddaProfile.id,
    },
    {
      slug: "kanakapura",
      assemblyNumber: 184,
      name: "Kanakapura",
      kannadaName: "ಕನಕಪುರ",
      district: "Ramanagara",
      region: "Southern Karnataka / Bengaluru Rural",
      reservation: ReservationType.GENERAL,
      totalElectors: 226500,
      description: "Kanakapura is an assembly constituency in Ramanagara district. Represented continuously by Deputy Chief Minister D. K. Shivakumar since 2008 delimitation.",
      representativeId: dksProfile.id,
    },
    {
      slug: "koratagere",
      assemblyNumber: 132,
      name: "Koratagere",
      kannadaName: "ಕೊರಟಗೆರೆ",
      district: "Tumakuru",
      region: "Central Karnataka",
      reservation: ReservationType.SC,
      totalElectors: 214800,
      description: "Koratagere is a reserved Scheduled Caste constituency in Tumakuru district, represented by Home Minister Dr. G. Parameshwara.",
      representativeId: parameshwaraProfile.id,
    },
    {
      slug: "chittapur",
      assemblyNumber: 40,
      name: "Chittapur",
      kannadaName: "ಚಿತ್ತಾಪುರ",
      district: "Kalaburagi",
      region: "Kalyana Karnataka",
      reservation: ReservationType.SC,
      totalElectors: 231400,
      description: "Chittapur is an assembly constituency in Kalaburagi district, represented by Minister for RDPR and IT/BT Priyank Kharge.",
      representativeId: khargeProfile.id,
    },
    {
      slug: "babaleshwar",
      assemblyNumber: 29,
      name: "Babaleshwar",
      kannadaName: "ಬಬಲೇಶ್ವರ",
      district: "Vijayapura",
      region: "Kittur Karnataka",
      reservation: ReservationType.GENERAL,
      totalElectors: 218900,
      description: "Babaleshwar is an assembly constituency in Vijayapura district, represented by Minister for Large & Medium Industries M. B. Patil.",
      representativeId: mbPatilProfile.id,
    },
    {
      slug: "yemkanmardi",
      assemblyNumber: 11,
      name: "Yemkanmardi",
      kannadaName: "ಯಮಕನಮರಡಿ",
      district: "Belagavi",
      region: "Kittur Karnataka",
      reservation: ReservationType.ST,
      totalElectors: 202600,
      description: "Yemkanmardi is a reserved Scheduled Tribe constituency in Belagavi district, represented by PWD Minister Satish Jarkiholi.",
      representativeId: jarkiholiProfile.id,
    },
    {
      slug: "byatarayanapura",
      assemblyNumber: 152,
      name: "Byatarayanapura",
      kannadaName: "ಬ್ಯಾಟರಾಯನಪುರ",
      district: "Bengaluru Urban",
      region: "Bengaluru Region",
      reservation: ReservationType.GENERAL,
      totalElectors: 468200,
      description: "One of the largest constituencies by electorate in Bengaluru Urban, represented by Revenue Minister Krishna Byre Gowda.",
      representativeId: kbgProfile.id,
    },
    {
      slug: "gandhinagar",
      assemblyNumber: 164,
      name: "Gandhinagar",
      kannadaName: "ಗಾಂಧಿನಗರ",
      district: "Bengaluru Urban",
      region: "Bengaluru Region",
      reservation: ReservationType.GENERAL,
      totalElectors: 224600,
      description: "Commercial heart of Bengaluru city, represented by Health Minister Dinesh Gundu Rao since 1999.",
      representativeId: dgrProfile.id,
    },
    {
      slug: "sarvagnanagar",
      assemblyNumber: 160,
      name: "Sarvagnanagar",
      kannadaName: "ಸರ್ವಜ್ಞನಗರ",
      district: "Bengaluru Urban",
      region: "Bengaluru Region",
      reservation: ReservationType.GENERAL,
      totalElectors: 352400,
      description: "Dynamic eastern Bengaluru urban constituency, represented by Energy Minister K. J. George.",
      representativeId: kjGeorgeProfile.id,
    },
    {
      slug: "btm-layout",
      assemblyNumber: 174,
      name: "BTM Layout",
      kannadaName: "ಬಿಟಿಎಂ ಲೇಔಟ್",
      district: "Bengaluru Urban",
      region: "Bengaluru Region",
      reservation: ReservationType.GENERAL,
      totalElectors: 278900,
      description: "Southern Bengaluru IT corridor constituency, represented by Transport Minister Ramalinga Reddy.",
      representativeId: ramalingaProfile.id,
    },
    {
      slug: "belgaum-rural",
      assemblyNumber: 13,
      name: "Belgaum Rural",
      kannadaName: "ಬೆಳಗಾವಿ ಗ್ರಾಮೀಣ",
      district: "Belagavi",
      region: "Kittur Karnataka",
      reservation: ReservationType.GENERAL,
      totalElectors: 247800,
      description: "Key assembly constituency in Belagavi district, represented by WCD Minister Laxmi Hebbalkar.",
      representativeId: hebbalkarProfile.id,
    },
    {
      slug: "bhalki",
      assemblyNumber: 51,
      name: "Bhalki",
      kannadaName: "ಭಾಲ್ಕಿ",
      district: "Bidar",
      region: "Kalyana Karnataka",
      reservation: ReservationType.GENERAL,
      totalElectors: 236200,
      description: "Kalyana Karnataka assembly constituency in Bidar district, represented by Forest Minister Eshwar Khandre.",
      representativeId: khandreProfile.id,
    },
    {
      slug: "gadag",
      assemblyNumber: 66,
      name: "Gadag",
      kannadaName: "ಗದಗ",
      district: "Gadag",
      region: "Kittur Karnataka",
      reservation: ReservationType.GENERAL,
      totalElectors: 221800,
      description: "Historical cooperative and cultural hub of northern Karnataka, represented by Law Minister H. K. Patil.",
      representativeId: hkPatilProfile.id,
    },
    {
      slug: "shivajinagar",
      assemblyNumber: 162,
      name: "Shivajinagar",
      kannadaName: "ಶಿವಾಜಿನಗರ",
      district: "Bengaluru Urban",
      region: "Bengaluru Region",
      reservation: ReservationType.GENERAL,
      totalElectors: 198400,
      description: "Central multicultural constituency of Bengaluru, represented by MLA Rizwan Arshad.",
      representativeId: rizwanProfile.id,
    },
    {
      slug: "narasimharaja",
      assemblyNumber: 218,
      name: "Narasimharaja",
      kannadaName: "ನರಸಿಂಹರಾಜ",
      district: "Mysuru",
      region: "Old Mysuru Region",
      reservation: ReservationType.GENERAL,
      totalElectors: 274300,
      description: "Historic assembly constituency in Mysuru city, represented by MLA Tanveer Sait.",
      representativeId: null,
    },
    {
      slug: "shantinagar",
      assemblyNumber: 163,
      name: "Shantinagar",
      kannadaName: "ಶಾಂತಿನಗರ",
      district: "Bengaluru Urban",
      region: "Bengaluru Region",
      reservation: ReservationType.GENERAL,
      totalElectors: 228900,
      description: "Bengaluru Urban constituency spanning Richmond Town, Neelasandra, and Austin Town, represented by N. A. Haris.",
      representativeId: null,
    },
    {
      slug: "bellary-city",
      assemblyNumber: 94,
      name: "Bellary City",
      kannadaName: "ಬಳ್ಳಾರಿ ನಗರ",
      district: "Ballari",
      region: "Kalyana Karnataka",
      reservation: ReservationType.GENERAL,
      totalElectors: 258900,
      description: "Urban economic hub of the iron ore and textile corridor in Ballari district, represented by Nara Bharath Reddy (INC).",
      representativeId: null,
    },
    {
      slug: "mangaluru",
      assemblyNumber: 204,
      name: "Mangaluru",
      kannadaName: "ಮಂಗಳೂರು",
      district: "Dakshina Kannada",
      region: "Coastal Karnataka",
      reservation: ReservationType.GENERAL,
      totalElectors: 201200,
      description: "Key coastal assembly constituency (formerly Ullal) in Dakshina Kannada district, represented by Speaker U. T. Khader (INC).",
      representativeId: null,
    },
    {
      slug: "hubballi-dharwad-central",
      assemblyNumber: 73,
      name: "Hubballi-Dharwad Central",
      kannadaName: "ಹುಬ್ಬಳ್ಳಿ-ಧಾರವಾಡ ಸೆಂಟ್ರಲ್",
      district: "Dharwad",
      region: "Kittur Karnataka",
      reservation: ReservationType.GENERAL,
      totalElectors: 242000,
      description: "Commercial center of North Karnataka, part of the twin cities metropolitan agglomeration in Dharwad district.",
      representativeId: null,
    },
    {
      slug: "shimoga-rural",
      assemblyNumber: 111,
      name: "Shimoga Rural",
      kannadaName: "ಶಿವಮೊಗ್ಗ ಗ್ರಾಮೀಣ",
      district: "Shivamogga",
      region: "Malenadu Region",
      reservation: ReservationType.SC,
      totalElectors: 212400,
      description: "Malenadu gateway constituency in Shivamogga district, represented by Sharada Puryanaik.",
      representativeId: null,
    },
    {
      slug: "hassan",
      assemblyNumber: 197,
      name: "Hassan",
      kannadaName: "ಹಾಸನ",
      district: "Hassan",
      region: "Old Mysuru Region",
      reservation: ReservationType.GENERAL,
      totalElectors: 220100,
      description: "District headquarters constituency of Hassan, known for Hoysala architecture and agrarian commerce.",
      representativeId: null,
    },
    {
      slug: "chikkamagaluru",
      assemblyNumber: 125,
      name: "Chikkamagaluru",
      kannadaName: "ಚಿಕ್ಕಮಗಳೂರು",
      district: "Chikkamagaluru",
      region: "Malenadu Region",
      reservation: ReservationType.GENERAL,
      totalElectors: 219500,
      description: "Coffee capital of India in Western Ghats, won by H. D. Thammaiah (INC) in the 2023 Karnataka elections.",
      representativeId: null,
    },
    {
      slug: "davanagere-south",
      assemblyNumber: 107,
      name: "Davanagere South",
      kannadaName: "ದಾವಣಗೆರೆ ದಕ್ಷಿಣ",
      district: "Davanagere",
      region: "Central Karnataka",
      reservation: ReservationType.GENERAL,
      totalElectors: 209800,
      description: "Industrial and educational center of Central Karnataka, represented by veteran leader Shamanur Shivashankarappa (INC).",
      representativeId: null,
    },
    {
      slug: "madikeri",
      assemblyNumber: 208,
      name: "Madikeri",
      kannadaName: "ಮಡಿಕೇರಿ",
      district: "Kodagu",
      region: "Malenadu Region",
      reservation: ReservationType.GENERAL,
      totalElectors: 217400,
      description: "Scenic highland constituency covering the district capital of Kodagu, represented by Mantar Gowda (INC).",
      representativeId: null,
    },
  ];

  for (const c of constituenciesData) {
    await prisma.constituency.upsert({
      where: { slug: c.slug },
      update: {
        number: c.assemblyNumber,
        name: c.name,
        kannadaName: c.kannadaName,
        district: c.district,
        region: c.region,
        reservation: c.reservation,
        totalElectors: c.totalElectors,
        summary: c.description,
        representativeId: c.representativeId,
      },
      create: {
        organisationId: org.id,
        slug: c.slug,
        number: c.assemblyNumber,
        name: c.name,
        kannadaName: c.kannadaName,
        district: c.district,
        region: c.region,
        reservation: c.reservation,
        totalElectors: c.totalElectors,
        summary: c.description,
        representativeId: c.representativeId,
      },
    });
  }

  console.log(`✓ Seeded ${constituenciesData.length} verified Karnataka constituencies`);

  // ==========================================
  // 6. SEED THE 5 GUARANTEES (GOVERNMENT SCHEMES)
  // ==========================================
  const schemesData = [
    {
      slug: "gruha-lakshmi",
      name: "Gruha Lakshmi Scheme",
      kannadaName: "ಗೃಹಲಕ್ಷ್ಮಿ ಯೋಜನೆ",
      department: "Department of Women and Child Development",
      tagline: "Direct financial assistance of ₹2,000 per month transferred to the woman head of household in eligible families across Karnataka.",
      description: "Gruha Lakshmi is the flagship gender empowerment guarantee of the Government of Karnataka. The scheme directly transfers ₹2,000 every month via Direct Benefit Transfer (DBT) to the bank account of the woman designated as head of household in Antyodaya (AAY), BPL, and APL ration cards. The program covers over 1.2 crore women, fostering household economic independence and domestic dignity.",
      eligibility: "Women registered as head of family in Antyodaya (AAY), BPL, or APL cards issued by Food & Civil Supplies Department. Women or spouses paying Income Tax or GST are ineligible. Maximum one woman beneficiary per household.",
      benefits: "₹2,000 credited monthly directly via Aadhaar-linked DBT into beneficiary bank account.",
      applicationUrl: "https://sevasindhugs.karnataka.gov.in",
      officialSourceUrl: "https://dipr.karnataka.gov.in/guarantees/gruha-lakshmi",
      verificationDate: new Date("2026-11-03"),
      sortOrder: 1,
    },
    {
      slug: "gruha-jyothi",
      name: "Gruha Jyothi Scheme",
      kannadaName: "ಗೃಹಜ್ಯೋತಿ ಯೋಜನೆ",
      department: "Energy Department (BESCOM, HESCOM, MESCOM, GESCOM, CESC)",
      tagline: "Free domestic electricity up to 200 units per month for all residential households in Karnataka.",
      description: "Gruha Jyothi guarantees zero-cost domestic power for residential households consuming within their historical average plus a 10% buffer, up to a maximum cap of 200 units per month. Over 1.5 crore domestic electricity consumers are registered, substantially reducing monthly living costs for working-class and middle-class families.",
      eligibility: "All domestic electricity consumers registered in Karnataka. Entitlement calculation: Average monthly consumption over the preceding 12 months (FY 2022–23 baseline) + 10% buffer, capped at a maximum of 200 units per month. If consumption exceeds entitlement but stays within 200 units, consumer pays only the difference; if monthly consumption exceeds 200 units, consumer pays the full bill.",
      benefits: "Zero electricity billing for consumption within entitled monthly units up to 200 units ceiling.",
      applicationUrl: "https://sevasindhugs.karnataka.gov.in",
      officialSourceUrl: "https://energy.karnataka.gov.in/gruha-jyothi",
      verificationDate: new Date("2026-11-03"),
      sortOrder: 2,
    },
    {
      slug: "shakthi-scheme",
      name: "Shakthi Scheme",
      kannadaName: "ಶಕ್ತಿ ಯೋಜನೆ",
      department: "Transport Department (KSRTC, BMTC, NWKRTC, KKRTC)",
      tagline: "Free public bus transit across Karnataka for all resident women and transgender persons.",
      description: "Launched on 11 June 2023, the Shakthi scheme provides 100% fare waiver for all domicile women, girls, and transgender residents on ordinary, city, and express buses operated by the state's four road transport corporations (KSRTC, BMTC, NWKRTC, and KKRTC). The initiative has facilitated over 300 crore passenger journeys, unlocking education, work, and healthcare mobility for women across the state.",
      eligibility: "All women and transgender individuals domiciled in the State of Karnataka. Passengers must show state domicile photo ID (Aadhaar, Voter ID, Driving Licence, or Shakthi smart card). Service coverage includes ordinary, city, and express buses; exclusions apply to luxury/premium interstate and AC services (Rajahamsa, Non-AC Sleeper, Airavat, Airavat Club Class, EV Power Plus, Corona, Flybus, and Vayu Vajra airport AC buses), and travel beyond Karnataka state borders.",
      benefits: "Free bus travel within Karnataka borders on non-premium bus services across all four state RTCs.",
      applicationUrl: "https://ksrtc.karnataka.gov.in",
      officialSourceUrl: "https://transport.karnataka.gov.in/shakthi",
      verificationDate: new Date("2026-11-03"),
      sortOrder: 3,
    },
    {
      slug: "anna-bhagya",
      name: "Anna Bhagya Scheme",
      kannadaName: "ಅನ್ನಭಾಗ್ಯ ಯೋಜನೆ",
      department: "Department of Food, Civil Supplies and Consumer Affairs",
      tagline: "Statutory food security guarantee of 10 kg foodgrains per person per month (delivered as 5 kg physical rice + ₹170 DBT cash transfer for 5 kg).",
      description: "Anna Bhagya guarantees food security by ensuring 10 kg of foodgrains per month per individual in Priority Household (BPL) and Antyodaya Anna Yojana (AAY) families. The delivery mechanism operates as a hybrid model: 5 kg physical free rice is provided per person via Fair Price Shops under NFSA/PMGKAY, while the Government of Karnataka transfers ₹170 per person per month (at the statutory cash equivalent rate of ₹34 per kg for the remaining 5 kg) directly into the head of household's Aadhaar-linked bank account via DBT.",
      eligibility: "All beneficiaries enrolled under Antyodaya Anna Yojana (AAY) and Priority Household (BPL) ration cards issued by Food, Civil Supplies and Consumer Affairs Department in Karnataka.",
      benefits: "5 kg physical rice per person via Fair Price Shops + ₹170 direct bank transfer (DBT) per person per month in lieu of additional 5 kg foodgrains (statutory rate ₹34/kg).",
      applicationUrl: "https://ahara.kar.nic.in",
      officialSourceUrl: "https://ahara.kar.nic.in/anna-bhagya-guidelines",
      verificationDate: new Date("2026-11-03"),
      sortOrder: 4,
    },
    {
      slug: "yuva-nidhi",
      name: "Yuva Nidhi Scheme",
      kannadaName: "ಯುವನಿಧಿ ಯೋಜನೆ",
      department: "Department of Skill Development, Entrepreneurship and Livelihood",
      tagline: "Monthly unemployment assistance of ₹3,000 for degree holders and ₹1,500 for diploma holders alongside job-market upskilling.",
      description: "Yuva Nidhi provides financial stabilization for educated youth entering the workforce. Unemployed degree holders receive ₹3,000 per month and diploma holders receive ₹1,500 per month for up to 24 months (2 years) from the application date, or until they secure employment or self-employment, whichever is earlier. Beneficiaries submit a monthly self-declaration on Seva Sindhu confirming continued unemployment and enrol in free certified vocational training with Karnataka Skill Development Corporation (KSDC).",
      eligibility: "Graduates and diploma holders passing in academic year 2022-23 and subsequent batches, domiciled in Karnataka for min. 6 years, unemployed after 180 days (6 months) of graduation. Beneficiaries must complete monthly self-declaration of unemployment on Seva Sindhu.",
      benefits: "₹3,000/month for graduates; ₹1,500/month for diploma holders credited via DBT for up to 24 months, plus free access to certified skill enhancement programs.",
      applicationUrl: "https://sevasindhugs.karnataka.gov.in/yuvanidhi",
      officialSourceUrl: "https://skill.karnataka.gov.in/yuva-nidhi-guidelines",
      verificationDate: new Date("2026-11-03"),
      sortOrder: 5,
    },
  ];

  for (const s of schemesData) {
    await prisma.governmentScheme.upsert({
      where: { slug: s.slug },
      update: {
        name: s.name,
        kannadaName: s.kannadaName,
        department: s.department,
        tagline: s.tagline,
        description: s.description,
        eligibility: s.eligibility,
        benefits: s.benefits,
        applicationUrl: s.applicationUrl,
        officialSourceUrl: s.officialSourceUrl,
        verifiedAt: s.verificationDate,
        verificationStatus: VerificationStatus.VERIFIED,
        publicationStatus: PublicationStatus.PUBLISHED,
        sortOrder: s.sortOrder,
      },
      create: {
        organisationId: org.id,
        slug: s.slug,
        name: s.name,
        kannadaName: s.kannadaName,
        department: s.department,
        tagline: s.tagline,
        description: s.description,
        eligibility: s.eligibility,
        benefits: s.benefits,
        applicationUrl: s.applicationUrl,
        officialSourceUrl: s.officialSourceUrl,
        verifiedAt: s.verificationDate,
        verificationStatus: VerificationStatus.VERIFIED,
        publicationStatus: PublicationStatus.PUBLISHED,
        sortOrder: s.sortOrder,
      },
    });
  }

  console.log("✓ Seeded Karnataka's Five Guarantees with verified department references");

  // ==========================================
  // 7. SEED DOCUMENTED WORKS & INITIATIVES
  // ==========================================
  // Fetch constituency IDs for relational foreign keys
  const kanakapuraC = await prisma.constituency.findUnique({ where: { slug: "kanakapura" } });
  const koratagereC = await prisma.constituency.findUnique({ where: { slug: "koratagere" } });
  const babaleshwarC = await prisma.constituency.findUnique({ where: { slug: "babaleshwar" } });
  const byatarayanapuraC = await prisma.constituency.findUnique({ where: { slug: "byatarayanapura" } });
  const chittapurC = await prisma.constituency.findUnique({ where: { slug: "chittapur" } });
  const yemkanmardiC = await prisma.constituency.findUnique({ where: { slug: "yemkanmardi" } });

  // Clean existing projects for fresh idempotent seeding
  await prisma.workProject.deleteMany({ where: { organisationId: org.id } });

  const projectsData = [
    {
      title: "Cauvery Stage V Drinking Water Supply (CWSS Stage 5)",
      description: "Commissioning of 775 MLD treated drinking water supply network from T.K. Halli to 110 peripheral villages and municipal zones across Greater Bengaluru, funded through JICA ODA loan assistance (JPY 45,513 Million) and GoK/BWSSB counterpart capital. Inaugurated and commissioned 16 October 2024.",
      constituencyId: byatarayanapuraC?.id,
      location: "110 Peripheral Villages & Outer Zones, Greater Bengaluru",
      department: "Bengaluru Water Supply and Sewerage Board (BWSSB) / Urban Development",
      stage: ProjectStage.COMPLETED,
      initiativeType: ProjectType.GOVERNMENT_PROJECT,
      leaderProfileId: kbgProfile.id,
      announcedDate: new Date("2017-03-31"),
      latestUpdateDate: new Date("2024-10-16"),
      budgetAmount: "₹5,550 Crore (Sanctioned Project Cost / JICA Loan ID-P260)",
      evidenceUrl: "https://www.jica.go.jp/english/our_work/social_environmental/id/asia/south_asia/india/c8h0vm0000ak5o6v.html",
      lastVerifiedAt: new Date("2026-11-03"),
      verificationStatus: VerificationStatus.VERIFIED,
      publicationStatus: PublicationStatus.PUBLISHED,
    },
    {
      title: "Yettinahole Integrated Drinking Water Supply Project",
      description: "Lift canal and balancing reservoir network diverting 24.01 TMC of water from Western Ghats streams to provide dedicated drinking water supply to 75.59 lakh population across drought-prone Kolar, Chikkaballapura, Tumakuru, and Ramanagara districts. State Cabinet 2nd Revised Administrative Approval based on 2018-19 Schedule of Rates.",
      constituencyId: kanakapuraC?.id,
      location: "Sakleshpur, Tumakuru, Kolar & Chikkaballapur Districts",
      department: "Water Resources Department / Visvesvaraya Jala Nigam Limited (VJNL)",
      stage: ProjectStage.ONGOING,
      initiativeType: ProjectType.GOVERNMENT_PROJECT,
      leaderProfileId: dksProfile.id,
      announcedDate: new Date("2014-02-17"),
      latestUpdateDate: new Date("2024-09-06"),
      budgetAmount: "₹23,251.66 Crore (2nd Revised Administrative Approval)",
      evidenceUrl: "https://waterresources.karnataka.gov.in/",
      lastVerifiedAt: new Date("2026-11-03"),
      verificationStatus: VerificationStatus.VERIFIED,
      publicationStatus: PublicationStatus.PUBLISHED,
    },
    {
      title: "Bengaluru Peripheral Ring Road (Bengaluru Business Corridor)",
      description: "73-km priority phase access-controlled 8-lane expressway linking Tumakuru Road to Hosur Road via Old Madras Road to decongest metropolitan freight transit. Karnataka Cabinet approval dated 25 January 2024 approving ₹27,000 Cr DPR financing structure and hybrid land compensation framework.",
      constituencyId: byatarayanapuraC?.id,
      location: "Metropolitan Peripheral Arc, Bengaluru Urban & Rural",
      department: "Urban Development / Bangalore Development Authority (BDA)",
      stage: ProjectStage.APPROVED,
      initiativeType: ProjectType.GOVERNMENT_PROJECT,
      leaderProfileId: kbgProfile.id,
      announcedDate: new Date("2024-01-25"),
      latestUpdateDate: new Date("2026-10-15"),
      budgetAmount: "₹27,000 Crore (DPR Estimate & Cabinet Loan Framework)",
      evidenceUrl: "https://bda.karnataka.gov.in/",
      lastVerifiedAt: new Date("2026-11-03"),
      verificationStatus: VerificationStatus.VERIFIED,
      publicationStatus: PublicationStatus.PUBLISHED,
    },
    {
      title: "Kalasa-Banduri Nala Drinking Water Project",
      description: "Diversion of 3.90 TMC (Kalasa: 1.72 TMC, Banduri: 2.18 TMC) from Mahadayi tributaries into the Malaprabha basin to alleviate drinking water shortages across Belagavi, Dharwad, Bagalkot, and Gadag districts. Central Water Commission (CWC) technical appraisal cleared on 29 Dec 2022; Karnataka Cabinet revised administrative approval for ₹1,677.30 Cr (Kalasa ₹885.80 Cr; Banduri ₹791.50 Cr) in March 2023.",
      constituencyId: yemkanmardiC?.id,
      location: "Khanapur, Belagavi & Malaprabha Basin, North Karnataka",
      department: "Water Resources Department / Karnataka Neeravari Nigam Limited (KNNL)",
      stage: ProjectStage.APPROVED,
      initiativeType: ProjectType.GOVERNMENT_PROJECT,
      leaderProfileId: jarkiholiProfile.id,
      announcedDate: new Date("2022-12-29"),
      latestUpdateDate: new Date("2026-10-12"),
      budgetAmount: "₹1,677.30 Crore (Revised Administrative Approval)",
      evidenceUrl: "https://waterresources.karnataka.gov.in/",
      lastVerifiedAt: new Date("2026-11-03"),
      verificationStatus: VerificationStatus.VERIFIED,
      publicationStatus: PublicationStatus.PUBLISHED,
    },
    {
      title: "State Highway & Rural Bridge Capital Works Program",
      description: "Capital improvement, bridge reconstruction, and network upgradation across Karnataka state highways and district corridors under the Public Works Department. Financed via annual state capital outlay under Demand No. 20 (Public Works), Major Head 5054 (Capital Outlay on Roads and Bridges). Standalone ₹3,450 Cr figure flagged unverified in media reports and removed from public claims.",
      constituencyId: yemkanmardiC?.id,
      location: "Statewide Highway Network, 31 Districts",
      department: "Public Works Department (PWD)",
      stage: ProjectStage.ONGOING,
      initiativeType: ProjectType.GOVERNMENT_PROJECT,
      leaderProfileId: jarkiholiProfile.id,
      announcedDate: new Date("2023-07-07"),
      latestUpdateDate: new Date("2026-10-21"),
      budgetAmount: "State Budget Allocation (Demand No. 20, Major Head 5054)",
      evidenceUrl: "https://finance.karnataka.gov.in/",
      lastVerifiedAt: new Date("2026-11-03"),
      verificationStatus: VerificationStatus.NEEDS_REVIEW,
      publicationStatus: PublicationStatus.PUBLISHED,
    },
    {
      title: "Karnataka Digital Economy Mission (KDEM) Innovation Fund",
      description: "Blended public-private fund pool pooling venture capital commitments (₹786+ Cr) with state counterpart funds to seed deep-tech, artificial intelligence, and 'Beyond Bengaluru' tech clusters across Mysuru, Mangaluru, and Hubballi-Dharwad. Announced by Department of Electronics, IT, BT and S&T.",
      constituencyId: chittapurC?.id,
      location: "Bengaluru, Mysuru, Hubballi-Dharwad & Mangaluru Clusters",
      department: "Department of Electronics, IT, BT and S&T / KDEM",
      stage: ProjectStage.ONGOING,
      initiativeType: ProjectType.GOVERNMENT_PROJECT,
      leaderProfileId: khargeProfile.id,
      announcedDate: new Date("2024-03-05"),
      latestUpdateDate: new Date("2026-10-18"),
      budgetAmount: "₹1,200 Crore (Blended Capital Pool)",
      evidenceUrl: "https://karnatakadigital.in/",
      lastVerifiedAt: new Date("2026-11-03"),
      verificationStatus: VerificationStatus.VERIFIED,
      publicationStatus: PublicationStatus.PUBLISHED,
    },
    {
      title: "Vijayapura Mega Industrial Growth Centre & Agro-Tech Hub",
      description: "Establishment of a 1,200-acre comprehensive industrial park and food processing cluster with dedicated logistics link to NH 50, attracting large manufacturing and agro-allied investments to North Karnataka.",
      constituencyId: babaleshwarC?.id,
      location: "Babaleshwar & Vijayapura Industrial Zone, Vijayapura District",
      department: "Commerce & Industries Department / Karnataka Industrial Areas Development Board (KIADB)",
      stage: ProjectStage.ONGOING,
      initiativeType: ProjectType.GOVERNMENT_PROJECT,
      leaderProfileId: mbPatilProfile.id,
      announcedDate: new Date("2023-11-20"),
      latestUpdateDate: new Date("2026-10-26"),
      budgetAmount: "₹650 Crore (Approved Administrative Outlay)",
      evidenceUrl: "https://industries.karnataka.gov.in/",
      lastVerifiedAt: new Date("2026-11-03"),
      verificationStatus: VerificationStatus.VERIFIED,
      publicationStatus: PublicationStatus.PUBLISHED,
    },
    {
      title: "Bhoomi 3.0 & State Digital Land Mutation Modernisation",
      description: "Comprehensive digital transformation of Karnataka's agricultural and rural land records into the next-generation Bhoomi 3.0 cloud architecture, streamlining contactless mutation, Kaveri 2.0 integration, and transparent title tracking.",
      constituencyId: koratagereC?.id,
      location: "Koratagere & State Land Registries, Tumakuru & Statewide",
      department: "Revenue Department, Government of Karnataka",
      stage: ProjectStage.ONGOING,
      initiativeType: ProjectType.GOVERNMENT_PROJECT,
      leaderProfileId: parameshwaraProfile.id,
      announcedDate: new Date("2023-07-15"),
      latestUpdateDate: new Date("2026-10-20"),
      budgetAmount: "₹185 Crore (Sanctioned Budget Outlay)",
      evidenceUrl: "https://bhoomi.karnataka.gov.in/",
      lastVerifiedAt: new Date("2026-11-03"),
      verificationStatus: VerificationStatus.VERIFIED,
      publicationStatus: PublicationStatus.PUBLISHED,
    },
  ];

  for (const p of projectsData) {
    await prisma.workProject.create({
      data: {
        organisationId: org.id,
        title: p.title,
        description: p.description,
        constituencyId: p.constituencyId,
        location: p.location,
        department: p.department,
        stage: p.stage,
        initiativeType: p.initiativeType,
        leaderProfileId: p.leaderProfileId,
        announcedDate: p.announcedDate,
        latestUpdateDate: p.latestUpdateDate,
        budgetAmount: p.budgetAmount,
        evidenceUrl: p.evidenceUrl,
        lastVerifiedAt: p.lastVerifiedAt,
        verificationStatus: p.verificationStatus,
        publicationStatus: p.publicationStatus,
      },
    });
  }

  console.log("✓ Seeded documented works & initiatives across Karnataka constituencies");

  // ==========================================
  // 8. SEED AUDIT LOG EVENTS
  // ==========================================
  await prisma.auditEvent.createMany({
    data: [
      {
        organisationId: org.id,
        actorId: adminUser.id,
        action: "PLATFORM_EVOLVED",
        entityType: "Organisation",
        entityId: org.id,
        metadata: {
          platform: "UCreates Karnataka Congress Leadership & Constituency Platform",
          verifiedLeadersCount: 13,
          constituenciesCount: constituenciesData.length,
          schemesCount: schemesData.length,
          projectsCount: projectsData.length,
        },
        createdAt: new Date("2026-10-28T10:00:00Z"),
      },
      {
        organisationId: org.id,
        actorId: reviewerUser.id,
        action: "ROLES_VERIFIED_AGAINST_GAZETTES",
        entityType: "LeaderProfile",
        entityId: siddaProfile.id,
        metadata: {
          chiefMinister: "Siddaramaiah",
          deputyChiefMinister: "D. K. Shivakumar",
          homeMinister: "Dr. G. Parameshwara",
          rdprItbtMinister: "Priyank Kharge",
        },
        createdAt: new Date("2026-10-28T11:00:00Z"),
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
