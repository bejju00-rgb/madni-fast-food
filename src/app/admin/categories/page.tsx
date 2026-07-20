"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Edit, X, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import type { Category } from "@/types";
import ImageUpload from "@/components/admin/ImageUpload";

interface CategoryForm {
  name: string;
  image: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryForm>({ name: "", image: "" });
  const [saving, setSaving] = useState(false);

  const loadData = () => {
    fetch("/api/categories").then((r) => r.json()).then(setCategories);
  };

  useEffect(() => loadData(), []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ name: "", image: "" });
    setShowForm(true);
  };

  const openEdit = (cat: Category) => {
    setEditingId(cat.id);
    setForm({ name: cat.name, image: cat.image || "" });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ name: "", image: "" });
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setSaving(true);
    try {
      const slug = form.name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
      const payload = { name: form.name, slug, image: form.image || null };

      const res = editingId
        ? await fetch(`/api/categories/${editingId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      if (!res.ok) throw new Error("Failed");

      toast.success(editingId ? "Category updated" : "Category created");
      closeForm();
      loadData();
    } catch {
      toast.error("Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category? Products in it may be affected.")) return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (res.ok) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success("Category deleted");
    } else {
      toast.error("Failed to delete — category may have products");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-montserrat font-black">Categories</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-orange rounded-xl text-sm font-semibold"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {showForm && (
        <div className="glass rounded-2xl p-6 mb-6 space-y-4 max-w-lg">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg">
              {editingId ? "Edit Category" : "Add Category"}
            </h2>
            <button onClick={closeForm} className="p-2 hover:bg-white/10 rounded-full">
              <X size={18} />
            </button>
          </div>

          <ImageUpload
            value={form.image}
            onChange={(url) => setForm({ ...form, image: url })}
            folder="madni-fast-food/categories"
            label="Category Image"
          />

          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Category name"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-orange/50"
          />

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-orange rounded-xl font-semibold disabled:opacity-50"
          >
            {saving ? "Saving..." : editingId ? "Update Category" : "Save Category"}
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="glass rounded-2xl overflow-hidden group">
            <div className="relative h-32 bg-white/5">
              {cat.image ? (
                <Image src={cat.image} alt={cat.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/20 text-sm">
                  No image
                </div>
              )}
              <div className="absolute inset-0 bg-dark/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => openEdit(cat)}
                  className="p-2 bg-orange rounded-full hover:bg-orange-dark transition-colors"
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="p-4 text-center">
              <h3 className="font-semibold">{cat.name}</h3>
              <p className="text-white/40 text-sm">{cat._count?.products || 0} items</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
