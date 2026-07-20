"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!barRef.current) return;

    gsap.set(barRef.current, { scaleX: 0 });

    const tween = gsap.to(barRef.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [pathname]);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[100] bg-white/5 pointer-events-none">
      <div
        ref={barRef}
        className="h-full bg-gradient-to-r from-orange via-yellow to-orange origin-left"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
