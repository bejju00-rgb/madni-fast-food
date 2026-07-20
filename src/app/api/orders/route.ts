import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const where =
      session.user.role === "ADMIN" ? {} : { userId: session.user.id };

    const orders = await prisma.order.findMany({
      where,
      take: session.user.role === "ADMIN" ? 100 : undefined,
      include: { user: { select: { name: true, phone: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Please sign in to place an order" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const settings = await prisma.settings.findFirst();

    let discount = 0;
    if (body.couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: body.couponCode.toUpperCase(), active: true },
      });
      if (coupon && body.subtotal >= coupon.minOrder) {
        discount =
          coupon.discountType === "percentage"
            ? (body.subtotal * coupon.discountValue) / 100
            : coupon.discountValue;
        await prisma.coupon.update({
          where: { id: coupon.id },
          data: { usedCount: { increment: 1 } },
        });
      }
    }

    const deliveryCharge = settings?.deliveryCharge || 150;
    const total = body.subtotal + deliveryCharge - discount;

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: session.user.id,
        items: body.items,
        address: body.address,
        city: body.city,
        landmark: body.landmark,
        notes: body.notes,
        phone: body.phone,
        customerName: body.customerName,
        paymentMethod: body.paymentMethod,
        subtotal: body.subtotal,
        deliveryCharge,
        discount,
        total,
        couponCode: body.couponCode,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
