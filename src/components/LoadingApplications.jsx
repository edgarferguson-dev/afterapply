import { Loader2 } from "lucide-react";

export default function LoadingApplications() {
  return (
    <div className="flex min-h-[min(60vh,28rem)] flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-zinc-800/50 bg-zinc-900/20 py-16">
      <Loader2 className="h-9 w-9 animate-spin text-zinc-500" strokeWidth={1.5} />
      <div className="text-center">
        <p className="text-sm font-medium text-zinc-400">Loading applications…</p>
        <p className="mt-1 text-xs text-zinc-600">Fetching from your sheet</p>
      </div>
    </div>
  );
}
