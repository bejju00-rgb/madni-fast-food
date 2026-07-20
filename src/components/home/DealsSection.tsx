"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Deal } from "@/types";
import DealCard from "@/components/ui/DealCard";
import { ChevronRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface DealsSectionProps {
  deals: Deal[];
}

export default function DealsSection({ deals }: DealsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current || deals.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.from(".deals-title", {
        y: 60,
        opacity: 0,
        duration: 1,
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [deals.length]);

  return (
    <section ref={sectionRef} id="deals" className="relative overflow-hidden">
      <div className="section-padding pb-0">
        <div className="max-w-7xl mx-auto text-center mb-12 deals-title">
          <span className="text-orange font-semibold text-sm uppercase tracking-widest">
            Special Offers
          </span>
          <h2 className="text-4xl sm:text-5xl font-montserrat font-black mt-2">
            Special <span className="gradient-text">Deals</span>
          </h2>
          <p className="text-white/45 text-sm mt-3">Tap any deal for details</p>
        </div>
      </div>

      <div className="relative">
        <div
          className="pointer-events-none absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-10
                        flex flex-col items-center gap-1 text-orange"
        >
          <ChevronRight size={28} className="animate-bounce-x" />
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-white/60">
            Swipe
          </span>
        </div>

        <div className="overflow-x-auto pb-20 scrollbar-hide">
          <div className="flex gap-6 px-8 w-max min-w-full">
            {deals.map((deal) => (
              <DealCard key={deal.id} deal={deal} layout="carousel" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
