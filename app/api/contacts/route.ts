import { cookies } from "next/headers";

export async function GET(request: Request) {
  const token = cookies().get("access")?.value;

  if (!token) {
    return Response.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "";
  const search = searchParams.get("search") || "";

  const query = new URLSearchParams();
  if (page) query.append("page", page);
  if (search) query.append("search", search);

  const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/contacts?${query.toString()}`;

  const backendRes = await fetch(backendUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const data = await backendRes.json();
  return Response.json(data, { status: backendRes.status });
}
