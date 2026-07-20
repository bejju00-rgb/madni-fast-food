"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { usePathname } from "next/navigation";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallAppButton() {
  const pathname = usePathname();
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone;

    if (!isStandalone && !localStorage.getItem("pwa-install-dismissed")) {
      setVisible(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [pathname]);

  if (pathname.startsWith("/admin") || dismissed) return null;

  const handleInstall = async () => {
    if (deferred) {
      await deferred.prompt();
      await deferred.userChoice;
      setDeferred(null);
      setVisible(false);
      return;
    }
    alert(
      "To install the app:\n\n• Android Chrome: Menu (⋮) → Install app / Add to Home screen\n• iPhone Safari: Share → Add to Home Screen\n• Desktop Chrome: Install icon in the address bar"
    );
  };

  const handleDismiss = () => {
    setDismissed(true);
    setVisible(false);
    localStorage.setItem("pwa-install-dismissed", "1");
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 right-4 z-[45] flex flex-col items-end gap-2 sm:bottom-6">
      <button
        type="button"
        onClick={handleDismiss}
        className="p-1 rounded-full bg-dark/80 border border-white/10 text-white/50 hover:text-white"
        aria-label="Dismiss install hint"
      >
        <X size={14} />
      </button>
      <button
        type="button"
        onClick={handleInstall}
        className="flex items-center gap-2 px-4 py-3 rounded-full bg-orange text-white font-semibold text-sm
                   shadow-lg shadow-orange/30 hover:bg-orange-dark transition-colors"
      >
        <Download size={18} />
        Download App
      </button>
    </div>
  );
}
