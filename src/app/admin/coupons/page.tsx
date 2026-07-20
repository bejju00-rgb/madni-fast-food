"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

interface Coupon {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  minOrder: number;
  active: boolean;
  usedCount: number;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [form, setForm] = useState({ code: "", discountType: "percentage", discountValue: 10, minOrder: 500 });

  useEffect(() => {
    fetch("/api/coupons").then((r) => r.json()).then(setCoupons);
  }, []);

  const handleCreate = async () => {
    const res = await fetch("/api/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const coupon = await res.json();
      setCoupons((prev) => [...prev, coupon]);
      toast.success("Coupon created");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-montserrat font-black mb-8">Coupons</h1>
      <div className="glass rounded-2xl p-6 mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <input placeholder="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none" />
        <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none">
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed Amount</option>
        </select>
        <input type="number" placeholder="Value" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })}
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none" />
        <button onClick={handleCreate} className="flex items-center justify-center gap-2 bg-orange rounded-xl font-semibold">
          <Plus size={16} /> Create
        </button>
      </div>
      <div className="space-y-3">
        {coupons.map((c) => (
          <div key={c.id} className="glass rounded-xl p-4 flex justify-between items-center">
            <div>
              <span className="font-mono font-bold text-orange">{c.code}</span>
              <span className="text-white/50 text-sm ml-3">
                {c.discountValue}{c.discountType === "percentage" ? "%" : " Rs"} off
              </span>
            </div>
            <span className="text-white/40 text-sm">Used: {c.usedCount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
