import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

  const res = await fetch(`${BASE_URL}/api/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
