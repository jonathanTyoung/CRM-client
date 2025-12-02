// app/internal/contacts/route.ts
import { cookies } from "next/headers";
import { API_BASE } from "../../../lib/api";

export async function GET(req: Request) {
  console.log("🔵 INTERNAL ROUTE HIT: /internal/contacts");

  const cookieStore = await cookies();
  const access = cookieStore.get("access")?.value;
  console.log("🔵 INTERNAL ACCESS COOKIE:", access ? "PRESENT" : "MISSING");
  console.log("🔵 RAW COOKIE VALUE:", access);

  if (!access) {
    return Response.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const search = url.search; // keep pagination/filtering

  console.log("🟣 FETCHING DJANGO:", `${API_BASE}/api/contacts${search}`);
  console.log("🟣 SENDING AUTH HEADER:", access?.slice(0, 20) + "...");

  const res = await fetch(`${API_BASE}/api/contacts${search}`, {
    headers: { Authorization: `Bearer ${access}` },
    cache: "no-store",
  });

  const data = await res.json();
  return Response.json(data, { status: res.status });
  console.log("🟢 DJANGO RESPONSE STATUS:", res.status);
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const access = cookieStore.get("access")?.value;

  if (!access) {
    return Response.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const res = await fetch(`${API_BASE}/api/contacts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return Response.json(data, { status: res.status });
}
