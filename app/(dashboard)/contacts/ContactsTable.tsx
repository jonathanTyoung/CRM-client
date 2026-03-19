"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const RELATIONSHIP_LABELS: Record<string, string> = {
  prospect: "Prospect",
  client: "Client",
  past_client: "Past Client",
  referral: "Referral",
  vendor: "Vendor",
  sphere: "Sphere",
};

export default function ContactsTable({
  data,
  currentPage,
  searchQuery,
  relationshipType,
  tagFilter,
}: {
  data: any;
  currentPage: number;
  searchQuery: string;
  relationshipType: string;
  tagFilter: string;
}) {
  const router = useRouter();
  const contacts = data?.results || [];

  const [tags, setTags] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    fetch("/api/tags")
      .then((r) => (r.ok ? r.json() : []))
      .then(setTags)
      .catch(() => {});
  }, []);

  function buildUrl(overrides: Record<string, string>) {
    const params = new URLSearchParams({
      page: String(currentPage),
      search: searchQuery,
      relationship_type: relationshipType,
      tag: tagFilter,
      ...overrides,
    });
    // Strip empty values
    for (const [k, v] of [...params.entries()]) {
      if (!v) params.delete(k);
    }
    return `/contacts?${params.toString()}`;
  }

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem("search") as HTMLInputElement;
    router.push(buildUrl({ search: input.value, page: "1" }));
  }

  function handleRelationshipChange(e: React.ChangeEvent<HTMLSelectElement>) {
    router.push(buildUrl({ relationship_type: e.target.value, page: "1" }));
  }

  function handleTagChange(e: React.ChangeEvent<HTMLSelectElement>) {
    router.push(buildUrl({ tag: e.target.value, page: "1" }));
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="page-title">Contacts</h1>
        <Link href="/contacts/new" className="btn-primary">
          + Add Contact
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-0">
          <input
            name="search"
            defaultValue={searchQuery}
            placeholder="Search contacts…"
            className="input flex-1"
          />
          <button type="submit" className="btn-secondary">
            Search
          </button>
        </form>

        <select
          value={relationshipType}
          onChange={handleRelationshipChange}
          className="input w-auto"
        >
          <option value="">All Types</option>
          {Object.entries(RELATIONSHIP_LABELS).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>

        <select value={tagFilter} onChange={handleTagChange} className="input w-auto">
          <option value="">All Tags</option>
          {tags.map((t) => (
            <option key={t.id} value={String(t.id)}>{t.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-800">
            <tr>
              <th className="table-th">Name</th>
              <th className="table-th">Type</th>
              <th className="table-th">Email</th>
              <th className="table-th">Phone</th>
              <th className="table-th">Tags</th>
              <th className="table-th text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-zinc-500 dark:text-zinc-400">
                  No contacts found.
                </td>
              </tr>
            )}
            {contacts.map((c: any) => (
              <tr key={c.id} className="table-tr">
                <td className="table-td font-medium text-zinc-900 dark:text-zinc-100">
                  {c.first_name} {c.last_name}
                </td>
                <td className="table-td">
                  {c.relationship_type ? (
                    <span className="badge-zinc">
                      {RELATIONSHIP_LABELS[c.relationship_type] ?? c.relationship_type}
                    </span>
                  ) : (
                    <span className="text-zinc-400">—</span>
                  )}
                </td>
                <td className="table-td">{c.email || "—"}</td>
                <td className="table-td">{c.phone || "—"}</td>
                <td className="table-td">
                  <div className="flex flex-wrap gap-1">
                    {(c.tags || []).map((tag: any) => (
                      <span key={tag.id} className="badge-blue">{tag.name}</span>
                    ))}
                  </div>
                </td>
                <td className="table-td text-right space-x-3">
                  <Link href={`/contacts/${c.id}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                    View
                  </Link>
                  <Link href={`/contacts/${c.id}/edit`} className="text-zinc-700 dark:text-zinc-300 hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-4">
        {data.previous ? (
          <Link href={buildUrl({ page: String(currentPage - 1) })} className="btn-secondary">
            ← Previous
          </Link>
        ) : (
          <span className="px-3 py-2 text-zinc-400 dark:text-zinc-600">← Previous</span>
        )}
        {data.next ? (
          <Link href={buildUrl({ page: String(currentPage + 1) })} className="btn-secondary">
            Next →
          </Link>
        ) : (
          <span className="px-3 py-2 text-zinc-400 dark:text-zinc-600">Next →</span>
        )}
      </div>
    </div>
  );
}
