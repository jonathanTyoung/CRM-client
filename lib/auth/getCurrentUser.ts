import { cookies } from "next/headers";

export async function getCurrentUser() {
  const token = cookies().get("access")?.value;
  if (!token) return null;

  // Call your Next.js proxy route, NOT Django directly
  const res = await fetch("http://localhost:3000/api/current_user", {
    method: "GET",
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,  // ← forward cookie manually
    },
  });

  if (!res.ok) return null;

  const data = await res.json();

  // Your /api/current_user returns:
  // { authenticated: true, user: {...} }
  if (!data.authenticated) return null;

  return data.user;
}
