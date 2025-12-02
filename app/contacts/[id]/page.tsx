import Link from "next/link";
import { cookies } from "next/headers";
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
// Fetch helper
// -----------------------------
async function getContact(id: string, token: string): Promise<Contact | null> {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const res = await fetch(`${baseUrl}/api/contacts/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

// -----------------------------
// Page Component (Next.js 15 compliant)
// -----------------------------
export default async function ContactDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  // Unwrap route params (Next.js 15)
  const { id } = await props.params;

  // Grab auth token from cookies
  const cookieStore = await cookies();
  const access = cookieStore.get("access")?.value;

  if (!access) {
    return (
      <div className="p-6">
        <p className="text-red-500 text-sm">You must be logged in.</p>
        <Link href="/contacts" className="btn-secondary inline-block mt-4">
          ← Back to contacts
        </Link>
      </div>
    );
  }

  // Fetch the contact
  const contact = await getContact(id, access);

  if (!contact) {
    return (
      <div className="p-6">
        <p className="text-red-500 text-sm">Contact not found.</p>
        <Link href="/contacts" className="btn-secondary inline-block mt-4">
          ← Back to contacts
        </Link>
      </div>
    );
  }

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
