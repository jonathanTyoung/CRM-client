import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: {
    page?: string;
    search?: string;
    stage?: string;
    type?: string;
  };
}) {
  // Params
  const page = searchParams.page || "1";
  const search = searchParams.search || "";
  const stage = searchParams.stage || "";
  const type = searchParams.type || "";

  // Query
  const query = new URLSearchParams();
  query.set("page", page);
  if (search) query.set("search", search);
  if (stage) query.set("stage", stage);
  if (type) query.set("deal_type", type);

  // Build absolute URL SAFELY
  const hdrs = headers();
  const host = hdrs.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const cookieHeader = hdrs.get("cookie") ?? "";

  const apiUrl = `${protocol}://${host}/api/opportunities?${query.toString()}`;

  console.log("FETCHING:", apiUrl);

  // Fetch from proxy route
  const res = await fetch(apiUrl, {
    cache: "no-store",
    headers: {
      Cookie: cookieHeader,
    },
  });

  if (!res.ok) {
    console.error(await res.text());
    return notFound();
  }

  const data = await res.json();
  const opportunities = data.results || [];
  const totalPages = Math.ceil(data.count / 20);

  return (
    <div className="space-y-6">
      {/* HEADER */}
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

      {/* FILTERS */}
      <div className="flex flex-wrap gap-4 items-end">
        <form className="flex-1">
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Search opportunities..."
            className="w-full rounded-lg px-3 py-2 border"
          />
        </form>

        <form>
          <select
            name="stage"
            defaultValue={stage}
            className="rounded-lg px-3 py-2 border"
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

        <form>
          <select
            name="type"
            defaultValue={type}
            className="rounded-lg px-3 py-2 border"
          >
            <option value="">All Types</option>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>
        </form>
      </div>

      {/* TABLE */}
      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-3 px-4 text-left">Title</th>
              <th className="py-3 px-4 text-left">Stage</th>
              <th className="py-3 px-4 text-left">Type</th>
              <th className="py-3 px-4 text-left">Price</th>
              <th className="py-3 px-4 text-left">Updated</th>
            </tr>
          </thead>

          <tbody>
            {opportunities.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-neutral-500">
                  No opportunities found.
                </td>
              </tr>
            ) : (
              opportunities.map((opp: any) => (
                <tr
                  key={opp.id}
                  className="border-b hover:bg-neutral-100 cursor-pointer"
                >
                  <td className="py-3 px-4">
                    <Link
                      href={`/opportunities/${opp.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {opp.title}
                    </Link>
                  </td>
                  <td className="py-3 px-4 capitalize">
                    {opp.stage.replace("_", " ")}
                  </td>
                  <td className="py-3 px-4 capitalize">{opp.deal_type}</td>
                  <td className="py-3 px-4">
                    {opp.price
                      ? `$${Number(opp.price).toLocaleString()}`
                      : "--"}
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

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-3 mt-6">
          {Array.from({ length: totalPages }, (_, i) => (
            <Link
              key={i}
              href={`/opportunities?page=${i + 1}`}
              className={`px-3 py-1 rounded ${
                page == String(i + 1)
                  ? "bg-blue-600 text-white"
                  : "bg-neutral-200 text-neutral-700"
              }`}
            >
              {i + 1}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
