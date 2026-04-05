import { Crosshair, Activity } from "lucide-react";

export default function Header({ stats }) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="border-b border-surface-subtle">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-200 ring-1 ring-surface-subtle">
              <Crosshair className="h-5 w-5 text-primary" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-primary sm:text-xl">
                AfterApply
              </h1>
              <p className="text-xs text-tertiary sm:text-sm">
                Follow up before the opportunity goes cold.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {stats && (
              <div className="hidden items-center gap-1.5 rounded-lg bg-surface-100 px-3 py-1.5 ring-1 ring-surface-subtle md:flex">
                <Activity className="h-3.5 w-3.5 text-emerald-400" strokeWidth={2} />
                <span className="text-xs font-medium text-secondary">
                  <span className="text-primary">{stats.activePipeline}</span> active
                </span>
              </div>
            )}
            <time className="text-xs font-medium text-tertiary font-mono tracking-tight">
              {today}
            </time>
          </div>
        </div>
      </div>
    </header>
  );
}
