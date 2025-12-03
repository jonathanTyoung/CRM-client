// app/internal/contacts/[id]/route.ts
import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const token = (await cookies()).get("access")?.value;

  console.log("🔵 INTERNAL GET:", id);

  if (!token) {
    return new Response(JSON.stringify({ detail: "Unauthorized" }), {
      status: 401,
    });
  }

  const res = await fetch(`${BASE_URL}/api/contacts/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  return new Response(await res.text(), {
    status: res.status,
  });
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const token = (await cookies()).get("access")?.value;

  if (!token) {
    return new Response(JSON.stringify({ detail: "Unauthorized" }), {
      status: 401,
    });
  }

  const body = await req.json();

  const res = await fetch(`${BASE_URL}/api/contacts/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  return new Response(await res.text(), { status: res.status });
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const token = (await cookies()).get("access")?.value;

  console.log("🔴 INTERNAL DELETE:", id);

  if (!token) {
    return new Response(JSON.stringify({ detail: "Unauthorized" }), {
      status: 401,
    });
  }

  // Forward DELETE to Django
  const res = await fetch(`${BASE_URL}/api/contacts/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  // Django returns 204 No Content
  if (res.status === 204) {
    return new Response(null, { status: 204 });
  }

  return new Response(await res.text(), { status: res.status });
}
