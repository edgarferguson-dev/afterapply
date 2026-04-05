import {
  Clock,
  Send,
  MessageSquare,
  CalendarCheck,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { getCountByStatus, getDueToday } from "../utils/helpers";

const instrumentConfigs = [
  { key: "waiting", label: "Waiting", icon: Clock, accent: "var(--accent-blue)" },
  { key: "followed_up", label: "Followed Up", icon: Send, accent: "var(--accent-cyan)" },
  { key: "responded", label: "Responded", icon: MessageSquare, accent: "var(--accent-green)" },
  { key: "interview", label: "Interview", icon: CalendarCheck, accent: "var(--accent-amber)" },
  { key: "closed", label: "Closed", icon: XCircle, accent: "var(--text-muted)" },
  { key: "due_today", label: "Due Today", icon: AlertTriangle, accent: "var(--accent-amber)" },
];

function InstrumentGauge({ config, count, emphasis }) {
  const Icon = config.icon;

  return (
    <div
      className={`rounded-[22px] border px-4 py-4 ${
        emphasis
          ? "border-white/12 bg-white/[0.065]"
          : "border-white/[0.06] bg-white/[0.03]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="mini-kicker">{config.label}</p>
          <p className="mt-3 text-[1.7rem] font-semibold leading-none tracking-[-0.06em] text-[color:var(--text-primary)]">
            {count}
          </p>
        </div>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-black/10"
          style={{ color: config.accent }}
        >
          <Icon className="h-4.5 w-4.5" strokeWidth={1.8} />
        </div>
      </div>
      <div className="mt-4 h-px bg-white/[0.06]" />
      <p className="mt-3 text-xs leading-5 text-[color:var(--text-secondary)]">
        {emphasis
          ? "Immediate follow-up pressure is present today."
          : "A compact read on where the pipeline is sitting right now."}
      </p>
    </div>
  );
}

export default function SummaryCards({ applications, stats }) {
  return (
    <section className="panel rounded-[28px] px-4 py-4 sm:px-5">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="section-label">Pipeline snapshot</p>
          <h2 className="mt-2 text-lg font-semibold tracking-[-0.04em] text-[color:var(--text-primary)]">
            Compact metrics, organized for quick scanning.
          </h2>
        </div>
        <div className="hidden rounded-full border border-white/8 bg-white/[0.04] px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-muted)] sm:block">
          {stats?.total ?? applications.length} applications tracked
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
        {instrumentConfigs.map((config) => {
          const count =
            config.key === "due_today"
              ? getDueToday(applications).length
              : getCountByStatus(applications, config.key);

          return (
            <InstrumentGauge
              key={config.key}
              config={config}
              count={count}
              emphasis={config.key === "due_today" && count > 0}
            />
          );
        })}
      </div>
    </section>
  );
}
