// app/(dashboard)/opportunities/new/page.tsx

import OpportunityForm from "../OpportunityForm";

export default function NewOpportunityPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Create Opportunity</h1>
      <OpportunityForm mode="create" />
    </div>
  );
}
