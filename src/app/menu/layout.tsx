import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Menu",
  description: `Browse our full menu of shawarma, burgers, pizza, fries and more at ${SITE_NAME}. Order online for fast delivery.`,
};

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return children;
}
