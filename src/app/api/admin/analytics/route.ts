import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const [
      totalOrders,
      totalRevenue,
      pendingOrders,
      totalCustomers,
      dailySales,
      weeklySales,
      monthlySales,
      recentOrders,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.user.count({ where: { role: "USER" } }),
      prisma.order.aggregate({
        where: { createdAt: { gte: today }, status: { not: "CANCELLED" } },
        _sum: { total: true },
        _count: true,
      }),
      prisma.order.aggregate({
        where: { createdAt: { gte: weekAgo }, status: { not: "CANCELLED" } },
        _sum: { total: true },
        _count: true,
      }),
      prisma.order.aggregate({
        where: { createdAt: { gte: monthAgo }, status: { not: "CANCELLED" } },
        _sum: { total: true },
        _count: true,
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, phone: true } } },
      }),
    ]);

    return NextResponse.json({
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      pendingOrders,
      totalCustomers,
      dailySales: { total: dailySales._sum.total || 0, count: dailySales._count },
      weeklySales: { total: weeklySales._sum.total || 0, count: weeklySales._count },
      monthlySales: { total: monthlySales._sum.total || 0, count: monthlySales._count },
      recentOrders,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
