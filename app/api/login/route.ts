// app/api/login/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const DJANGO_URL = process.env.API_URL!;

    const res = await fetch(`${DJANGO_URL}/api/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    const { access, refresh, user } = data;

    const isProd = process.env.NODE_ENV === "production";

    const response = NextResponse.json({ user }, { status: 200 });

    response.cookies.set("access", access, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
    });

    response.cookies.set("refresh", refresh, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login route error:", error);
    return NextResponse.json(
      { detail: "Server error during login" },
      { status: 500 },
    );
  }
}
