"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  paymentMethod: string;
  status: string;
  total: number;
  items: Array<{ name: string; quantity: number; price: number }>;
  createdAt: string;
  user: { name: string; phone: string };
}

const statuses = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

export default function AdminOrdersClient({
  initialOrders,
}: {
  initialOrders: Order[];
}) {
  const router = useRouter();
  const [orders, setOrders] = useState(initialOrders);
  const [expanded, setExpanded] = useState<string | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
      toast.success("Status updated");
      router.refresh();
    }
  };

  const removeOrder = async (id: string, orderNumber: string) => {
    if (
      !confirm(
        `Remove order ${orderNumber}? It will be deleted permanently and removed from dashboard revenue.`
      )
    ) {
      return;
    }

    setDeletingId(id);
    const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });

    if (res.ok) {
      setOrders((prev) => prev.filter((o) => o.id !== id));
      if (expanded === id) setExpanded(null);
      toast.success("Order removed");
      router.refresh();
    } else {
      toast.error("Could not remove order");
    }
    setDeletingId(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-montserrat font-black mb-2">Order Management</h1>
      <p className="text-white/40 text-sm mb-8">Latest {orders.length} orders</p>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="glass rounded-2xl p-6">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setExpanded(expanded === order.id ? null : order.id)}
            >
              <div>
                <span className="font-mono text-sm text-orange">{order.orderNumber}</span>
                <p className="font-semibold">{order.customerName}</p>
                <p className="text-white/50 text-sm">{order.phone}</p>
              </div>
              <div className="text-right flex flex-col items-end gap-2">
                <p className="font-bold text-orange">{formatPrice(order.total)}</p>
                <p className="text-white/40 text-xs">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    void removeOrder(order.id, order.orderNumber);
                  }}
                  disabled={deletingId === order.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                             bg-red-500/15 text-red-300 border border-red-500/30 hover:bg-red-500/25
                             disabled:opacity-50 transition-colors"
                >
                  <Trash2 size={14} />
                  {deletingId === order.id ? "Removing…" : "Remove order"}
                </button>
              </div>
            </div>

            {expanded === order.id && (
              <div className="mt-4 pt-4 border-t border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-white/50 text-sm">Address</p>
                    <p>
                      {order.address}, {order.city}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/50 text-sm">Payment</p>
                    <p>{order.paymentMethod.replace(/_/g, " ")}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-white/50 text-sm mb-2">Items</p>
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm py-1">
                      <span>
                        {item.name} x{item.quantity}
                      </span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {statuses.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        void updateStatus(order.id, status);
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        order.status === status
                          ? "bg-orange text-white"
                          : "bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      {status.replace(/_/g, " ")}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
