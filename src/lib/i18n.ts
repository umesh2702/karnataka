export type Language = "en" | "kn";

export interface Translations {
  nav: {
    home: string;
    leaders: string;
    about: string;
    corrections: string;
    studio: string;
    signIn: string;
    searchPlaceholder: string;
  };
  hero: {
    edition: string;
    tagline: string;
    description: string;
    exploreBtn: string;
    aboutBtn: string;
    featuredLabel: string;
    viewProfile: string;
  };
  directory: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    filterRole: string;
    filterRegion: string;
    allRoles: string;
    allRegions: string;
    sortAsc: string;
    sortDesc: string;
    clearFilters: string;
    verifiedOn: string;
    noResultsTitle: string;
    noResultsDesc: string;
    showingResults: string;
  };
  profile: {
    roleVerifiedAt: string;
    biography: string;
    careerTimeline: string;
    initiatives: string;
    sourcesReferences: string;
    mediaGallery: string;
    shareProfile: string;
    copied: string;
    constituency: string;
    portfolio: string;
    organisation: string;
    verifiedSource: string;
    emptyTimeline: string;
    emptyInitiatives: string;
    independentDisclaimer: string;
  };
  status: {
    published: string;
    draft: string;
    inReview: string;
    approved: string;
    archived: string;
  };
  footer: {
    tagline: string;
    disclaimer: string;
    rights: string;
    about: string;
    privacy: string;
    terms: string;
    corrections: string;
    karnatakaEdition: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      home: "Home",
      leaders: "Leaders Directory",
      about: "Editorial Standards",
      corrections: "Submit Correction",
      studio: "Studio Admin",
      signIn: "Studio Sign-in",
      searchPlaceholder: "Search leader by name or role...",
    },
    hero: {
      edition: "Karnataka Edition",
      tagline: "Public Leadership. Clearly Documented.",
      description:
        "An independent, source-aware digital publication platform documenting public service, career milestones, and legislative work across Karnataka.",
      exploreBtn: "Explore Leaders Directory",
      aboutBtn: "Our Editorial Standards",
      featuredLabel: "Featured Leadership Profile",
      viewProfile: "View Full Profile & Sources",
    },
    directory: {
      title: "Karnataka Leadership Directory",
      subtitle:
        "Verified public representatives and cabinet ministers, with citations linked to official legislative gazettes and public filings.",
      searchPlaceholder: "Search by leader name, constituency or portfolio...",
      filterRole: "Filter by Role",
      filterRegion: "Filter by Region",
      allRoles: "All Public Roles",
      allRegions: "All Regions",
      sortAsc: "Name (A to Z)",
      sortDesc: "Name (Z to A)",
      clearFilters: "Clear Filters",
      verifiedOn: "Verified",
      noResultsTitle: "No matching leadership profiles found",
      noResultsDesc: "Try adjusting your search criteria or clearing selected filters.",
      showingResults: "Showing public profiles",
    },
    profile: {
      roleVerifiedAt: "Role last verified against official records",
      biography: "Public Biography & Background",
      careerTimeline: "Public Career & Milestones",
      initiatives: "Documented Initiatives & Work",
      sourcesReferences: "Sourced References & Verification",
      mediaGallery: "Media & Attribution",
      shareProfile: "Share Profile",
      copied: "Link Copied!",
      constituency: "Constituency",
      portfolio: "Executive Portfolio",
      organisation: "Affiliation",
      verifiedSource: "Verified Official Source",
      emptyTimeline: "No verified public milestones have been published for this profile yet.",
      emptyInitiatives: "No public initiatives currently listed under verified status.",
      independentDisclaimer:
        "This profile is compiled by UCreates Leadership Studio using public legislative gazettes and verifiable reports. It is not an official government endorsement.",
    },
    status: {
      published: "Published",
      draft: "Draft",
      inReview: "In Review",
      approved: "Approved",
      archived: "Archived",
    },
    footer: {
      tagline: "A Digital Record of Public Service.",
      disclaimer:
        "UCreates Leadership Studio is an independent digital publishing platform. Not affiliated with or endorsed by the Government of Karnataka, Indian National Congress, or any political entity.",
      rights: "All rights reserved.",
      about: "About & Standards",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      corrections: "Corrections & Updates",
      karnatakaEdition: "Karnataka Edition v1.0",
    },
  },
  kn: {
    nav: {
      home: "ಮುಖಪುಟ",
      leaders: "ನಾಯಕರ ಕೋಶ",
      about: "ಸಂಪಾದಕೀಯ ನೀತಿ",
      corrections: "ತಿದ್ದುಪಡಿ ಸಲ್ಲಿಸಿ",
      studio: "ಸ್ಟುಡಿಯೋ ಆಡಳಿತ",
      signIn: "ಪ್ರವೇಶ (Sign-in)",
      searchPlaceholder: "ನಾಯಕರ ಹೆಸರು ಅಥವಾ ಹುದ್ದೆ ಹುಡುಕಿ...",
    },
    hero: {
      edition: "ಕರ್ನಾಟಕ ಆವೃತ್ತಿ",
      tagline: "ಸಾರ್ವಜನಿಕ ನಾಯಕತ್ವ. ಸ್ಪಷ್ಟ ದಾಖಲೆ.",
      description:
        "ಕರ್ನಾಟಕದ ಸಾರ್ವಜನಿಕ ಪ್ರತಿನಿಧಿಗಳು, ಶಾಸಕಾಂಗ ಕಾರ್ಯಗಳು ಮತ್ತು ದಾಖಲಿತ ಸಾಧನೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ ದಾಖಲಿಸುವ ಸ್ವತಂತ್ರ ಡಿಜಿಟಲ್ ವೇದಿಕೆ.",
      exploreBtn: "ನಾಯಕರ ವಿವರಗಳನ್ನು ನೋಡಿ",
      aboutBtn: "ಸಂಪಾದಕೀಯ ಮಾನದಂಡಗಳು",
      featuredLabel: "ಪ್ರಮುಖ ನಾಯಕರ ಪರಿಚಯ",
      viewProfile: "ಸಂಪೂರ್ಣ ವಿವರ ಮತ್ತು ಆಧಾರಗಳು",
    },
    directory: {
      title: "ಕರ್ನಾಟಕ ನಾಯಕರ ಕೋಶ",
      subtitle: "ಅಧಿಕೃತ ಗೆಜೆಟ್ ಮತ್ತು ಸಾರ್ವಜನಿಕ ದಾಖಲೆಗಳಿಂದ ಪರಿಶೀಲಿಸಲ್ಪಟ್ಟ ಜನಪ್ರತಿನಿಧಿಗಳ ವಿವರಗಳು.",
      searchPlaceholder: "ಹೆಸರು, ಕ್ಷೇತ್ರ ಅಥವಾ ಖಾತೆಯ ಮೂಲಕ ಹುಡುಕಿ...",
      filterRole: "ಹುದ್ದೆಯ ಪ್ರಕಾರ",
      filterRegion: "ಪ್ರದೇಶದ ಪ್ರಕಾರ",
      allRoles: "ಎಲ್ಲಾ ಹುದ್ದೆಗಳು",
      allRegions: "ಎಲ್ಲಾ ಪ್ರದೇಶಗಳು",
      sortAsc: "ಅಕಾರಾದಿ (A to Z)",
      sortDesc: "ಅಕಾರಾದಿ (Z to A)",
      clearFilters: "ಫಿಲ್ಟರ್ ತೆರವುಗೊಳಿಸಿ",
      verifiedOn: "ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
      noResultsTitle: "ಯಾವುದೇ ನಾಯಕರ ವಿವರ ಲಭ್ಯವಿಲ್ಲ",
      noResultsDesc: "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಹುಡುಕಾಟದ ಪದಗಳನ್ನು ಬದಲಿಸಿ ಅಥವಾ ಫಿಲ್ಟರ್ ತೆರವುಗೊಳಿಸಿ.",
      showingResults: "ತೋರಿಸಲಾಗುತ್ತಿರುವ ಪ್ರೊಫೈಲ್‌ಗಳು",
    },
    profile: {
      roleVerifiedAt: "ಅಧಿಕೃತ ದಾಖಲೆಯೊಂದಿಗೆ ಪರಿಶೀಲಿಸಿದ ದಿನಾಂಕ",
      biography: "ಸಾರ್ವಜನಿಕ ಜೀವನ ಚರಿತ್ರೆ",
      careerTimeline: "ಸಾರ್ವಜನಿಕ ಸೇವಾ ಮೈಲಿಗಲ್ಲುಗಳು",
      initiatives: "ದಾಖಲಿತ ಯೋಜನೆಗಳು ಮತ್ತು ಕಾರ್ಯಗಳು",
      sourcesReferences: "ಉಲ್ಲೇಖಿತ ಮೂಲಗಳು ಮತ್ತು ಪುರಾವೆಗಳು",
      mediaGallery: "ಮಾಧ್ಯಮ ಮತ್ತು ಹಕ್ಕುಗಳು",
      shareProfile: "ಹಂಚಿಕೊಳ್ಳಿ",
      copied: "ಲಿಂಕ್ ನಕಲಿಸಲಾಗಿದೆ!",
      constituency: "ಚುನಾವಣಾ ಕ್ಷೇತ್ರ",
      portfolio: "ಸಚಿವ ಸಂಪುಟ ಖಾತೆ",
      organisation: "ಸಂಸ್ಥೆ / ಪಕ್ಷ",
      verifiedSource: "ಪರಿಶೀಲಿತ ಅಧಿಕೃತ ಮೂಲ",
      emptyTimeline: "ಈ ನಾಯಕರಿಗೆ ಇನ್ನೂ ಯಾವುದೇ ಮೈಲಿಗಲ್ಲುಗಳನ್ನು ಪ್ರಕಟಿಸಲಾಗಿಲ್ಲ.",
      emptyInitiatives: "ಯಾವುದೇ ಸಾರ್ವಜನಿಕ ಯೋಜನೆಗಳು ದಾಖಲಾಗಿಲ್ಲ.",
      independentDisclaimer:
        "ಈ ವಿವರವನ್ನು ಯುಕ್ರಿಯೇಟ್ಸ್ (UCreates) ಸ್ವತಂತ್ರವಾಗಿ ಸಾರ್ವಜನಿಕ ಗೆಜೆಟ್‌ಗಳಿಂದ ಸಂಗ್ರಹಿಸಿದೆ. ಇದು ಯಾವುದೇ ಸರ್ಕಾರದ ಅಧಿಕೃತ ಅಂಗೀಕಾರವಲ್ಲ.",
    },
    status: {
      published: "ಪ್ರಕಟಿತ",
      draft: "ಕರಡು",
      inReview: "ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ",
      approved: "ಅನುಮೋದಿತ",
      archived: "ಆರ್ಕೈವ್ ಮಾಡಲಾಗಿದೆ",
    },
    footer: {
      tagline: "ಸಾರ್ವಜನಿಕ ಸೇವೆಯ ಅಧಿಕೃತ ಡಿಜಿಟಲ್ ದಾಖಲೆ.",
      disclaimer:
        "ಯುಕ್ರಿಯೇಟ್ಸ್ ಲೀಡರ್‌ಶಿಪ್ ಸ್ಟುಡಿಯೋ ಒಂದು ಸ್ವತಂತ್ರ ಡಿಜಿಟಲ್ ಪ್ರಕಾಶನ ತಂತ್ರಜ್ಞಾನ. ಕರ್ನಾಟಕ ಸರ್ಕಾರ ಅಥವಾ ಯಾವುದೇ ರಾಜಕೀಯ ಪಕ್ಷದೊಂದಿಗೆ ನೇರ ಸಂಬಂಧ ಹೊಂದಿಲ್ಲ.",
      rights: "ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.",
      about: "ಕುರಿತು & ಮಾನದಂಡಗಳು",
      privacy: "ಗೌಪ್ಯತಾ ನೀತಿ",
      terms: "ಬಳಕೆಯ ನಿಯಮಗಳು",
      corrections: "ತಿದ್ದುಪಡಿ ಮತ್ತು ಅಪ್‌ಡೇಟ್",
      karnatakaEdition: "ಕರ್ನಾಟಕ ಆವೃತ್ತಿ ೧.೦",
    },
  },
};
