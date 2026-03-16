import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import OpportunityForm from "../OpportunityForm";

export const dynamic = "force-dynamic";

export default async function OpportunityDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;
  const cookieStore = await cookies();
  const token = cookieStore.get("access")?.value;

  if (!token) return notFound();

  const res = await fetch(
    `${process.env.API_URL}/api/opportunities/${id}/`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    console.error("Failed to load opportunity:", await res.text());
    return notFound();
  }

  const opportunity = await res.json();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
        Edit Opportunity
      </h1>

      <OpportunityForm mode="edit" initialData={opportunity} />
    </div>
  );
}
