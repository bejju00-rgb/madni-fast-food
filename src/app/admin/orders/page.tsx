import { getAdminOrders } from "@/lib/admin-data";
import AdminOrdersClient from "./AdminOrdersClient";

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders(100);
  return <AdminOrdersClient initialOrders={orders} />;
}
