// app/internal/contacts/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { API_BASE } from "../../../lib/api";

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const access = cookieStore.get("access")?.value;

  if (!access) {
    return Response.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const search = url.search;

  const res = await fetch(`${API_BASE}/api/contacts${search}`, {
    headers: { Authorization: `Bearer ${access}` },
    cache: "no-store",
  });

  const data = await res.json();
  return Response.json(data, { status: res.status });
}
