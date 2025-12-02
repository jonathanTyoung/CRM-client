// app/contacts/[id]/page.tsx
import Link from "next/link";
import { apiFetch } from "../../../../lib/fetcher";
import { DeleteContactButton } from "./DeleteContactButton";

// -----------------------------
// Types
// -----------------------------
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
  owner: string;
  source: Source | null;
  tags: Tag[];
  created_at: string;
  updated_at: string;
}

// -----------------------------
// Page Component (Next.js 15 compliant)
// -----------------------------
export default async function ContactDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  // Unwrap dynamic route params
  const { id } = await props.params;

  // Fetch from Next.js API (NOT Django)
  const res = await apiFetch(`/api/contacts/${id}`);

  if (!res.ok) {
    return (
      <div className="p-6">
        <p className="text-red-500 text-sm">Contact not found.</p>
        <Link href="/contacts" className="btn-secondary inline-block mt-4">
          ← Back to contacts
        </Link>
      </div>
    );
  }

  const contact: Contact = await res.json();

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            {contact.first_name} {contact.last_name}
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Owned by {contact.owner || "—"}
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/contacts/${contact.id}/edit`}
            className="btn-secondary"
          >
            Edit
          </Link>

          <DeleteContactButton id={contact.id} />

          <Link href="/contacts" className="btn-secondary">
            Back
          </Link>
        </div>
      </div>

      {/* Core info */}
      <div className="dashboard-card">
        <h2 className="dashboard-section-title mb-3">Contact Info</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-zinc-500">Email</p>
            <p className="font-medium">{contact.email || "—"}</p>
          </div>

          <div>
            <p className="text-zinc-500">Phone</p>
            <p className="font-medium">{contact.phone || "—"}</p>
          </div>

          <div>
            <p className="text-zinc-500">Source</p>
            <p className="font-medium">{contact.source?.name || "—"}</p>
          </div>

          <div>
            <p className="text-zinc-500">Tags</p>
            <p className="font-medium">
              {contact.tags.length
                ? contact.tags.map((t) => t.name).join(", ")
                : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="dashboard-card">
        <h2 className="dashboard-section-title mb-3">Notes</h2>
        <p className="text-sm whitespace-pre-wrap">
          {contact.notes?.trim() || "No notes added yet."}
        </p>
      </div>
    </div>
  );
}
