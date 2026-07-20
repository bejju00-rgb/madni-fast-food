import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Kill all ScrollTriggers and revert any pinned/reparented DOM nodes before navigation. */
export function killAllScrollTriggers() {
  if (typeof window === "undefined") return;
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill(true));
  ScrollTrigger.clearScrollMemory?.();
}
