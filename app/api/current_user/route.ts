import { cookies } from "next/headers";

export async function GET() {
  const token = cookies().get("access")?.value;

  if (!token) {
    return Response.json(
      { authenticated: false, user: null },
      { status: 200 }
    );
  }

  // Use Django URL — NEVER NEXT_PUBLIC inside server routes
  const DJANGO_URL = process.env.DJANGO_API_URL!;

  const res = await fetch(`${DJANGO_URL}/api/current_user/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return Response.json(
      { authenticated: false, user: null },
      { status: res.status }
    );
  }

  const user = await res.json();

  return Response.json(
    { authenticated: true, user },
    { status: 200 }
  );
}
