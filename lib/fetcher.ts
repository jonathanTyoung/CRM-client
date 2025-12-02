// lib/fetcher.ts
import { cookies } from "next/headers";

export async function apiFetch(path: string, options: RequestInit = {}) {
  // Build absolute URL for SSR
  const BASE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const absoluteUrl = path.startsWith("http")
    ? path
    : `${BASE}${path}`;

  return fetch(absoluteUrl, {
    ...options,
    credentials: "include",       // 🔥 SEND COOKIES ALWAYS
    cache: "no-store",
  });
}
