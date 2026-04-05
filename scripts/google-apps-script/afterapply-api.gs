/**
 * AfterApply — Google Apps Script web app
 *
 * Deploy: Deploy → New deployment → Type "Web app"
 * - Execute as: Me
 * - Who has access: Anyone (required for browser fetch from your Vite app)
 *
 * Set SPREADSHEET_ID and SHEET_NAME to match your Google Sheet.
 * Header row column names can be human-readable; map them in rowToApplication().
 */

var SPREADSHEET_ID = "YOUR_SPREADSHEET_ID_HERE";
var SHEET_NAME = "Applications";

function doGet() {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      return jsonOut({ ok: false, error: "Sheet not found: " + SHEET_NAME });
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
    var applications = [];
    for (var r = 1; r < values.length; r++) {
      var row = values[r];
      if (rowJoin(row) === "") continue;
      applications.push(rowToApplication(headers, row, r));
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

function rowJoin(row) {
  return row
    .map(function (c) {
      return String(c).trim();
    })
    .join("");
}

/**
 * Map your sheet columns to the keys the AfterApply frontend expects.
 * Adjust the header names to match row 1 of your sheet.
 */
function rowToApplication(headers, row, rowIndex) {
  var o = {};
  for (var i = 0; i < headers.length; i++) {
    o[headers[i]] = row[i];
  }

  return {
    id: pick_(o, ["id", "ID", "Row ID"]) || "row-" + rowIndex,
    company: pick_(o, ["company", "Company"]),
    role: pick_(o, ["role", "Role", "Title"]),
    dateApplied: formatDate_(pick_(o, ["dateApplied", "Date Applied", "Applied"])),
    status: pick_(o, ["status", "Status", "Stage"]),
    caseCode: pick_(o, ["caseCode", "Case Code", "Case"]),
    jobLink: pick_(o, ["jobLink", "Job Link", "URL", "Link"]),
    lastUpdated: formatDate_(pick_(o, ["lastUpdated", "Last Updated", "Updated"])),
    nextFollowUpDate: formatDate_(pick_(o, ["nextFollowUpDate", "Next Follow Up", "Follow Up"])),
    notes: pick_(o, ["notes", "Notes"]),
  };
}

function pick_(obj, keys) {
  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    if (obj[k] !== undefined && obj[k] !== null && String(obj[k]).trim() !== "") {
      return obj[k];
    }
  }
  return "";
}

function formatDate_(v) {
  if (v === "" || v === null || v === undefined) return "";
  if (Object.prototype.toString.call(v) === "[object Date]" && !isNaN(v)) {
    return Utilities.formatDate(v, Session.getScriptTimeZone(), "yyyy-MM-dd");
  }
  return String(v).trim();
}

function readActivityLog_(ss) {
  var sh = ss.getSheetByName("Activity");
  if (!sh) return [];

  var values = sh.getDataRange().getValues();
  if (!values.length) return [];

  var headers = values[0].map(function (h) {
    return String(h).trim();
  });
  var out = [];
  for (var r = 1; r < values.length; r++) {
    var row = values[r];
    if (rowJoin(row) === "") continue;
    var o = {};
    for (var i = 0; i < headers.length; i++) {
      o[headers[i]] = row[i];
    }
    out.push({
      id: pick_(o, ["id", "ID"]) || "ev-" + r,
      timestamp: formatDate_(pick_(o, ["timestamp", "Date", "Time"])),
      action: pick_(o, ["action", "Action", "Description"]),
      company: pick_(o, ["company", "Company"]),
      type: String(pick_(o, ["type", "Type"]) || "applied").toLowerCase(),
    });
  }
  return out;
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
