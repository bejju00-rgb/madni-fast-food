"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Tag,
  FolderOpen,
  Ticket,
  Video,
  Settings,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

import { ADMIN_NAV_LINKS } from "@/lib/admin-nav";
import BrandLogo from "@/components/ui/BrandLogo";

const iconByHref: Record<string, typeof LayoutDashboard> = {
  "/admin": LayoutDashboard,
  "/admin/orders": ShoppingBag,
  "/admin/products": Package,
  "/admin/deals": Tag,
  "/admin/categories": FolderOpen,
  "/admin/coupons": Ticket,
  "/admin/videos": Video,
  "/admin/settings": Settings,
};

const links = ADMIN_NAV_LINKS.map((item) => ({
  ...item,
  icon: iconByHref[item.href] ?? LayoutDashboard,
}));

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-dark border-r border-white/5 flex flex-col min-h-screen hidden lg:flex">
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-2">
          <BrandLogo size={32} textClassName="text-white font-bold text-sm" />
          <div>
            <span className="font-montserrat font-bold text-sm">Madni Shawarma</span>
            <span className="text-orange font-bold text-sm ml-1">Admin</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-orange/10 text-orange"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <link.icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/60
                     hover:bg-red-500/10 hover:text-red-400 transition-all w-full"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
