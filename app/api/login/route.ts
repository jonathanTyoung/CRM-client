import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const body = await req.json();

  // Call your Django backend
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login/`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();
  if (!res.ok) {
    return NextResponse.json({ error: data.detail }, { status: 401 });
  }

  // Store tokens in httpOnly cookies for SSR
  const c = cookies();

  c.set("access", data.access, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });

  c.set("refresh", data.refresh, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });

  return NextResponse.json({ success: true });
}
