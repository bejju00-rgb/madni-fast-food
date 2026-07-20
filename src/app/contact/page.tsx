"use client";

import { motion } from "framer-motion";
import { Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import { useSiteSettings } from "@/components/providers/SiteSettingsProvider";
import {
  formatPhoneDisplay,
  whatsAppOrderUrl,
} from "@/lib/site-settings";

export default function ContactPage() {
  const settings = useSiteSettings();
  const whatsappHref = whatsAppOrderUrl(settings.whatsappNumber);

  return (
    <div className="min-h-screen pt-24 section-padding">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-orange font-semibold text-sm uppercase tracking-widest">
            Get In Touch
          </span>
          <h1 className="text-4xl sm:text-5xl font-montserrat font-black mt-2">
            Contact <span className="gradient-text">Us</span>
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-2xl p-8"
          >
            <h2 className="font-montserrat font-bold text-xl mb-6">Contact Information</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange/10 rounded-full">
                  <Phone size={20} className="text-orange" />
                </div>
                <div>
                  <p className="text-white/50 text-sm">JazzCash</p>
                  <p className="font-semibold">{formatPhoneDisplay(settings.jazzcashNumber)}</p>
                  <p className="text-white/50 text-sm mt-2">Easypaisa</p>
                  <p className="font-semibold">{formatPhoneDisplay(settings.easypaisaNumber)}</p>
                  <p className="text-white/50 text-sm mt-2">WhatsApp</p>
                  <p className="font-semibold">{formatPhoneDisplay(settings.whatsappNumber)}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange/10 rounded-full">
                  <Clock size={20} className="text-orange" />
                </div>
                <div>
                  <p className="text-white/50 text-sm">Hours</p>
                  <p className="font-semibold">Open Daily: 12 PM - 2 AM</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange/10 rounded-full">
                  <MapPin size={20} className="text-orange" />
                </div>
                <div>
                  <p className="text-white/50 text-sm">Delivery</p>
                  <p className="font-semibold">Fast Delivery Available</p>
                </div>
              </div>
            </div>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 flex items-center justify-center gap-2 w-full py-3 bg-green-600 rounded-full
                         font-semibold hover:bg-green-700 transition-colors"
            >
              <MessageCircle size={18} />
              Order on WhatsApp
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-2xl p-8"
          >
            <h2 className="font-montserrat font-bold text-xl mb-6">Send a Message</h2>
            <form className="space-y-4">
              <input
                placeholder="Your Name"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl
                           focus:outline-none focus:border-orange/50 transition-colors"
              />
              <input
                placeholder="Phone Number"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl
                           focus:outline-none focus:border-orange/50 transition-colors"
              />
              <textarea
                placeholder="Your Message"
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl
                           focus:outline-none focus:border-orange/50 transition-colors resize-none"
              />
              <MagneticButton type="button" className="w-full btn-primary py-3">
                Send Message
              </MagneticButton>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
