import { STATUS_CONFIG } from "../utils/helpers";

const VALID_STATUSES = new Set(Object.keys(STATUS_CONFIG));

function pick(obj, keys) {
  for (const k of keys) {
    if (obj[k] !== undefined && obj[k] !== null && obj[k] !== "") return obj[k];
  }
  return undefined;
}

function toIsoDate(value) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number" && !Number.isNaN(value)) {
    const epoch = new Date((value - 25569) * 86400 * 1000);
    if (!Number.isNaN(epoch.getTime())) {
      return epoch.toISOString().split("T")[0];
    }
  }
  const s = String(value).trim();
  if (!s) return null;
  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) return d.toISOString().split("T")[0];
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  return s;
}

function normalizeStatus(value) {
  if (value === null || value === undefined) return "waiting";
  let s = String(value).trim().toLowerCase().replace(/\s+/g, "_");
  if (s === "followedup" || s === "follow-up" || s === "follow_up") s = "followed_up";
  if (!VALID_STATUSES.has(s)) return "waiting";
  return s;
}

/**
 * Maps a row/object from the web app into the dashboard application shape.
 * @param {Record<string, unknown>} raw
 * @param {number} [rowIndex]
 */
export function normalizeApplication(raw, rowIndex = 0) {
  const company = String(pick(raw, ["company", "Company", "companyName"]) ?? "").trim();
  const role = String(pick(raw, ["role", "Role", "title", "Title", "jobTitle"]) ?? "").trim();
  const caseCode = String(
    pick(raw, ["caseCode", "case_code", "Case Code", "CaseCode", "id"]) ?? ""
  ).trim();
  const explicitId = pick(raw, ["id", "ID", "rowId"]);
  const id = String(
    explicitId != null && String(explicitId).trim() !== ""
      ? explicitId
      : caseCode || `row-${rowIndex}`
  ).trim();

  const dateApplied = toIsoDate(pick(raw, ["dateApplied", "date_applied", "Date Applied", "applied"])) ?? "";
  const lastUpdated = toIsoDate(pick(raw, ["lastUpdated", "last_updated", "Last Updated", "updated"])) ?? dateApplied;
  const nextRaw = pick(raw, [
    "nextFollowUpDate",
    "next_follow_up_date",
    "Next Follow Up",
    "nextFollowUp",
    "followUp",
  ]);
  const nextFollowUpDate = toIsoDate(nextRaw);

  const status = normalizeStatus(pick(raw, ["status", "Status", "Stage"]));
  const jobLink = String(pick(raw, ["jobLink", "job_link", "Job Link", "url", "URL"]) ?? "").trim();
  const notes = String(pick(raw, ["notes", "Notes", "comment"]) ?? "").trim();

  return {
    id: id || caseCode || `${company}-${role}-${rowIndex}`,
    company: company || "—",
    role: role || "—",
    dateApplied,
    status,
    caseCode: caseCode || id,
    jobLink: jobLink || "#",
    lastUpdated,
    nextFollowUpDate,
    notes,
  };
}

const ACTIVITY_TYPES = new Set(["milestone", "follow_up", "response", "signal", "applied"]);

/**
 * @param {Record<string, unknown>} raw
 */
export function normalizeActivityEvent(raw) {
  const id = String(pick(raw, ["id", "ID"]) ?? "").trim() || `ev-${Math.random()}`;
  const timestamp = toIsoDate(pick(raw, ["timestamp", "date", "time"])) ?? "";
  const action = String(pick(raw, ["action", "Action", "description"]) ?? "").trim();
  const company = String(pick(raw, ["company", "Company"]) ?? "").trim();
  let type = String(pick(raw, ["type", "Type"]) ?? "applied").toLowerCase();
  if (!ACTIVITY_TYPES.has(type)) type = "applied";
  return { id, timestamp, action, company, type };
}
