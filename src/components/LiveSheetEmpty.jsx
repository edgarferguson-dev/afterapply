import { Inbox } from "lucide-react";

export default function LiveSheetEmpty() {
  return (
    <div className="panel-soft flex items-start gap-3 rounded-[22px] px-4 py-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-black/10">
        <Inbox className="h-4 w-4 text-[color:var(--text-muted)]" strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-sm font-medium text-[color:var(--text-primary)]">No rows in your sheet yet</p>
        <p className="mt-0.5 text-xs leading-5 text-[color:var(--text-secondary)]">
          Add a row under the header in the Applications tab, or confirm the web app points at the
          correct spreadsheet. Metrics below stay at zero until data exists.
        </p>
      </div>
    </div>
  );
}
