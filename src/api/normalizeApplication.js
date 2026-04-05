import { STATUS_CONFIG } from "../utils/helpers";
import {
  APPLICATION_SHEET_HEADERS,
  ACTIVITY_SHEET_HEADERS,
} from "../data/applicationSchema";

const VALID_STATUSES = new Set(Object.keys(STATUS_CONFIG));

const H = APPLICATION_SHEET_HEADERS;
const AH = ACTIVITY_SHEET_HEADERS;

/**
 * Maps common sheet / human labels to a canonical status.
 * Output is always one of the keys of STATUS_CONFIG.
 */
const STATUS_SLUG_ALIASES = {
  pending: "waiting",
  new: "waiting",
  applied: "waiting",
  wait: "waiting",
  waiting: "waiting",
  queue: "waiting",
  queued: "waiting",
  outreach: "waiting",
  no_response: "waiting",
  noresponse: "waiting",
  no_reply: "waiting",
  silent: "waiting",

  followedup: "followed_up",
  "follow-up": "followed_up",
  follow_up: "followed_up",
  followup: "followed_up",
  followed: "followed_up",
  nudge: "followed_up",
  ping: "followed_up",

  reply: "responded",
  replied: "responded",
  response: "responded",
  recruiter: "responded",
  engaged: "responded",

  screening: "interview",
  phone_screen: "interview",
  phone: "interview",
  onsite: "interview",
  on_site: "interview",
  on_site_interview: "interview",
  loop: "interview",

  rejected: "closed",
  decline: "closed",
  declined: "closed",
  lost: "closed",
  archive: "closed",
  archived: "closed",
  filled: "closed",
  dead: "closed",
};

function pick(obj, keys) {
  for (const k of keys) {
    if (obj[k] !== undefined && obj[k] !== null && obj[k] !== "") return obj[k];
  }
  return undefined;
}

