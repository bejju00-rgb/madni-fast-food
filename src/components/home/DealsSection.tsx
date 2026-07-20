"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import type { Deal } from "@/types";
import toast from "react-hot-toast";
import MagneticButton from "@/components/ui/MagneticButton";
import { ShoppingCart } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface DealsSectionProps {
  deals: Deal[];
}

export default function DealsSection({ deals }: DealsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const addItem = useCartStore((s) => s.addItem);

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

  const handleAddDeal = (deal: Deal) => {
    addItem({
      id: deal.id,
      name: deal.title,
      price: deal.price,
      image: deal.image || undefined,
      type: "deal",
    });
    toast.success(`${deal.title} added to cart!`);
  };

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
        </div>
      </div>

      <div className="overflow-x-auto pb-20 scrollbar-hide">
        <div className="flex gap-6 px-8 w-max min-w-full">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="flex-shrink-0 w-80 sm:w-96 food-card group"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={deal.image || "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop"}
                  alt={deal.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent" />
                <div className="absolute top-4 right-4 bg-orange px-3 py-1 rounded-full font-bold">
                  {formatPrice(deal.price)}
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-montserrat font-bold text-xl mb-3 group-hover:text-orange transition-colors">
                  {deal.title}
                </h3>
                <ul className="space-y-1 mb-4">
                  {deal.items.map((item, i) => (
                    <li key={i} className="text-white/50 text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-orange rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
                <MagneticButton
                  onClick={() => handleAddDeal(deal)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-orange rounded-full
                             font-semibold hover:bg-orange-dark transition-colors"
                >
                  <ShoppingCart size={16} />
                  Add Deal to Cart
                </MagneticButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
