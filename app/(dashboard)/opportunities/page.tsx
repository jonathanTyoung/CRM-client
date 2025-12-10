import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; stage?: string; type?: string };
}) {
  const page = searchParams.page || "1";
  const search = searchParams.search || "";
  const stage = searchParams.stage || "";
  const type = searchParams.type || "";

  const query = new URLSearchParams();
  query.set("page", page);
  if (search) query.set("search", search);
  if (stage) query.set("stage", stage);
  if (type) query.set("deal_type", type);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/opportunities?${query.toString()}`,
    { cache: "no-store" }
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          Opportunities
        </h1>

        <Link
          href="/opportunities/new"
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium"
        >
          New Opportunity
        </Link>
      </div>

      {/* Filters + Search */}
      <div className="flex flex-wrap gap-4 items-end">
        {/* Search Input */}
        <form className="flex-1">
          <input
            type="text"
            name="search"
            placeholder="Search opportunities..."
            defaultValue={search}
            className="
              w-full rounded-lg px-3 py-2
              bg-neutral-100 dark:bg-neutral-800
              border border-neutral-300 dark:border-neutral-700
              text-neutral-900 dark:text-neutral-100
              placeholder-neutral-400 dark:placeholder-neutral-500
              focus:outline-none focus:ring-2 focus:ring-blue-500/50
            "
          />
        </form>

        {/* Stage Filter */}
        <form>
          <select
            name="stage"
            defaultValue={stage}
            className="
              rounded-lg px-3 py-2
              bg-neutral-100 dark:bg-neutral-800
              border border-neutral-300 dark:border-neutral-700
              text-neutral-900 dark:text-neutral-100
              focus:outline-none focus:ring-2 focus:ring-blue-500/50
            "
          >
            <option value="">All Stages</option>
            <option value="prospecting">Prospecting</option>
            <option value="showing">Showing</option>
            <option value="offer">Offer Made</option>
            <option value="contract">Under Contract</option>
            <option value="closing">Closing Scheduled</option>
            <option value="closed">Closed</option>
          </select>
        </form>

        {/* Deal Type Filter */}
        <form>
          <select
            name="type"
            defaultValue={type}
            className="
              rounded-lg px-3 py-2
              bg-neutral-100 dark:bg-neutral-800
              border border-neutral-300 dark:border-neutral-700
              text-neutral-900 dark:text-neutral-100
              focus:outline-none focus:ring-2 focus:ring-blue-500/50
            "
          >
            <option value="">All Types</option>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>
        </form>
      </div>

      {/* Table */}
      <div
        className="
          overflow-hidden border border-neutral-200 dark:border-neutral-800 rounded-xl
          bg-white dark:bg-neutral-900
        "
      >
        <table className="w-full text-sm">
          <thead className="bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-300 dark:border-neutral-700">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-neutral-700 dark:text-neutral-300">
                Title
              </th>
              <th className="text-left py-3 px-4 font-medium text-neutral-700 dark:text-neutral-300">
                Stage
              </th>
              <th className="text-left py-3 px-4 font-medium text-neutral-700 dark:text-neutral-300">
                Type
              </th>
              <th className="text-left py-3 px-4 font-medium text-neutral-700 dark:text-neutral-300">
                Price
              </th>
              <th className="text-left py-3 px-4 font-medium text-neutral-700 dark:text-neutral-300">
                Updated
              </th>
            </tr>
          </thead>

          <tbody>
            {opportunities.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-6 text-neutral-500 dark:text-neutral-400"
                >
                  No opportunities found.
                </td>
              </tr>
            ) : (
              opportunities.map((opp: any) => (
                <tr
                  key={opp.id}
                  className="
                    border-b border-neutral-200 dark:border-neutral-800
                    hover:bg-neutral-100 dark:hover:bg-neutral-800
                    transition cursor-pointer
                  "
                >
                  <td className="py-3 px-4">
                    <Link
                      href={`/opportunities/${opp.id}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {opp.title}
                    </Link>
                  </td>
                  <td className="py-3 px-4 capitalize">
                    {opp.stage.replace("_", " ")}
                  </td>
                  <td className="py-3 px-4 capitalize">{opp.deal_type}</td>
                  <td className="py-3 px-4">
                    {opp.price ? `$${Number(opp.price).toLocaleString()}` : "--"}
                  </td>
                  <td className="py-3 px-4">
                    {new Date(opp.updated_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-3 mt-6">
          {Array.from({ length: totalPages }, (_, i) => (
            <Link
              key={i}
              href={`/opportunities?page=${i + 1}`}
              className={`
                px-3 py-1 rounded 
                ${page == String(i + 1)
                  ? "bg-blue-600 text-white"
                  : "bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                }
              `}
            >
              {i + 1}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
