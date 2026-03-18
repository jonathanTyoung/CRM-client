import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LeadsTable from "./LeadsTable";

export const dynamic = "force-dynamic";

type LeadsPageProps = {
  searchParams?: {
    page?: string;
    search?: string;
    status?: string;
  };
};

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  const page = searchParams?.page ?? "1";
  const search = searchParams?.search ?? "";
  const status = searchParams?.status ?? "";

  const token = cookies().get("access")?.value;
  if (!token) redirect("/login");

  const query = new URLSearchParams({ page, search });
  if (status) query.set("status", status);

  const res = await fetch(
    `${process.env.API_URL}/api/leads/?${query.toString()}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    console.error("Leads fetch error:", res.status, await res.text());
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">Error loading leads</h1>
        <p className="text-sm text-zinc-500">
          There was a problem fetching leads (status {res.status}).
        </p>
      </div>
    );
  }

  const data = await res.json();

  return (
    <LeadsTable
      data={data}
      currentPage={Number(page)}
      searchQuery={search}
      statusFilter={status}
    />
  );
}
