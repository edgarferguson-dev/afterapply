import { ExternalLink, ArrowUpDown, CornerUpRight } from "lucide-react";
import { useState } from "react";
import StatusPill from "./StatusPill";
import { daysFromNow, formatDate, relativeDay } from "../utils/helpers";

const STATUS_ORDER = {
  interview: 0,
  responded: 1,
  followed_up: 2,
  waiting: 3,
  closed: 4,
};

function getScheduleState(app) {
  if (app.status === "closed") return "closed";
  if (app.nextFollowUpDate) {
    const diff = daysFromNow(app.nextFollowUpDate);
    if (diff < 0) return "overdue";
    if (diff === 0) return "due_today";
  }
  if (app.status === "interview") return "interview";
  if (app.status === "responded") return "responded";
  return "waiting";
}

function ScheduleBadge({ app }) {
  const state = getScheduleState(app);
  const labelMap = {
    overdue: `${Math.abs(daysFromNow(app.nextFollowUpDate))}d overdue`,
    due_today: "Due today",
    waiting: app.nextFollowUpDate
      ? `Follow up ${relativeDay(app.nextFollowUpDate).toLowerCase()}`
      : "Awaiting next step",
    interview: "Interview lane",
    responded: "Recent reply",
    closed: "Closed out",
  };

  return (
    <span className="status-pill" data-state={state}>
      {labelMap[state]}
    </span>
  );
}

function LedgerRow({ app, isPriority = false }) {
  return (
    <article
      className="ledger-row px-5 sm:grid-cols-[minmax(0,2.1fr)_minmax(9rem,0.85fr)_minmax(10rem,0.95fr)_minmax(8.5rem,0.8fr)_minmax(7rem,0.6fr)] sm:items-center"
      data-priority={isPriority}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-[15px] font-semibold tracking-[-0.025em] text-[color:var(--text-primary)]">
            {app.company}
          </h3>
          <StatusPill status={app.status} size="xs" />
        </div>
        <p className="mt-1 truncate text-sm text-[color:var(--text-secondary)]">{app.role}</p>
      </div>

      <div>
        <p className="mini-kicker">Follow-up</p>
        <div className="mt-2">
          <ScheduleBadge app={app} />
        </div>
      </div>

      <div>
        <p className="mini-kicker">Timeline</p>
        <div className="mt-2 space-y-1">
          <p className="text-sm text-[color:var(--text-primary)]">{formatDate(app.dateApplied)}</p>
          <p className="mono-meta text-xs text-[color:var(--text-muted)]">
            Updated {relativeDay(app.lastUpdated)}
          </p>
        </div>
      </div>

      <div>
        <p className="mini-kicker">Case</p>
        <p className="mono-meta mt-2 text-sm text-[color:var(--text-secondary)]">{app.caseCode}</p>
      </div>

      <div className="flex items-center sm:justify-end">
        <a
          href={app.jobLink}
          target="_blank"
          rel="noopener noreferrer"
          className="surface-button px-3 py-2 text-[11px] uppercase tracking-[0.16em]"
        >
          Listing
          <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.8} />
        </a>
      </div>
    </article>
  );
}

function DataSurface({ applications, sortBy, setSortBy }) {
  const sorted = [...applications].sort((a, b) => {
    if (sortBy === "lastUpdated") {
      return new Date(b.lastUpdated) - new Date(a.lastUpdated);
    }
    if (sortBy === "status") {
      return (STATUS_ORDER[a.status] ?? 5) - (STATUS_ORDER[b.status] ?? 5);
    }
    if (sortBy === "dateApplied") {
      return new Date(b.dateApplied) - new Date(a.dateApplied);
    }
    return 0;
  });

  return (
    <div className="ledger-shell overflow-hidden px-4 py-4 sm:px-5">
      <div className="ledger-head flex flex-col gap-4 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-label">Applications</p>
          <h2 className="mt-2 text-xl font-semibold tracking-[-0.05em] text-[color:var(--text-primary)]">
            A refined ledger for scanning status, timing, and context.
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[color:var(--text-secondary)]">
            The hierarchy now comes from rhythm and contrast instead of card chrome, so each application reads like part of one coherent operating layer.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-2 text-sm text-[color:var(--text-secondary)]">
            <span className="font-semibold text-[color:var(--text-primary)]">{applications.length}</span>{" "}
            tracked
          </div>
          <div className="flex items-center gap-1 rounded-full border border-white/8 bg-white/[0.03] p-1">
            <span className="inline-flex items-center gap-2 px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-[color:var(--text-muted)]">
              <ArrowUpDown className="h-3.5 w-3.5" strokeWidth={1.8} />
              Sort
            </span>
            {["lastUpdated", "dateApplied", "status"].map((key) => (
              <button
                key={key}
                onClick={() => setSortBy(key)}
                className="surface-button px-3 py-2 text-[11px] uppercase tracking-[0.16em]"
                data-active={sortBy === key ? "true" : "false"}
              >
                {key === "lastUpdated" ? "Recent" : key === "dateApplied" ? "Applied" : "State"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-[22px] border border-dashed border-white/10 bg-black/10 px-5 py-14 text-center">
          <CornerUpRight className="mx-auto h-10 w-10 text-[color:var(--text-muted)]" strokeWidth={1.6} />
          <h3 className="mt-4 text-lg font-semibold tracking-[-0.04em] text-[color:var(--text-primary)]">
            No applications yet
          </h3>
          <p className="mt-2 text-sm text-[color:var(--text-secondary)]">
            Once your sheet is connected, this ledger becomes the steady operating view for the entire pipeline.
          </p>
        </div>
      ) : (
        <div className="pt-2">
          <div className="hidden grid-cols-[minmax(0,2.1fr)_minmax(9rem,0.85fr)_minmax(10rem,0.95fr)_minmax(8.5rem,0.8fr)_minmax(7rem,0.6fr)] gap-4 px-5 pb-3 text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-muted)] sm:grid">
            <span>Application</span>
            <span>Next action</span>
            <span>Timeline</span>
            <span>Case code</span>
            <span className="text-right">Listing</span>
          </div>
          <div>
            {sorted.map((app) => (
              <LedgerRow
                key={app.id}
                app={app}
                isPriority={app.status === "interview"}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ApplicationList({ applications }) {
  const [sortBy, setSortBy] = useState("lastUpdated");

  return (
    <section>
      <DataSurface
        applications={applications}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
    </section>
  );
}
