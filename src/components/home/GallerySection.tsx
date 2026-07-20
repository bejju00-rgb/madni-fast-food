import { getGalleryImages } from "@/lib/gallery-images";
import GalleryMarquee from "@/components/home/GalleryMarquee";

export default async function GallerySection() {
  const images = await getGalleryImages();
  return <GalleryMarquee images={images} />;
}
