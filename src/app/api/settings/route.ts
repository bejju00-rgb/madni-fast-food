import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

const SETTINGS_ID = "default";

const editableFields = [
  "deliveryCharge",
  "whatsappNumber",
  "jazzcashNumber",
  "jazzcashName",
  "easypaisaNumber",
  "easypaisaName",
  "facebookHandle",
  "instagramHandle",
  "logoUrl",
  "heroOpenTime",
  "heroCloseTime",
] as const;

async function getSettingsRecord() {
  const byId = await prisma.settings.findUnique({ where: { id: SETTINGS_ID } });
  if (byId) return byId;
  return prisma.settings.findFirst();
}

export async function GET() {
  try {
    const settings = await getSettingsRecord();
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({});
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const data: Record<string, string | number | null> = {};
    for (const key of editableFields) {
      if (body[key] !== undefined) {
        if (key === "logoUrl") {
          data.logoUrl = body.logoUrl ? String(body.logoUrl) : null;
        } else {
          data[key] = body[key];
        }
      }
    }

    const existing = await getSettingsRecord();

    const settings = existing
      ? await prisma.settings.update({
          where: { id: existing.id },
          data,
        })
      : await prisma.settings.create({
          data: { id: SETTINGS_ID, ...data },
        });

    revalidateTag("site-settings");

    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
