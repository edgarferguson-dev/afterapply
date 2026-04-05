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

const ACTION_ICONS = {
  "Send follow-up": Send,
  "Waiting on reply": Hourglass,
  "Archive": Archive,
  "Interview prep": BookOpen,
  "Review": CheckCircle2,
};

const ACTION_STYLES = {
  "Send follow-up": "bg-amber-500/10 text-amber-400 ring-amber-500/20",
  "Waiting on reply": "bg-blue-500/10 text-blue-400 ring-blue-500/20",
  "Archive": "bg-zinc-500/10 text-zinc-400 ring-zinc-500/20",
  "Interview prep": "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
  "Review": "bg-cyan-500/10 text-cyan-400 ring-cyan-500/20",
};

function AttentionItem({ app, reasonTag, reasonColor, icon: Icon, actionLabel }) {
  const ActionIcon = ACTION_ICONS[actionLabel] || CheckCircle2;
  const actionStyle = ACTION_STYLES[actionLabel] || ACTION_STYLES["Review"];

  return (
    <div className="group flex items-center gap-3 rounded-xl border border-zinc-800/40 bg-zinc-900/30 px-4 py-3 transition-all duration-150 hover:bg-zinc-800/30 hover:border-zinc-700/40 sm:gap-4">
      {/* Priority icon */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
          reasonColor === "rose"
            ? "bg-rose-500/10"
            : reasonColor === "amber"
            ? "bg-amber-500/10"
            : "bg-cyan-500/10"
        }`}
      >
        <Icon
          className={`h-4 w-4 ${
            reasonColor === "rose"
              ? "text-rose-400"
              : reasonColor === "amber"
              ? "text-amber-400"
              : "text-cyan-400"
          }`}
          strokeWidth={1.8}
        />
      </div>

      {/* Main info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-zinc-200 text-sm truncate">
            {app.company}
          </span>
          <StatusPill status={app.status} size="xs" />
        </div>
        <p className="truncate text-xs text-zinc-500 mt-0.5">{app.role}</p>
      </div>

      {/* Action label */}
      <div
        className={`hidden sm:flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset whitespace-nowrap ${actionStyle}`}
      >
        <ActionIcon className="h-3 w-3" strokeWidth={2} />
        {actionLabel}
      </div>

      {/* Reason tag */}
      <div className="shrink-0 text-right">
        <span
          className={`text-[11px] font-mono whitespace-nowrap ${
            reasonColor === "rose"
              ? "text-rose-400/80"
              : reasonColor === "amber"
              ? "text-amber-400/80"
              : "text-cyan-400/80"
          }`}
        >
          {reasonTag}
        </span>
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, description, accent }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-dashed border-zinc-800/50 bg-zinc-900/20 px-4 py-4">
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800/30`}>
        <Icon className={`h-4 w-4 ${accent}`} strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-sm font-medium text-zinc-500">{title}</p>
        <p className="text-xs text-zinc-600 mt-0.5">{description}</p>
      </div>
    </div>
  );
}

export default function NeedsAttention({ applications }) {
  const dueToday = getDueToday(applications);
  const overdue = getOverdue(applications);
  const recent = getRecentlyUpdated(applications);

  const seen = new Set();
  const items = [];

  overdue.forEach((app) => {
    if (!seen.has(app.id)) {
      seen.add(app.id);
      const days = Math.abs(daysFromNow(app.nextFollowUpDate));
      items.push({
        app,
        reasonTag: `${days}d overdue`,
        reasonColor: "rose",
        icon: AlertTriangle,
        priority: 0,
        actionLabel: getSuggestedAction(app, "overdue"),
      });
    }
  });

  dueToday.forEach((app) => {
    if (!seen.has(app.id)) {
      seen.add(app.id);
      items.push({
        app,
        reasonTag: "Due today",
        reasonColor: "amber",
        icon: Clock,
        priority: 1,
        actionLabel: getSuggestedAction(app, "due_today"),
      });
    }
  });

  recent.forEach((app) => {
    if (!seen.has(app.id)) {
      seen.add(app.id);
      items.push({
        app,
        reasonTag: relativeDay(app.lastUpdated),
        reasonColor: "cyan",
        icon: Activity,
        priority: 2,
        actionLabel: getSuggestedAction(app, "recent"),
      });
    }
  });

  items.sort((a, b) => a.priority - b.priority);

  const hasOverdue = overdue.length > 0;
  const hasDueToday = dueToday.length > 0;
  const hasRecent = recent.length > 0;
  const hasNothing = !hasOverdue && !hasDueToday && !hasRecent;

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        {(hasOverdue || hasDueToday) && (
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
          </span>
        )}
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
          Needs Attention
        </h2>
        {items.length > 0 && (
          <span className="text-[10px] font-mono text-zinc-600">
            {items.length}
          </span>
        )}
      </div>

      {hasNothing ? (
        <EmptyState
          icon={Inbox}
          title="All clear"
          description="No overdue follow-ups, nothing due today, and no recent updates."
          accent="text-emerald-500/60"
        />
      ) : (
        <div className="space-y-2">
          {items.map(({ app, reasonTag, reasonColor, icon, actionLabel }) => (
            <AttentionItem
              key={app.id}
              app={app}
              reasonTag={reasonTag}
              reasonColor={reasonColor}
              icon={icon}
              actionLabel={actionLabel}
            />
          ))}
        </div>
      )}
    </section>
  );
}
