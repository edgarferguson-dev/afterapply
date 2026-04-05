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
  {
    key: "waiting",
    label: "Waiting",
    icon: Clock,
    accent: "#fbbf24",
    bgGlow: "glow-amber",
    surface: "surface-200",
    priority: 3,
  },
  {
    key: "followed_up",
    label: "Followed Up",
    icon: Send,
    accent: "#60a5fa",
    bgGlow: "glow-blue",
    surface: "surface-200",
    priority: 2,
  },
  {
    key: "responded",
    label: "Responded",
    icon: MessageSquare,
    accent: "#34d399",
    bgGlow: "glow-emerald",
    surface: "surface-200",
    priority: 2,
  },
  {
    key: "interview",
    label: "Interview",
    icon: CalendarCheck,
    accent: "#fbbf24",
    bgGlow: "glow-amber",
    surface: "surface-200",
    priority: 1,
  },
  {
    key: "closed",
    label: "Closed",
    icon: XCircle,
    accent: "#9ca3af",
    bgGlow: "",
    surface: "surface-300",
    priority: 4,
  },
  {
    key: "due_today",
    label: "Due Today",
    icon: AlertTriangle,
    accent: "#f87171",
    bgGlow: "glow-rose",
    surface: "surface-200",
    priority: 0,
  },
];

function InstrumentGauge({ config, count, isPriority }) {
  const Icon = config.icon;
  
  return (
    <div className={`instrument-panel p-4 transition-premium ${isPriority ? config.bgGlow : ''} relative overflow-hidden group`}>
      {/* Priority indicator */}
      {isPriority && (
        <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-400 animate-pulse" />
      )}
      
      {/* Gauge display */}
      <div className="flex flex-col items-center gap-3">
        {/* Icon with glow */}
        <div className="relative">
          <div className={`h-10 w-10 rounded-xl ${config.surface} border-arch flex items-center justify-center`}>
            <Icon 
              className="h-5 w-5" 
              style={{ color: config.accent }} 
              strokeWidth={2}
            />
          </div>
          {isPriority && (
            <div className="absolute inset-0 h-10 w-10 rounded-xl" style={{ boxShadow: `0 0 20px ${config.accent}40` }} />
          )}
        </div>
        
        {/* Metric */}
        <div className="text-center">
          <div className={`text-3xl font-bold tabular-nums tracking-tight text-primary ${isPriority ? 'animate-pulse' : ''}`}>
            {count}
          </div>
          <div className="text-xs font-medium uppercase tracking-wider text-tertiary mt-1">
            {config.label}
          </div>
        </div>
      </div>
      
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
}

export default function SummaryCards({ applications }) {
  // Sort by priority
  const sortedConfigs = [...instrumentConfigs].sort((a, b) => a.priority - b.priority);
  
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 mb-6">
      {sortedConfigs.map((config) => {
        const count =
          config.key === "due_today"
            ? getDueToday(applications).length
            : getCountByStatus(applications, config.key);
        
        const isPriority = config.key === "due_today" && count > 0;
        
        return (
          <InstrumentGauge
            key={config.key}
            config={config}
            count={count}
            isPriority={isPriority}
          />
        );
      })}
    </div>
  );
}
