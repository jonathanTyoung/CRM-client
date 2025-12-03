import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

// DELETE /api/contacts/:id  → proxy to Django
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access")?.value;

  if (!token) {
    return new Response(
      JSON.stringify({ detail: "Not authenticated" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const res = await fetch(`${BASE_URL}/api/contacts/${params.id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  // Pass through Django's response body + status
  const text = await res.text();
  return new Response(text || null, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
