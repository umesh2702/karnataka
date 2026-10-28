# UCreates Leadership Studio — Karnataka Edition

> **"Public Leadership. Clearly Documented."**  
> An independent digital publication and profile publishing platform for documenting public leadership, verified career milestones, and sourced service records across Karnataka, India.

---

## 1. Product Overview

**UCreates Leadership Studio** is a multi-tenant leadership-profile publishing system. It combines the editorial elegance of a digital publication with the verification workflows of an enterprise SaaS platform.

### Core Capabilities
* **Public Editorial Portal:** Warm-white editorial aesthetic (`#F7F7F4`), charcoal typography (`#191A1C`), deep burgundy accents (`#8A1C2C`), bilingual interface (English & Kannada glyph coverage), searchable leadership directory, and structured public profiles.
* **Source Registry & Verification:** Every milestone and claim is linked to verified citations (Government Gazettes, Election Commission of India affidavits, official legislative records, and reputable reporting).
* **Consent & Media-Rights Governance:** Tracks rights holders, grant scopes (`PROFILE_PUBLICATION`, `PORTRAIT_USAGE`, `COPYRIGHTED_MEDIA`), expiry dates, and evidence references. Publication is blocked if active consent is missing.
* **Editorial Review State Machine:** Multi-tier lifecycle (`DRAFT → IN_REVIEW → APPROVED → PUBLISHED`), immutable revision snapshots, reviewer decision logs with mandatory reasons, and strict self-approval prevention.
* **Public Corrections Desk:** Public interface (`/corrections`) allowing citizens and institutions to submit structured correction requests backed by evidence URLs.
* **Enterprise Audit Logging:** Tamper-evident, sanitized activity log tracking all profile creations, draft updates, submissions, review decisions, and publication state changes.

---

## 2. Technology Stack

* **Frontend:** Next.js 16 (App Router), React 19, TypeScript (strict mode), Tailwind CSS v4, Lucide icons.
* **Backend:** Next.js Server Components, Server Actions, Route Handlers, Zod input validation.
* **Database & ORM:** PostgreSQL 17, Prisma ORM v7 with `@prisma/adapter-pg` driver adapter and connection pooling.
* **Authentication & RBAC:** Auth.js-compatible JOSE JWT session tokens with server-side cookie verification and role-based permissions (`PLATFORM_ADMIN`, `ORGANISATION_ADMIN`, `REVIEWER`, `EDITOR`).
* **Testing:** Vitest with native unit, database persistence, and workflow validation test suites.
* **Deployment:** Vercel-ready, container-compatible, cloud-managed PostgreSQL support (Neon, Supabase, AWS RDS).

---

## 3. Application Routes

### Public Pages
| Route | Description |
| :--- | :--- |
| `/` | Homepage featuring Karnataka Edition introduction, featured leader (D. K. Shivakumar), and directory preview |
| `/leaders` | Searchable directory of published Karnataka leaders with portfolio & region filters and pagination |
| `/leaders/[slug]` | Individual public profile with bilingual hero, career timeline, initiatives, and verified citations |
| `/about` | Product purpose, editorial guidelines, source verification methodology, and independence declaration |
| `/corrections` | Public corrections intake form for factual updates, evidence submission, and editorial review |
| `/privacy` | Privacy policy and public record curation governance |
| `/terms` | Platform terms of use and attribution standards |
| `/sitemap.xml` | Dynamically generated XML sitemap containing only approved, published leadership records |
| `/robots.txt` | Crawler directives allowing public profiles while disallowing private `/studio` routes |

### Studio Administration
| Route | Access Level | Description |
| :--- | :--- | :--- |
| `/studio/login` | Public | Administrator and editor authentication portal with 1-click test credentials |
| `/studio` | Authenticated | Live dashboard with database-calculated metrics and recent audit trail |
| `/studio/leaders` | Authenticated | Leadership profile manager with status filters, search, and action menus |
| `/studio/leaders/new` | Editor+ | Structured profile creator with slug generator and bilingual fields |
| `/studio/leaders/[id]/edit` | Editor+ | Multi-tab structured editor (Basic Info, Milestones, Initiatives, Media, Preview) |
| `/studio/reviews` | Reviewer+ | Editorial queue with submission diffs, revision history, and approval actions |
| `/studio/sources` | Reviewer+ | Source registry managing citations, publishers, and verification states |
| `/studio/permissions` | Reviewer+ | Legal consent and media-rights registry enforcing publication prerequisites |
| `/studio/audit` | Admin | Filterable institutional audit log with actor attribution and metadata |
| `/studio/users` | Admin | User account provisioning and role assignments |
| `/studio/settings` | Admin | Organisation configuration and regional branding parameters |

