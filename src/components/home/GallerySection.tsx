"use client";

import Image from "next/image";

const galleryImages = [
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1529006557810-274dbdd82a285?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1608039829572-7851fb4a9632?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1626700051175-6818013e5786?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1606755962773-d324e166a853?w=400&h=300&fit=crop",
];

export default function GallerySection() {
  const doubled = [...galleryImages, ...galleryImages];

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
          {doubled.map((src, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-72 h-48 rounded-2xl overflow-hidden relative group"
            >
              <Image
                src={src}
                alt={`Food ${i + 1}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-orange/0 group-hover:bg-orange/20 transition-colors duration-500" />
            </div>
          ))}
        </div>
      </div>

      <div className="relative mt-4">
        <div className="flex animate-marquee-reverse gap-4">
          {[...doubled].reverse().map((src, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-72 h-48 rounded-2xl overflow-hidden relative group"
            >
              <Image
                src={src}
                alt={`Food ${i + 1}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-orange/0 group-hover:bg-orange/20 transition-colors duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
