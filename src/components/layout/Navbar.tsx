"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import NavLink from "@/components/ui/NavLink";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingCart, User, Sun, Moon, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/store/cart";
import { useThemeStore } from "@/store/theme";
import MagneticButton from "@/components/ui/MagneticButton";
import BrandLogo from "@/components/ui/BrandLogo";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/deals", label: "Deals" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const totalItems = useCartStore((s) => s.totalItems());
  const toggleCart = useCartStore((s) => s.toggleCart);
  const { isDark, toggleTheme } = useThemeStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass-dark py-3 shadow-lg shadow-black/20"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link href="/" data-cursor="pointer" className="flex items-center gap-2">
          <BrandLogo size={40} />
          <div className="hidden lg:block max-w-[220px]">
            <span className="font-montserrat font-bold text-sm leading-tight block">Madni Shawarma</span>
            <span className="font-montserrat text-orange font-bold text-sm leading-tight block">Burgur & Pizza</span>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              data-cursor="pointer"
              className={`relative font-medium transition-colors hover:text-orange ${
                pathname === link.href ? "text-orange" : "text-white/80"
              }`}
            >
              {link.label}
              {pathname === link.href && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-orange"
                />
              )}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            data-cursor="pointer"
            className="p-2 rounded-full glass hover:bg-white/10 transition-colors hidden sm:flex"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            onClick={toggleCart}
            data-cursor="pointer"
            className="relative p-2 rounded-full glass hover:bg-white/10 transition-colors"
          >
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-orange rounded-full text-xs
                           flex items-center justify-center font-bold"
              >
                {totalItems}
              </motion.span>
            )}
          </button>

          {session ? (
            <>
              <Link
                href={session.user.role === "ADMIN" ? "/admin" : "/dashboard"}
                data-cursor="pointer"
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full glass hover:bg-white/10 transition-colors text-sm"
              >
                <User size={16} />
                {session.user.name?.split(" ")[0]}
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                data-cursor="pointer"
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full glass
                           hover:bg-red-500/10 hover:text-red-400 transition-colors text-sm"
                title="Log out"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/auth/signin"
              data-cursor="pointer"
              className="p-2 rounded-full glass hover:bg-white/10 transition-colors hidden sm:flex"
            >
              <User size={20} />
            </Link>
          )}

          <MagneticButton
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-full glass"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </MagneticButton>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass-dark border-t border-white/5 overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  className={`text-lg font-medium py-2 ${
                    pathname === link.href ? "text-orange" : "text-white/80"
                  }`}
                >
                  {link.label}
                </NavLink>
              ))}
              {session ? (
                <>
                  <Link
                    href={session.user.role === "ADMIN" ? "/admin" : "/dashboard"}
                    className="text-lg font-medium py-2 text-white/80"
                  >
                    {session.user.role === "ADMIN" ? "Admin Panel" : "My Orders"}
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-lg font-medium py-2 text-red-400 text-left flex items-center gap-2"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/auth/signin" className="text-lg font-medium py-2 text-white/80">
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
