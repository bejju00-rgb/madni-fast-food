"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import FoodCard from "@/components/ui/FoodCard";
import type { Product, Category } from "@/types";

interface MenuClientProps {
  initialProducts: Product[];
  initialCategories: Category[];
}

export default function MenuClient({
  initialProducts,
  initialCategories,
}: MenuClientProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return initialProducts.filter((p) => {
      const matchCat =
        activeCategory === "all" || p.category?.slug === activeCategory;
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [initialProducts, activeCategory, search]);

  return (
    <div className="min-h-screen pt-24 section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-orange font-semibold text-sm uppercase tracking-widest">
            Full Menu
          </span>
          <h1 className="text-4xl sm:text-5xl font-montserrat font-black mt-2">
            Our <span className="gradient-text">Menu</span>
          </h1>
        </div>

        <div className="relative max-w-md mx-auto mb-8">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
            size={18}
          />
          <input
            type="text"
            placeholder="Search menu items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 glass rounded-full text-white placeholder-white/30
                       focus:outline-none focus:border-orange/50 border border-transparent transition-colors"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === "all"
                ? "bg-orange text-white"
                : "glass hover:bg-white/10"
            }`}
          >
            All
          </button>
          {initialCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.slug)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.slug
                  ? "bg-orange text-white"
                  : "glass hover:bg-white/10"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-white/50 py-20">No items found</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {filtered.map((product) => (
              <FoodCard key={product.id} item={product} lite />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
