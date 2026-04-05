import { Inbox } from "lucide-react";

/** Shown when the live sheet returns successfully but zero application rows. */
export default function LiveSheetEmpty() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-zinc-800/50 bg-zinc-900/25 px-4 py-3 ring-1 ring-zinc-800/30">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800/40">
        <Inbox className="h-4 w-4 text-zinc-500" strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-sm font-medium text-zinc-400">No rows in your sheet yet</p>
        <p className="mt-0.5 text-xs text-zinc-600">
          Add a row under the header in the Applications tab, or confirm the web app points at the
          correct spreadsheet. Metrics below stay at zero until data exists.
        </p>
      </div>
    </div>
  );
}
