import { cookies } from "next/headers";

const BASE_URL = process.env.API_URL!;

export async function GET() {
  const token = cookies().get("access")?.value;

  if (!token) {
    return Response.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const res = await fetch(`${BASE_URL}/api/tags/`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const text = await res.text();
  return new Response(text || "[]", {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
