// app/api/contacts/route.ts
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const access = cookieStore.get("access")?.value;

  const res = await fetch(`${process.env.DJANGO_API_URL}/api/contacts`, {
    headers: {
      Authorization: `Bearer ${access}`,
    },
    cache: "no-store",
  });

  const data = await res.json();
  return Response.json(data, { status: res.status });
}
