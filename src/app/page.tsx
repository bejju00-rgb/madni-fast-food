import HeroSection from "@/components/home/HeroSection";
import MenuPreview from "@/components/home/MenuPreview";
import DealsSection from "@/components/home/DealsSection";
import AboutSection from "@/components/home/AboutSection";
import GallerySection from "@/components/home/GallerySection";
import prisma from "@/lib/prisma";

export const revalidate = 60;

async function getFeaturedProducts() {
  try {
    return await prisma.product.findMany({
      where: { available: true },
      include: { category: { select: { name: true, slug: true } } },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      take: 8,
    });
  } catch {
    return [];
  }
}

async function getDeals() {
  try {
    return await prisma.deal.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [products, deals] = await Promise.all([getFeaturedProducts(), getDeals()]);

  return (
    <>
      <link rel="preload" href="/videos/hero-1.mp4" as="video" type="video/mp4" />
      <HeroSection />
      <MenuPreview products={products} />
      <DealsSection deals={deals} />
      <AboutSection />
      <GallerySection />
    </>
  );
}
