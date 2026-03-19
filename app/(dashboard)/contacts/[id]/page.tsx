import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DeleteContactButton } from "./DeleteContactButton";

const RELATIONSHIP_LABELS: Record<string, string> = {
  prospect: "Prospect",
  client: "Client",
  past_client: "Past Client",
  referral: "Referral",
  vendor: "Vendor",
  sphere: "Sphere",
};

const STAGE_LABELS: Record<string, string> = {
  prospecting: "Prospecting",
  showing: "Showing",
  offer_made: "Offer Made",
  under_contract: "Under Contract",
  appointment_set: "Appointment Set",
  appointment_held: "Appointment Held",
  agreement_signed: "Agreement Signed",
  listed: "Listed",
  closed: "Closed",
};

interface Tag { id: number; name: string; }
interface Source { id: number; name: string; }
interface Owner { id: number; name: string; email: string; }

interface Contact {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  notes: string;
  relationship_type: string | null;
  source: Source | null;
  tags: Tag[];
  owner: Owner | null;
}

interface Opportunity {
  id: number;
  title: string;
  deal_type: string;
  stage: string;
  price: string | null;
  property_address: string;
}

export default async function ContactDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const token = (await cookies()).get("access")?.value;
  if (!token) redirect("/login");

  const BASE_URL = process.env.API_URL!;
  const headers = { Authorization: `Bearer ${token}` };

  const [contactRes, oppsRes] = await Promise.all([
    fetch(`${BASE_URL}/api/contacts/${id}/`, { headers, cache: "no-store" }),
    fetch(`${BASE_URL}/api/opportunities/?contact=${id}&page_size=50`, { headers, cache: "no-store" }),
  ]);

  if (!contactRes.ok) redirect("/contacts");

  const contact: Contact = await contactRes.json();
  const oppsData = oppsRes.ok ? await oppsRes.json() : null;
  const linkedOpportunities: Opportunity[] = oppsData?.results ?? [];

  const fullName = `${contact.first_name} ${contact.last_name}`.trim();
  const ownerName = contact.owner?.name ?? "Unassigned";
  const sourceName = contact.source?.name ?? "—";
  const notesText = contact.notes?.trim() || "No notes added yet.";

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-title">{fullName}</h1>
          <p className="page-subtitle mt-1">Owned by {ownerName}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/contacts/${contact.id}/edit`} className="btn-secondary">Edit</Link>
          <DeleteContactButton id={contact.id} />
          <Link href="/contacts" className="btn-secondary">Back</Link>
        </div>
      </div>

      {/* Contact Info */}
      <div className="dashboard-card">
        <h2 className="dashboard-section-title mb-4">Contact Info</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-zinc-500 dark:text-zinc-400">Email</p>
            <p className="font-medium mt-0.5">{contact.email || "—"}</p>
          </div>
          <div>
            <p className="text-zinc-500 dark:text-zinc-400">Phone</p>
            <p className="font-medium mt-0.5">{contact.phone || "—"}</p>
          </div>
          <div>
            <p className="text-zinc-500 dark:text-zinc-400">Relationship</p>
            <p className="font-medium mt-0.5">
              {contact.relationship_type
                ? RELATIONSHIP_LABELS[contact.relationship_type] ?? contact.relationship_type
                : "—"}
            </p>
          </div>
          <div>
            <p className="text-zinc-500 dark:text-zinc-400">Source</p>
            <p className="font-medium mt-0.5">{sourceName}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-zinc-500 dark:text-zinc-400 mb-1">Tags</p>
            {contact.tags?.length ? (
              <div className="flex flex-wrap gap-1">
                {contact.tags.map((t) => (
                  <span key={t.id} className="badge-blue">{t.name}</span>
                ))}
              </div>
            ) : (
              <p className="font-medium">—</p>
            )}
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="dashboard-card">
        <h2 className="dashboard-section-title mb-3">Notes</h2>
        <p className="text-sm whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">{notesText}</p>
      </div>

      {/* Linked Opportunities */}
      <div className="dashboard-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="dashboard-section-title">Linked Opportunities</h2>
          <Link href="/opportunities/new" className="text-xs font-medium text-blue-600 hover:underline">
            + New
          </Link>
        </div>

        {linkedOpportunities.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">No linked opportunities.</p>
        ) : (
          <div className="space-y-2">
            {linkedOpportunities.map((opp) => (
              <div
                key={opp.id}
                className="flex items-center justify-between rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2"
              >
                <div>
                  <Link
                    href={`/opportunities/${opp.id}`}
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {opp.title}
                  </Link>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {opp.deal_type === "buyer" ? "Buyer" : "Seller"} ·{" "}
                    {STAGE_LABELS[opp.stage] ?? opp.stage}
                    {opp.price ? ` · $${Number(opp.price).toLocaleString()}` : ""}
                  </p>
                </div>
                <span className="badge-zinc capitalize">{opp.deal_type}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
