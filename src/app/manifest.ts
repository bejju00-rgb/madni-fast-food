import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";
import { getPublicSiteSettings } from "@/lib/site-settings";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getPublicSiteSettings();

  const icons: MetadataRoute.Manifest["icons"] = settings.logoUrl
    ? [
        {
          src: settings.logoUrl,
          sizes: "512x512",
          type: "image/png",
          purpose: "any",
        },
        {
          src: settings.logoUrl,
          sizes: "192x192",
          type: "image/png",
          purpose: "maskable",
        },
      ]
    : [
        {
          src: "/favicon.svg",
          sizes: "any",
          type: "image/svg+xml",
          purpose: "any",
        },
      ];

  return {
    name: SITE_NAME,
    short_name: "Madni Shawarma",
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#0A0A0A",
    theme_color: "#FF6B00",
    icons,
  };
}
