import prisma from "@/lib/prisma";
import MenuClient from "./MenuClient";
import type { Product, Category } from "@/types";

export const revalidate = 60;

async function getMenuData(): Promise<{
  products: Product[];
  categories: Category[];
}> {
  try {
    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: { available: true },
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
      }),
      prisma.category.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          image: true,
          sortOrder: true,
        },
        orderBy: { sortOrder: "asc" },
      }),
    ]);

    return {
      products: products.map((p) => ({ ...p, price: Number(p.price) })),
      categories,
    };
  } catch {
    return { products: [], categories: [] };
  }
}

export default async function MenuPage() {
  const { products, categories } = await getMenuData();
  return (
    <MenuClient initialProducts={products} initialCategories={categories} />
  );
}
