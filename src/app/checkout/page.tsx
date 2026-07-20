"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, type CheckoutInput } from "@/lib/validations";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import MagneticButton from "@/components/ui/MagneticButton";
import { CreditCard, Banknote, Smartphone } from "lucide-react";
import { useSiteSettings } from "@/components/providers/SiteSettingsProvider";
import { formatPhoneDisplay } from "@/lib/site-settings";

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const settings = useSiteSettings();
  const { items, totalPrice, clearCart } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState<string>("CASH_ON_DELIVERY");
  const [loading, setLoading] = useState(false);

  const form = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: session?.user?.name || "",
      phone: session?.user?.phone || "",
      paymentMethod: "CASH_ON_DELIVERY",
    },
  });

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-orange border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!session) {
    router.push("/auth/signin");
    return null;
  }

  if (items.length === 0) {
    router.push("/menu");
    return null;
  }

  const subtotal = totalPrice();
  const deliveryCharge = settings.deliveryCharge;

  const paymentMethods = [
    {
      id: "JAZZCASH",
      label: "JazzCash",
      icon: Smartphone,
      details: { number: formatPhoneDisplay(settings.jazzcashNumber), name: settings.jazzcashName },
    },
    {
      id: "EASYPAISA",
      label: "Easypaisa",
      icon: CreditCard,
      details: {
        number: formatPhoneDisplay(settings.easypaisaNumber),
        name: settings.easypaisaName,
      },
    },
    {
      id: "CASH_ON_DELIVERY",
      label: "Cash on Delivery",
      icon: Banknote,
      details: null,
    },
  ];

  const onSubmit = async (data: CheckoutInput) => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          paymentMethod,
          items: items.map((i) => ({
            id: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            type: i.type,
          })),
          subtotal,
        }),
      });

      if (!res.ok) throw new Error("Failed to place order");

      const order = await res.json();
      clearCart();
      toast.success("Order placed successfully!");
      router.push(`/orders/${order.id}`);
    } catch {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 section-padding">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-montserrat font-black mb-8 text-center"
        >
          Checkout
        </motion.h1>

        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="glass rounded-2xl p-6">
              <h2 className="font-montserrat font-bold text-lg mb-4">Delivery Details</h2>
              <div className="space-y-4">
                {(["customerName", "phone", "address", "city", "landmark", "notes"] as const).map(
                  (field) => (
                    <div key={field}>
                      <label className="text-sm text-white/60 mb-1 block capitalize">
                        {field === "customerName" ? "Full Name" : field}
                      </label>
                      <input
                        {...form.register(field)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl
                                   focus:outline-none focus:border-orange/50 transition-colors"
                      />
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <h2 className="font-montserrat font-bold text-lg mb-4">Payment Method</h2>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                      paymentMethod === method.id
                        ? "border-orange bg-orange/10"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <method.icon size={20} className="text-orange" />
                    <div className="text-left">
                      <div className="font-semibold">{method.label}</div>
                      {method.details && paymentMethod === method.id && (
                        <div className="text-xs text-white/50 mt-1">
                          {method.details.number} - {method.details.name}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="glass rounded-2xl p-6 sticky top-24">
              <h2 className="font-montserrat font-bold text-lg mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-white/70">
                      {item.name} x{item.quantity}
                    </span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Delivery</span>
                  <span>{formatPrice(deliveryCharge)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2">
                  <span>Total</span>
                  <span className="text-orange">{formatPrice(subtotal + deliveryCharge)}</span>
                </div>
              </div>
              <MagneticButton
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-4 mt-6 disabled:opacity-50"
              >
                {loading ? "Placing Order..." : "Place Order"}
              </MagneticButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
