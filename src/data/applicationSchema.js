/**
 * Canonical application record consumed by the dashboard.
 * All sheet/API rows are normalized into this shape before rendering.
 *
 * @typedef {Object} Application
 * @property {string} id            Stable row identifier (usually same as caseCode)
 * @property {string} company
 * @property {string} role
 * @property {string} dateApplied   ISO date "YYYY-MM-DD" or "" if unknown
 * @property {'waiting'|'followed_up'|'responded'|'interview'|'closed'} status
 * @property {string} caseCode
 * @property {string} jobLink       Absolute URL or "#" if missing
 * @property {string} lastUpdated   ISO date "YYYY-MM-DD" or ""
 * @property {string|null} nextFollowUpDate  ISO date or null when none / not applicable
 * @property {string} notes
 */

/** Row 1 headers in the Google Sheet `Applications` tab (exact strings, trimmed). */
export const APPLICATION_SHEET_HEADERS = {
  caseCode: "Case Code",
  company: "Company",
  role: "Role",
  dateApplied: "Date Applied",
  status: "Status",
  jobLink: "Job Link",
  lastUpdated: "Last Updated",
  nextFollowUp: "Next Follow Up",
  notes: "Notes",
};

/** Optional `Activity` tab — exact header strings. */
export const ACTIVITY_SHEET_HEADERS = {
  id: "ID",
  timestamp: "Timestamp",
  action: "Action",
  company: "Company",
  type: "Type",
};
