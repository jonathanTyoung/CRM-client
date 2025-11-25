import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Add pathname for SSR components
  res.headers.set("x-pathname", req.nextUrl.pathname);

  return res;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/contacts/:path*",
    "/leads/:path*",
    "/opportunities/:path*",
    "/",
  ],
};
