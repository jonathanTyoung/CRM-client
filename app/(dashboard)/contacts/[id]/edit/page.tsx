// app/(dashboard)/contacts/[id]/edit/page.tsx

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import EditContactForm from "./EditContactForm";
import { cookies } from "next/headers";

export default async function EditContactPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  // Read JWT from httpOnly cookies
  const token = (await cookies()).get("access")?.value;

  if (!token) {
    return <p className="text-red-500">Unauthorized. Please log in.</p>;
  }

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
  const res = await fetch(`${BASE_URL}/api/contacts/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return <p className="text-red-500">Contact not found.</p>;
  }

  const contact = await res.json();

  return (
    <div className="max-w-xl space-y-6">

      {/* Ghost Back Button */}
      <Link
        href={`/contacts/${id}`}
        className="inline-flex items-center text-sm font-medium text-zinc-600 hover:text-zinc-900 
                  dark:text-zinc-400 dark:hover:text-white transition-colors"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back
      </Link>

      <h1 className="text-2xl font-semibold">Edit Contact</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Update contact details.
      </p>

      <EditContactForm contact={contact} />
    </div>
  );
}
