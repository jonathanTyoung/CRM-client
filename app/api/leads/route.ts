import { cookies } from "next/headers";
import { fetchWithRefresh } from "../../../lib/api/fetchWithRefresh";

const BASE_URL = process.env.API_URL!;

export async function GET(request: Request) {
  const token = cookies().get("access")?.value;

  if (!token) {
    return Response.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "1";
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";

  const query = new URLSearchParams({ page });
  if (search) query.append("search", search);
  if (status) query.append("status", status);

  const backendRes = await fetchWithRefresh(`${BASE_URL}/api/leads/?${query.toString()}`);

  const text = await backendRes.text();
  return new Response(text || null, {
    status: backendRes.status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: Request) {
  const token = cookies().get("access")?.value;

  if (!token) {
    return Response.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const backendRes = await fetchWithRefresh(`${BASE_URL}/api/leads/`, {
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
