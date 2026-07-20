import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Special Deals",
  description: `Save big with combo deals on shawarma, burgers and pizza from ${SITE_NAME}. Student deals, family packs and more.`,
};

export default function DealsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
