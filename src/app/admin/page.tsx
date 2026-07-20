"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  DollarSign,
  Clock,
  Users,
  TrendingUp,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Analytics {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  totalCustomers: number;
  dailySales: { total: number; count: number };
  weeklySales: { total: number; count: number };
  monthlySales: { total: number; count: number };
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    total: number;
    status: string;
    customerName: string;
    createdAt: string;
  }>;
}

export default function AdminDashboard() {
  const [data, setData] = useState<Analytics | null>(null);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-orange border-t-transparent rounded-full" />
      </div>
    );
  }

  const stats = [
    { label: "Total Orders", value: data.totalOrders, icon: ShoppingBag, color: "text-blue-400" },
    { label: "Revenue", value: formatPrice(data.totalRevenue), icon: DollarSign, color: "text-green-400" },
    { label: "Pending", value: data.pendingOrders, icon: Clock, color: "text-yellow-400" },
    { label: "Customers", value: data.totalCustomers, icon: Users, color: "text-purple-400" },
  ];

  const salesPeriods = [
    { label: "Today", ...data.dailySales },
    { label: "This Week", ...data.weeklySales },
    { label: "This Month", ...data.monthlySales },
  ];

  return (
    <div>
      <h1 className="text-2xl font-montserrat font-black mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon size={20} className={stat.color} />
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-white/50 text-sm">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        {salesPeriods.map((period) => (
          <div key={period.label} className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-orange" />
              <span className="text-sm text-white/50">{period.label}</span>
            </div>
            <div className="text-xl font-bold">{formatPrice(period.total)}</div>
            <div className="text-white/40 text-xs">{period.count} orders</div>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="font-bold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/50 border-b border-white/5">
                <th className="text-left py-3">Order</th>
                <th className="text-left py-3">Customer</th>
                <th className="text-left py-3">Total</th>
                <th className="text-left py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-white/5">
                  <td className="py-3 font-mono text-xs">{order.orderNumber}</td>
                  <td className="py-3">{order.customerName}</td>
                  <td className="py-3 text-orange">{formatPrice(order.total)}</td>
                  <td className="py-3">
                    <span className="px-2 py-1 rounded-full text-xs bg-white/5">
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
