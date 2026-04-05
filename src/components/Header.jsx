import { Crosshair, Activity } from "lucide-react";

export default function Header({ stats }) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="border-b border-zinc-800/50">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800/80 ring-1 ring-zinc-700/60">
              <Crosshair className="h-5 w-5 text-zinc-300" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-zinc-50 sm:text-xl">
                AfterApply
              </h1>
              <p className="text-xs text-zinc-500 sm:text-sm">
                Follow up before the opportunity goes cold.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {stats && (
              <div className="hidden items-center gap-1.5 rounded-lg bg-zinc-800/40 px-3 py-1.5 ring-1 ring-zinc-700/30 md:flex">
                <Activity className="h-3.5 w-3.5 text-emerald-400" strokeWidth={2} />
                <span className="text-xs font-medium text-zinc-400">
                  <span className="text-zinc-200">{stats.activePipeline}</span> active
                </span>
              </div>
            )}
            <time className="text-xs font-medium text-zinc-500 font-mono tracking-tight">
              {today}
            </time>
          </div>
        </div>
      </div>
    </header>
  );
}
