"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Deal } from "@/types";
import DealCard from "@/components/ui/DealCard";

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/deals")
      .then((r) => r.json())
      .then((data) => {
        setDeals(data);
        setLoading(false);
      });
  }, []);

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
            Tap a deal to see full details and add to cart
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
              <DealCard key={deal.id} deal={deal} layout="grid" index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
