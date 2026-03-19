import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import OpportunityFilters from "./OpportunityFilters";
import OpportunityPipeline from "./OpportunityPipeline";

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

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: {
    page?: string;
    search?: string;
    stage?: string;
    type?: string;
    view?: string;
  };
}) {
  const page = searchParams.page || "1";
  const search = searchParams.search || "";
  const stage = searchParams.stage || "";
  const dealType = searchParams.type || "";
  const view = searchParams.view || "list";

  const cookieStore = await cookies();
  const token = cookieStore.get("access")?.value;
  if (!token) return notFound();

  const query = new URLSearchParams({ page });
  if (search) query.set("search", search);
  if (stage) query.set("stage", stage);
  if (dealType) query.set("deal_type", dealType);
  // Pipeline mode: fetch up to 200 without relying on pagination
  if (view === "pipeline") query.set("page_size", "200");

  const res = await fetch(
    `${process.env.API_URL}/api/opportunities/?${query.toString()}`,
    { cache: "no-store", headers: { Authorization: `Bearer ${token}` } }
  );

  if (!res.ok) {
    console.error(await res.text());
    return notFound();
  }

  const data = await res.json();
  const opportunities = data.results || [];
  const totalPages = Math.ceil(data.count / 20);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="page-title">Opportunities</h1>
        <Link href="/opportunities/new" className="btn-primary">
          + New Opportunity
        </Link>
      </div>

      {/* Filters + view toggle */}
      <OpportunityFilters search={search} stage={stage} dealType={dealType} view={view} />

      {/* Pipeline view */}
      {view === "pipeline" ? (
        <OpportunityPipeline opportunities={opportunities} />
      ) : (
        <>
          {/* List table */}
          <div className="table-container">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 dark:bg-zinc-800">
                <tr>
                  <th className="table-th">Title</th>
                  <th className="table-th">Stage</th>
                  <th className="table-th">Type</th>
                  <th className="table-th">Price</th>
                  <th className="table-th">Updated</th>
                  <th className="table-th text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {opportunities.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-zinc-500 dark:text-zinc-400">
                      No opportunities found.
                    </td>
                  </tr>
                ) : (
                  opportunities.map((opp: any) => (
                    <tr key={opp.id} className="table-tr">
                      <td className="table-td font-medium text-zinc-900 dark:text-zinc-100">
                        <Link href={`/opportunities/${opp.id}`} className="hover:underline">
                          {opp.title}
                        </Link>
                      </td>
                      <td className="table-td">
                        {STAGE_LABELS[opp.stage] ?? opp.stage}
                      </td>
                      <td className="table-td capitalize">{opp.deal_type}</td>
                      <td className="table-td">
                        {opp.price ? `$${Number(opp.price).toLocaleString()}` : "—"}
                      </td>
                      <td className="table-td">
                        {new Date(opp.updated_at).toLocaleDateString()}
                      </td>
                      <td className="table-td text-right space-x-3">
                        <Link
                          href={`/opportunities/${opp.id}`}
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          View
                        </Link>
                        <Link
                          href={`/opportunities/${opp.id}/edit`}
                          className="text-zinc-700 dark:text-zinc-300 hover:underline"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => {
                const params = new URLSearchParams({ page: String(i + 1) });
                if (search) params.set("search", search);
                if (stage) params.set("stage", stage);
                if (dealType) params.set("type", dealType);
                return (
                  <Link
                    key={i}
                    href={`/opportunities?${params.toString()}`}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      page === String(i + 1)
                        ? "bg-blue-600 text-white"
                        : "bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600"
                    }`}
                  >
                    {i + 1}
                  </Link>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
