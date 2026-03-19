"use client";

import { useRouter } from "next/navigation";

interface Props {
  search: string;
  stage: string;
  dealType: string;
  view: string;
}

export default function OpportunityFilters({ search, stage, dealType, view }: Props) {
  const router = useRouter();

  function buildUrl(overrides: Partial<Props>) {
    const params = new URLSearchParams({
      search,
      stage,
      type: dealType,
      view,
      page: "1",
      ...Object.fromEntries(
        Object.entries(overrides).map(([k, v]) => [k === "dealType" ? "type" : k, v ?? ""])
      ),
    });
    for (const [k, v] of [...params.entries()]) {
      if (!v || v === "1") params.delete(k);
    }
    return `/opportunities?${params.toString()}`;
  }

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem("search") as HTMLInputElement;
    router.push(buildUrl({ search: input.value }));
  }

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-0">
        <input
          name="search"
          defaultValue={search}
          placeholder="Search opportunities…"
          className="input flex-1"
        />
        <button type="submit" className="btn-secondary">Search</button>
      </form>

      {/* Stage */}
      <select
        value={stage}
        onChange={(e) => router.push(buildUrl({ stage: e.target.value }))}
        className="input w-auto"
      >
        <option value="">All Stages</option>
        <optgroup label="Buyer">
          <option value="prospecting">Prospecting</option>
          <option value="showing">Showing</option>
          <option value="offer_made">Offer Made</option>
          <option value="under_contract">Under Contract</option>
        </optgroup>
        <optgroup label="Seller">
          <option value="appointment_set">Appointment Set</option>
          <option value="appointment_held">Appointment Held</option>
          <option value="agreement_signed">Agreement Signed</option>
          <option value="listed">Listed</option>
        </optgroup>
        <option value="closed">Closed</option>
      </select>

      {/* Deal Type */}
      <select
        value={dealType}
        onChange={(e) => router.push(buildUrl({ dealType: e.target.value }))}
        className="input w-auto"
      >
        <option value="">All Types</option>
        <option value="buyer">Buyer</option>
        <option value="seller">Seller</option>
      </select>

      {/* View Toggle */}
      <div className="flex rounded-lg border border-zinc-300 dark:border-zinc-700 overflow-hidden text-sm">
        <button
          onClick={() => router.push(buildUrl({ view: "list" }))}
          className={`px-3 py-1.5 font-medium transition ${
            view !== "pipeline"
              ? "bg-blue-600 text-white"
              : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          }`}
        >
          List
        </button>
        <button
          onClick={() => router.push(buildUrl({ view: "pipeline" }))}
          className={`px-3 py-1.5 font-medium transition border-l border-zinc-300 dark:border-zinc-700 ${
            view === "pipeline"
              ? "bg-blue-600 text-white"
              : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          }`}
        >
          Pipeline
        </button>
      </div>
    </div>
  );
}
