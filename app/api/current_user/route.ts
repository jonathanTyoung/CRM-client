export const runtime = "nodejs";

import { cookies } from "next/headers";

export async function GET() {
  const access = cookies().get("access")?.value;
  console.log("SERVER ACCESS:", access);

  // 🔹 No token -> not authenticated (but NOT a 401)
  if (!access) {
    return Response.json(
      { authenticated: false, user: null },
      { status: 200 }
    );
  }

  // 🔹 Hit Django
  const res = await fetch(`${process.env.DJANGO_API_URL}/api/current_user/`, {
    headers: {
      Authorization: `Bearer ${access}`,
    },
    cache: "no-store",
  });

  // 🔹 Token invalid → treat as unauthenticated
  if (!res.ok) {
    return Response.json(
      { authenticated: false, user: null },
      { status: 200 }
    );
  }

  const user = await res.json();

  // 🔹 Success
  return Response.json(
    { authenticated: true, user },
    { status: 200 }
  );
}
