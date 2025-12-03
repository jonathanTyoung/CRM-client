// lib/auth.ts
import { cookies } from "next/headers";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const access = cookieStore.get("access")?.value;

  if (!access) return null;

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

  const res = await fetch(`${BASE_URL}/api/current_user/`, {
    headers: { Authorization: `Bearer ${access}` },
    cache: "no-store",
  });

  if (!res.ok) return null;

  return res.json();
}
