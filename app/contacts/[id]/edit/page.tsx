// app/contacts/[id]/edit/page.tsx

import EditContactForm from "./EditContactForm.js";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

async function getContact(id: string) {
  const res = await fetch(`${baseUrl}/api/contacts/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function EditContactPage({
  params,
}: {
  params: { id: string };
}) {
  const contact = await getContact(params.id);

  if (!contact) {
    return <p className="text-red-500">Contact not found.</p>;
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Edit Contact</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Update contact details.
        </p>
      </div>

      <EditContactForm contact={contact} />
    </div>
  );
}
