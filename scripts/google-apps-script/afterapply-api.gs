/**
 * AfterApply — Google Apps Script web app
 *
 * Deploy: Deploy → New deployment → Type "Web app"
 * - Execute as: Me
 * - Who has access: Anyone (required for browser fetch from your Vite app)
 *
 * The Applications tab MUST use row 1 headers exactly as APPLICATION_HEADERS below.
 * Copy/paste that row into your sheet — spelling and spacing must match.
 */

var SPREADSHEET_ID = "YOUR_SPREADSHEET_ID_HERE";
var APPLICATIONS_SHEET_NAME = "Applications";
var ACTIVITY_SHEET_NAME = "Activity";

/** Exact column titles for row 1 of the Applications sheet (trimmed when read). */
var APPLICATION_HEADERS = {
  CASE_CODE: "Case Code",
  COMPANY: "Company",
  ROLE: "Role",
  DATE_APPLIED: "Date Applied",
  STATUS: "Status",
  JOB_LINK: "Job Link",
  LAST_UPDATED: "Last Updated",
  NEXT_FOLLOW_UP: "Next Follow Up",
  NOTES: "Notes",
};

/** Exact column titles for row 1 of the Activity sheet (optional tab). */
var ACTIVITY_HEADERS = {
  ID: "ID",
  TIMESTAMP: "Timestamp",
  ACTION: "Action",
  COMPANY: "Company",
  TYPE: "Type",
};

function doGet() {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(APPLICATIONS_SHEET_NAME);
    if (!sheet) {
      return jsonOut({ ok: false, error: "Sheet not found: " + APPLICATIONS_SHEET_NAME });
    }

    var values = sheet.getDataRange().getValues();
    if (!values.length) {
      return jsonOut({
        ok: true,
        generatedAt: new Date().toISOString(),
        applications: [],
        activityLog: [],
      });
    }

    var headers = values[0].map(function (h) {
      return String(h).trim();
    });
    validateApplicationHeaders_(headers);

    var applications = [];
    for (var r = 1; r < values.length; r++) {
      var row = values[r];
      if (rowJoin_(row) === "") continue;
      var rowMap = rowToMap_(headers, row);
      applications.push(rowToApplication(rowMap, r));
    }

    var activityLog = readActivityLog_(ss);

    return jsonOut({
      ok: true,
      generatedAt: new Date().toISOString(),
      applications: applications,
      activityLog: activityLog,
    });
  } catch (err) {
    return jsonOut({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

function validateApplicationHeaders_(headers) {
  var required = [
    APPLICATION_HEADERS.CASE_CODE,
    APPLICATION_HEADERS.COMPANY,
    APPLICATION_HEADERS.ROLE,
    APPLICATION_HEADERS.DATE_APPLIED,
    APPLICATION_HEADERS.STATUS,
    APPLICATION_HEADERS.JOB_LINK,
    APPLICATION_HEADERS.LAST_UPDATED,
    APPLICATION_HEADERS.NEXT_FOLLOW_UP,
    APPLICATION_HEADERS.NOTES,
  ];
  var missing = [];
  for (var i = 0; i < required.length; i++) {
    if (headers.indexOf(required[i]) === -1) missing.push(required[i]);
  }
  if (missing.length) {
    throw new Error("Missing required column(s): " + missing.join(", "));
  }
}

function rowJoin_(row) {
  return row
    .map(function (c) {
      return String(c).trim();
    })
    .join("");
}

function rowToMap_(headers, row) {
  var o = {};
  for (var i = 0; i < headers.length; i++) {
    o[headers[i]] = row[i];
  }
  return o;
}

/**
 * Reads one data row using ONLY the canonical header names.
 * Outputs camelCase keys matching the AfterApply frontend contract.
 */
function rowToApplication(rowMap, rowIndex) {
  var caseCode = cellStr_(rowMap, APPLICATION_HEADERS.CASE_CODE);
  var id = caseCode || "row-" + rowIndex;

  return {
    id: id,
    company: cellStr_(rowMap, APPLICATION_HEADERS.COMPANY),
    role: cellStr_(rowMap, APPLICATION_HEADERS.ROLE),
    dateApplied: formatDate_(rowMap[APPLICATION_HEADERS.DATE_APPLIED]),
    status: cellStr_(rowMap, APPLICATION_HEADERS.STATUS),
    caseCode: caseCode,
    jobLink: cellStr_(rowMap, APPLICATION_HEADERS.JOB_LINK),
    lastUpdated: formatDate_(rowMap[APPLICATION_HEADERS.LAST_UPDATED]),
    nextFollowUpDate: formatDate_(rowMap[APPLICATION_HEADERS.NEXT_FOLLOW_UP]),
    notes: cellStr_(rowMap, APPLICATION_HEADERS.NOTES),
  };
}

function cellStr_(rowMap, header) {
  var v = rowMap[header];
  if (v === undefined || v === null) return "";
  return String(v).trim();
}

/**
 * Normalizes Sheet values to yyyy-MM-dd for JSON.
 * Handles Date objects, serial numbers, and string literals.
 */
function formatDate_(v) {
  if (v === "" || v === null || v === undefined) return "";
  if (Object.prototype.toString.call(v) === "[object Date]" && !isNaN(v)) {
    return Utilities.formatDate(v, Session.getScriptTimeZone(), "yyyy-MM-dd");
  }
  if (typeof v === "number" && !isNaN(v)) {
    var whole = Math.floor(v);
    if (whole >= 1 && whole < 1000000) {
      var epochMs = (whole - 25569) * 86400 * 1000;
      var d = new Date(epochMs);
      if (!isNaN(d.getTime())) {
        return Utilities.formatDate(d, Session.getScriptTimeZone(), "yyyy-MM-dd");
      }
    }
  }
  return String(v).trim();
}

function readActivityLog_(ss) {
  var sh = ss.getSheetByName(ACTIVITY_SHEET_NAME);
  if (!sh) return [];

  var values = sh.getDataRange().getValues();
  if (!values.length) return [];

  var headers = values[0].map(function (h) {
    return String(h).trim();
  });
  var out = [];
  for (var r = 1; r < values.length; r++) {
    var row = values[r];
    if (rowJoin_(row) === "") continue;
    var o = rowToMap_(headers, row);
    out.push({
      id: cellStr_(o, ACTIVITY_HEADERS.ID) || "ev-" + r,
      timestamp: formatDate_(o[ACTIVITY_HEADERS.TIMESTAMP]),
      action: cellStr_(o, ACTIVITY_HEADERS.ACTION),
      company: cellStr_(o, ACTIVITY_HEADERS.COMPANY),
      type: String(cellStr_(o, ACTIVITY_HEADERS.TYPE) || "applied").toLowerCase(),
    });
  }
  return out;
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
