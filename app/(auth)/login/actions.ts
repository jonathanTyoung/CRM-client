"use server";

import { cookies } from "next/headers";

export async function loginAction(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

  const res = await fetch(`${BASE_URL}/api/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    return { error: "Invalid credentials" };
  }

  const data = await res.json();

  // Save tokens in HTTP-only cookies
  cookies().set("access", data.access, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
  });

  cookies().set("refresh", data.refresh, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
  });

  return { success: true };
}
