"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { killAllScrollTriggers } from "@/lib/gsap-cleanup";

type NavLinkProps = React.ComponentProps<typeof Link>;

export default function NavLink({ href, onClick, ...props }: NavLinkProps) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      onClick={(e) => {
        const target = typeof href === "string" ? href : href.pathname || "";
        if (target && target !== pathname) {
          killAllScrollTriggers();
        }
        onClick?.(e);
      }}
      {...props}
    />
  );
}
