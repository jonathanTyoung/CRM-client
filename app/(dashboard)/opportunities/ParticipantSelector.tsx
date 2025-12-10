"use client";

import { useState, useEffect } from "react";

interface Contact {
  id: number;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
}

export default function ParticipantSelector({
  selected,
  onChange,
}: {
  selected: any[];
  onChange: (updated: any[]) => void;
}) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);

  // Compute display label
  function labelFor(c: Contact) {
    if (c.first_name || c.last_name)
      return `${c.first_name ?? ""} ${c.last_name ?? ""}`.trim();
    if (c.email) return c.email;
    return `Contact #${c.id}`;
  }

  // Debounced search
  useEffect(() => {
    const delay = setTimeout(() => {
      if (search.trim().length > 1) fetchSearchResults();
      else setResults([]);
    }, 300);
    return () => clearTimeout(delay);
  }, [search]);

  async function fetchSearchResults() {
    setLoading(true);
    const res = await fetch(`/api/contacts?search=${search}`);
    const data = await res.json();
    setResults(data.results || data || []);
    setLoading(false);
  }

  // Add participant
  function addParticipant(contact: Contact) {
    if (selected.some((p) => p.contact === contact.id)) return;

    const updated = [...selected, { contact: contact.id }];

    onChange(updated);
    setSearch("");
    setResults([]);
  }

  // Remove participant
  function removeParticipant(id: number) {
    onChange(selected.filter((p) => p.contact !== id));
  }

  return (
    <div className="space-y-3">
      <label className="block font-medium text-neutral-700 dark:text-neutral-300">
        Participants
      </label>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search contacts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-3 py-2 rounded-lg
          bg-white dark:bg-neutral-800
          border border-neutral-300 dark:border-neutral-700
          text-neutral-900 dark:text-neutral-100
          shadow-sm"
      />

      {/* Dropdown */}
      {search.length > 1 && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow max-h-48 overflow-y-auto mt-1">
          {loading && (
            <div className="p-3 text-neutral-500 text-sm">Searching…</div>
          )}

          {!loading &&
            results.map((c) => (
              <div
                key={c.id}
                onClick={() => addParticipant(c)}
                className="px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
              >
                {labelFor(c)}
              </div>
            ))}

          {!loading && results.length === 0 && (
            <div className="p-3 text-neutral-500 text-sm">
              No matches found.
            </div>
          )}
        </div>
      )}

      {/* Selected Chips */}
      <div className="flex flex-wrap gap-2 mt-2">
        {selected.map((p) => {
          // Normalize all possible formats:
          // p.contact → number OR object
          const contactObj =
            typeof p.contact === "object" && p.contact !== null
              ? p.contact
              : results.find((r) => r.id === p.contact);

          const id = typeof p.contact === "object" ? p.contact.id : p.contact;

          const display = contactObj ? labelFor(contactObj) : `Contact #${id}`;

          return (
            <span
              key={id}
              className="px-3 py-1 bg-blue-600 text-white rounded-full flex items-center gap-2 shadow"
            >
              {display}
              <button
                onClick={() => removeParticipant(id)}
                className="text-white hover:text-red-300 text-sm"
              >
                ✕
              </button>
            </span>
          );
        })}
      </div>
    </div>
  );
}
