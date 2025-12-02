// app/internal/agent-profiles/route.ts
import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function GET() {
  const token = (await cookies()).get("access")?.value;

  const res = await fetch(`${BASE_URL}/api/agent-profiles`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  return new Response(await res.text(), { status: res.status });
}
