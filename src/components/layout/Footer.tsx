"use client";

import Link from "next/link";
import NavLink from "@/components/ui/NavLink";
import { Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="relative bg-dark border-t border-white/5 overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-t from-orange/20 to-transparent" />
      </div>

      <div className="section-padding relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-orange rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="font-montserrat font-bold text-xl">Madni Shawarma Burgur & Pizza</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              Premium shawarma, burgers, pizza and more delivered to your door.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="font-montserrat font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {["Menu", "Deals", "About", "Contact"].map((link) => (
                <li key={link}>
                  <NavLink
                    href={`/${link.toLowerCase()}`}
                    className="text-white/50 hover:text-orange transition-colors text-sm"
                  >
                    {link}
                  </NavLink>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="font-montserrat font-bold text-lg mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-white/50 text-sm">
                <Phone size={14} className="text-orange" />
                0322-3572541 / 0307-6980041
              </li>
              <li className="flex items-center gap-2 text-white/50 text-sm">
                <MapPin size={14} className="text-orange" />
                Fast Delivery Available
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="font-montserrat font-bold text-lg mb-4">Follow Us</h4>
            <div className="flex gap-3">
              <a
                href="https://facebook.com/akmal.raza.9619"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full glass hover:bg-orange/20 transition-colors"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://instagram.com/akmal.raza.9619"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full glass hover:bg-orange/20 transition-colors"
              >
                <Instagram size={18} />
              </a>
            </div>
            <a
              href="https://wa.me/923223572541"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-600 rounded-full
                         text-sm font-semibold hover:bg-green-700 transition-colors"
            >
              Order on WhatsApp
            </a>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 text-center space-y-2">
          <p className="text-white/30 text-sm">
            &copy; {new Date().getFullYear()} Madni Fast Food. All rights reserved.
          </p>
          <p className="text-white/40 text-sm">
            Developed by <span className="text-orange/80 font-medium">Ahmad Ali Abraiz</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
