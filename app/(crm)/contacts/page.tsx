// app/(crm)/contacts/page.tsx

import { cookies } from "next/headers";
import ContactsTable from "./ContactsTable";

export default async function ContactsPage({ searchParams }) {
  const { page = "1", search = "" } = await searchParams;

  // get JWT from cookies
  const cookieStore = await cookies();
  const access = cookieStore.get("access")?.value;

  if (!access) {
    return <div>You must be logged in.</div>;
  }

  const BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const url = `${BASE_URL}/api/contacts?page=${page}${
    search ? `&search=${search}` : ""
  }`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${access}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return <div>Failed to load contacts: {res.status}</div>;
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
