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
    <div className="border-b border-zinc-800/40 bg-zinc-900/30">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
          {isPending && (
            <span className="flex items-center gap-2 text-zinc-500">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-400" />
              Connecting to sheet…
            </span>
          )}

          {isMock && (
            <span className="flex items-center gap-2 text-zinc-500">
              <Database className="h-3.5 w-3.5 text-zinc-600" strokeWidth={2} />
              Demo data — set{" "}
              <code className="rounded bg-zinc-800/80 px-1 py-0.5 font-mono text-[10px] text-zinc-400">
                VITE_AFTERAPPLY_APPS_SCRIPT_URL
              </code>{" "}
              for live sync
            </span>
          )}

          {isLive && (
            <span className="flex items-center gap-2 text-zinc-400">
              <Radio className="h-3.5 w-3.5 text-emerald-500" strokeWidth={2} />
              <span className="font-medium text-zinc-300">Live</span>
              {lastSyncedAt && (
                <span className="font-mono text-zinc-500">
                  Last synced {formatSyncedAt(lastSyncedAt)}
                </span>
              )}
              {refreshing && (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-500" />
              )}
            </span>
          )}

          {isFallback && (
            <span className="flex items-center gap-2 text-amber-400/90">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
              <span className="font-medium">Sheet unavailable</span>
              <span className="text-zinc-500">
                Showing demo data{error ? ` — ${error}` : ""}
              </span>
            </span>
          )}
        </div>

        {(isLive || isFallback) && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-1.5 self-start rounded-lg bg-zinc-800/60 px-2.5 py-1.5 text-[11px] font-medium text-zinc-300 ring-1 ring-zinc-700/50 transition-colors hover:bg-zinc-800 hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
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
