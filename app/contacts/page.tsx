// app/contacts/page.tsx
import { cookies } from "next/headers";
import ContactsTable from "./ContactsTable";

export default async function ContactsPage(props: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const { page = "1", search = "" } = await props.searchParams;

  const cookieStore = await cookies();
  const access = cookieStore.get("access")?.value;

  if (!access) {
    return (
      <div className="p-4 text-red-600">
        You must be logged in to view your contacts.
      </div>
    );
  }

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Build URL
  const url = new URL(`${BASE_URL}/api/contacts`);
  url.searchParams.set("page", page);
  if (search) url.searchParams.set("search", search);

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${access}`,
    },
    cache: "no-store",    // keep it fresh
  });

  if (!res.ok) {
    return (
      <div className="p-4 text-red-600">
        Failed to load contacts. Status: {res.status}
      </div>
    );
  }

  const data = await res.json();

  return (
    <div className="p-6">
      <ContactsTable
        data={data}
        currentPage={Number(page)}
        searchQuery={search}
      />
    </div>
  );
}
