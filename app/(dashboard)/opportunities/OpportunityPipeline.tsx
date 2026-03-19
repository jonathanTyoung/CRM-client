"use client";

import Link from "next/link";

const STAGES = [
  { value: "prospecting", label: "Prospecting" },
  { value: "appointment_set", label: "Appointment Set" },
  { value: "showing", label: "Showing" },
  { value: "appointment_held", label: "Appointment Held" },
  { value: "offer_made", label: "Offer Made" },
  { value: "agreement_signed", label: "Agreement Signed" },
  { value: "listed", label: "Listed" },
  { value: "under_contract", label: "Under Contract" },
  { value: "closed", label: "Closed" },
];

export default function OpportunityPipeline({ opportunities }: { opportunities: any[] }) {
  const grouped = Object.fromEntries(STAGES.map((s) => [s.value, [] as any[]]));
  for (const opp of opportunities) {
    if (grouped[opp.stage]) grouped[opp.stage].push(opp);
    else grouped[opp.stage] = [opp];
  }

  const activeStages = STAGES.filter(
    (s) => grouped[s.value]?.length > 0
  );

  if (opportunities.length === 0) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400 py-6">No opportunities found.</p>
    );
  }

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max">
        {activeStages.map((stage) => (
          <div key={stage.value} className="w-64 flex-shrink-0">
            {/* Column header */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                {stage.label}
              </span>
              <span className="badge-zinc">{grouped[stage.value].length}</span>
            </div>

            {/* Cards */}
            <div className="space-y-2">
              {grouped[stage.value].map((opp: any) => (
                <Link
                  key={opp.id}
                  href={`/opportunities/${opp.id}`}
                  className="block rounded-lg border border-zinc-200 dark:border-zinc-700
                             bg-white dark:bg-zinc-900 px-3 py-3 shadow-sm
                             hover:border-blue-400 dark:hover:border-blue-500
                             hover:shadow transition"
                >
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                    {opp.title}
                  </p>
                  {opp.property_address && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
                      {opp.property_address}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="badge-zinc capitalize text-xs">{opp.deal_type}</span>
                    {opp.price && (
                      <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                        ${Number(opp.price).toLocaleString()}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
