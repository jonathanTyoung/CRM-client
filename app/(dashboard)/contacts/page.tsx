// app/(dashboard)/contacts/page.tsx
import { cookies } from "next/headers";
import ContactsTable from "./ContactsTable";

export const dynamic = "force-dynamic";

type ContactsPageProps = {
  searchParams?: {
    page?: string;
    search?: string;
  };
};

export default async function ContactsPage({
  searchParams,
}: ContactsPageProps) {
  const page = searchParams?.page ?? "1";
  const search = searchParams?.search ?? "";

  // 1. Get access token from cookies
  const token = cookies().get("access")?.value;

  if (!token) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">Unauthorized</h1>
        <p className="text-sm text-zinc-500">
          Your session has expired. Please log in again.
        </p>
      </div>
    );
  }

  // 2. Build query string for Django
  const query = new URLSearchParams({
    page,
    search,
  }).toString();

  const DJANGO_URL = process.env.DJANGO_API_URL!;

  // 3. Call Django directly (server → Django, no CORS issues)
  const res = await fetch(`${DJANGO_URL}/api/contacts?${query}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error("Contacts fetch error:", res.status, errorBody);

    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">Error loading contacts</h1>
        <p className="text-sm text-zinc-500">
          There was a problem talking to the contacts API (status {res.status}).
        </p>
      </div>
    );
  }

  const data = await res.json();

  // 4. Render your existing ContactsTable
  return (
    <ContactsTable
      data={data}
      currentPage={Number(page)}
      searchQuery={search}
    />
  );
}
