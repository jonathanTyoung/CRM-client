import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const form = await req.formData();
  const email = form.get("email");
  const password = form.get("password");

  const res = await fetch(`${process.env.API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Invalid login" }, { status: 401 });
  }

  const data = await res.json();

  const cookieStore = await cookies();
  cookieStore.set("access", data.access, { httpOnly: true, path: "/" });
  cookieStore.set("refresh", data.refresh, { httpOnly: true, path: "/" });

  return NextResponse.json({ success: true });
}
