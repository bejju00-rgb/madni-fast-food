import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";

export async function getAdminAnalytics() {
  return unstable_cache(
    async () => {
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
          select: {
            id: true,
            orderNumber: true,
            total: true,
            status: true,
            customerName: true,
            createdAt: true,
          },
        }),
      ]);

      return {
        totalOrders,
        totalRevenue: totalRevenue._sum.total || 0,
        pendingOrders,
        totalCustomers,
        dailySales: { total: dailySales._sum.total || 0, count: dailySales._count },
        weeklySales: { total: weeklySales._sum.total || 0, count: weeklySales._count },
        monthlySales: { total: monthlySales._sum.total || 0, count: monthlySales._count },
        recentOrders: recentOrders.map((o) => ({
          ...o,
          createdAt: o.createdAt.toISOString(),
        })),
      };
    },
    ["admin-analytics-v1"],
    { revalidate: 30, tags: ["admin-analytics"] }
  )();
}

export async function getAdminProducts() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      image: true,
      categoryId: true,
      available: true,
      featured: true,
      category: { select: { name: true, slug: true } },
    },
    orderBy: { name: "asc" },
  });
  return products.map((p) => ({ ...p, price: Number(p.price) }));
}

export async function getAdminCategories() {
  return prisma.category.findMany({
    select: { id: true, name: true, slug: true, image: true, sortOrder: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getAdminOrders(limit = 100) {
  const orders = await prisma.order.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      orderNumber: true,
      customerName: true,
      phone: true,
      address: true,
      city: true,
      paymentMethod: true,
      status: true,
      total: true,
      items: true,
      createdAt: true,
      user: { select: { name: true, phone: true } },
    },
  });
  return orders.map((o) => ({
    ...o,
    total: Number(o.total),
    createdAt: o.createdAt.toISOString(),
    items: (Array.isArray(o.items) ? o.items : []) as Array<{
      name: string;
      quantity: number;
      price: number;
    }>,
    status: String(o.status),
    paymentMethod: String(o.paymentMethod),
  }));
}
