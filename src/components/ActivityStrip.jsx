import {
  TrendingUp,
  Send,
  Zap,
  Target,
  ArrowRight,
} from "lucide-react";
import { relativeDay, ACTIVITY_TYPE_CONFIG } from "../utils/helpers";

function StatBlock({ icon: Icon, label, value, accent }) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg bg-surface-100 px-3 py-2 ring-1 ring-surface-subtle">
      <Icon className={`h-3.5 w-3.5 ${accent}`} strokeWidth={2} />
      <div className="flex items-baseline gap-1.5">
        <span className="text-sm font-bold tabular-nums text-primary">
          {value}
        </span>
        <span className="text-[10px] font-medium uppercase tracking-wider text-tertiary">
          {label}
        </span>
      </div>
    </div>
  );
}

function ActivityEvent({ event }) {
  const config = ACTIVITY_TYPE_CONFIG[event.type] || ACTIVITY_TYPE_CONFIG.applied;

  return (
    <div className="flex items-center gap-2.5 shrink-0 rounded-lg bg-surface-50 px-3 py-2 ring-1 ring-surface-subtle">
      <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${config.color.replace("text-", "bg-")}`} />
      <span className="text-xs text-secondary whitespace-nowrap">
        <span className="font-medium text-primary">{event.company}</span>
        <span className="mx-1.5 text-tertiary">·</span>
        {event.action}
      </span>
      <span className="text-[10px] font-mono text-tertiary whitespace-nowrap">
        {relativeDay(event.timestamp)}
      </span>
    </div>
  );
}

export default function ActivityStrip({ stats, activityLog }) {
  return (
    <div className="rounded-xl border border-surface-subtle bg-surface-50 p-3.5">
      <div className="flex flex-col gap-3.5 lg:flex-row lg:items-center lg:justify-between">
        {/* Quick stats */}
        <div className="flex flex-wrap items-center gap-2">
          <StatBlock
            icon={Target}
            label="Active"
            value={stats.activePipeline}
            accent="text-emerald-400"
          />
          <StatBlock
            icon={Send}
            label="This week"
            value={stats.appliedThisWeek}
            accent="text-blue-400"
          />
          <StatBlock
            icon={TrendingUp}
            label="Response"
            value={`${stats.responseRate}%`}
            accent="text-cyan-400"
          />
          <StatBlock
            icon={Zap}
            label={stats.interviewCount === 1 ? "Interview" : "Interviews"}
            value={stats.interviewCount}
            accent="text-violet-400"
          />
        </div>

        {/* Divider on large screens */}
        <div className="hidden lg:block h-8 w-px bg-zinc-800/60" />

        {/* Activity feed */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none -mx-1 px-1">
          <div className="flex items-center gap-1 shrink-0 mr-1">
            <ArrowRight className="h-3 w-3 text-zinc-600" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 whitespace-nowrap">
              Recent
            </span>
          </div>
          {activityLog.length === 0 ? (
            <span className="text-xs text-zinc-600 whitespace-nowrap py-2">
              No recent activity in sheet
            </span>
          ) : (
            activityLog.slice(0, 4).map((event) => (
              <ActivityEvent key={event.id} event={event} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
