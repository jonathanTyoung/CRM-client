// app/(dashboard)/contacts/page.tsx

import { cookies } from "next/headers";
import ContactsTable from "./ContactsTable";

export default async function ContactsPage({ searchParams }) {
  const { page = "1", search = "" } = await searchParams;

  // Read httpOnly token on the server
  const access = (await cookies()).get("access")?.value;
  if (!access) {
    return <div>You must be logged in.</div>;
  }

  // Build Django URL
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
  const url = new URL("/api/contacts", BASE_URL);
  url.searchParams.set("page", page);
  if (search) url.searchParams.set("search", search);

  console.log("🟡 SERVER → DJANGO:", url.toString());

  // Fetch directly from Django (correct for server components)
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${access}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return <div>Failed to load contacts. Status: {res.status}</div>;
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
