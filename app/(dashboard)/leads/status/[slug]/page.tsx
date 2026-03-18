import { redirect } from "next/navigation";

// Maps sidebar URL slugs to the Lead model's status field values
const SLUG_TO_STATUS: Record<string, string> = {
  new: "new",
  attempted: "contacted",
  contacted: "contacted",
  qualified: "nurturing",
  converted: "converted",
  archived: "closed",
};

export default function LeadsStatusPage({
  params,
}: {
  params: { slug: string };
}) {
  const status = SLUG_TO_STATUS[params.slug];
  redirect(status ? `/leads?status=${status}` : "/leads");
}
