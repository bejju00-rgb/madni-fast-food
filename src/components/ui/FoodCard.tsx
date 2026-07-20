"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Heart, Eye, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useFavoritesStore } from "@/store/theme";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";
import toast from "react-hot-toast";
import MagneticButton from "./MagneticButton";

interface FoodCardProps {
  item: Product;
  index?: number;
  /** Faster card for full menu grid (no stagger / tilt). */
  lite?: boolean;
}

export default function FoodCard({ item, index = 0, lite = false }: FoodCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [showQuickView, setShowQuickView] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((s) => s.addItem);
  const { toggleFavorite, isFavorite } = useFavoritesStore();

  const handleMouseMove = (e: React.MouseEvent) => {
    if (lite || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientY - rect.top - rect.height / 2) / 20;
    const y = -(e.clientX - rect.left - rect.width / 2) / 20;
    setTilt({ x, y });
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image || undefined,
        type: "product",
      });
    }
    toast.success(`${item.name} added to cart!`, { duration: 2000 });
  };

  const cardClassName = "food-card group";

  const cardBody = (
    <>
      <div className="relative h-32 sm:h-48 overflow-hidden">
        {!lite ? (
          <motion.div
            className="absolute inset-0"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          >
            <Image
              src={
                item.image ||
                "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop"
              }
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, 33vw"
              loading="lazy"
            />
          </motion.div>
        ) : (
          <Image
            src={
              item.image ||
              "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop"
            }
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, 33vw"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent opacity-60" />

        {!lite && (
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => toggleFavorite(item.id)}
              data-cursor="pointer"
              className="p-2 rounded-full glass hover:bg-orange/20 transition-colors"
            >
              <Heart
                size={16}
                className={isFavorite(item.id) ? "fill-orange text-orange" : "text-white"}
              />
            </button>
            <button
              onClick={() => setShowQuickView(true)}
              data-cursor="pointer"
              className="p-2 rounded-full glass hover:bg-orange/20 transition-colors"
            >
              <Eye size={16} className="text-white" />
            </button>
          </div>
        )}

        {!item.available && (
          <div className="absolute inset-0 bg-dark/70 flex items-center justify-center">
            <span className="text-red-400 font-semibold text-sm">Unavailable</span>
          </div>
        )}
      </div>

      <div className="p-3 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-2">
          <h3 className="font-montserrat font-bold text-sm sm:text-lg group-hover:text-orange transition-colors line-clamp-2">
            {item.name}
          </h3>
          <span className="text-orange font-bold text-sm sm:text-lg whitespace-nowrap">
            {formatPrice(item.price)}
          </span>
        </div>
        {item.description && (
          <p className="hidden sm:block text-white/50 text-sm mb-4 line-clamp-2">
            {item.description}
          </p>
        )}

        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1 sm:gap-2 glass rounded-full px-1.5 sm:px-2 py-1">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              data-cursor="pointer"
              className="p-0.5 sm:p-1 hover:text-orange transition-colors"
            >
              <Minus size={14} />
            </button>
            <span className="w-5 sm:w-6 text-center text-xs sm:text-sm font-semibold">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              data-cursor="pointer"
              className="p-0.5 sm:p-1 hover:text-orange transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>

          <MagneticButton
            onClick={handleAddToCart}
            disabled={!item.available}
            className="flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-orange rounded-full text-xs sm:text-sm font-semibold
                       hover:bg-orange-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={14} />
            <span className="hidden sm:inline">Add</span>
          </MagneticButton>
        </div>
      </div>
    </>
  );

  return (
    <>
      {lite ? (
        <div ref={cardRef} className={cardClassName}>
          {cardBody}
        </div>
      ) : (
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setTilt({ x: 0, y: 0 })}
          style={{
            transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: "transform 0.1s ease-out",
          }}
          className={cardClassName}
        >
          {cardBody}
        </motion.div>
      )}

      <AnimatePresence>
        {showQuickView && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/80 backdrop-blur-sm"
            onClick={() => setShowQuickView(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-dark border border-white/10 rounded-3xl max-w-lg w-full overflow-hidden"
            >
              <div className="relative h-64">
                <Image
                  src={
                    item.image ||
                    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop"
                  }
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold font-montserrat mb-2">{item.name}</h2>
                <p className="text-white/60 mb-4">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-orange">{formatPrice(item.price)}</span>
                  <MagneticButton onClick={handleAddToCart} className="btn-primary">
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
