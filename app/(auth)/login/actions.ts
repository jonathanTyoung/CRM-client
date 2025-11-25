"use server";

import { cookies } from "next/headers";

export async function loginAction(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const res = await fetch(`${API_URL}/api/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    return { error: "Invalid email or password" };
  }

  const data = await res.json();

  const cookieStore = await cookies();

  cookieStore.set("access", data.access, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
  });

  cookieStore.set("refresh", data.refresh, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
  });

  return { success: true };
}
