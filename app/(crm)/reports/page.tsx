import { redirect } from "next/navigation";
import { getCurrentUser } from "../../lib/auth";

export default async function ReportsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="p-6 space-y-8">

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Analytics and insights about your CRM activity.
        </p>
      </div>

      {/* Placeholder Sections */}
      <section className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow border dark:border-zinc-800">
        <h2 className="text-lg font-semibold mb-2">Pipeline Overview</h2>
        <p className="text-sm text-zinc-500">Metrics coming soon…</p>
      </section>

      <section className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow border dark:border-zinc-800">
        <h2 className="text-lg font-semibold mb-2">Lead Conversion</h2>
        <p className="text-sm text-zinc-500">Analytics under development…</p>
      </section>

      <section className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow border dark:border-zinc-800">
        <h2 className="text-lg font-semibold mb-2">Agent Activity</h2>
        <p className="text-sm text-zinc-500">Tracking will appear here…</p>
      </section>

      <section className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow border dark:border-zinc-800">
        <h2 className="text-lg font-semibold mb-2">Revenue & Forecast</h2>
        <p className="text-sm text-zinc-500">Forecasting coming soon…</p>
      </section>

    </div>
  );
}
