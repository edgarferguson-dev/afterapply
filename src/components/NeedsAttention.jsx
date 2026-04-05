import {
  AlertTriangle,
  Clock,
  Activity,
  Send,
  Hourglass,
  Archive,
  BookOpen,
  CheckCircle2,
  Inbox,
  Zap,
} from "lucide-react";
import StatusPill from "./StatusPill";
import {
  getDueToday,
  getOverdue,
  getRecentlyUpdated,
  daysFromNow,
  getSuggestedAction,
  relativeDay,
} from "../utils/helpers";

const ACTION_CONFIGS = {
  "Send follow-up": { 
    icon: Send, 
    color: "#f87171", 
    glow: "glow-rose",
    urgency: "critical" 
  },
  "Waiting on reply": { 
    icon: Hourglass, 
    color: "#60a5fa", 
    glow: "glow-blue",
    urgency: "normal" 
  },
  "Archive": { 
    icon: Archive, 
    color: "#9ca3af", 
    glow: "",
    urgency: "low" 
  },
  "Interview prep": { 
    icon: BookOpen, 
    color: "#fbbf24", 
    glow: "glow-amber",
    urgency: "high" 
  },
  "Review": { 
    icon: CheckCircle2, 
    color: "#34d399", 
    glow: "glow-emerald",
    urgency: "normal" 
  },
};

function AlertItem({ app, reasonTag, reasonColor, urgency, actionConfig, priority }) {
  const ActionIcon = actionConfig.icon;
  const isCritical = urgency === "critical";
  const isHigh = urgency === "high";
  
  return (
    <div className={`
      relative overflow-hidden rounded-xl border p-4 transition-all duration-300
      ${isCritical ? 'alert-console glow-rose' : ''}
      ${isHigh ? 'surface-200 border-amber-500/30 glow-amber' : ''}
      ${!isCritical && !isHigh ? 'surface-100 border-arch-subtle' : ''}
      ${priority === 0 ? 'scale-[1.02] shadow-2xl' : ''}
      group hover:scale-[1.01] hover:shadow-xl
    `}>
      {/* Priority glow effect */}
      {isCritical && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent animate-pulse" />
      )}
      
      {/* Alert header */}
      <div className="flex items-start gap-4 relative z-10">
        {/* Alert icon with glow */}
        <div className={`
          relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg
          ${isCritical ? 'bg-red-500/20 border border-red-500/40' : ''}
          ${isHigh ? 'bg-amber-500/20 border border-amber-500/40' : ''}
          ${!isCritical && !isHigh ? 'bg-blue-500/15 border border-blue-500/30' : ''}
        `}>
          <AlertTriangle 
            className={`h-5 w-5 ${isCritical ? 'text-red-400 animate-pulse' : isHigh ? 'text-amber-400' : 'text-blue-400'}`} 
            strokeWidth={2}
          />
          {isCritical && (
            <div className="absolute inset-0 h-10 w-10 rounded-full bg-red-400/20 blur-md animate-pulse" />
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-display text-primary truncate">
              {app.company}
            </span>
            <StatusPill status={app.status} size="sm" />
          </div>
          <p className="text-secondary text-sm mb-3">{app.role}</p>
          
          {/* Action and urgency */}
          <div className="flex items-center justify-between">
            <div className={`
              inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium
              ${isCritical ? 'bg-red-500/20 text-red-300 border border-red-500/30' : ''}
              ${isHigh ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : ''}
              ${!isCritical && !isHigh ? 'bg-blue-500/15 text-blue-300 border border-blue-500/25' : ''}
            `}>
              <ActionIcon className="h-3 w-3" strokeWidth={2} />
              {getSuggestedAction(app, isCritical ? "overdue" : isHigh ? "due_today" : "recent")}
            </div>
            
            {/* Urgency timestamp */}
            <div className={`
              text-xs font-mono font-bold
              ${isCritical ? 'text-red-400' : isHigh ? 'text-amber-400' : 'text-blue-400'}
            `}>
              {reasonTag}
            </div>
          </div>
        </div>
      </div>
      
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
}

function AlertConsoleEmpty() {
  return (
    <div className="surface-100 border-arch-subtle rounded-xl p-6 text-center">
      <div className="flex justify-center mb-4">
        <div className="surface-200 h-12 w-12 rounded-xl flex items-center justify-center border-arch">
          <Inbox className="h-6 w-6 text-emerald-400" strokeWidth={2} />
        </div>
      </div>
      <h3 className="text-display text-primary mb-2">All Clear</h3>
      <p className="text-secondary text-sm">
        No overdue follow-ups, nothing due today, and no recent updates requiring attention.
      </p>
    </div>
  );
}

export default function NeedsAttention({ applications }) {
  const dueToday = getDueToday(applications);
  const overdue = getOverdue(applications);
  const recent = getRecentlyUpdated(applications);

  const seen = new Set();
  const items = [];

  // Critical: Overdue items
  overdue.forEach((app) => {
    if (!seen.has(app.id)) {
      seen.add(app.id);
      const days = Math.abs(daysFromNow(app.nextFollowUpDate));
      items.push({
        app,
        reasonTag: `${days}d overdue`,
        reasonColor: "rose",
        urgency: "critical",
        priority: 0,
        actionConfig: ACTION_CONFIGS["Send follow-up"],
      });
    }
  });

  // High: Due today
  dueToday.forEach((app) => {
    if (!seen.has(app.id)) {
      seen.add(app.id);
      items.push({
        app,
        reasonTag: "Due today",
        reasonColor: "amber",
        urgency: "high",
        priority: 1,
        actionConfig: ACTION_CONFIGS["Interview prep"],
      });
    }
  });

  // Normal: Recent updates
  recent.forEach((app) => {
    if (!seen.has(app.id)) {
      seen.add(app.id);
      items.push({
        app,
        reasonTag: relativeDay(app.lastUpdated),
        reasonColor: "blue",
        urgency: "normal",
        priority: 2,
        actionConfig: ACTION_CONFIGS["Review"],
      });
    }
  });

  const hasAlerts = items.length > 0;
  const hasCritical = overdue.length > 0;
  const hasHigh = dueToday.length > 0;

  return (
    <section className="mb-6">
      {/* Alert console header */}
      <div className="flex items-center gap-3 mb-4">
        {(hasCritical || hasHigh) && (
          <div className="relative">
            <div className={`h-3 w-3 rounded-full ${hasCritical ? 'bg-red-500 animate-pulse' : 'bg-amber-400 animate-pulse'}`} />
            <div className={`absolute inset-0 h-3 w-3 rounded-full ${hasCritical ? 'bg-red-400 blur-md' : 'bg-amber-300 blur-md'} opacity-60 animate-pulse`} />
          </div>
        )}
        <h2 className="text-display text-primary">
          Alert Console
        </h2>
        {hasAlerts && (
          <div className="surface-100 px-2 py-1 rounded-lg">
            <span className="text-sm font-bold text-primary">{items.length}</span>
            <span className="text-xs text-tertiary ml-1">active</span>
          </div>
        )}
      </div>

      {/* Alert items */}
      {hasAlerts ? (
        <div className="space-y-3">
          {items.map(({ app, reasonTag, reasonColor, urgency, priority, actionConfig }) => (
            <AlertItem
              key={app.id}
              app={app}
              reasonTag={reasonTag}
              reasonColor={reasonColor}
              urgency={urgency}
              actionConfig={actionConfig}
              priority={priority}
            />
          ))}
        </div>
      ) : (
        <AlertConsoleEmpty />
      )}
    </section>
  );
}
