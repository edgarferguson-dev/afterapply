import { Loader2 } from "lucide-react";

export default function LoadingApplications() {
  return (
    <div className="panel flex min-h-[min(60vh,28rem)] flex-col items-center justify-center gap-4 rounded-[28px] py-16">
      <Loader2 className="h-9 w-9 animate-spin text-[color:var(--accent-cyan)]" strokeWidth={1.5} />
      <div className="text-center">
        <p className="text-sm font-medium text-[color:var(--text-primary)]">Loading applications...</p>
        <p className="mt-1 text-xs text-[color:var(--text-muted)]">Fetching from your sheet</p>
      </div>
    </div>
  );
}
