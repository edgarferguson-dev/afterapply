/**
 * AfterApply Google Apps Script web app
 *
 * Deploy:
 * 1. Extensions -> Apps Script
 * 2. Paste this file into the script editor
 * 3. Set SPREADSHEET_ID if the script is not bound to the target sheet
 * 4. Deploy -> New deployment -> Web app
 * 5. Execute as: Me
 * 6. Who has access: Anyone
 *
 * The Applications sheet must use the exact headers defined below.
 * The Activity sheet is optional.
 */

var SPREADSHEET_ID = "";
var APPLICATIONS_SHEET_NAME = "Applications";
var ACTIVITY_SHEET_NAME = "Activity";

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

var ACTIVITY_HEADERS = {
  ID: "ID",
  TIMESTAMP: "Timestamp",
  ACTION: "Action",
  COMPANY: "Company",
  TYPE: "Type",
};

function doGet() {
  try {
    var ss = getSpreadsheet_();
    var applicationsSheet = ss.getSheetByName(APPLICATIONS_SHEET_NAME);
    if (!applicationsSheet) {
      throw new Error("Sheet not found: " + APPLICATIONS_SHEET_NAME);
    }

    var applications = readApplications_(applicationsSheet);
    var activityLog = readActivityLog_(ss);

    return jsonOut_({
      ok: true,
      generatedAt: new Date().toISOString(),
      applications: applications,
      activityLog: activityLog,
    });
  } catch (err) {
    return jsonOut_({
      ok: false,
      error: String(err && err.message ? err.message : err),
    });
  }
}

function getSpreadsheet_() {
  if (SPREADSHEET_ID && String(SPREADSHEET_ID).trim() !== "") {
    return SpreadsheetApp.openById(String(SPREADSHEET_ID).trim());
  }

  var active = SpreadsheetApp.getActiveSpreadsheet();
  if (!active) {
    throw new Error("No active spreadsheet found. Set SPREADSHEET_ID before deploying.");
  }
  return active;
}

function readApplications_(sheet) {
  var values = sheet.getDataRange().getValues();
  if (!values.length) return [];

  var headers = normalizeHeaders_(values[0]);
  validateHeaders_(headers, getRequiredApplicationHeaders_(), "Applications");

  var applications = [];
  for (var r = 1; r < values.length; r++) {
    var row = values[r];
    if (isBlankRow_(row)) continue;
    var rowMap = rowToMap_(headers, row);
    applications.push(rowToApplication_(rowMap, r));
  }
  return applications;
}

function readActivityLog_(ss) {
  var sheet = ss.getSheetByName(ACTIVITY_SHEET_NAME);
  if (!sheet) return [];

  var values = sheet.getDataRange().getValues();
  if (!values.length) return [];

  var headers = normalizeHeaders_(values[0]);
  var required = getRequiredActivityHeaders_();
  if (!hasAllHeaders_(headers, required)) {
    return [];
  }

  var events = [];
  for (var r = 1; r < values.length; r++) {
    var row = values[r];
    if (isBlankRow_(row)) continue;
    var rowMap = rowToMap_(headers, row);
    events.push({
      id: cellStr_(rowMap, ACTIVITY_HEADERS.ID) || "ev-" + r,
      timestamp: formatDate_(rowMap[ACTIVITY_HEADERS.TIMESTAMP]),
      action: cellStr_(rowMap, ACTIVITY_HEADERS.ACTION),
      company: cellStr_(rowMap, ACTIVITY_HEADERS.COMPANY),
      type: normalizeActivityType_(cellStr_(rowMap, ACTIVITY_HEADERS.TYPE)),
    });
  }

  return events;
}

function getRequiredApplicationHeaders_() {
  return [
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
}

function getRequiredActivityHeaders_() {
  return [
    ACTIVITY_HEADERS.ID,
    ACTIVITY_HEADERS.TIMESTAMP,
    ACTIVITY_HEADERS.ACTION,
    ACTIVITY_HEADERS.COMPANY,
    ACTIVITY_HEADERS.TYPE,
  ];
}

function normalizeHeaders_(row) {
  return row.map(function (header) {
    return String(header || "").trim();
  });
}

function validateHeaders_(headers, requiredHeaders, sheetName) {
  var missing = [];
  for (var i = 0; i < requiredHeaders.length; i++) {
    if (headers.indexOf(requiredHeaders[i]) === -1) {
      missing.push(requiredHeaders[i]);
    }
  }

  if (missing.length) {
    throw new Error(
      sheetName + " is missing required column(s): " + missing.join(", ")
    );
  }
}

function hasAllHeaders_(headers, requiredHeaders) {
  for (var i = 0; i < requiredHeaders.length; i++) {
    if (headers.indexOf(requiredHeaders[i]) === -1) {
      return false;
    }
  }
  return true;
}

function isBlankRow_(row) {
  for (var i = 0; i < row.length; i++) {
    if (String(row[i] || "").trim() !== "") return false;
  }
  return true;
}

function rowToMap_(headers, row) {
  var out = {};
  for (var i = 0; i < headers.length; i++) {
    out[headers[i]] = row[i];
  }
  return out;
}

function rowToApplication_(rowMap, rowIndex) {
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
  var value = rowMap[header];
  if (value === undefined || value === null) return "";
  return String(value).trim();
}

function normalizeActivityType_(value) {
  var allowed = {
    milestone: true,
    follow_up: true,
    response: true,
    signal: true,
    applied: true,
  };

  var normalized = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[\s/]+/g, "_")
    .replace(/-+/g, "_");

  return allowed[normalized] ? normalized : "applied";
}

function formatDate_(value) {
  if (value === "" || value === null || value === undefined) return "";

  if (Object.prototype.toString.call(value) === "[object Date]" && !isNaN(value)) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), "yyyy-MM-dd");
  }

  if (typeof value === "number" && !isNaN(value)) {
    var serial = Math.floor(value);
    if (serial >= 1 && serial < 1000000) {
      var epochMs = (serial - 25569) * 86400 * 1000;
      var fromSerial = new Date(epochMs);
      if (!isNaN(fromSerial.getTime())) {
        return Utilities.formatDate(
          fromSerial,
          Session.getScriptTimeZone(),
          "yyyy-MM-dd"
        );
      }
    }
  }

  var asString = String(value).trim();
  if (!asString) return "";

  var parsed = new Date(asString);
  if (!isNaN(parsed.getTime())) {
    return Utilities.formatDate(parsed, Session.getScriptTimeZone(), "yyyy-MM-dd");
  }

  return asString;
}

function jsonOut_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
