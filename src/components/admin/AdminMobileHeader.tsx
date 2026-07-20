"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/deals", label: "Deals" },
  { href: "/admin/categories", label: "Categories" },
];

export default function AdminMobileHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="lg:hidden sticky top-0 z-40 bg-dark border-b border-white/10">
      <div className="flex items-center justify-between p-4">
        <span className="font-montserrat font-bold text-sm">Madni Admin</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-400
                       border border-red-400/30 rounded-lg hover:bg-red-500/10"
          >
            <LogOut size={14} />
            Logout
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-lg glass"
            aria-label="Menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="px-4 pb-4 flex flex-col gap-1 border-t border-white/5">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`px-3 py-2 rounded-lg text-sm ${
                pathname === link.href ? "bg-orange/10 text-orange" : "text-white/70"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
