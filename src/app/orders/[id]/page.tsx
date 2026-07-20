"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Clock } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import MagneticButton from "@/components/ui/MagneticButton";

const statusSteps = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

export default function OrderConfirmationPage() {
  const params = useParams();
  const [order, setOrder] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch(`/api/orders/${params.id}`)
      .then((r) => r.json())
      .then(setOrder);
  }, [params.id]);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-orange border-t-transparent rounded-full" />
      </div>
    );
  }

  const currentStep = statusSteps.indexOf(order.status as string);

  return (
    <div className="min-h-screen pt-24 section-padding">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
          <CheckCircle size={64} className="mx-auto text-green-400 mb-6" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-montserrat font-black mb-2"
        >
          Order Confirmed!
        </motion.h1>
        <p className="text-white/50 mb-8">
          Order #{order.orderNumber as string}
        </p>

        <div className="glass rounded-2xl p-6 mb-8">
          <h2 className="font-bold mb-4 flex items-center justify-center gap-2">
            <Clock size={18} className="text-orange" />
            Order Status
          </h2>
          <div className="flex justify-between relative">
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-white/10" />
            {statusSteps.map((step, i) => (
              <div key={step} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    i <= currentStep ? "bg-orange text-white" : "bg-white/10 text-white/30"
                  }`}
                >
                  {i + 1}
                </div>
                <span className="text-[10px] mt-2 text-white/50 hidden sm:block">
                  {step.replace(/_/g, " ")}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6 mb-8 text-left">
          <div className="flex justify-between mb-4">
            <span className="text-white/50">Total</span>
            <span className="text-orange font-bold text-xl">
              {formatPrice(order.total as number)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/50">Payment</span>
            <span>{(order.paymentMethod as string)?.replace(/_/g, " ")}</span>
          </div>
        </div>

        <Link href="/dashboard">
          <MagneticButton className="btn-primary">View All Orders</MagneticButton>
        </Link>
      </div>
    </div>
  );
}