---

## 4. Seeded Karnataka Leaders

The initial seed dataset (`prisma/seed.ts`) populates verified Karnataka public leadership records with genuine citations:

1. **D. K. Shivakumar (`dk-shivakumar`)** — *PUBLISHED*
   - Deputy Chief Minister of Karnataka & Minister for Water Resources and Bengaluru Development.
   - Sourced milestones: Adelaide academic background, 1989 Sathanur assembly election, energy department reforms, Karnataka KPCC presidency, and 2023 swearing-in.
   - Sources: Official portal archives, Karnataka Legislative Assembly gazette, Election Commission of India affidavits.
2. **Siddaramaiah (`siddaramaiah`)** — *PUBLISHED*
   - Chief Minister of Karnataka.
   - Sourced milestones: Varuna assembly victory, finance minister tenures (13 state budgets), five welfare guarantees rollout.
3. **Dr. G. Parameshwara (`g-parameshwara`)** — *PUBLISHED*
   - Minister for Home Affairs.
   - Sourced milestones: Ph.D. in Plant Physiology (University of Adelaide), higher education and home affairs portfolios.
4. **Priyank Kharge (`priyank-kharge`)** — *IN_REVIEW*
   - Minister for Rural Development, Panchayat Raj & IT/BT.
5. **M. B. Patil (`mb-patil`)** — *APPROVED*
   - Minister for Large & Medium Industries and Infrastructure Development.
6. **Satish Jarkiholi (`satish-jarkiholi`)** — *DRAFT*
   - Minister for Public Works Department.

---

## 5. Development & Local Setup

### Prerequisites
* **Node.js:** v20.9.0 or later (Node.js 22 supported)
* **PostgreSQL:** Local PostgreSQL 14+ or remote cloud database (Neon, Supabase, RDS)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/ucreates/leadership-studio.git
cd leadership-studio
npm install
```

### 2. Configure Environment Variables
Copy the template configuration:
```bash
cp .env.example .env
```
Ensure `.env` contains your PostgreSQL credentials:
```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/leadership_studio?schema=public"
AUTH_SECRET="your-32-character-secret-key-goes-here-randomly-generated"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Synchronize Database & Run Seeds
```bash
# Push schema to database
npx prisma db push

# Populate initial Karnataka leaders, organisations, and users
npm run seed
```

### 4. Seeded Development Accounts
| Role | Email | Password |
| :--- | :--- | :--- |
| **Platform / Org Admin** | `admin@ucreates.io` | `Admin@12345` |
| **Reviewer** | `reviewer@ucreates.io` | `Admin@12345` |
| **Editor** | `editor@ucreates.io` | `Admin@12345` |

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) for the public portal or [http://localhost:3000/studio](http://localhost:3000/studio) for administration.

---

## 6. Automated Testing

Run the test suite:
```bash
npm test
```
The automated Vitest suite verifies:
* Real PostgreSQL connectivity and retrieval of seeded leadership records.
* Publication status isolation (Draft and In-Review profiles are omitted from public directory).
* Non-existent slug 404 responses.
* Editorial state machine transition validations.
* Self-approval prevention (editors cannot approve their own submissions).
* Consent enforcement (missing or expired consent blocks publication).
* Server-side audit log sanitization.

---

## 7. Production Build

To test and build the production bundle:
```bash
npm run build
npm start
```

---

## 8. Deployment Guide

### Vercel Deployment
1. Import repository into Vercel.
2. In Project Settings > Environment Variables, provide:
   * `DATABASE_URL`: Connection pooler URL (e.g. Neon, Supabase, or AWS RDS).
   * `AUTH_SECRET`: Random 32+ character string.
   * `NEXT_PUBLIC_APP_URL`: Production domain URL (e.g. `https://karnataka.ucreates.io`).
3. Deploy. The build process runs `prisma generate` and Next.js static page optimization.

---

## 9. Brand & Integrity Notice
* **Independent Initiative:** UCreates Leadership Studio is developed independently by UCreates.
* **No Official Endorsement:** The platform does not claim official endorsement, commissioning, or partnership with the Government of Karnataka, the Indian National Congress, or any elected official unless explicitly contracted.
* **Permitted Assets:** Does not use official state seals or protected marks outside of sourced informational reporting context.
