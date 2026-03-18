import { cookies } from "next/headers";
import { fetchWithRefresh } from "../../../lib/api/fetchWithRefresh";

export async function GET(request: Request) {
  if (!cookies().get("access")?.value) {
    return Response.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "";
  const search = searchParams.get("search") || "";

  const query = new URLSearchParams();
  if (page) query.append("page", page);
  if (search) query.append("search", search);

  const backendRes = await fetchWithRefresh(
    `${process.env.API_URL}/api/contacts/?${query.toString()}`
  );

  const data = await backendRes.json();
  return Response.json(data, { status: backendRes.status });
}

export async function POST(request: Request) {
  if (!cookies().get("access")?.value) {
    return Response.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const backendRes = await fetchWithRefresh(
    `${process.env.API_URL}/api/contacts/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  const text = await backendRes.text();
  return new Response(text || null, {
    status: backendRes.status,
    headers: { "Content-Type": "application/json" },
  });
}
