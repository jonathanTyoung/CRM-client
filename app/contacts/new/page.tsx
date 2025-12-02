// app/contacts/new/page.tsx

import NewContactForm from "./NewContactsForm";

export default function NewContactPage() {
  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">New Contact</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Create a new contact in your CRM.
        </p>
      </div>

      <NewContactForm />
    </div>
  );
}
