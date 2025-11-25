import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });

  // Clear cookies correctly (Next.js 15+)
  res.cookies.set("access", "", {
    expires: new Date(0),
    path: "/",
  });

  res.cookies.set("refresh", "", {
    expires: new Date(0),
    path: "/",
  });

  return res;
}
