"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import type { Deal } from "@/types";
import toast from "react-hot-toast";
import MagneticButton from "./MagneticButton";

const FALLBACK =
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop";

interface DealCardProps {
  deal: Deal;
  layout?: "grid" | "carousel";
  index?: number;
}

export default function DealCard({ deal, layout = "grid", index = 0 }: DealCardProps) {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: deal.id,
        name: deal.title,
        price: deal.price,
        image: deal.image || undefined,
        type: "deal",
      });
    }
    toast.success(`${deal.title} added to cart!`, { duration: 2000 });
    setOpen(false);
  };

  const openDetail = () => setOpen(true);

  const cardInner = (
    <>
      <div
        className={`relative overflow-hidden cursor-pointer ${layout === "carousel" ? "h-48" : "h-56"}`}
        onClick={openDetail}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && openDetail()}
      >
        <Image
          src={deal.image || FALLBACK}
          alt={deal.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          sizes={layout === "carousel" ? "384px" : "33vw"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent" />
        <div className="absolute top-4 right-4 bg-orange px-3 py-1 rounded-full font-bold text-sm sm:text-base">
          {formatPrice(deal.price)}
        </div>
      </div>
      <div className="p-4 sm:p-6">
        <button
          type="button"
          onClick={openDetail}
          className="text-left w-full font-montserrat font-bold text-lg sm:text-xl mb-2 group-hover:text-orange transition-colors"
        >
          {deal.title}
        </button>
        {layout === "grid" && deal.description && (
          <p className="text-white/50 text-sm mb-3 line-clamp-2">{deal.description}</p>
        )}
        {layout === "grid" && (
          <ul className="space-y-1 mb-4 hidden sm:block">
            {deal.items.slice(0, 3).map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-white/70">
                <span className="w-2 h-2 bg-yellow rounded-full flex-shrink-0" />
                {item}
              </li>
            ))}
            {deal.items.length > 3 && (
              <li className="text-xs text-white/40">+{deal.items.length - 3} more… tap for details</li>
            )}
          </ul>
        )}
        {layout === "carousel" && (
          <ul className="space-y-1 mb-4">
            {deal.items.slice(0, 2).map((item, i) => (
              <li key={i} className="text-white/50 text-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-orange rounded-full" />
                <span className="line-clamp-1">{item}</span>
              </li>
            ))}
          </ul>
        )}
        <button
          type="button"
          onClick={openDetail}
          className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 bg-orange rounded-full
                     font-semibold hover:bg-orange-dark transition-colors text-sm"
        >
          <ShoppingCart size={16} />
          View Deal
        </button>
      </div>
    </>
  );

  const wrapperClass =
    layout === "carousel"
      ? "flex-shrink-0 w-80 sm:w-96 food-card group"
      : "food-card group overflow-hidden";

  return (
    <>
      {layout === "grid" ? (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: Math.min(index * 0.05, 0.3) }}
          className={wrapperClass}
        >
          {cardInner}
        </motion.div>
      ) : (
        <div className={wrapperClass}>{cardInner}</div>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-dark/85 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-dark border border-white/10 rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="relative h-52 sm:h-64">
                <Image src={deal.image || FALLBACK} alt={deal.title} fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-full glass hover:bg-white/10"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
                <div className="absolute bottom-4 left-4 bg-orange px-4 py-2 rounded-full font-bold text-lg">
                  {formatPrice(deal.price)}
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-montserrat font-black mb-2">{deal.title}</h2>
                {deal.description && (
                  <p className="text-white/60 text-sm mb-4">{deal.description}</p>
                )}
                <p className="text-sm font-semibold text-orange mb-2">Includes:</p>
                <ul className="space-y-2 mb-6">
                  {deal.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-white/80">
                      <span className="w-2 h-2 bg-yellow rounded-full flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 glass rounded-full px-3 py-2">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-1 hover:text-orange"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-semibold">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-1 hover:text-orange"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <MagneticButton onClick={handleAdd} className="btn-primary flex-1 py-3">
                    Add to Cart
                  </MagneticButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
