import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const STAGE_LABELS: Record<string, string> = {
  prospecting: "Prospecting",
  showing: "Showing",
  offer_made: "Offer Made",
  under_contract: "Under Contract",
  appointment_set: "Appointment Set",
  appointment_held: "Appointment Held",
  agreement_signed: "Agreement Signed",
  listed: "Listed",
  closed: "Closed",
};

export default async function OpportunityDetailPage({
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

  const opp = await res.json();
  const participants = opp.participants ?? [];

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">{opp.title}</h1>
          <p className="page-subtitle mt-1 capitalize">
            {opp.deal_type} deal · {STAGE_LABELS[opp.stage] ?? opp.stage}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/opportunities/${id}/edit`} className="btn-secondary">Edit</Link>
          <Link href="/opportunities" className="btn-secondary">Back</Link>
        </div>
      </div>

      {/* Deal Info */}
      <div className="dashboard-card">
        <h2 className="dashboard-section-title mb-4">Deal Info</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-zinc-500 dark:text-zinc-400">Stage</p>
            <p className="font-medium mt-0.5">{STAGE_LABELS[opp.stage] ?? opp.stage}</p>
          </div>
          <div>
            <p className="text-zinc-500 dark:text-zinc-400">Deal Type</p>
            <p className="font-medium mt-0.5 capitalize">{opp.deal_type}</p>
          </div>
          <div>
            <p className="text-zinc-500 dark:text-zinc-400">Property Address</p>
            <p className="font-medium mt-0.5">{opp.property_address || "—"}</p>
          </div>
          <div>
            <p className="text-zinc-500 dark:text-zinc-400">MLS ID</p>
            <p className="font-medium mt-0.5">{opp.mls_id || "—"}</p>
          </div>
          <div>
            <p className="text-zinc-500 dark:text-zinc-400">Price</p>
            <p className="font-medium mt-0.5">
              {opp.price ? `$${Number(opp.price).toLocaleString()}` : "—"}
            </p>
          </div>
          <div>
            <p className="text-zinc-500 dark:text-zinc-400">Est. Close Date</p>
            <p className="font-medium mt-0.5">
              {opp.estimated_close_date
                ? new Date(opp.estimated_close_date).toLocaleDateString()
                : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Notes */}
      {opp.notes && (
        <div className="dashboard-card">
          <h2 className="dashboard-section-title mb-3">Notes</h2>
          <p className="text-sm whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
            {opp.notes}
          </p>
        </div>
      )}

      {/* Participants */}
      <div className="dashboard-card">
        <h2 className="dashboard-section-title mb-4">Participants</h2>
        {participants.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">No participants added.</p>
        ) : (
          <div className="space-y-2">
            {participants.map((p: any) => {
              const c = p.contact;
              const name = `${c.first_name ?? ""} ${c.last_name ?? ""}`.trim() || c.email || `Contact #${c.id}`;
              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2 text-sm"
                >
                  <div>
                    <Link
                      href={`/contacts/${c.id}`}
                      className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {name}
                    </Link>
                    {c.email && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{c.email}</p>
                    )}
                  </div>
                  {p.role && <span className="badge-zinc">{p.role}</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
