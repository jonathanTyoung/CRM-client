import { cookies } from "next/headers";
import { API_BASE } from "../../../lib/api";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const res = await fetch(`${API_BASE}/api/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    return Response.json(data, { status: res.status });
  }

  const cookieStore = await cookies();
  cookieStore.set("access", data.access, { httpOnly: true, path: "/" });
  cookieStore.set("refresh", data.refresh, { httpOnly: true, path: "/" });

  return Response.json(data, { status: 200 });
}
