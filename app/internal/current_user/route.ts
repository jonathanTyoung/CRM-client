import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const access = cookieStore.get("access")?.value;

  if (!access) return Response.json(null);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

  const res = await fetch(`${BASE_URL}/api/current_user/`, {
    headers: { Authorization: `Bearer ${access}` },
    cache: "no-store",
  });

  return new Response(await res.text(), { status: res.status });
}
