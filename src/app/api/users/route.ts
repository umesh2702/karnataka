import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";
import { Role, MembershipStatus } from "@prisma/client";

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.nativeEnum(Role),
});

export async function GET(req: NextRequest) {
  const authRes = await requireAuth(req, [Role.PLATFORM_ADMIN, Role.ORGANISATION_ADMIN]);
  if (authRes instanceof NextResponse) return authRes;
  const { session } = authRes;

  try {
    const memberships = await prisma.membership.findMany({
      where: { organisationId: session.organisationId },
      include: {
        user: { select: { id: true, name: true, email: true, createdAt: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const users = memberships.map((m) => ({
      membershipId: m.id,
      userId: m.user.id,
      name: m.user.name,
      email: m.user.email,
      role: m.role,
      status: m.status,
      joinedAt: m.createdAt,
    }));

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authRes = await requireAuth(req, [Role.PLATFORM_ADMIN, Role.ORGANISATION_ADMIN]);
  if (authRes instanceof NextResponse) return authRes;
  const { session } = authRes;

  try {
    const body = await req.json();
    const result = createUserSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, password, role } = result.data;

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      // Check if already member
      const existingMembership = await prisma.membership.findUnique({
        where: {
          organisationId_userId: {
            organisationId: session.organisationId,
            userId: existingUser.id,
          },
        },
      });

      if (existingMembership) {
        return NextResponse.json(
          { error: "User is already an authorised member of this studio organisation." },
          { status: 409 }
        );
      }

      const membership = await prisma.membership.create({
        data: {
          organisationId: session.organisationId,
          userId: existingUser.id,
          role,
          status: MembershipStatus.ACTIVE,
        },
      });

      await logAuditEvent({
        organisationId: session.organisationId,
        actorId: session.userId,
        action: "USER_INVITED",
        entityType: "Membership",
        entityId: membership.id,
        metadata: { email, role },
      });

      return NextResponse.json({ success: true, user: { id: existingUser.id, name, email, role } });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
        globalRole: "USER",
        memberships: {
          create: {
            organisationId: session.organisationId,
            role,
            status: MembershipStatus.ACTIVE,
          },
        },
      },
    });

    await logAuditEvent({
      organisationId: session.organisationId,
      actorId: session.userId,
      action: "USER_CREATED",
      entityType: "User",
      entityId: newUser.id,
      metadata: { email, role },
    });

    return NextResponse.json({ success: true, user: { id: newUser.id, name, email, role } });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
