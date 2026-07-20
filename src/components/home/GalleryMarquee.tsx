"use client";

import Image from "next/image";

type GalleryItem = { src: string; alt: string };

function isCloudinary(url: string) {
  return url.includes("res.cloudinary.com");
}

function GalleryImage({ src, alt }: GalleryItem) {
  const useNextImage = isCloudinary(src) || src.includes("images.unsplash.com");

  if (useNextImage) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes="288px"
        unoptimized={src.includes("images.unsplash.com")}
        className="object-cover group-hover:scale-110 transition-transform duration-700"
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
    />
  );
}

export default function GalleryMarquee({ images }: { images: GalleryItem[] }) {
  const doubled = [...images, ...images];

  return (
    <section className="py-20 overflow-hidden">
      <div className="text-center mb-12">
        <span className="text-orange font-semibold text-sm uppercase tracking-widest">
          Gallery
        </span>
        <h2 className="text-4xl sm:text-5xl font-montserrat font-black mt-2">
          Food <span className="gradient-text">Gallery</span>
        </h2>
      </div>

      <div className="relative">
        <div className="flex animate-marquee gap-4">
          {doubled.map((item, i) => (
            <div
              key={`${item.src}-${i}`}
              className="flex-shrink-0 w-72 h-48 rounded-2xl overflow-hidden relative group"
            >
              <GalleryImage src={item.src} alt={item.alt} />
              <div className="absolute inset-0 bg-orange/0 group-hover:bg-orange/20 transition-colors duration-500 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>

      <div className="relative mt-4">
        <div className="flex animate-marquee-reverse gap-4">
          {[...doubled].reverse().map((item, i) => (
            <div
              key={`rev-${item.src}-${i}`}
              className="flex-shrink-0 w-72 h-48 rounded-2xl overflow-hidden relative group"
            >
              <GalleryImage src={item.src} alt={item.alt} />
              <div className="absolute inset-0 bg-orange/0 group-hover:bg-orange/20 transition-colors duration-500 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
