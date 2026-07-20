import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.settings.findFirst();
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({});
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const settings = await prisma.settings.upsert({
      where: { id: "default" },
      update: body,
      create: { id: "default", ...body },
    });
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
