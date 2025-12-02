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

export default function NewContactForm() {
  const router = useRouter();

  const [tags, setTags] = useState<Tag[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    notes: "",
    source_id: "",
    tag_ids: [] as number[],
  });

  // Fetch tags and sources on mount
  useEffect(() => {
    async function loadMeta() {
      try {
        const [tagsRes, sourcesRes] = await Promise.all([
          fetch("/internal/tags"),
          fetch("/internal/sources"),
        ]);

        if (!tagsRes.ok || !sourcesRes.ok) {
          throw new Error("Failed to load metadata.");
        }

        const [tagsData, sourcesData] = await Promise.all([
          tagsRes.json(),
          sourcesRes.json(),
        ]);

        setTags(tagsData);
        setSources(sourcesData);
      } catch (err: any) {
        setError(err.message || "Failed to load tags/sources.");
      } finally {
        setLoading(false);
      }
    }

    loadMeta();
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleTagToggle(tagId: number) {
    setForm((prev) => {
      const exists = prev.tag_ids.includes(tagId);
      return {
        ...prev,
        tag_ids: exists
          ? prev.tag_ids.filter((id) => id !== tagId)
          : [...prev.tag_ids, tagId],
      };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/internal/contacts", {
        method: "POST",
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
        throw new Error(data?.detail || "Failed to create contact.");
      }

      const created = await res.json();
      router.push(`/contacts/${created.id}`);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p>Loading contact options…</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">First name</label>
          <input
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Last name</label>
          <input
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-sm"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Notes</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 text-sm"
          rows={4}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Source</label>
          <select
            name="source_id"
            value={form.source_id}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-sm"
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
          <span className="block text-sm font-medium mb-1">Tags</span>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <label
                key={tag.id}
                className="inline-flex items-center gap-1 text-xs border rounded px-2 py-1 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={form.tag_ids.includes(tag.id)}
                  onChange={() => handleTagToggle(tag.id)}
                />
                {tag.name}
              </label>
            ))}
          </div>
        </div>
      </div>

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
          {submitting ? "Saving..." : "Save Contact"}
        </button>
      </div>
    </form>
  );
}
