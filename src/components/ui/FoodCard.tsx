"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Heart, ShoppingCart, X } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useFavoritesStore } from "@/store/theme";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";
import toast from "react-hot-toast";
import MagneticButton from "./MagneticButton";

interface FoodCardProps {
  item: Product;
  index?: number;
  lite?: boolean;
}

const FALLBACK =
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop";

export default function FoodCard({ item, index = 0, lite = false }: FoodCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [showDetail, setShowDetail] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((s) => s.addItem);
  const { toggleFavorite, isFavorite } = useFavoritesStore();

  const openDetail = () => setShowDetail(true);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (lite || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientY - rect.top - rect.height / 2) / 20;
    const y = -(e.clientX - rect.left - rect.width / 2) / 20;
    setTilt({ x, y });
  };

  const handleAddToCart = (closeAfter = false) => {
    if (!item.available) return;
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
    if (closeAfter) setShowDetail(false);
  };

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  const cardClassName = "food-card group cursor-pointer";

  const cardBody = (
    <>
      <div
        className="relative h-32 sm:h-48 overflow-hidden"
        onClick={openDetail}
        role="presentation"
      >
        {!lite ? (
          <motion.div className="absolute inset-0" whileHover={{ scale: 1.05 }} transition={{ duration: 0.4 }}>
            <Image
              src={item.image || FALLBACK}
              alt={item.name}
              fill
              className="object-cover pointer-events-none"
              sizes="(max-width: 640px) 50vw, 33vw"
              loading="lazy"
            />
          </motion.div>
        ) : (
          <Image
            src={item.image || FALLBACK}
            alt={item.name}
            fill
            className="object-cover pointer-events-none"
            sizes="(max-width: 640px) 50vw, 33vw"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent opacity-60" />

        {!lite && (
          <div className="absolute top-3 right-3 flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={(e) => {
                stopPropagation(e);
                toggleFavorite(item.id);
              }}
              className="p-2 rounded-full glass hover:bg-orange/20 transition-colors"
            >
              <Heart
                size={16}
                className={isFavorite(item.id) ? "fill-orange text-orange" : "text-white"}
              />
            </button>
          </div>
        )}

        {!item.available && (
          <div className="absolute inset-0 bg-dark/70 flex items-center justify-center">
            <span className="text-red-400 font-semibold text-sm">Unavailable</span>
          </div>
        )}
      </div>

      <div className="p-3 sm:p-5" onClick={openDetail}>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-2">
          <h3 className="font-montserrat font-bold text-sm sm:text-lg group-hover:text-orange transition-colors line-clamp-2">
            {item.name}
          </h3>
          <span className="text-orange font-bold text-sm sm:text-lg whitespace-nowrap">
            {formatPrice(item.price)}
          </span>
        </div>
        {item.description && (
          <p className="hidden sm:block text-white/50 text-sm mb-4 line-clamp-2">{item.description}</p>
        )}
      </div>

      <div className="px-3 pb-3 sm:px-5 sm:pb-5 flex items-center justify-between gap-1" onClick={stopPropagation}>
        <div className="flex items-center gap-1 sm:gap-2 glass rounded-full px-1.5 sm:px-2 py-1">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-0.5 sm:p-1 hover:text-orange transition-colors"
          >
            <Minus size={14} />
          </button>
          <span className="w-5 sm:w-6 text-center text-xs sm:text-sm font-semibold">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="p-0.5 sm:p-1 hover:text-orange transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>

        <MagneticButton
          onClick={() => handleAddToCart(false)}
          disabled={!item.available}
          className="flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-orange rounded-full text-xs sm:text-sm font-semibold
                     hover:bg-orange-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart size={14} />
          <span className="hidden sm:inline">Add</span>
        </MagneticButton>
      </div>
    </>
  );

  const detailModal = (
    <AnimatePresence>
      {showDetail && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-dark/85 backdrop-blur-sm"
          onClick={() => setShowDetail(false)}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-dark border border-white/10 rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="relative h-52 sm:h-64">
              <Image src={item.image || FALLBACK} alt={item.name} fill className="object-cover" />
              <button
                type="button"
                onClick={() => setShowDetail(false)}
                className="absolute top-4 right-4 p-2 rounded-full glass hover:bg-white/10"
                aria-label="Close"
              >
                <X size={20} />
              </button>
              <button
                type="button"
                onClick={() => toggleFavorite(item.id)}
                className="absolute top-4 left-4 p-2 rounded-full glass hover:bg-orange/20"
              >
                <Heart
                  size={20}
                  className={isFavorite(item.id) ? "fill-orange text-orange" : "text-white"}
                />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-2">
                <h2 className="text-2xl font-montserrat font-black">{item.name}</h2>
                <span className="text-2xl font-bold text-orange whitespace-nowrap">
                  {formatPrice(item.price)}
                </span>
              </div>
              {item.category?.name && (
                <p className="text-orange/80 text-sm mb-3">{item.category.name}</p>
              )}
              <p className="text-white/60 mb-6 leading-relaxed">
                {item.description || "Freshly prepared with premium ingredients."}
              </p>
              {!item.available && (
                <p className="text-red-400 text-sm mb-4 font-semibold">Currently unavailable</p>
              )}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 glass rounded-full px-3 py-2">
                  <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-semibold">{quantity}</span>
                  <button type="button" onClick={() => setQuantity(quantity + 1)}>
                    <Plus size={16} />
                  </button>
                </div>
                <MagneticButton
                  onClick={() => handleAddToCart(true)}
                  disabled={!item.available}
                  className="btn-primary flex-1 py-3 disabled:opacity-50"
                >
                  Add to Cart
                </MagneticButton>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
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
      {detailModal}
    </>
  );
}
