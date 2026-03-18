import { cookies } from "next/headers";

export async function getLeads(page = "1", search = "", status = "") {
  const token = cookies().get("access")?.value;
  if (!token) return null;

  const query = new URLSearchParams({ page, search });
  if (status) query.set("status", status);

  const res = await fetch(
    `${process.env.API_URL}/api/leads/?${query.toString()}`,
    { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }
  );

  if (!res.ok) return null;
  return res.json();
}
