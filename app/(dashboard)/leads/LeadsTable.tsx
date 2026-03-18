"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  nurturing: "Nurturing",
  appointment_set: "Appointment Set",
  appointment_held: "Appointment Held",
  agreement_signed: "Agreement Signed",
  listed_or_showing: "Listed / Showing",
  contract_accepted: "Contract Accepted",
  closed: "Closed",
  converted: "Converted",
};

const TYPE_LABELS: Record<string, string> = {
  buying: "Buying",
  selling: "Selling",
  buying_and_selling: "Buying & Selling",
};

export default function LeadsTable({
  data,
  currentPage,
  searchQuery,
  statusFilter,
}: {
  data: any;
  currentPage: number;
  searchQuery: string;
  statusFilter: string;
}) {
  const router = useRouter();
  const leads = data?.results || [];

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem("search") as HTMLInputElement;
    router.push(`/leads?page=1&search=${encodeURIComponent(input.value)}&status=${statusFilter}`);
  }

  function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    router.push(`/leads?page=1&search=${encodeURIComponent(searchQuery)}&status=${e.target.value}`);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="page-title">Leads</h1>
        <Link href="/leads/new" className="btn-primary">
          + Add Lead
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <form onSubmit={handleSearch} className="flex gap-3 flex-1 min-w-0">
          <input
            name="search"
            defaultValue={searchQuery}
            placeholder="Search leads…"
            className="input flex-1"
          />
          <button type="submit" className="btn-secondary">
            Search
          </button>
        </form>

        <select
          value={statusFilter}
          onChange={handleStatusChange}
          className="input w-auto"
        >
          <option value="">All Statuses</option>
          {Object.entries(STATUS_LABELS).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-800">
            <tr>
              <th className="table-th">Name</th>
              <th className="table-th">Email</th>
              <th className="table-th">Phone</th>
              <th className="table-th">Status</th>
              <th className="table-th">Type</th>
              <th className="table-th">Agent</th>
              <th className="table-th text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 && (
              <tr>
                <td colSpan={7} className="py-6 text-center text-zinc-500 dark:text-zinc-400">
                  No leads found.
                </td>
              </tr>
            )}
            {leads.map((lead: any) => (
              <tr key={lead.id} className="table-tr">
                <td className="table-td font-medium text-zinc-900 dark:text-zinc-100">
                  {lead.first_name} {lead.last_name}
                </td>
                <td className="table-td">{lead.email || "—"}</td>
                <td className="table-td">{lead.phone || "—"}</td>
                <td className="table-td">
                  <span className="badge-blue">
                    {STATUS_LABELS[lead.status] ?? lead.status}
                  </span>
                </td>
                <td className="table-td">{TYPE_LABELS[lead.type] ?? lead.type ?? "—"}</td>
                <td className="table-td">
                  {lead.assigned_agent_first_name} {lead.assigned_agent_last_name}
                </td>
                <td className="table-td text-right">
                  <Link
                    href={`/leads/${lead.id}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-2">
        {data?.previous ? (
          <Link
            href={`/leads?page=${currentPage - 1}&search=${encodeURIComponent(searchQuery)}&status=${statusFilter}`}
            className="btn-secondary"
          >
            ← Previous
          </Link>
        ) : (
          <span className="px-3 py-2 rounded text-zinc-400 dark:text-zinc-600">
            ← Previous
          </span>
        )}
        {data?.next ? (
          <Link
            href={`/leads?page=${currentPage + 1}&search=${encodeURIComponent(searchQuery)}&status=${statusFilter}`}
            className="btn-secondary"
          >
            Next →
          </Link>
        ) : (
          <span className="px-3 py-2 rounded text-zinc-400 dark:text-zinc-600">
            Next →
          </span>
        )}
      </div>
    </div>
  );
}
