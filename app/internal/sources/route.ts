// app/api/sources/route.ts
import { cookies } from "next/headers";
import { API_BASE } from "../../../lib/api";

export async function GET() {
  const cookieStore = await cookies();
  const access = cookieStore.get("access")?.value;

  if (!access) {
    return Response.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const res = await fetch(`${API_BASE}/api/sources/`, {
    headers: { Authorization: `Bearer ${access}` },
    cache: "no-store",
  });

  const data = await res.json();
  return Response.json(data, { status: res.status });
}
