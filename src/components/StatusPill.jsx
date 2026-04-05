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

  return (
    <span className="status-pill whitespace-nowrap" data-status={status} data-size={size}>
      <Icon className="h-3 w-3" strokeWidth={2} />
      {config.label}
    </span>
  );
}
