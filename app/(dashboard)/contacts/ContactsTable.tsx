"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ContactsTable({
  data,
  currentPage,
  searchQuery,
}: {
  data: any;
  currentPage: number;
  searchQuery: string;
}) {
  const router = useRouter();
  const contacts = data?.results || [];

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem("search") as HTMLInputElement;
    router.push(`/contacts?page=1&search=${input.value}`);
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

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3">
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

      {/* Contacts Table */}
      <div className="table-container">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-800">
            <tr>
              <th className="table-th">Name</th>
              <th className="table-th">Email</th>
              <th className="table-th">Phone</th>
              <th className="table-th">Tags</th>
              <th className="table-th text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {contacts.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-zinc-500 dark:text-zinc-400">
                  No contacts found.
                </td>
              </tr>
            )}

            {contacts.map((c: any) => (
              <tr key={c.id} className="table-tr">
                <td className="table-td font-medium text-zinc-900 dark:text-zinc-100">
                  {c.first_name} {c.last_name}
                </td>
                <td className="table-td">{c.email || "-"}</td>
                <td className="table-td">{c.phone || "-"}</td>
                <td className="table-td">
                  <div className="flex flex-wrap gap-1">
                    {(c.tags || []).map((tag: any) => (
                      <span key={tag.id} className="badge-blue">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="table-td text-right space-x-3">
                  <Link
                    href={`/contacts/${c.id}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View
                  </Link>
                  <Link
                    href={`/contacts/${c.id}/edit`}
                    className="text-zinc-700 dark:text-zinc-300 hover:underline"
                  >
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
          <Link
            href={`/contacts?page=${currentPage - 1}&search=${searchQuery}`}
            className="btn-secondary"
          >
            ← Previous
          </Link>
        ) : (
          <span className="px-3 py-2 rounded text-zinc-400 dark:text-zinc-600">
            ← Previous
          </span>
        )}

        {data.next ? (
          <Link
            href={`/contacts?page=${currentPage + 1}&search=${searchQuery}`}
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
