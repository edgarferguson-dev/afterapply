import { normalizeApplication, normalizeActivityEvent } from "./normalizeApplication";

/**
 * Expected JSON from the Google Apps Script web app (or compatible endpoint).
 *
 * @typedef {Object} SheetApiResponse
 * @property {boolean} [ok]
 * @property {string} [generatedAt] ISO-8601 timestamp when the script built the payload
 * @property {Array<Record<string, unknown>>} [applications]
 * @property {Array<Record<string, unknown>>} [activityLog]
 */

/**
 * @param {string} url
 * @param {AbortSignal} [signal]
 * @returns {Promise<{ applications: Array<Record<string, unknown>>, activityLog: Array<Record<string, unknown>> | undefined, generatedAt: string | null }>}
 */
export async function fetchSheetData(url, signal) {
  const res = await fetch(url, {
    method: "GET",
    mode: "cors",
    cache: "no-store",
    signal,
  });

  if (!res.ok) {
    throw new Error(`Sheet request failed (${res.status})`);
  }

  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Sheet response was not valid JSON");
  }

  if (data && data.ok === false && data.error) {
    throw new Error(String(data.error));
  }

  const rows = Array.isArray(data?.applications) ? data.applications : [];
  const applications = rows.map((row, i) => normalizeApplication(row, i));

  const logRows = Array.isArray(data?.activityLog) ? data.activityLog : undefined;
  const activityLog = logRows?.map((row) => normalizeActivityEvent(row));

  const generatedAt =
    typeof data?.generatedAt === "string" && data.generatedAt.trim()
      ? data.generatedAt.trim()
      : null;

  return { applications, activityLog, generatedAt };
}
