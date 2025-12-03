// lib/auth/auth.ts
import { cookies } from "next/headers";

export async function auth() {
  // 1. Read JWT from incoming request's cookies
  const token = cookies().get("access")?.value;
  if (!token) return null;

  // 2. Call Django directly (server-to-server, no CORS issues)
  const DJANGO_URL = process.env.DJANGO_API_URL!;
  const res = await fetch(`${DJANGO_URL}/api/current_user/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  // 3. Django returns the user object directly:
  // { id, email, first_name, last_name }
  const user = await res.json();
  return user;
}
