import prisma from "@/lib/prisma";

/** Stable food photos (JPEG via Unsplash) — used when DB has fewer images */
export const GALLERY_FALLBACK: { src: string; alt: string }[] = [
  {
    src: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
    alt: "Pizza",
  },
  {
    src: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    alt: "Pizza slice",
  },
  {
    src: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    alt: "Burger",
  },
  {
    src: "https://images.unsplash.com/photo-1529006557810-274dbdd82af85?auto=format&fit=crop&w=800&q=80",
    alt: "Shawarma",
  },
  {
    src: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
    alt: "Grilled food",
  },
  {
    src: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80",
    alt: "Pizza oven",
  },
  {
    src: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80",
    alt: "Kebab",
  },
  {
    src: "https://images.unsplash.com/photo-1606755962773-d324e166a853?auto=format&fit=crop&w=800&q=80",
    alt: "Fast food",
  },
];

export async function getGalleryImages(): Promise<{ src: string; alt: string }[]> {
  try {
    const products = await prisma.product.findMany({
      where: { image: { not: null }, available: true },
      select: { image: true, name: true },
      orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
      take: 12,
    });

    const fromDb = products
      .filter((p): p is { image: string; name: string } => Boolean(p.image))
      .map((p) => ({ src: p.image, alt: p.name }));

    if (fromDb.length >= 6) return fromDb;
    const merged = [...fromDb];
    for (const item of GALLERY_FALLBACK) {
      if (merged.length >= 8) break;
      if (!merged.some((m) => m.src === item.src)) merged.push(item);
    }
    return merged.length ? merged : GALLERY_FALLBACK;
  } catch {
    return GALLERY_FALLBACK;
  }
}
