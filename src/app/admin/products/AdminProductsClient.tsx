"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Edit, X } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import type { Product, Category } from "@/types";
import ImageUpload from "@/components/admin/ImageUpload";

interface ProductForm {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image: string;
  available: boolean;
  featured: boolean;
}

const emptyForm: ProductForm = {
  name: "",
  description: "",
  price: 0,
  categoryId: "",
  image: "",
  available: true,
  featured: false,
};

interface AdminProductsClientProps {
  initialProducts: Product[];
  initialCategories: Category[];
}

export default function AdminProductsClient({
  initialProducts,
  initialCategories,
}: AdminProductsClientProps) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [categories] = useState(initialCategories);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category?.name.toLowerCase().includes(q)
    );
  }, [products, search]);

  const refreshList = async () => {
    const res = await fetch("/api/admin/products", { cache: "no-store" });
    if (res.ok) setProducts(await res.json());
    router.refresh();
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price,
      categoryId: product.categoryId,
      image: product.image || "",
      available: product.available,
      featured: product.featured || false,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSave = async () => {
    if (!form.name || !form.categoryId || !form.price) {
      toast.error("Name, category, and price are required");
      return;
    }

    setSaving(true);
    try {
      const payload = { ...form, image: form.image || null };
      const res = editingId
        ? await fetch(`/api/products/${editingId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      if (!res.ok) throw new Error("Failed to save");

      toast.success(editingId ? "Product updated" : "Product created");
      closeForm();
      await refreshList();
    } catch {
      toast.error("Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.success("Product deleted");
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-montserrat font-black">Products</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="search"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-orange/50"
          />
          <button
            onClick={openCreate}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-orange rounded-xl text-sm font-semibold"
          >
            <Plus size={16} />
            Add Product
          </button>
        </div>
      </div>

      {showForm && (
        <div className="glass rounded-2xl p-6 mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg">{editingId ? "Edit Product" : "Add Product"}</h2>
            <button onClick={closeForm} className="p-2 hover:bg-white/10 rounded-full">
              <X size={18} />
            </button>
          </div>

          <ImageUpload
            value={form.image}
            onChange={(url) => setForm({ ...form, image: url })}
            folder="madni-fast-food/products"
            label="Product Image"
          />

          <input
            placeholder="Product Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-orange/50"
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-orange/50"
            rows={3}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Price"
              value={form.price || ""}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-orange/50"
            />
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="admin-select w-full"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={form.available}
                onChange={(e) => setForm({ ...form, available: e.target.checked })}
                className="accent-orange"
              />
              Available
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="accent-orange"
              />
              Featured
            </label>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-orange rounded-xl font-semibold disabled:opacity-50"
          >
            {saving ? "Saving..." : editingId ? "Update Product" : "Save Product"}
          </button>
        </div>
      )}

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-[#141414] z-10">
              <tr className="text-white/50 border-b border-white/5">
                <th className="text-left p-4">Image</th>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Category</th>
                <th className="text-left p-4">Price</th>
                <th className="text-left p-4">Status</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-4">
                    {product.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.image}
                        alt=""
                        width={48}
                        height={48}
                        loading="lazy"
                        decoding="async"
                        className="w-12 h-12 rounded-lg object-cover bg-white/5"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-white/20 text-xs">
                        —
                      </div>
                    )}
                  </td>
                  <td className="p-4 font-medium">{product.name}</td>
                  <td className="p-4 text-white/50">{product.category?.name}</td>
                  <td className="p-4 text-orange">{formatPrice(product.price)}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        product.available
                          ? "bg-green-400/10 text-green-400"
                          : "bg-red-400/10 text-red-400"
                      }`}
                    >
                      {product.available ? "Available" : "Unavailable"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(product)}
                        className="p-2 hover:text-orange transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-white/40 text-xs p-3 border-t border-white/5">
          Showing {filtered.length} of {products.length} products
        </p>
      </div>
    </div>
  );
}
