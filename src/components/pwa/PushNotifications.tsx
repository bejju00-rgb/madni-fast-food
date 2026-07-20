"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { subscribeToPush } from "@/lib/push-client";

const PROMPT_KEY = "madni-push-prompted";

export default function PushNotifications() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const tried = useRef(false);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return;
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) return;
    if (tried.current) return;

    const isRelevant =
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/orders") ||
      pathname.startsWith("/admin") ||
      pathname === "/checkout";

    if (!isRelevant) return;

    tried.current = true;

    const run = async () => {
      if (Notification.permission === "granted") {
        await subscribeToPush();
        return;
      }
      if (Notification.permission === "denied") return;
      if (localStorage.getItem(PROMPT_KEY)) return;

      localStorage.setItem(PROMPT_KEY, "1");
      const ok = await Notification.requestPermission();
      if (ok === "granted") await subscribeToPush();
    };

    void run();
  }, [status, session, pathname]);

  return null;
}
