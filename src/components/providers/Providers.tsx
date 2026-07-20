"use client";

import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import SmoothScroll from "@/components/providers/SmoothScroll";
import CustomCursor from "@/components/ui/CustomCursor";
import ScrollProgress from "@/components/ui/ScrollProgress";
import ScrollTriggerCleanup from "@/components/providers/ScrollTriggerCleanup";
import FloatingCart from "@/components/cart/FloatingCart";
import { SiteSettingsProvider } from "@/components/providers/SiteSettingsProvider";
import InstallAppButton from "@/components/pwa/InstallAppButton";
import PushNotifications from "@/components/pwa/PushNotifications";
import type { PublicSiteSettings } from "@/lib/site-settings";

function useLightweightMode() {
  const pathname = usePathname();
  return pathname !== "/";
}

function AppToaster() {
  return (
    <Toaster
      position="top-right"
      gutter={8}
      toastOptions={{
        duration: 2000,
        style: {
          background: "#1a1a1a",
          color: "#fff",
          border: "1px solid rgba(255,107,0,0.3)",
        },
        success: { iconTheme: { primary: "#FF6B00", secondary: "#fff" } },
      }}
    />
  );
}

function useShowCustomCursor() {
  const pathname = usePathname();
  return !pathname.startsWith("/admin");
}

export default function Providers({
  children,
  siteSettings,
}: {
  children: React.ReactNode;
  siteSettings: PublicSiteSettings;
}) {
  const lightweight = useLightweightMode();
  const showCursor = useShowCustomCursor();

  return (
    <SessionProvider>
      <SiteSettingsProvider settings={siteSettings}>
        {showCursor && <CustomCursor />}
        {lightweight ? (
          <>
            {children}
            <FloatingCart />
            <InstallAppButton />
            <PushNotifications />
            <AppToaster />
          </>
        ) : (
          <SmoothScroll>
            <ScrollTriggerCleanup />
            <ScrollProgress />
            {children}
            <FloatingCart />
            <InstallAppButton />
            <PushNotifications />
            <AppToaster />
          </SmoothScroll>
        )}
      </SiteSettingsProvider>
    </SessionProvider>
  );
}
