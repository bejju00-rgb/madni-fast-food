import { getAdminCategories, getAdminProducts } from "@/lib/admin-data";
import AdminProductsClient from "./AdminProductsClient";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    getAdminProducts(),
    getAdminCategories(),
  ]);

  return (
    <AdminProductsClient initialProducts={products} initialCategories={categories} />
  );
}
