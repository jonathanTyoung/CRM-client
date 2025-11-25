import { cookies } from "next/headers";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const access = cookieStore.get("access")?.value;

  // No token → not logged in
  if (!access) return null;

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

  // Call Django current_user endpoint
  const res = await fetch(`${BASE_URL}/api/current_user/`, {
    headers: {
      Authorization: `Bearer ${access}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Failed to fetch current_user:", res.status);
    return null;
  }

  const user = await res.json();

  // Debug log (won't break SSR)
  console.log("Decoded user:", user);

  return user; // { id, email, first_name, last_name }
}
