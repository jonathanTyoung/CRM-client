// app/internal/login/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // 1. Read form data (NOT JSON)
  const form = await req.formData();
  const email = form.get("email");
  const password = form.get("password");

  const API_URL = process.env.NEXT_PUBLIC_API_URL!;
  
  // 2. Send JSON to Django
  const res = await fetch(`${API_URL}/api/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  const data = await res.json();

  // 3. If invalid, stay on login page
  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
  }

  // 4. SUCCESS → set cookies + redirect
  const response = NextResponse.redirect(new URL("/dashboard", req.url));

  response.cookies.set("access", data.access, {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // true in production
    path: "/",
  });

  response.cookies.set("refresh", data.refresh, {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // true in production
    path: "/",
  });

  return response;
}
