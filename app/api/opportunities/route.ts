import { cookies } from "next/headers";
import { fetchWithRefresh } from "../../../lib/api/fetchWithRefresh";

const BASE_URL = process.env.API_URL!;

// ------------------------------------------------------------
// GET /api/opportunities
// ------------------------------------------------------------
export async function GET(request: Request) {
  if (!cookies().get("access")?.value) {
    return Response.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "1";
  const stage = searchParams.get("stage");
  const deal_type = searchParams.get("deal_type");

  const query = new URLSearchParams();
  query.append("page", page);
  if (stage) query.append("stage", stage);
  if (deal_type) query.append("deal_type", deal_type);

  const backendRes = await fetchWithRefresh(
    `${BASE_URL}/api/opportunities/?${query.toString()}`
  );

  const text = await backendRes.text();
  return new Response(text || null, {
    status: backendRes.status,
    headers: { "Content-Type": "application/json" },
  });
}

// ------------------------------------------------------------
// POST /api/opportunities
// ------------------------------------------------------------
export async function POST(request: Request) {
  if (!cookies().get("access")?.value) {
    return Response.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const backendRes = await fetchWithRefresh(`${BASE_URL}/api/opportunities/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await backendRes.text();
  return new Response(text || null, {
    status: backendRes.status,
    headers: { "Content-Type": "application/json" },
  });
}
