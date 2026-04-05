import { TrendingUp, Send, Zap, Target, Dot } from "lucide-react";
import { relativeDay, ACTIVITY_TYPE_CONFIG } from "../utils/helpers";

function StatusTicker({ event }) {
  const config = ACTIVITY_TYPE_CONFIG[event.type] || ACTIVITY_TYPE_CONFIG.applied;

  return (
    <div className="shrink-0 rounded-full border border-white/[0.07] bg-white/[0.035] px-3.5 py-2 text-sm text-[color:var(--text-secondary)]">
      <span className="font-medium text-[color:var(--text-primary)]">{event.company}</span>
      <Dot className="mx-0.5 inline h-4 w-4 align-middle text-[color:var(--text-muted)]" />
      <span>{event.action}</span>
      <span className="ml-2 mono-meta text-[11px]" style={{ color: config.accent }}>
        {relativeDay(event.timestamp)}
      </span>
    </div>
  );
}

function MetricDisplay({ icon: Icon, label, value, accent, trend }) {
  return (
    <div className="rounded-full border border-white/[0.07] bg-white/[0.035] px-3 py-2.5">
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4" style={{ color: accent }} strokeWidth={2} />
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold text-[color:var(--text-primary)]">{value}</span>
          <span className="text-[11px] uppercase tracking-[0.16em] text-[color:var(--text-muted)]">
            {label}
          </span>
        </div>
        {trend && (
          <TrendingUp className="ml-auto h-3.5 w-3.5 text-[color:var(--accent-green)]" strokeWidth={2} />
        )}
      </div>
    </div>
  );
}

export default function ActivityStrip({ stats, activityLog }) {
  return (
    <section className="panel rounded-[28px] px-4 py-4 sm:px-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="section-label">Recent movement</p>
            <h2 className="mt-2 text-base font-semibold tracking-[-0.04em] text-[color:var(--text-primary)]">
              Activity stays visible without turning into a ticker tape spectacle.
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <MetricDisplay
              icon={Target}
              label="Active"
              value={stats.activePipeline}
              accent="var(--accent-blue)"
              trend={stats.activePipeline > 0}
            />
            <MetricDisplay
              icon={Send}
              label="Follow-ups"
              value={stats.followedUp}
              accent="var(--accent-cyan)"
            />
            <MetricDisplay
              icon={Zap}
              label="Response"
              value={`${stats.responseRate}%`}
              accent="var(--accent-amber)"
            />
          </div>
        </div>

        <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
          {activityLog.slice(0, 6).map((event, index) => (
            <StatusTicker key={`${event.id}-${index}`} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}
