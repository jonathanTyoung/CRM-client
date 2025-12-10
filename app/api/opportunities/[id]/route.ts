import { cookies } from "next/headers";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const token = cookies().get("access")?.value;

  if (!token) {
    return Response.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/opportunities/${params.id}/`;

  const backendRes = await fetch(backendUrl, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const data = await backendRes.json();
  return Response.json(data, { status: backendRes.status });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const token = cookies().get("access")?.value;

  if (!token) {
    return Response.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/opportunities/${params.id}/`;

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
