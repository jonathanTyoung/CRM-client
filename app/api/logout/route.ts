// app/api/logout/route.ts
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();

  // --- Remove JWT ACCESS TOKEN ---
  cookieStore.set("access", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(0),
    path: "/",
  });

  // --- Remove JWT REFRESH TOKEN ---
  cookieStore.set("refresh", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(0),
    path: "/",
  });

  // --- Remove Django SESSIONID ---
  // (prevents ghost logins, session auth interference)
  cookieStore.set("sessionid", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(0),
    path: "/",
  });

  return Response.json({ success: true });
}
