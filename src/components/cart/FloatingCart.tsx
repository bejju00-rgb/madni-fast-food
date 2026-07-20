"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import MagneticButton from "@/components/ui/MagneticButton";

export default function FloatingCart() {
  const { items, isOpen, setCartOpen, removeItem, updateQuantity, totalPrice, totalItems } =
    useCartStore();

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-dark/60 backdrop-blur-sm z-50"
              onClick={() => setCartOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-dark border-l border-white/10 z-50
                         flex flex-col"
              data-lenis-prevent
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-xl font-montserrat font-bold flex items-center gap-2">
                  <ShoppingBag size={20} className="text-orange" />
                  Your Cart ({totalItems()})
                </h2>
                <button
                  onClick={() => setCartOpen(false)}
                  data-cursor="pointer"
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="text-center py-20">
                    <ShoppingBag size={48} className="mx-auto text-white/20 mb-4" />
                    <p className="text-white/50">Your cart is empty</p>
                    <Link href="/menu">
                      <MagneticButton
                        onClick={() => setCartOpen(false)}
                        className="btn-primary mt-4"
                      >
                        Browse Menu
                      </MagneticButton>
                    </Link>
                  </div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-4 glass rounded-xl p-3"
                    >
                      {item.image && (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                        <p className="text-orange text-sm font-bold">
                          {formatPrice(item.price)}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-0.5 hover:text-orange"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-0.5 hover:text-orange"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-white/30 hover:text-red-400 transition-colors self-start"
                      >
                        <X size={16} />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>

              {items.length > 0 && (
                <div className="p-6 border-t border-white/10 space-y-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-orange">{formatPrice(totalPrice())}</span>
                  </div>
                  <Link href="/checkout">
                    <MagneticButton
                      onClick={() => setCartOpen(false)}
                      className="w-full btn-primary text-center py-4"
                    >
                      Proceed to Checkout
                    </MagneticButton>
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
