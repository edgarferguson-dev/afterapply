export const STATUS_CONFIG = {
  waiting: {
    label: "Waiting",
    variant: "waiting",
  },
  followed_up: {
    label: "Followed Up",
    variant: "followed_up",
  },
  responded: {
    label: "Responded",
    variant: "responded",
  },
  interview: {
    label: "Interview",
    variant: "interview",
  },
  closed: {
    label: "Closed",
    variant: "closed",
  },
};

export const ACTIVITY_TYPE_CONFIG = {
  milestone: { color: "text-emerald-400", bg: "bg-emerald-500/10", accent: "#6dd6ae" },
  follow_up: { color: "text-blue-400", bg: "bg-blue-500/10", accent: "#69a9ff" },
  response: { color: "text-cyan-400", bg: "bg-cyan-500/10", accent: "#73dfff" },
  signal: { color: "text-violet-400", bg: "bg-violet-500/10", accent: "#9ab6ff" },
  applied: { color: "text-zinc-400", bg: "bg-zinc-500/10", accent: "#a7b1bd" },
};

export function formatDate(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateShort(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function relativeDay(dateStr) {
  if (!dateStr) return "-";
  const diff = daysFromNow(dateStr);
  if (Number.isNaN(diff)) return "-";
  if (diff === 0) return "Today";
  if (diff === -1) return "Yesterday";
  if (diff === 1) return "Tomorrow";
  if (diff < 0) return `${Math.abs(diff)}d ago`;
  return `in ${diff}d`;
}

export function daysFromNow(dateStr) {
  if (!dateStr) return Number.NaN;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(target.getTime())) return Number.NaN;
  target.setHours(0, 0, 0, 0);
  return Math.round((target - today) / (1000 * 60 * 60 * 24));
}

export function isToday(dateStr) {
  return daysFromNow(dateStr) === 0;
}

export function isOverdue(dateStr) {
  return daysFromNow(dateStr) < 0;
}

export function getCountByStatus(applications, status) {
  return applications.filter((app) => app.status === status).length;
}

export function getDueToday(applications) {
  return applications.filter(
    (app) =>
      app.nextFollowUpDate &&
      isToday(app.nextFollowUpDate) &&
      app.status !== "closed",
  );
}

export function getOverdue(applications) {
  return applications.filter(
    (app) =>
      app.nextFollowUpDate &&
      isOverdue(app.nextFollowUpDate) &&
      app.status !== "closed",
  );
}

export function getRecentlyUpdated(applications) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 2);
  cutoff.setHours(0, 0, 0, 0);
  return applications.filter((app) => {
    const updated = new Date(`${app.lastUpdated}T00:00:00`);
    return updated >= cutoff && app.status !== "closed";
  });
}

export function getSuggestedAction(app, reason) {
  if (app.status === "interview") return "Interview prep";
  if (app.status === "closed") return "Archive";
  if (app.status === "followed_up") return "Waiting on reply";

  if (reason === "overdue" || reason === "due_today") return "Send follow-up";
  if (app.status === "responded") return "Waiting on reply";
  if (app.status === "waiting") return "Send follow-up";

  return "Review";
}

export function getPipelineStats(applications) {
  const active = applications.filter((a) => a.status !== "closed");
  const thisWeek = applications.filter((a) => {
    const diff = daysFromNow(a.dateApplied);
    return diff >= -7 && diff <= 0;
  });
  const followedUp = applications.filter((a) => a.status === "followed_up");
  const withResponse = applications.filter(
    (a) => a.status === "responded" || a.status === "interview",
  );
  const responseRate =
    applications.length > 0
      ? Math.round((withResponse.length / applications.length) * 100)
      : 0;

  return {
    total: applications.length,
    activePipeline: active.length,
    appliedThisWeek: thisWeek.length,
    followedUp: followedUp.length,
    responded: withResponse.length,
    responseRate,
    interviewCount: getCountByStatus(applications, "interview"),
  };
}
