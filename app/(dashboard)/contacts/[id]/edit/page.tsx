import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import EditContactForm from "./EditContactForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function EditContactPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const token = (await cookies()).get("access")?.value;

  if (!token) {
    redirect("/login");
  }

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
  const res = await fetch(`${BASE_URL}/api/contacts/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    redirect("/contacts");
  }

  const contact = await res.json();

  return (
    <div className="max-w-xl space-y-6">
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
