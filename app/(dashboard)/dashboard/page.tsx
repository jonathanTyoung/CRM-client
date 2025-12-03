import Link from "next/link";
import { auth } from "../../../lib/auth/auth";

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
  { id: 1, text: "New lead created: John Smith", time: "5 minutes ago" },
  { id: 2, text: "Opportunity updated: 123 Main St → Qualified", time: "30 minutes ago" },
  { id: 3, text: "New contact added: Sarah Johnson", time: "Today, 10:15 AM" },
  { id: 4, text: "Lead status updated: Alex Brown → Contacted", time: "Yesterday" },
];

export default async function DashboardPage() {
  const user = await auth();  // <-- Updated

  const totalPipelineCount = pipelineStages.reduce(
    (sum, stage) => sum + stage.count,
    0
  );

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">
          Welcome back, {user?.first_name}
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Snapshot of your contacts, leads, and deal pipeline.
        </p>
      </header>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link href="/contacts/new" className="btn-primary">
          + New Contact
        </Link>
        <Link href="/leads/new" className="btn-secondary">
          + New Lead
        </Link>
        <Link href="/opportunities/new" className="btn-secondary">
          + New Opportunity
        </Link>
      </div>

      {/* KPI Cards */}
      <section>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="dashboard-card">
              <p className="dashboard-card-label">{stat.label}</p>
              <p className="dashboard-card-value">{stat.value}</p>
              <p className="dashboard-card-hint">{stat.hint}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pipeline + Recent Activity */}
      <section className="grid gap-6 lg:grid-cols-[2fr,1.5fr]">
        {/* Pipeline */}
        <div className="dashboard-card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="dashboard-section-title">Pipeline Snapshot</h2>
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
              const width =
                totalPipelineCount > 0
                  ? `${(stage.count / totalPipelineCount) * 100}%`
                  : "0%";

              return (
                <div key={stage.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">{stage.label}</span>
                    <span className="text-zinc-500">
                      {stage.count} deal{stage.count === 1 ? "" : "s"}
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                    {stage.count > 0 && (
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="dashboard-section-title">Recent Activity</h2>
            <span className="text-xs text-zinc-500">Last 24 hours</span>
          </div>

          <ul className="space-y-3">
            {recentActivity.map((item) => (
              <li key={item.id} className="flex flex-col">
                <p className="text-sm">{item.text}</p>
                <span className="text-xs text-zinc-500">{item.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
