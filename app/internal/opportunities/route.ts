import { cookies } from "next/headers";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access")?.value;

  const url = new URL(req.url);
  const page = url.searchParams.get("page") ?? "1";

  const res = await fetch(`${BASE_URL}/api/opportunities?page=${page}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  return new Response(await res.text(), { status: res.status });
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access")?.value;
  const body = await req.json();

  const res = await fetch(`${BASE_URL}/api/opportunities`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  return new Response(await res.text(), { status: res.status });
}
