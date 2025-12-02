// app/api/logout/route.ts
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();

  cookieStore.set("access", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  cookieStore.set("refresh", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return Response.json({ success: true });
}
