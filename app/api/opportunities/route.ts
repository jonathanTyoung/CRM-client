import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

// ------------------------------------------------------------
// GET /api/opportunities
// ------------------------------------------------------------
export async function GET(request: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get("access")?.value;

  if (!token) {
    return Response.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "1";
  const stage = searchParams.get("stage");
  const deal_type = searchParams.get("deal_type");

  const query = new URLSearchParams();
  query.append("page", page);
  if (stage) query.append("stage", stage);
  if (deal_type) query.append("deal_type", deal_type);

  const backendUrl = `${BASE_URL}/api/opportunities/?${query.toString()}`;

  const backendRes = await fetch(backendUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const text = await backendRes.text();

  return new Response(text || null, {
    status: backendRes.status,
    headers: { "Content-Type": "application/json" },
  });
}

// ------------------------------------------------------------
// POST /api/opportunities  (CREATE OPPORTUNITY)
// ------------------------------------------------------------
export async function POST(request: Request) {
  console.log("POST /api/opportunities HIT"); // 💥 MUST PRINT

  const token = cookies().get("access")?.value;

  if (!token) {
    console.log("NO TOKEN FOR OPPORTUNITIES");
    return new Response(JSON.stringify({ detail: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const body = await request.json();
  console.log("REQUEST BODY:", body); // 💥 PRINT BODY

  const backendUrl = `${BASE_URL}/api/opportunities/`;

  const backendRes = await fetch(backendUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await backendRes.text();

  console.log("DJANGO STATUS:", backendRes.status); // 💥 PRINT STATUS
  console.log("DJANGO ERROR PAYLOAD:", text); // 💥 PRINT ERROR
  console.log("REQUEST BODY:", body);

  return new Response(text || null, {
    status: backendRes.status,
    headers: { "Content-Type": "application/json" },
  });
}