function slugStatusInput(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[\s/]+/g, "_")
    .replace(/-+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

/**
 * Strict, consistent status: always one of waiting | followed_up | responded | interview | closed.
 */
export function normalizeStatus(value) {
  if (value === null || value === undefined) return "waiting";
  const raw = String(value).trim();
  if (!raw) return "waiting";

  const slug = slugStatusInput(raw);
  if (VALID_STATUSES.has(slug)) return slug;

  const mapped = STATUS_SLUG_ALIASES[slug];
  if (mapped && VALID_STATUSES.has(mapped)) return mapped;

  const collapsed = slug.replace(/_/g, "");
  if (collapsed === "followedup") return "followed_up";

  return "waiting";
}

/** Google Sheets / Excel serial date to UTC calendar ISO date (date part only). */
function serialToIsoDate(serial) {
  const whole = Math.floor(Number(serial));
  if (!Number.isFinite(whole) || whole < 1) return null;
  const ms = (whole - 25569) * 86400 * 1000;
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

function isLikelyDateSerial(n) {
  if (typeof n !== "number" || !Number.isFinite(n)) return false;
  if (Number.isInteger(n) && n >= 1900 && n <= 2100) return false;
  return n >= 1 && n < 1_000_000;
}

function dateToLocalIsoDate(d) {
  if (!(d instanceof Date) || Number.isNaN(d.getTime())) return null;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * @param {unknown} value
 * @returns {string|null}  YYYY-MM-DD or null if unknown / invalid
 */
export function parseIsoDate(value) {
  if (value === null || value === undefined || value === "") return null;

  if (typeof value === "number" && Number.isFinite(value)) {
    if (isLikelyDateSerial(value)) return serialToIsoDate(value);
    return null;
  }

  const s = String(value).trim();
  if (!s) return null;

  const ymd = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (ymd) {
    const candidate = `${ymd[1]}-${ymd[2]}-${ymd[3]}`;
    const test = new Date(candidate + "T12:00:00");
    if (!Number.isNaN(test.getTime())) return candidate;
    return null;
  }

  const numeric = Number(s);
  if (s !== "" && !Number.isNaN(numeric) && /^[\d.]+$/.test(s) && isLikelyDateSerial(numeric)) {
    return serialToIsoDate(numeric);
  }

  const parsed = new Date(s);
  if (!Number.isNaN(parsed.getTime())) {
    return dateToLocalIsoDate(parsed);
  }

  const us = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (us) {
    const mm = parseInt(us[1], 10);
    const dd = parseInt(us[2], 10);
    const yy = parseInt(us[3], 10);
    const d = new Date(yy, mm - 1, dd, 12, 0, 0, 0);
    if (!Number.isNaN(d.getTime())) return dateToLocalIsoDate(d);
  }

  return null;
}

function strOrEmpty(v) {
  if (v === null || v === undefined) return "";
  return String(v).trim();
}

/**
 * Maps a row/object from the web app into {@link Application}.
 * Accepts camelCase API objects and legacy / header-keyed rows for resilience.
 * @param {Record<string, unknown>} raw
 * @param {number} [rowIndex]
 */
export function normalizeApplication(raw, rowIndex = 0) {
  const safeRaw = raw && typeof raw === "object" ? raw : {};
  const company = strOrEmpty(
    pick(safeRaw, ["company", H.company, "Company", "companyName"])
  );
  const role = strOrEmpty(
    pick(safeRaw, ["role", H.role, "Role", "title", "Title", "jobTitle"])
  );

  const caseCode = strOrEmpty(
    pick(safeRaw, ["caseCode", H.caseCode, "case_code", "CaseCode", "Case"])
  );

  const explicitId = pick(safeRaw, ["id", "ID", "rowId"]);
  const id = strOrEmpty(
    explicitId != null && String(explicitId).trim() !== ""
      ? explicitId
      : caseCode || `row-${rowIndex}`
  );

  const dateApplied =
    parseIsoDate(pick(safeRaw, ["dateApplied", H.dateApplied, "date_applied", "Applied"])) ?? "";
  const lastUpdatedRaw = pick(safeRaw, [
    "lastUpdated",
    H.lastUpdated,
    "last_updated",
    "Updated",
  ]);
  const lastUpdated = parseIsoDate(lastUpdatedRaw) ?? dateApplied;

  const nextRaw = pick(safeRaw, [
    "nextFollowUpDate",
    H.nextFollowUp,
    "next_follow_up_date",
    "nextFollowUp",
    "followUp",
    "Follow Up",
  ]);
  const nextFollowUpDate = parseIsoDate(nextRaw);

  const status = normalizeStatus(pick(safeRaw, ["status", H.status, "Status", "Stage"]));

  let jobLink = strOrEmpty(
    pick(safeRaw, ["jobLink", H.jobLink, "job_link", "URL", "Link", "url"])
  );
  if (
    jobLink &&
    jobLink !== "#" &&
    !/^[a-z][a-z0-9+.-]*:/i.test(jobLink)
  ) {
    jobLink = `https://${jobLink}`;
  }
  if (!jobLink) jobLink = "#";

  const notes = strOrEmpty(pick(safeRaw, ["notes", H.notes, "Notes", "comment"]));

  return {
    id: id || caseCode || `${company}-${role}-${rowIndex}`,
    company: company || "-",
    role: role || "-",
    dateApplied,
    status,
    caseCode: caseCode || id,
    jobLink,
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
  const safeRaw = raw && typeof raw === "object" ? raw : {};
  const id =
    strOrEmpty(pick(safeRaw, ["id", AH.id, "ID"])) ||
    `ev-${Math.random().toString(36).slice(2, 9)}`;
  const timestamp =
    parseIsoDate(
      pick(safeRaw, ["timestamp", AH.timestamp, "date", "time", "Date"])
    ) ?? "";
  const action = strOrEmpty(
    pick(safeRaw, ["action", AH.action, "description", "Description"])
  );
  const company = strOrEmpty(pick(safeRaw, ["company", AH.company, "Company"]));
  let type =
    strOrEmpty(pick(safeRaw, ["type", AH.type, "Type"])).toLowerCase() || "applied";
  if (!ACTIVITY_TYPES.has(type)) type = "applied";
  return { id, timestamp, action, company, type };
}

