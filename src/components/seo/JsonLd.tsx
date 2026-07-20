import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/site";

export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    servesCuisine: ["Shawarma", "Burgers", "Pizza", "Fast Food"],
    priceRange: "$$",
    telephone: "+923223572541",
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
      "https://facebook.com/akmal.raza.9619",
      "https://instagram.com/akmal.raza.9619",
    ],
    potentialAction: {
      "@type": "OrderAction",
      target: `${SITE_URL}/menu`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
