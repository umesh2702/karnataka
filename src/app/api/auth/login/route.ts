import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { signSession, SESSION_COOKIE } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        memberships: {
          where: { status: "ACTIVE" },
          include: { organisation: true },
          take: 1,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const membership = user.memberships[0];
    if (!membership) {
      return NextResponse.json(
        { error: "No active organisation membership found for this account." },
        { status: 403 }
      );
    }

    const payload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: membership.role,
      organisationId: membership.organisationId,
    };

    const token = await signSession(payload);

    await logAuditEvent({
      organisationId: membership.organisationId,
      actorId: user.id,
      action: "USER_SIGNED_IN",
      entityType: "User",
      entityId: user.id,
      metadata: { role: membership.role },
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: membership.role,
        organisation: {
          id: membership.organisation.id,
          name: membership.organisation.name,
          slug: membership.organisation.slug,
        },
      },
    });

    response.cookies.set({
      name: SESSION_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json({ error: "Internal server error during authentication." }, { status: 500 });
  }
}
