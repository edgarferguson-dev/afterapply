import {
  TrendingUp,
  Send,
  Zap,
  Target,
  Activity,
  ChevronRight,
} from "lucide-react";
import { relativeDay, ACTIVITY_TYPE_CONFIG } from "../utils/helpers";

function StatusTicker({ event, index }) {
  const config = ACTIVITY_TYPE_CONFIG[event.type] || ACTIVITY_TYPE_CONFIG.applied;
  
  return (
    <div className="surface-glass px-4 py-2.5 flex items-center gap-3 shrink-0 transition-premium group">
      {/* Event indicator */}
      <div className="relative">
        <div className={`h-2 w-2 rounded-full`} style={{ backgroundColor: config.accent }} />
        <div className={`absolute inset-0 h-2 w-2 rounded-full blur-sm`} style={{ backgroundColor: config.accent, opacity: 0.5 }} />
      </div>
      
      {/* Event content */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-sm font-medium text-primary truncate">
          {event.company}
        </span>
        <ChevronRight className="h-3 w-3 text-tertiary flex-shrink-0" />
        <span className="text-sm text-secondary">
          {event.action}
        </span>
      </div>
      
      {/* Timestamp */}
      <div className="flex items-center gap-1 text-tertiary">
        <Activity className="h-3 w-3" strokeWidth={2} />
        <span className="text-xs font-mono">
          {relativeDay(event.timestamp)}
        </span>
      </div>
      
      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
}

function MetricDisplay({ icon: Icon, label, value, accent, trend }) {
  return (
    <div className="instrument-panel px-4 py-3 flex items-center gap-3 transition-premium group">
      {/* Icon with glow */}
      <div className="relative">
        <Icon className="h-4 w-4" style={{ color: accent }} strokeWidth={2} />
        <div className="absolute inset-0 h-4 w-4 blur-md opacity-50" style={{ color: accent }} />
      </div>
      
      {/* Value */}
      <div className="flex items-baseline gap-2">
        <span className="text-display text-primary">{value}</span>
        <span className="text-xs font-medium uppercase tracking-wider text-tertiary">
          {label}
        </span>
      </div>
      
      {/* Trend indicator */}
      {trend && (
        <div className="ml-auto">
          <TrendingUp className="h-3 w-3 text-emerald-400" strokeWidth={2} />
        </div>
      )}
    </div>
  );
}

export default function ActivityStrip({ stats, activityLog }) {
  return (
    <div className="control-deck p-5 mb-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Metrics dashboard */}
          <div className="flex flex-wrap items-center gap-3">
            <MetricDisplay
              icon={Target}
              label="Active"
              value={stats.activePipeline}
              accent="#34d399"
              trend={stats.activePipeline > 0}
            />
            <MetricDisplay
              icon={Send}
              label="Follow-ups"
              value={stats.followedUp}
              accent="#60a5fa"
            />
            <MetricDisplay
              icon={Zap}
              label="Response Rate"
              value={`${Math.round((stats.responded / stats.total) * 100)}%`}
              accent="#fbbf24"
            />
          </div>
          
          {/* Activity ticker */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            {activityLog.slice(0, 3).map((event, index) => (
              <StatusTicker
                key={`${event.id}-${index}`}
                event={event}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
