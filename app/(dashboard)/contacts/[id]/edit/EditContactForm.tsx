"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Tag {
  id: number;
  name: string;
}

interface Source {
  id: number;
  name: string;
}

interface Contact {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  notes: string;
  source: Source | null;
  tags: Tag[];
}

export default function EditContactForm({ contact }: { contact: Contact }) {
  const router = useRouter();

  const [tags, setTags] = useState<Tag[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    first_name: contact.first_name,
    last_name: contact.last_name,
    email: contact.email || "",
    phone: contact.phone || "",
    notes: contact.notes || "",
    source_id: contact.source?.id?.toString() ?? "",
    tag_ids: contact.tags.map((t) => t.id),
  });

  // ------- Load Tags + Sources -------
  useEffect(() => {
    async function loadMeta() {
      try {
        const [tagsRes, sourcesRes] = await Promise.all([
          fetch("/api/tags", { credentials: "include" }),       // 🔥 FIX #1
          fetch("/api/sources", { credentials: "include" }),    // 🔥 FIX #2
        ]);

        const [tagsData, sourcesData] = await Promise.all([
          tagsRes.json(),
          sourcesRes.json(),
        ]);

        setTags(tagsData);
        setSources(sourcesData);
      } catch (err: any) {
        setError("Failed to load tags/sources");
      } finally {
        setLoadingMeta(false);
      }
    }
    loadMeta();
  }, []);

  // ------- Form Handlers -------
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function toggleTag(id: number) {
    setForm((prev) => ({
      ...prev,
      tag_ids: prev.tag_ids.includes(id)
        ? prev.tag_ids.filter((t) => t !== id)
        : [...prev.tag_ids, id],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/contacts/${contact.id}`, {
        method: "PATCH",
        credentials: "include",                        // 🔥 FIX #3
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          phone: form.phone,
          notes: form.notes,
          source_id: form.source_id ? Number(form.source_id) : null,
          tag_ids: form.tag_ids,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.detail || "Failed to update contact.");
      }

      router.push(`/contacts/${contact.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingMeta) return <p>Loading contact options…</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Name Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium block mb-1">First Name</label>
          <input
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded w-full"
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Last Name</label>
          <input
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded w-full"
          />
        </div>
      </div>

      {/* Email & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium block mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1">Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="text-sm font-medium block mb-1">Notes</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={4}
          className="border px-3 py-2 rounded w-full"
        />
      </div>

      {/* Source & Tags */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium block mb-1">Source</label>
          <select
            name="source_id"
            value={form.source_id}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
          >
            <option value="">— None —</option>
            {sources.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Tags</label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <label
                key={tag.id}
                className="text-xs border rounded px-2 py-1 cursor-pointer flex items-center gap-1"
              >
                <input
                  type="checkbox"
                  checked={form.tag_ids.includes(tag.id)}
                  onChange={() => toggleTag(tag.id)}
                />
                {tag.name}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 flex justify-end gap-2">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => router.back()}
          disabled={submitting}
        >
          Cancel
        </button>

        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
