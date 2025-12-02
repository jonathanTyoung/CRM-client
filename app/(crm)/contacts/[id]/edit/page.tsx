// app/(crm)/contacts/[id]/edit/page.tsx

import EditContactForm from "./EditContactForm";
import { apiFetch } from "../../../../../lib/fetcher";

export default async function EditContactPage(props: {
  params: Promise<{ id: string }>;
}) {
  // Unwrap Next.js 15 async params
  const { id } = await props.params;

  // Fetch through Next.js API proxy (NOT Django directly)
  const res = await apiFetch(`/api/contacts/${id}`);

  if (!res.ok) {
    return <p className="text-red-500">Contact not found.</p>;
  }

  const contact = await res.json();

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold">Edit Contact</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Update contact details.
      </p>

      <EditContactForm contact={contact} />
    </div>
  );
}
