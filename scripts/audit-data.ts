import prisma from '../src/lib/prisma';

async function auditData() {
  const showcaseSlugs = [
    'dk-shivakumar',
    'g-parameshwara',
    'priyank-kharge',
    'mb-patil',
    'satish-jarkiholi',
    'krishna-byre-gowda'
  ];

  const profiles = await prisma.leaderProfile.findMany({
    where: { slug: { in: showcaseSlugs } },
    select: {
      slug: true,
      displayName: true,
      kannadaName: true,
      currentRole: true,
      party: true,
      portfolio: true,
      constituency: true,
      portraitUrl: true,
      roleLastVerifiedAt: true,
      _count: { select: { milestones: true, initiatives: true, projects: true, claimSources: true } }
    }
  });

  const schemes = await prisma.governmentScheme.findMany({
    select: {
      slug: true,
      name: true,
      kannadaName: true,
      department: true,
      officialSourceUrl: true,
      publicationStatus: true
    }
  });

  const projects = await prisma.workProject.findMany({
    select: {
      id: true,
      title: true,
      department: true,
      stage: true,
      verificationStatus: true,
      evidenceUrl: true,
      announcedDate: true,
      leaderProfile: { select: { displayName: true, slug: true } }
    }
  });

  console.log('=== LEADERS ===');
  console.log(JSON.stringify(profiles, null, 2));
  console.log('=== SCHEMES ===');
  console.log(JSON.stringify(schemes, null, 2));
  console.log('=== PROJECTS ===');
  console.log(JSON.stringify(projects, null, 2));
}

auditData().catch(console.error);
