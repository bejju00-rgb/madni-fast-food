import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminMobileHeader from "@/components/admin/AdminMobileHeader";
import AdminBodyClass from "@/components/admin/AdminBodyClass";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-dark flex flex-col lg:flex-row">
      <AdminBodyClass />
      <AdminMobileHeader />
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
