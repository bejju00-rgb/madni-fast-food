"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Trash2, Edit, X } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import type { Deal } from "@/types";
import ImageUpload from "@/components/admin/ImageUpload";

interface DealForm {
  title: string;
  description: string;
  price: number;
  items: string;
  image: string;
  active: boolean;
}

const emptyForm: DealForm = {
  title: "",
  description: "",
  price: 0,
  items: "",
  image: "",
  active: true,
};

export default function AdminDealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<DealForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadData = () => {
    fetch("/api/deals?all=true").then((r) => r.json()).then(setDeals);
  };

  useEffect(() => loadData(), []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (deal: Deal) => {
    setEditingId(deal.id);
    setForm({
      title: deal.title,
      description: deal.description || "",
      price: deal.price,
      items: deal.items.join("\n"),
      image: deal.image || "",
      active: deal.active,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSave = async () => {
    if (!form.title || !form.price) {
      toast.error("Title and price are required");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description || null,
        price: form.price,
        items: form.items.split("\n").filter(Boolean),
        image: form.image || null,
        active: form.active,
      };

      const res = editingId
        ? await fetch(`/api/deals/${editingId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/deals", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      if (!res.ok) throw new Error("Failed");

      toast.success(editingId ? "Deal updated" : "Deal created");
      closeForm();
      loadData();
    } catch {
      toast.error("Failed to save deal");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this deal?")) return;
    const res = await fetch(`/api/deals/${id}`, { method: "DELETE" });
    if (res.ok) {
      setDeals((prev) => prev.filter((d) => d.id !== id));
      toast.success("Deal deleted");
    } else {
      toast.error("Failed to delete deal");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-montserrat font-black">Deals</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-orange rounded-xl text-sm font-semibold"
        >
          <Plus size={16} /> Add Deal
        </button>
      </div>

      {showForm && (
        <div className="glass rounded-2xl p-6 mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg">{editingId ? "Edit Deal" : "Add Deal"}</h2>
            <button onClick={closeForm} className="p-2 hover:bg-white/10 rounded-full">
              <X size={18} />
            </button>
          </div>

          <ImageUpload
            value={form.image}
            onChange={(url) => setForm({ ...form, image: url })}
            folder="madni-fast-food/deals"
            label="Deal Image"
          />

          <input
            placeholder="Deal Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-orange/50"
          />
          <textarea
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-orange/50"
            rows={2}
          />
          <input
            type="number"
            placeholder="Price"
            value={form.price || ""}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-orange/50"
          />
          <textarea
            placeholder="Items (one per line)"
            value={form.items}
            onChange={(e) => setForm({ ...form, items: e.target.value })}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-orange/50"
            rows={4}
          />
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="accent-orange"
            />
            Active (visible on website)
          </label>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-orange rounded-xl font-semibold disabled:opacity-50"
          >
            {saving ? "Saving..." : editingId ? "Update Deal" : "Save Deal"}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {deals.map((deal) => (
          <div key={deal.id} className="glass rounded-2xl overflow-hidden">
            {deal.image && (
              <div className="relative h-36">
                <Image src={deal.image} alt={deal.title} fill className="object-cover" />
              </div>
            )}
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg">{deal.title}</h3>
                <span className="text-orange font-bold">{formatPrice(deal.price)}</span>
              </div>
              <ul className="space-y-1 mb-4">
                {deal.items.map((item, i) => (
                  <li key={i} className="text-sm text-white/50">• {item}</li>
                ))}
              </ul>
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  deal.active ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"
                }`}>
                  {deal.active ? "Active" : "Inactive"}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(deal)}
                    className="p-2 hover:text-orange transition-colors"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(deal.id)}
                    className="p-2 hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
