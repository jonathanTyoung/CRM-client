// app/(crm)/contacts/[id]/page.tsx

import Link from "next/link";
import { cookies } from "next/headers";
import { DeleteContactButton } from "./DeleteContactButton";

export default async function ContactDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const token = (await cookies()).get("access")?.value;

  if (!token) {
    return (
      <div className="p-6">
        <p className="text-red-500 text-sm">You must be logged in.</p>
        <Link href="/login" className="btn-secondary mt-4 inline-block">
          Go to Login
        </Link>
      </div>
    );
  }

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

  const res = await fetch(`${BASE_URL}/api/contacts/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <div className="p-6">
        <p className="text-red-500 text-sm">Contact not found.</p>
        <Link href="/contacts" className="btn-secondary mt-4 inline-block">
          ← Back to contacts
        </Link>
      </div>
    );
  }

  const contact = await res.json();

  return (
    <div className="space-y-6 max-w-3xl">
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
          <Link href={`/contacts/${contact.id}/edit`} className="btn-secondary">
            Edit
          </Link>
          <DeleteContactButton id={contact.id} />
          <Link href="/contacts" className="btn-secondary">
            Back
          </Link>
        </div>
      </div>

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

      <div className="dashboard-card">
        <h2 className="dashboard-section-title mb-3">Notes</h2>
        <p className="text-sm whitespace-pre-wrap">
          {contact.notes?.trim() || "No notes added yet."}
        </p>
      </div>
    </div>
  );
}
