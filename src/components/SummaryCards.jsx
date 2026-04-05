import {
  Clock,
  Send,
  MessageSquare,
  CalendarCheck,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { getCountByStatus, getDueToday } from "../utils/helpers";

const cards = [
  {
    key: "waiting",
    label: "Waiting",
    icon: Clock,
    accent: "text-amber-400",
    bg: "bg-amber-500/10",
    ring: "ring-amber-500/20",
    glow: "shadow-amber-500/5",
  },
  {
    key: "followed_up",
    label: "Followed Up",
    icon: Send,
    accent: "text-blue-400",
    bg: "bg-blue-500/10",
    ring: "ring-blue-500/20",
    glow: "shadow-blue-500/5",
  },
  {
    key: "responded",
    label: "Responded",
    icon: MessageSquare,
    accent: "text-cyan-400",
    bg: "bg-cyan-500/10",
    ring: "ring-cyan-500/20",
    glow: "shadow-cyan-500/5",
  },
  {
    key: "interview",
    label: "Interview",
    icon: CalendarCheck,
    accent: "text-emerald-400",
    bg: "bg-emerald-500/10",
    ring: "ring-emerald-500/20",
    glow: "shadow-emerald-500/5",
  },
  {
    key: "closed",
    label: "Closed",
    icon: XCircle,
    accent: "text-zinc-500",
    bg: "bg-zinc-500/10",
    ring: "ring-zinc-700/30",
    glow: "",
  },
  {
    key: "due_today",
    label: "Due Today",
    icon: AlertTriangle,
    accent: "text-rose-400",
    bg: "bg-rose-500/10",
    ring: "ring-rose-500/20",
    glow: "shadow-rose-500/5",
  },
];

export default function SummaryCards({ applications }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {cards.map(({ key, label, icon: Icon, accent, bg, ring, glow }) => {
        const count =
          key === "due_today"
            ? getDueToday(applications).length
            : getCountByStatus(applications, key);

        return (
          <div
            key={key}
            className={`group relative rounded-xl border border-zinc-800/50 bg-zinc-900/40 p-4 ring-1 transition-all duration-200 hover:bg-zinc-900/60 ${ring} ${glow}`}
          >
            <div className="flex items-center justify-between">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${bg}`}
              >
                <Icon className={`h-4 w-4 ${accent}`} strokeWidth={1.8} />
              </div>
              <span className="text-2xl font-bold tabular-nums tracking-tight text-zinc-100">
                {count}
              </span>
            </div>
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
              {label}
            </p>
          </div>
        );
      })}
    </div>
  );
}
