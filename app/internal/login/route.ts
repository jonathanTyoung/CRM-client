// app/internal/login/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const API_URL = process.env.NEXT_PUBLIC_API_URL!;

  const res = await fetch(`${API_URL}/api/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
  }

  const response = NextResponse.redirect(
    new URL("/dashboard", req.url)
  );

  response.cookies.set("access", data.access, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  response.cookies.set("refresh", data.refresh, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return response;
}
