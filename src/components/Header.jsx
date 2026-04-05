import { Crosshair, Activity, ArrowRight } from "lucide-react";

export default function Header({ stats }) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="control-deck px-6 py-6 mb-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Logo and identity */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl surface-200 border-arch-strong">
                <Crosshair className="h-6 w-6 text-primary" strokeWidth={1.5} />
              </div>
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div>
              <h1 className="text-hero mb-1">AfterApply</h1>
              <p className="text-secondary text-sm font-medium">
                Follow up before the opportunity goes cold.
              </p>
            </div>
          </div>

          {/* Control panel */}
          <div className="flex items-center gap-6">
            {stats && (
              <div className="instrument-panel px-4 py-3 flex items-center gap-3">
                <div className="relative">
                  <Activity className="h-4 w-4 text-emerald-400" strokeWidth={2} />
                  <div className="absolute inset-0 h-4 w-4 text-emerald-400 blur-md opacity-50" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-display text-primary">{stats.activePipeline}</span>
                  <span className="text-tertiary text-xs font-medium uppercase tracking-wider">Active</span>
                </div>
              </div>
            )}
            
            <div className="surface-glass px-4 py-3 flex items-center gap-3">
              <ArrowRight className="h-4 w-4 text-tertiary rotate-45" strokeWidth={1.5} />
              <time className="text-tertiary text-sm font-mono tracking-tight">
                {today}
              </time>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
