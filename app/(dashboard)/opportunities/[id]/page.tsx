import { notFound } from "next/navigation";
import OpportunityForm from "../OpportunityForm";

export const dynamic = "force-dynamic";

export default async function OpportunityDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/opportunities/${id}`,
    {
      cache: "no-store",
    }
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
