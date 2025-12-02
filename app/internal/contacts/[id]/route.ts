import { cookies } from "next/headers";
import { API_BASE } from "../../../../lib/api";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;    // MUST await in Next.js 15
  const cookieStore = await cookies();    // MUST await in Next.js 15
  const access = cookieStore.get("access")?.value;

  console.log("🔵 INTERNAL GET HIT:", req.url);
  console.log("🔵 RAW ACCESS COOKIE:", access);

  if (!access) {
    console.log("🔴 NO TOKEN → 401");
    return Response.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const res = await fetch(`${API_BASE}/api/contacts/${id}`, {
    headers: {
      Authorization: `Bearer ${access}`,
    },
    cache: "no-store",
  });

  const data = await res.json();
  return Response.json(data, { status: res.status });
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const cookieStore = await cookies();
  const access = cookieStore.get("access")?.value;

  console.log("🟡 INTERNAL PATCH HIT:", req.url);
  console.log("🟡 ACCESS TOKEN:", access);

  if (!access) {
    return Response.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const res = await fetch(`${API_BASE}/api/contacts/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${access}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = await res.text();
  return new Response(data, { status: res.status });
}
