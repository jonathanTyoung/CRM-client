import { cookies } from "next/headers";
import ContactsTable from "./ContactsTable";

export const dynamic = "force-dynamic";

type ContactsPageProps = {
  searchParams?: {
    page?: string;
    search?: string;
    relationship_type?: string;
    tag?: string;
  };
};

export default async function ContactsPage({ searchParams }: ContactsPageProps) {
  const page = searchParams?.page ?? "1";
  const search = searchParams?.search ?? "";
  const relationship_type = searchParams?.relationship_type ?? "";
  const tag = searchParams?.tag ?? "";

  const token = cookies().get("access")?.value;

  if (!token) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">Unauthorized</h1>
        <p className="text-sm text-zinc-500">Your session has expired. Please log in again.</p>
      </div>
    );
  }

  const query = new URLSearchParams({ page, search });
  if (relationship_type) query.set("relationship_type", relationship_type);
  if (tag) query.set("tag", tag);

  const res = await fetch(`${process.env.API_URL!}/api/contacts/?${query.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Contacts fetch error:", res.status, await res.text());
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

  return (
    <ContactsTable
      data={data}
      currentPage={Number(page)}
      searchQuery={search}
      relationshipType={relationship_type}
      tagFilter={tag}
    />
  );
}
