import { redirect } from "next/navigation";
import { auth } from "../../../../lib/auth/auth.js";

export default async function SearchListingsPage() {
  const user = await auth();
  if (!user) redirect("/login");

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Property Search</h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        IDX / MLS property search coming soon…
      </p>

      {/* Placeholder for filters */}
      <div className="bg-white dark:bg-zinc-900 p-4 rounded shadow border dark:border-zinc-800">
        <h2 className="text-lg font-semibold mb-2">Filters</h2>
        <p className="text-zinc-500 text-sm">MLS filtering tools will appear here.</p>
      </div>

      {/* Placeholder for results */}
      <div className="bg-white dark:bg-zinc-900 p-4 rounded shadow border dark:border-zinc-800">
        <h2 className="text-lg font-semibold mb-2">Results</h2>
        <p className="text-zinc-500 text-sm">Property results will appear here.</p>
      </div>
    </div>
  );
}
