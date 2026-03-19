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
  relationship_type: string | null;
  source: Source | null;
  tags: Tag[];
}

const RELATIONSHIP_OPTIONS = [
  { value: "prospect", label: "Prospect" },
  { value: "client", label: "Client" },
  { value: "past_client", label: "Past Client" },
  { value: "referral", label: "Referral" },
  { value: "vendor", label: "Vendor" },
  { value: "sphere", label: "Sphere" },
];

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
    relationship_type: contact.relationship_type ?? "",
    source_id: contact.source?.id?.toString() ?? "",
    tag_ids: contact.tags.map((t) => t.id),
  });

  useEffect(() => {
    async function loadMeta() {
      try {
        const [tagsRes, sourcesRes] = await Promise.all([
          fetch("/api/tags/"),
          fetch("/api/sources/"),
        ]);
        setTags(tagsRes.ok ? await tagsRes.json() : []);
        setSources(sourcesRes.ok ? await sourcesRes.json() : []);
      } catch (err) {
        console.error("Metadata fetch error:", err);
        setError("Unable to load metadata. Tags and sources may not exist yet.");
      } finally {
        setLoadingMeta(false);
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
      const res = await fetch(`/api/contacts/${contact.id}/`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          phone: form.phone,
          notes: form.notes,
          relationship_type: form.relationship_type || null,
          source_id: form.source_id ? Number(form.source_id) : null,
          tag_ids: form.tag_ids,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.detail || "Failed to update contact.");
      }

      router.refresh();
      router.push(`/contacts/${contact.id}/`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingMeta) return <p className="text-sm text-zinc-500">Loading contact options…</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <p className="error-text">{error}</p>}

      {/* Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="form-label">First Name</label>
          <input name="first_name" value={form.first_name} onChange={handleChange} required className="input" />
        </div>
        <div>
          <label className="form-label">Last Name</label>
          <input name="last_name" value={form.last_name} onChange={handleChange} required className="input" />
        </div>
      </div>

      {/* Email & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} className="input" />
        </div>
        <div>
          <label className="form-label">Phone</label>
          <input name="phone" value={form.phone} onChange={handleChange} className="input" />
        </div>
      </div>

      {/* Relationship Type & Source */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Relationship Type</label>
          <select name="relationship_type" value={form.relationship_type} onChange={handleChange} className="input">
            <option value="">— None —</option>
            {RELATIONSHIP_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label">Source</label>
          <select name="source_id" value={form.source_id} onChange={handleChange} className="input">
            <option value="">— None —</option>
            {sources.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="form-label">Notes</label>
        <textarea name="notes" value={form.notes} onChange={handleChange} rows={4} className="input" />
      </div>

      {/* Tags */}
      <div>
        <span className="form-label">Tags</span>
        <div className="flex flex-wrap gap-2 mt-1">
          {tags.map((tag) => (
            <label
              key={tag.id}
              className="inline-flex items-center gap-1.5 text-xs border border-zinc-300
                         dark:border-zinc-700 rounded-md px-2 py-1 cursor-pointer
                         hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
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

      {/* Footer */}
      <div className="pt-2 flex justify-end gap-2">
        <button type="button" className="btn-secondary" onClick={() => router.back()} disabled={submitting}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
