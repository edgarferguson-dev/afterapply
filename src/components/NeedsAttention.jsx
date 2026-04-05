import {
  AlertTriangle,
  Send,
  Hourglass,
  Archive,
  BookOpen,
  CheckCircle2,
  Inbox,
  ArrowUpRight,
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
  "Send follow-up": { icon: Send, color: "var(--accent-coral)", urgency: "critical" },
  "Waiting on reply": { icon: Hourglass, color: "var(--accent-blue)", urgency: "normal" },
  Archive: { icon: Archive, color: "var(--text-muted)", urgency: "low" },
  "Interview prep": { icon: BookOpen, color: "var(--accent-amber)", urgency: "high" },
  Review: { icon: CheckCircle2, color: "var(--accent-green)", urgency: "normal" },
};

function AttentionSummary({ counts }) {
  return (
    <div className="grid grid-cols-3 gap-2 rounded-[20px] border border-white/6 bg-black/10 p-3">
      <div>
        <p className="mini-kicker">Overdue</p>
        <p className="mt-2 text-xl font-semibold tracking-[-0.06em] text-[color:var(--text-primary)]">
          {counts.overdue}
        </p>
      </div>
      <div>
        <p className="mini-kicker">Due now</p>
        <p className="mt-2 text-xl font-semibold tracking-[-0.06em] text-[color:var(--text-primary)]">
          {counts.today}
        </p>
      </div>
      <div>
        <p className="mini-kicker">Fresh</p>
        <p className="mt-2 text-xl font-semibold tracking-[-0.06em] text-[color:var(--text-primary)]">
          {counts.recent}
        </p>
      </div>
    </div>
  );
}

function AlertItem({ app, reasonTag, urgency, actionConfig, priority }) {
  const ActionIcon = actionConfig.icon;

  return (
    <article className="attention-item p-4" data-urgency={urgency}>
      <div className="flex items-start gap-3">
        <div
          className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045]"
          style={{ color: actionConfig.color }}
        >
          <AlertTriangle className="h-4.5 w-4.5" strokeWidth={1.8} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate text-[15px] font-semibold tracking-[-0.02em] text-[color:var(--text-primary)]">
                  {app.company}
                </h3>
                <StatusPill status={app.status} size="xs" />
              </div>
              <p className="mt-1 truncate text-sm text-[color:var(--text-secondary)]">{app.role}</p>
            </div>
            <span
              className="mono-meta rounded-full border border-white/8 bg-black/10 px-2.5 py-1 text-[11px]"
              style={{ color: actionConfig.color }}
            >
              {reasonTag}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <span
              className="inline-flex items-center gap-2 rounded-full border border-white/8 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em]"
              style={{ color: actionConfig.color, background: "rgba(255,255,255,0.03)" }}
            >
              <ActionIcon className="h-3.5 w-3.5" strokeWidth={1.9} />
              {getSuggestedAction(
                app,
                urgency === "critical" ? "overdue" : urgency === "high" ? "due_today" : "recent",
              )}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-[color:var(--text-muted)]">
              Queue {priority + 1}
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.8} />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

function AlertConsoleEmpty() {
  return (
    <div className="rounded-[22px] border border-white/6 bg-black/10 px-5 py-7 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
        <Inbox className="h-5 w-5 text-[color:var(--accent-green)]" strokeWidth={1.8} />
      </div>
      <h3 className="mt-4 text-base font-semibold tracking-[-0.03em] text-[color:var(--text-primary)]">
        Attention is clear
      </h3>
      <p className="mt-2 text-sm leading-6 text-[color:var(--text-secondary)]">
        No overdue follow-ups, nothing due today, and no recent changes pushing work back into focus.
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

  overdue.forEach((app) => {
    if (!seen.has(app.id)) {
      seen.add(app.id);
      const days = Math.abs(daysFromNow(app.nextFollowUpDate));
      items.push({
        app,
        reasonTag: `${days}d overdue`,
        urgency: "critical",
        priority: 0,
        actionConfig: ACTION_CONFIGS["Send follow-up"],
      });
    }
  });

  dueToday.forEach((app) => {
    if (!seen.has(app.id)) {
      seen.add(app.id);
      items.push({
        app,
        reasonTag: "Due today",
        urgency: "high",
        priority: 1,
        actionConfig: ACTION_CONFIGS["Interview prep"],
      });
    }
  });

  recent.forEach((app) => {
    if (!seen.has(app.id)) {
      seen.add(app.id);
      items.push({
        app,
        reasonTag: relativeDay(app.lastUpdated),
        urgency: "normal",
        priority: 2,
        actionConfig: ACTION_CONFIGS.Review,
      });
    }
  });

  const hasAlerts = items.length > 0;
  const hasCritical = overdue.length > 0;
  const headline = hasCritical
    ? "Follow-up timing is slipping."
    : hasAlerts
      ? "A few conversations need a decision."
      : "Everything that matters is under control.";

  return (
    <section className="attention-panel self-start px-4 py-4 sm:px-5 sm:py-5 xl:sticky xl:top-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="section-label">Needs attention</p>
          <h2 className="mt-2 text-xl font-semibold tracking-[-0.05em] text-[color:var(--text-primary)]">
            {headline}
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[color:var(--text-secondary)]">
            Urgency is concentrated here so the rest of the dashboard can stay calm.
          </p>
        </div>
        {hasAlerts && (
          <div className="animate-soft-pulse inline-flex h-10 min-w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-3 text-sm font-semibold text-[color:var(--text-primary)]">
            {items.length}
          </div>
        )}
      </div>

      <div className="mt-4 space-y-4">
        <AttentionSummary
          counts={{ overdue: overdue.length, today: dueToday.length, recent: recent.length }}
        />

        {hasAlerts ? (
          <div className="space-y-2.5">
            {items.map(({ app, reasonTag, urgency, priority, actionConfig }) => (
              <AlertItem
                key={app.id}
                app={app}
                reasonTag={reasonTag}
                urgency={urgency}
                actionConfig={actionConfig}
                priority={priority}
              />
            ))}
          </div>
        ) : (
          <AlertConsoleEmpty />
        )}
      </div>
    </section>
  );
}
