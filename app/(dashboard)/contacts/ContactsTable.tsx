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
        <h1 className="text-2xl font-semibold">Contacts</h1>

        <Link
          href="/contacts/new"
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          + Add Contact
        </Link>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <input
          name="search"
          defaultValue={searchQuery}
          placeholder="Search contacts…"
          className="flex-1 border rounded-lg px-3 py-2 
                     bg-white dark:bg-zinc-900
                     text-gray-800 dark:text-zinc-200
                     border-gray-300 dark:border-zinc-700"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded bg-gray-800 text-white hover:bg-black"
        >
          Search
        </button>
      </form>

      {/* Contacts Table */}
      <div
        className="
          overflow-x-auto rounded-lg 
          border border-gray-200 dark:border-zinc-700
          bg-white dark:bg-zinc-900 
          shadow
        "
      >
        <table className="w-full text-sm">
          <thead
            className="
              bg-gray-100 dark:bg-zinc-800 
              text-gray-700 dark:text-zinc-200
            "
          >
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Tags</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {contacts.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="py-6 text-center text-gray-500 dark:text-zinc-400"
                >
                  No contacts found.
                </td>
              </tr>
            )}

            {contacts.map((c: any) => (
              <tr
                key={c.id}
                className="
                  border-t border-gray-200 dark:border-zinc-700
                  bg-white dark:bg-zinc-900
                  hover:bg-gray-50 dark:hover:bg-zinc-800
                  transition-colors
                "
              >
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-zinc-200">
                  {c.first_name} {c.last_name}
                </td>

                <td className="px-4 py-3 text-gray-700 dark:text-zinc-300">
                  {c.email || "-"}
                </td>

                <td className="px-4 py-3 text-gray-700 dark:text-zinc-300">
                  {c.phone || "-"}
                </td>

                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {(c.tags || []).map((tag: any) => (
                      <span
                        key={tag.id}
                        className="
                          px-2 py-1 text-xs 
                          bg-blue-100 text-blue-700 
                          dark:bg-blue-900 dark:text-blue-200
                          rounded
                        "
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </td>

                <td className="px-4 py-3 text-right space-x-3">
                  <Link
                    href={`/contacts/${c.id}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View
                  </Link>

                  <Link
                    href={`/contacts/${c.id}/edit`}
                    className="text-gray-700 dark:text-zinc-300 hover:underline"
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
            className="px-3 py-2 rounded 
                       bg-gray-200 dark:bg-zinc-800 
                       hover:bg-gray-300 dark:hover:bg-zinc-700"
          >
            ← Previous
          </Link>
        ) : (
          <span className="px-3 py-2 rounded 
                           bg-gray-100 dark:bg-zinc-800 
                           text-gray-400 dark:text-zinc-600"
          >
            ← Previous
          </span>
        )}

        {data.next ? (
          <Link
            href={`/contacts?page=${currentPage + 1}&search=${searchQuery}`}
            className="px-3 py-2 rounded 
                       bg-gray-200 dark:bg-zinc-800 
                       hover:bg-gray-300 dark:hover:bg-zinc-700"
          >
            Next →
          </Link>
        ) : (
          <span className="px-3 py-2 rounded 
                           bg-gray-100 dark:bg-zinc-800 
                           text-gray-400 dark:text-zinc-600"
          >
            Next →
          </span>
        )}
      </div>
    </div>
  );
}
