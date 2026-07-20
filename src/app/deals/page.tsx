"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import type { Deal } from "@/types";
import toast from "react-hot-toast";
import MagneticButton from "@/components/ui/MagneticButton";

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    fetch("/api/deals")
      .then((r) => r.json())
      .then((data) => {
        setDeals(data);
        setLoading(false);
      });
  }, []);

  const handleAdd = (deal: Deal) => {
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
    <div className="min-h-screen pt-24 section-padding">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-orange font-semibold text-sm uppercase tracking-widest">
            Save More
          </span>
          <h1 className="text-4xl sm:text-5xl font-montserrat font-black mt-2">
            Special <span className="gradient-text">Deals</span>
          </h1>
          <p className="text-white/50 mt-4 max-w-xl mx-auto">
            Grab our exclusive combo deals and save big on your favorite meals
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="food-card h-96 animate-pulse bg-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {deals.map((deal, i) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="food-card group overflow-hidden"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={deal.image || "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop"}
                    alt={deal.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent" />
                  <div className="absolute top-4 right-4 bg-orange px-4 py-2 rounded-full font-bold text-lg">
                    {formatPrice(deal.price)}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-montserrat font-bold text-xl mb-2 group-hover:text-orange transition-colors">
                    {deal.title}
                  </h3>
                  {deal.description && (
                    <p className="text-white/50 text-sm mb-4">{deal.description}</p>
                  )}
                  <ul className="space-y-2 mb-6">
                    {deal.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-white/70">
                        <span className="w-2 h-2 bg-yellow rounded-full flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <MagneticButton
                    onClick={() => handleAdd(deal)}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-orange rounded-full
                               font-semibold hover:bg-orange-dark transition-colors"
                  >
                    <ShoppingCart size={16} />
                    Add to Cart
                  </MagneticButton>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
