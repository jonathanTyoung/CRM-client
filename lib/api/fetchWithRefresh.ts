import { cookies } from "next/headers";

const BASE_URL = process.env.API_URL!;

/**
 * Wraps fetch with automatic JWT refresh on 401.
 * Only call this from Next.js API route handlers — writing cookies
 * is not allowed in server component render passes.
 */
export async function fetchWithRefresh(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const cookieStore = cookies();
  const token = cookieStore.get("access")?.value;

  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers ?? {}),
      Authorization: `Bearer ${token ?? ""}`,
    },
    cache: "no-store",
  });

  if (res.status !== 401) return res;

  // Attempt silent refresh
  const refreshToken = cookieStore.get("refresh")?.value;
  if (!refreshToken) return res;

  const refreshRes = await fetch(`${BASE_URL}/api/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: refreshToken }),
    cache: "no-store",
  });

  if (!refreshRes.ok) return res;

  const { access: newAccess } = await refreshRes.json();

  cookieStore.set("access", newAccess, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  // Retry with new token
  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers ?? {}),
      Authorization: `Bearer ${newAccess}`,
    },
    cache: "no-store",
  });
}
