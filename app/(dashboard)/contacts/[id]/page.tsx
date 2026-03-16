// app/(dashboard)/contacts/[id]/page.tsx

import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DeleteContactButton } from "./DeleteContactButton";

// -----------------------------
// Types — based on your model
// -----------------------------
interface Owner {
  id: number;
  name: string;
  email: string;
}

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
  owner: Owner | null;
}

// -----------------------------
// PAGE COMPONENT (Server)
// -----------------------------
export default async function ContactDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  // Read token from httpOnly cookies
  const token = (await cookies()).get("access")?.value;
  if (!token) redirect("/login");

  const BASE_URL = process.env.API_URL!;
  const res = await fetch(`${BASE_URL}/api/contacts/${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) redirect("/contacts");

  const contact: Contact = await res.json();

  // Safe field extractions
  const fullName = `${contact.first_name} ${contact.last_name}`.trim();
  const ownerName = contact.owner?.name ?? "Unassigned";
  const sourceName = contact.source?.name ?? "—";
  const tagsText =
    contact.tags?.length ? contact.tags.map((t) => t.name).join(", ") : "—";
  const notesText = contact.notes?.trim() || "No notes added yet.";

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{fullName}</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Owned by {ownerName}
          </p>
        </div>

        <div className="flex gap-2">
          <Link href={`/contacts/${contact.id}/edit`} className="btn-secondary">
            Edit
          </Link>
          <DeleteContactButton id={contact.id} />
          <Link href="/contacts" className="btn-secondary">
            Back
          </Link>
        </div>
      </div>

      {/* Contact Info */}
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
            <p className="font-medium">{sourceName}</p>
          </div>

          <div>
            <p className="text-zinc-500">Tags</p>
            <p className="font-medium">{tagsText}</p>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="dashboard-card">
        <h2 className="dashboard-section-title mb-3">Notes</h2>
        <p className="text-sm whitespace-pre-wrap">{notesText}</p>
      </div>
    </div>
  );
}
