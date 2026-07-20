"use client";

import Image from "next/image";
import { useSiteSettings } from "@/components/providers/SiteSettingsProvider";

type BrandLogoProps = {
  size?: number;
  className?: string;
  textClassName?: string;
};

export default function BrandLogo({
  size = 40,
  className = "",
  textClassName = "text-white font-bold",
}: BrandLogoProps) {
  const { logoUrl } = useSiteSettings();
  const dimension = `${size}px`;

  if (logoUrl) {
    return (
      <Image
        src={logoUrl}
        alt="Madni logo"
        width={size}
        height={size}
        className={`rounded-full object-cover bg-white/5 ${className}`}
        style={{ width: dimension, height: dimension }}
        unoptimized={logoUrl.includes("cloudinary") === false}
      />
    );
  }

  return (
    <div
      className={`bg-orange rounded-full flex items-center justify-center flex-shrink-0 ${className}`}
      style={{ width: dimension, height: dimension }}
    >
      <span className={textClassName} style={{ fontSize: Math.round(size * 0.45) }}>
        M
      </span>
    </div>
  );
}
