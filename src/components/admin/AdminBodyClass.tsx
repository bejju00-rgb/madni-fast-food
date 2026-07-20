"use client";

import { useEffect } from "react";

export default function AdminBodyClass() {
  useEffect(() => {
    document.body.classList.add("admin-panel");
    return () => document.body.classList.remove("admin-panel");
  }, []);
  return null;
}
