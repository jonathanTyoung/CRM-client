import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import OpportunityForm from "../../OpportunityForm";

export const dynamic = "force-dynamic";

export default async function EditOpportunityPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const token = (await cookies()).get("access")?.value;
  if (!token) return notFound();

  const res = await fetch(`${process.env.API_URL}/api/opportunities/${id}/`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) return notFound();

  const opportunity = await res.json();

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="page-title">Edit Opportunity</h1>
        <Link href={`/opportunities/${id}`} className="btn-secondary">Cancel</Link>
      </div>
      <OpportunityForm mode="edit" initialData={opportunity} />
    </div>
  );
}
