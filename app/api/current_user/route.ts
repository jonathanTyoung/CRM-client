import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const access = cookies().get("access")?.value;

  if (!access) return NextResponse.json({ user: null });

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/current_user/`, {
    headers: { Authorization: `Bearer ${access}` },
  });

  if (!res.ok) return NextResponse.json({ user: null });

  return NextResponse.json(await res.json());
}
