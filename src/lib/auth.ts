import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import prisma from "./prisma";

const SECRET_KEY = new TextEncoder().encode(
  process.env.AUTH_SECRET || "ucreates-leadership-studio-super-secret-key-32-bytes-minimum"
);

const SESSION_COOKIE = "leadership_studio_session";

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: Role;
  organisationId: string;
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET_KEY);
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return await verifySession(token);
}

export async function getSessionFromRequest(req: NextRequest): Promise<SessionPayload | null> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return await verifySession(token);
}

export async function requireAuth(
  req: NextRequest,
  allowedRoles?: Role[]
): Promise<{ session: SessionPayload } | NextResponse> {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const hasRole =
      session.role === Role.PLATFORM_ADMIN ||
      session.role === Role.ORGANISATION_ADMIN ||
      allowedRoles.includes(session.role);

    if (!hasRole) {
      return NextResponse.json(
        { error: `Forbidden. Requires one of [${allowedRoles.join(", ")}] roles.` },
        { status: 403 }
      );
    }
  }

  return { session };
}

/**
 * Enforces rule: Editors cannot approve their own submissions by default.
 */
export function canApproveRevision(reviewerId: string, submittedById?: string | null): boolean {
  if (!submittedById) return true;
  return reviewerId !== submittedById;
}

export { SESSION_COOKIE };
