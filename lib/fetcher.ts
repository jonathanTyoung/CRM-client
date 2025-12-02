// lib/fetcher.ts
import { cookies } from "next/headers";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const access = cookieStore.get("access")?.value;

  // If it's a relative URL, build an absolute one for SSR
  const BASE =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const absoluteUrl = path.startsWith("http")
    ? path
    : `${BASE}${path}`;

  return fetch(absoluteUrl, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: access ? `Bearer ${access}` : "",
    },
    cache: "no-store",
  });
}
