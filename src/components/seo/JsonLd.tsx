import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";
import { getPublicSiteSettings, toWhatsAppDigits } from "@/lib/site-settings";

export default async function JsonLd() {
  const settings = await getPublicSiteSettings();
  const wa = toWhatsAppDigits(settings.whatsappNumber);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "http://localhost:3000",
    servesCuisine: ["Shawarma", "Burgers", "Pizza", "Fast Food"],
    priceRange: "$$",
    telephone: `+${wa}`,
    address: {
      "@type": "PostalAddress",
      addressCountry: "PK",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "12:00",
      closes: "02:00",
    },
    sameAs: [
      `https://facebook.com/${settings.facebookHandle}`,
      `https://instagram.com/${settings.instagramHandle}`,
    ],
    potentialAction: {
      "@type": "OrderAction",
      target: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/menu`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
