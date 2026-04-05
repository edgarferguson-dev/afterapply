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
    <div className="flex items-center gap-2.5 rounded-lg bg-zinc-900/50 px-3 py-2 ring-1 ring-zinc-800/50">
      <Icon className={`h-3.5 w-3.5 ${accent}`} strokeWidth={2} />
      <div className="flex items-baseline gap-1.5">
        <span className="text-sm font-bold tabular-nums text-zinc-100">
          {value}
        </span>
        <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
          {label}
        </span>
      </div>
    </div>
  );
}

function ActivityEvent({ event }) {
  const config = ACTIVITY_TYPE_CONFIG[event.type] || ACTIVITY_TYPE_CONFIG.applied;

  return (
    <div className="flex items-center gap-2.5 shrink-0 rounded-lg bg-zinc-900/30 px-3 py-2 ring-1 ring-zinc-800/30">
      <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${config.color.replace("text-", "bg-")}`} />
      <span className="text-xs text-zinc-400 whitespace-nowrap">
        <span className="font-medium text-zinc-300">{event.company}</span>
        <span className="mx-1.5 text-zinc-600">·</span>
        {event.action}
      </span>
      <span className="text-[10px] font-mono text-zinc-600 whitespace-nowrap">
        {relativeDay(event.timestamp)}
      </span>
    </div>
  );
}

export default function ActivityStrip({ stats, activityLog }) {
  return (
    <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/20 p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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
