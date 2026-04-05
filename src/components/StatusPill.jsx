import { CheckCircle2, Clock, Send, MessageSquare, CalendarCheck, XCircle } from "lucide-react";
import { STATUS_CONFIG } from "../utils/helpers";

const STATUS_ICONS = {
  waiting: Clock,
  followed_up: Send,
  responded: MessageSquare,
  interview: CalendarCheck,
  closed: XCircle,
};

export default function StatusPill({ status, size = "sm" }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.waiting;
  const Icon = STATUS_ICONS[status] || CheckCircle2;
  
  const sizing = size === "xs" ? "px-2 py-1 text-[10px]" : "px-3 py-1.5 text-xs";
  
  return (
    <span className={`
      inline-flex items-center gap-1.5 rounded-lg font-medium whitespace-nowrap transition-premium
      ${sizing} state-${status}
    `}>
      <Icon className="h-3 w-3" strokeWidth={2} />
      {config.label}
    </span>
  );
}
