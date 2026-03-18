import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function ImportedLeadsPage() {
  return (
    <div className="max-w-xl space-y-6">
      <Link
        href="/leads"
        className="inline-flex items-center text-sm font-medium text-zinc-600 hover:text-zinc-900
                   dark:text-zinc-400 dark:hover:text-white transition-colors"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Leads
      </Link>

      <h1 className="text-2xl font-semibold">Imported Leads</h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Lead import (Facebook, Google, CSV) coming soon.
      </p>
    </div>
  );
}
