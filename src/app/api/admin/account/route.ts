import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return null;
  }
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, phone: true, email: true, role: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PATCH(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, phone, email, currentPassword, newPassword } = body as {
      name?: string;
      phone?: string;
      email?: string;
      currentPassword?: string;
      newPassword?: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const changingSensitive =
      (phone && phone !== user.phone) ||
      (newPassword && newPassword.length > 0);

    if (changingSensitive) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Current password is required" },
          { status: 400 }
        );
      }
      if (!user.password) {
        return NextResponse.json({ error: "No password set on account" }, { status: 400 });
      }
      const valid = await bcrypt.compare(currentPassword, user.password);
      if (!valid) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
      }
    }

    if (phone && phone !== user.phone) {
      const taken = await prisma.user.findUnique({ where: { phone } });
      if (taken && taken.id !== user.id) {
        return NextResponse.json({ error: "Phone number already in use" }, { status: 400 });
      }
    }

    if (email && email !== user.email) {
      const taken = await prisma.user.findUnique({ where: { email } });
      if (taken && taken.id !== user.id) {
        return NextResponse.json({ error: "Email already in use" }, { status: 400 });
      }
    }

    const data: {
      name?: string;
      phone?: string;
      email?: string | null;
      password?: string;
    } = {};

    if (name?.trim()) data.name = name.trim();
    if (phone?.trim()) data.phone = phone.trim();
    if (email !== undefined) {
      data.email = email.trim() ? email.trim() : null;
    }
    if (newPassword && newPassword.length >= 6) {
      data.password = await bcrypt.hash(newPassword, 12);
    } else if (newPassword && newPassword.length > 0) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data,
      select: { id: true, name: true, phone: true, email: true, role: true },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update account" }, { status: 500 });
  }
}
