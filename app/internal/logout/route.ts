import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();

  console.log("🔵 LOGOUT ROUTE HIT");
  console.log("🔵 BEFORE DELETE:", cookieStore.getAll());

  // Wipe ACCESS cookie
  cookieStore.set("access", "", {
    path: "/", // MUST match original
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 0,          // <--- DELETE COOKIE
    expires: new Date(0)
  });

  // Wipe REFRESH cookie
  cookieStore.set("refresh", "", {
    path: "/", // MUST match original
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 0,
    expires: new Date(0)
  });

  console.log("🔵 AFTER DELETE:", cookieStore.getAll());

  return Response.json({ success: true });
}
