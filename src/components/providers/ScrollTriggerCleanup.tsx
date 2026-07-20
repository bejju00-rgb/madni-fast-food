"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { killAllScrollTriggers } from "@/lib/gsap-cleanup";

export default function ScrollTriggerCleanup() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    killAllScrollTriggers();
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
