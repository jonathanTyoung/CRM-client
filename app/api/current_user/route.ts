import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const access = cookieStore.get("access")?.value;

  if (!access) return NextResponse.json(null);

  // Proxy to Django
  const res = await fetch(`${process.env.API_URL}/current_user`, {
    headers: { Authorization: `Bearer ${access}` },
  });

  const data = await res.json();
  return NextResponse.json(data);
}
