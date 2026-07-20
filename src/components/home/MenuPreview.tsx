"use client";

import { useEffect, useRef } from "react";
import NavLink from "@/components/ui/NavLink";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FoodCard from "@/components/ui/FoodCard";
import type { Product } from "@/types";
import MagneticButton from "@/components/ui/MagneticButton";

gsap.registerPlugin(ScrollTrigger);

interface MenuPreviewProps {
  products: Product[];
}

export default function MenuPreview({ products }: MenuPreviewProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".menu-title", {
        y: 60,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="menu" className="section-padding relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 menu-title">
          <span className="text-orange font-semibold text-sm uppercase tracking-widest">
            Our Menu
          </span>
          <h2 className="text-4xl sm:text-5xl font-montserrat font-black mt-2 mb-4">
            Popular <span className="gradient-text">Dishes</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">
            Explore our wide range of delicious shawarma, burgers, pizza and more
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {products.slice(0, 8).map((product, i) => (
            <FoodCard key={product.id} item={product} index={i} />
          ))}
        </div>

        <div className="text-center mt-12">
          <NavLink href="/menu">
            <MagneticButton className="btn-primary text-lg">
              View Full Menu
            </MagneticButton>
          </NavLink>
        </div>
      </div>
    </section>
  );
}
