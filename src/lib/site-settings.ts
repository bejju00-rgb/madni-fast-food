import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";

export type PublicSiteSettings = {
  deliveryCharge: number;
  whatsappNumber: string;
  jazzcashNumber: string;
  jazzcashName: string;
  easypaisaNumber: string;
  easypaisaName: string;
  facebookHandle: string;
  instagramHandle: string;
  logoUrl: string;
  heroOpenTime: string;
  heroCloseTime: string;
};

export const DEFAULT_SITE_SETTINGS: PublicSiteSettings = {
  deliveryCharge: 150,
  whatsappNumber: "923076980041",
  jazzcashNumber: "0322-3572541",
  jazzcashName: "Madni Fast Food",
  easypaisaNumber: "0307-6980041",
  easypaisaName: "Madni Fast Food",
  facebookHandle: "akmal.raza.9619",
  instagramHandle: "akmal.raza.9619",
  logoUrl: "",
  heroOpenTime: "6 PM",
  heroCloseTime: "2 AM",
};

function mapSettings(row: Record<string, unknown> | null): PublicSiteSettings {
  if (!row) return DEFAULT_SITE_SETTINGS;
  return {
    deliveryCharge: Number(row.deliveryCharge ?? DEFAULT_SITE_SETTINGS.deliveryCharge),
    whatsappNumber: String(row.whatsappNumber ?? DEFAULT_SITE_SETTINGS.whatsappNumber),
    jazzcashNumber: String(row.jazzcashNumber ?? DEFAULT_SITE_SETTINGS.jazzcashNumber),
    jazzcashName: String(row.jazzcashName ?? DEFAULT_SITE_SETTINGS.jazzcashName),
    easypaisaNumber: String(row.easypaisaNumber ?? DEFAULT_SITE_SETTINGS.easypaisaNumber),
    easypaisaName: String(row.easypaisaName ?? DEFAULT_SITE_SETTINGS.easypaisaName),
    facebookHandle: String(row.facebookHandle ?? DEFAULT_SITE_SETTINGS.facebookHandle).replace(
      /^@/,
      ""
    ),
    instagramHandle: String(row.instagramHandle ?? DEFAULT_SITE_SETTINGS.instagramHandle).replace(
      /^@/,
      ""
    ),
    logoUrl: row.logoUrl ? String(row.logoUrl) : "",
    heroOpenTime: String(row.heroOpenTime ?? DEFAULT_SITE_SETTINGS.heroOpenTime).trim(),
    heroCloseTime: String(row.heroCloseTime ?? DEFAULT_SITE_SETTINGS.heroCloseTime).trim(),
  };
}

async function fetchSettingsFromDb(): Promise<PublicSiteSettings> {
  try {
    const byId = await prisma.settings.findUnique({ where: { id: "default" } });
    if (byId) return mapSettings(byId as unknown as Record<string, unknown>);
    const first = await prisma.settings.findFirst();
    return mapSettings(first as unknown as Record<string, unknown> | null);
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function getPublicSiteSettings(): Promise<PublicSiteSettings> {
  return unstable_cache(fetchSettingsFromDb, ["public-site-settings-v1"], {
    revalidate: 60,
    tags: ["site-settings"],
  })();
}

export function formatHeroHours(openTime: string, closeTime: string): string {
  const open = openTime.trim() || DEFAULT_SITE_SETTINGS.heroOpenTime;
  const close = closeTime.trim() || DEFAULT_SITE_SETTINGS.heroCloseTime;
  return `Open from ${open} to ${close}`;
}

/** Normalize to wa.me digits (e.g. 03076980041 → 923076980041). */
export function toWhatsAppDigits(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("92")) return digits;
  if (digits.startsWith("0")) return `92${digits.slice(1)}`;
  if (digits.length === 10 && digits.startsWith("3")) return `92${digits}`;
  return digits;
}

export function formatPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("92") && digits.length >= 12) {
    const local = `0${digits.slice(2)}`;
    if (local.length === 11) {
      return `${local.slice(0, 4)}-${local.slice(4)}`;
    }
  }
  if (digits.startsWith("0") && digits.length === 11) {
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  }
  return phone;
}

export function whatsAppOrderUrl(phone: string, message?: string): string {
  const url = `https://wa.me/${toWhatsAppDigits(phone)}`;
  if (!message) return url;
  return `${url}?text=${encodeURIComponent(message)}`;
}

export function whatsAppCartMessage(
  items: { name: string; quantity: number; price: number }[]
): string {
  const lines = items.map(
    (i) => `• ${i.name} x${i.quantity} — Rs. ${(i.price * i.quantity).toLocaleString()}`
  );
  return `Assalam o Alaikum! I would like to order from Madni Shawarma:\n\n${lines.join("\n")}`;
}
