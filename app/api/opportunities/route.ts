import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

// ---------------------
// GET /api/opportunities
// ---------------------
export async function GET(request: Request) {
  const token = cookies().get("access")?.value;

  if (!token) {
    return Response.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const stage = searchParams.get("stage");
  const deal_type = searchParams.get("deal_type");
  const page = searchParams.get("page") || "1";

  const query = new URLSearchParams();
  query.append("page", page);
  if (stage) query.append("stage", stage);
  if (deal_type) query.append("deal_type", deal_type);

  // 💥 ALWAYS TRAILING SLASH BEFORE QUERY
  const backendUrl = `${BASE_URL}/api/opportunities/?${query.toString()}`;

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

// ---------------------
// POST /api/opportunities
// ---------------------
export async function POST(request: Request) {
  const token = cookies().get("access")?.value;

  if (!token) {
    return Response.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const backendUrl = `${BASE_URL}/api/opportunities/`; // ✔ trailing slash

  const backendRes = await fetch(backendUrl, {
    method: "POST",
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
