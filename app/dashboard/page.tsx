import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const access = cookieStore.get("access")?.value;

  // Protect dashboard – redirect anonymous users
  if (!access) {
    redirect("/login");
  }

  // TODO: Replace these with real API calls later
  const stats = [
    { label: "Total Contacts", value: "—", hint: "All contacts in your CRM" },
    { label: "Active Leads", value: "—", hint: "Leads not yet closed" },
    { label: "Open Opportunities", value: "—", hint: "Deals currently in pipeline" },
    { label: "Tasks Today", value: "—", hint: "Calls, follow-ups, reminders" },
  ];

  const pipelineStages = [
    { label: "New", count: 5 },
    { label: "Contacted", count: 3 },
    { label: "Qualified", count: 2 },
    { label: "Showing / Tour", count: 1 },
    { label: "Under Contract", count: 1 },
    { label: "Closed", count: 0 },
  ];

  const recentActivity = [
    {
      id: 1,
      text: "New lead created: John Smith",
      time: "5 minutes ago",
    },
    {
      id: 2,
      text: "Opportunity updated: 123 Main St moved to Qualified",
      time: "30 minutes ago",
    },
    {
      id: 3,
      text: "New contact added: Sarah Johnson",
      time: "Today, 10:15 AM",
    },
    {
      id: 4,
      text: "Lead status changed: Alex Brown → Contacted",
      time: "Yesterday",
    },
  ];

  const totalPipelineCount = pipelineStages.reduce(
    (sum, stage) => sum + stage.count,
    0
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Snapshot of your contacts, leads, and deal pipeline.
          </p>
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-3">
          <Link
            href="/contacts/new"
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
          >
            + New Contact
          </Link>
          <Link
            href="/leads/new"
            className="inline-flex items-center rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            + New Lead
          </Link>
          <Link
            href="/opportunities/new"
            className="inline-flex items-center rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            + New Opportunity
          </Link>
        </div>
      </header>

      {/* KPI Cards */}
      <section>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <p className="text-xs font-medium uppercase text-zinc-500">
                {stat.label}
              </p>
              <p className="mt-2 text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-zinc-500">{stat.hint}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pipeline + Activity */}
      <section className="grid gap-6 lg:grid-cols-[2fr,1.5fr]">
        {/* Pipeline Snapshot */}
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Pipeline Snapshot
            </h2>
            <Link
              href="/opportunities"
              className="text-xs font-medium text-blue-600 hover:underline"
            >
              View pipeline
            </Link>
          </div>
          <p className="text-xs text-zinc-500 mb-4">
            Deals by stage in your current pipeline.
          </p>

          <div className="space-y-3">
            {pipelineStages.map((stage) => {
              const fraction =
                totalPipelineCount > 0
                  ? stage.count / totalPipelineCount
                  : 0;
              const barWidth = `${Math.max(fraction * 100, stage.count > 0 ? 10 : 0)}%`;

              return (
                <div key={stage.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-zinc-700 dark:text-zinc-200">
                      {stage.label}
                    </span>
                    <span className="text-zinc-500">
                      {stage.count} deal{stage.count === 1 ? "" : "s"}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                    {stage.count > 0 && (
                      <div
                        className="h-2 rounded-full bg-blue-500 transition-all"
                        style={{ width: barWidth }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Recent Activity
            </h2>
            <span className="text-xs text-zinc-500">Last 24 hours</span>
          </div>

          <ul className="space-y-3">
            {recentActivity.map((item) => (
              <li key={item.id} className="flex flex-col gap-1">
                <p className="text-sm text-zinc-800 dark:text-zinc-100">
                  {item.text}
                </p>
                <span className="text-xs text-zinc-500">{item.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
