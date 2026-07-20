function normalizeSiteUrl(raw: string | undefined): string | null {
  if (!raw?.trim()) return null;
  const trimmed = raw.trim().replace(/\/$/, "");
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const parsed = new URL(withProtocol);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    return parsed.origin;
  } catch {
    return null;
  }
}

/** Canonical site URL for SEO, metadata, and sitemap. Safe during Vercel builds. */
export function getSiteUrl(): string {
  const fromEnv =
    normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL) ||
    normalizeSiteUrl(process.env.NEXTAUTH_URL);

  if (fromEnv) return fromEnv;

  const vercel = normalizeSiteUrl(
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined
  );
  if (vercel) return vercel;

  return "http://localhost:3000";
}

export const SITE_URL = getSiteUrl();

export const SITE_NAME = "Madni Shawarma Burgur & Pizza";
export const SITE_SHORT_NAME = "Madni Shawarma";
export const SITE_DESCRIPTION =
  "Order premium shawarma, burgers, pizza and special deals from Madni Shawarma Burgur & Pizza. Fast delivery, JazzCash, Easypaisa and cash on delivery.";
export const SITE_KEYWORDS = [
  "Madni Shawarma Burgur Pizza",
  "shawarma delivery",
  "burger delivery",
  "pizza delivery",
  "fast food Pakistan",
  "Madni shawarma",
  "zinger burger",
  "food delivery",
  "online food order",
];
