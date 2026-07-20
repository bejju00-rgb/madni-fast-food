"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Package, Clock, MapPin, RefreshCw, LogOut } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/types";
import MagneticButton from "@/components/ui/MagneticButton";
import { useCartStore } from "@/store/cart";
import toast from "react-hot-toast";
import { signOut } from "next-auth/react";

const statusColors: Record<string, string> = {
  PENDING: "text-yellow-400 bg-yellow-400/10",
  CONFIRMED: "text-blue-400 bg-blue-400/10",
  PREPARING: "text-orange bg-orange/10",
  OUT_FOR_DELIVERY: "text-purple-400 bg-purple-400/10",
  DELIVERED: "text-green-400 bg-green-400/10",
  CANCELLED: "text-red-400 bg-red-400/10",
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch("/api/orders")
        .then((r) => r.json())
        .then((data) => {
          setOrders(data);
          setLoading(false);
        });
    }
  }, [session]);

  const handleReorder = (order: Order) => {
    const items = order.items as Order["items"];
    items.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        addItem({
          id: item.id,
          name: item.name,
          price: item.price,
          type: item.type,
        });
      }
    });
    toast.success("Items added to cart!");
    router.push("/checkout");
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-spin w-8 h-8 border-2 border-orange border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 section-padding">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-montserrat font-black mb-2">
                Welcome, {session?.user?.name}
              </h1>
              <p className="text-white/50">Track and manage your orders</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center justify-center gap-2 px-5 py-2.5 glass rounded-full
                         text-sm font-medium hover:bg-red-500/10 hover:text-red-400 transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </motion.div>

        {orders.length === 0 ? (
          <div className="text-center py-20 glass rounded-2xl">
            <Package size={48} className="mx-auto text-white/20 mb-4" />
            <p className="text-white/50">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold">{order.orderNumber}</h3>
                    <p className="text-white/50 text-sm flex items-center gap-1 mt-1">
                      <Clock size={12} />
                      {new Date(order.createdAt).toLocaleDateString("en-PK", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      statusColors[order.status] || ""
                    }`}
                  >
                    {order.status.replace(/_/g, " ")}
                  </span>
                </div>

                <div className="text-sm text-white/60 mb-3 flex items-center gap-1">
                  <MapPin size={12} />
                  {order.address}, {order.city}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-orange font-bold text-lg">
                    {formatPrice(order.total)}
                  </span>
                  <MagneticButton
                    onClick={() => handleReorder(order)}
                    className="flex items-center gap-2 px-4 py-2 glass rounded-full text-sm
                               hover:bg-orange/10 transition-colors"
                  >
                    <RefreshCw size={14} />
                    Reorder
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
