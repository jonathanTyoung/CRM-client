import { cookies } from "next/headers";
import { API_BASE } from "../../../lib/api";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // Hit Django
  const res = await fetch(`${API_BASE}/api/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    return Response.json(data, { status: res.status });
  }

  // Store JWT securely
  cookies().set("access", data.access, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  cookies().set("refresh", data.refresh, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return Response.json({ success: true }, { status: 200 });
}
