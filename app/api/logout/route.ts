// app/api/logout/route.ts

import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });

  // Remove cookies by setting them expired
  res.cookies.set("access", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
    path: "/",
  });

  res.cookies.set("refresh", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
    path: "/",
  });

  return res;
}
