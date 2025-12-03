import { cookies } from "next/headers";

export const dynamic = "force-dynamic"; // ensure SSR runs fresh each load

export default async function ContactsPage() {
  // 1. Read JWT access token from cookies
  const token = cookies().get("access")?.value;

  if (!token) {
    // If somehow we reach here without auth, fail gracefully
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">Unauthorized</h1>
        <p>Please log in again.</p>
      </div>
    );
  }

  // 2. Fetch contacts from Django API
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contacts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const data = await res.json();

  // 3. Normalize DRF response (pagination OR raw list)
  const contacts = Array.isArray(data)
    ? data
    : Array.isArray(data?.results)
    ? data.results
    : [];

  // 4. Render UI
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold mb-6">Contacts</h1>

      {contacts.length === 0 ? (
        <p className="text-zinc-500">No contacts found.</p>
      ) : (
        <ul className="space-y-2">
          {contacts.map((c) => (
            <li
              key={c.id}
              className="p-3 border rounded bg-white shadow-sm hover:bg-zinc-50"
            >
              <p className="font-medium">
                {c.first_name} {c.last_name}
              </p>
              <p className="text-sm text-zinc-600">{c.email}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
