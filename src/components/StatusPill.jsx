import { STATUS_CONFIG } from "../utils/helpers";

export default function StatusPill({ status, size = "sm" }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.waiting;
  const sizing =
    size === "xs"
      ? "px-1.5 py-0.5 text-[10px]"
      : "px-2.5 py-0.5 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ring-1 ring-inset whitespace-nowrap ${sizing} ${config.color}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
