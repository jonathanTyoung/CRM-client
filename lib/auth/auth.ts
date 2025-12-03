// lib/auth/auth.ts
import { cookies } from "next/headers";

export const auth = {
  getAccessToken() {
    return cookies().get("access")?.value || null;
  },

  async getUser() {
    const token = this.getAccessToken();
    if (!token) return null;

    const BASE_URL =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const res = await fetch(`${BASE_URL}/api/current_user`, {
      method: "GET",
      cache: "no-store",
      credentials: "include",
    });

    if (!res.ok) return null;

    return res.json(); // Django already returns the user object
  },
};
