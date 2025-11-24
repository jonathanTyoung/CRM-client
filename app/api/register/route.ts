import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const form = await req.formData();

  const body = {
    first_name: form.get("first_name"),
    last_name: form.get("last_name"),
    email: form.get("email"),
    password: form.get("password"),
  };

  const res = await fetch(`${process.env.API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Registration failed" }, { status: 400 });
  }

  const data = await res.json();

  const cookieStore = await cookies();
  cookieStore.set("access", data.access, { httpOnly: true, path: "/" });
  cookieStore.set("refresh", data.refresh, { httpOnly: true, path: "/" });

  return NextResponse.json({ success: true });
}
