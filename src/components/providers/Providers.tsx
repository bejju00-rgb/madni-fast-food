"use client";

import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import SmoothScroll from "@/components/providers/SmoothScroll";
import CustomCursor from "@/components/ui/CustomCursor";
import ScrollProgress from "@/components/ui/ScrollProgress";
import ScrollTriggerCleanup from "@/components/providers/ScrollTriggerCleanup";
import FloatingCart from "@/components/cart/FloatingCart";

function useLightweightMode() {
  const pathname = usePathname();
  // GSAP + Lenis only on homepage — prevents DOM conflicts on other routes
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

export default function Providers({ children }: { children: React.ReactNode }) {
  const lightweight = useLightweightMode();
  const showCursor = useShowCustomCursor();

  return (
    <SessionProvider>
      {showCursor && <CustomCursor />}
      {lightweight ? (
        <>
          {children}
          <FloatingCart />
          <AppToaster />
        </>
      ) : (
        <SmoothScroll>
          <ScrollTriggerCleanup />
          <ScrollProgress />
          {children}
          <FloatingCart />
          <AppToaster />
        </SmoothScroll>
      )}
    </SessionProvider>
  );
}
