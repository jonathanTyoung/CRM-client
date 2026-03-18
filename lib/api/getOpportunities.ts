import { cookies } from "next/headers";

export async function getOpportunities(page = "1", stage = "", deal_type = "") {
  const token = cookies().get("access")?.value;
  if (!token) return null;

  const query = new URLSearchParams({ page });
  if (stage) query.set("stage", stage);
  if (deal_type) query.set("deal_type", deal_type);

  const res = await fetch(
    `${process.env.API_URL}/api/opportunities/?${query.toString()}`,
    { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }
  );

  if (!res.ok) return null;
  return res.json();
}
