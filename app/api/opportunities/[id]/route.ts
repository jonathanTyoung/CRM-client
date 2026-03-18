import { cookies } from "next/headers";

const BASE_URL = process.env.API_URL!;

// -----------------------
// GET /api/opportunities/:id
// -----------------------
export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access")?.value;
  console.log("OPPORTUNITY [id] TOKEN:", token ? "found" : "MISSING");

  if (!token) {
    return Response.json({ detail: "Unauthorized" }, { status: 401 });
  }

  // ✔ ALWAYS TRAILING SLASH
  const backendUrl = `${BASE_URL}/api/opportunities/${params.id}/`;

  const backendRes = await fetch(backendUrl, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const text = await backendRes.text();
  return new Response(text || null, {
    status: backendRes.status,
    headers: { "Content-Type": "application/json" },
  });
}

// -----------------------
// PATCH /api/opportunities/:id
// -----------------------
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access")?.value;

  if (!token) {
    return Response.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  // ✔ ALWAYS TRAILING SLASH
  const backendUrl = `${BASE_URL}/api/opportunities/${params.id}/`;

  const backendRes = await fetch(backendUrl, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await backendRes.text();
  return new Response(text || null, {
    status: backendRes.status,
    headers: { "Content-Type": "application/json" },
  });
}
