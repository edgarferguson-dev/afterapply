import { Loader2, RefreshCw, Radio, Database, AlertCircle } from "lucide-react";

function formatSyncedAt(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function DataSyncStatus({
  dataSource,
  error,
  lastSyncedAt,
  refreshing,
  onRefresh,
}) {
  const isLive = dataSource === "live";
  const isMock = dataSource === "mock";
  const isFallback = dataSource === "fallback";
  const isPending = dataSource === "pending";

  return (
    <div className="mx-auto mb-4 w-full max-w-[84rem] px-4 sm:px-6 lg:px-8">
      <div className="sync-bar flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
          {isPending && (
            <span className="flex items-center gap-2 text-[color:var(--text-secondary)]">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-[color:var(--accent-cyan)]" />
              Connecting to sheet...
            </span>
          )}

          {isMock && (
            <span className="flex flex-col gap-0.5 text-[color:var(--text-secondary)] sm:flex-row sm:items-center sm:gap-2">
              <span className="flex items-center gap-2 font-medium text-[color:var(--text-primary)]">
                <Database className="h-3.5 w-3.5 text-[color:var(--text-muted)]" strokeWidth={2} />
                Demo data
              </span>
              <span className="text-[color:var(--text-muted)] sm:before:mr-2 sm:before:content-['-']">
                Set{" "}
                <code className="mono-meta rounded bg-black/15 px-1 py-0.5 text-[10px] text-[color:var(--text-secondary)]">
                  VITE_AFTERAPPLY_APPS_SCRIPT_URL
                </code>{" "}
                for live sync
              </span>
            </span>
          )}

          {isLive && (
            <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[color:var(--text-secondary)]">
              <Radio className="h-3.5 w-3.5 text-[color:var(--accent-green)]" strokeWidth={2} />
              <span className="font-medium text-[color:var(--text-primary)]">Live data</span>
              {lastSyncedAt && (
                <span className="mono-meta text-[color:var(--text-muted)]">
                  Last synced {formatSyncedAt(lastSyncedAt)}
                </span>
              )}
              {refreshing && (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-[color:var(--text-muted)]" />
              )}
            </span>
          )}

          {isFallback && (
            <span className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-2">
              <span className="flex items-center gap-2 text-[color:var(--accent-amber)]">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                <span className="font-medium">Live data unavailable - showing demo data</span>
              </span>
              {error && (
                <span className="mono-meta text-[11px] text-[color:var(--text-muted)] sm:pl-5">
                  {error}
                </span>
              )}
            </span>
          )}
        </div>

        {(isLive || isFallback) && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            className="surface-button self-start px-3 py-2 text-[11px] uppercase tracking-[0.16em] disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`}
              strokeWidth={2}
            />
            Refresh
          </button>
        )}
      </div>
    </div>
  );
}
