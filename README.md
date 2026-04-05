# AfterApply

Follow up before the opportunity goes cold.

AfterApply is a job application follow-up dashboard. The UI is intentionally stable now; the core of the product is the follow-up workflow and the live data connection.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Current Data Modes

The dashboard supports three modes without changing the UI:

- Demo mode: no Apps Script URL is configured, so built-in mock data is shown.
- Live mode: a Google Apps Script web app URL is configured and returns valid JSON.
- Fallback mode: a live URL is configured, but the request fails, so the app falls back to demo data and shows the error in the sync bar.

The expected JSON shape is:

```json
{
  "ok": true,
  "generatedAt": "2026-04-05T18:30:00.000Z",
  "applications": [],
  "activityLog": []
}
```

## Canonical Frontend Shape

Every application row is normalized into this shape before rendering:

```js
{
  id,
  company,
  role,
  dateApplied,
  status,
  caseCode,
  jobLink,
  lastUpdated,
  nextFollowUpDate,
  notes,
}
```

Canonical statuses are strictly normalized to:

- `waiting`
- `followed_up`
- `responded`
- `interview`
- `closed`

## Files That Power Live Data

- [src/config/dataSource.js](C:/Users/ewf83/OneDrive/Desktop/afterapply/src/config/dataSource.js): reads `VITE_AFTERAPPLY_APPS_SCRIPT_URL`
- [src/hooks/useApplicationsData.js](C:/Users/ewf83/OneDrive/Desktop/afterapply/src/hooks/useApplicationsData.js): loading, refresh, live/mock/fallback mode switching
- [src/api/fetchSheetData.js](C:/Users/ewf83/OneDrive/Desktop/afterapply/src/api/fetchSheetData.js): fetches JSON and validates payload shape
- [src/api/normalizeApplication.js](C:/Users/ewf83/OneDrive/Desktop/afterapply/src/api/normalizeApplication.js): normalizes statuses, dates, links, and activity rows
- [src/data/applicationSchema.js](C:/Users/ewf83/OneDrive/Desktop/afterapply/src/data/applicationSchema.js): locked sheet headers and canonical frontend shape
- [scripts/google-apps-script/afterapply-api.gs](C:/Users/ewf83/OneDrive/Desktop/afterapply/scripts/google-apps-script/afterapply-api.gs): Apps Script web app that exposes Google Sheets data as JSON

## Locked Google Sheet Headers

Applications sheet, row 1 must be exactly:

- `Case Code`
- `Company`
- `Role`
- `Date Applied`
- `Status`
- `Job Link`
- `Last Updated`
- `Next Follow Up`
- `Notes`

Optional Activity sheet, row 1:

- `ID`
- `Timestamp`
- `Action`
- `Company`
- `Type`

## Manual Setup: Google Sheet

1. Create a Google Sheet.
2. Name the main tab `Applications`.
3. Put the locked `Applications` headers in row 1 exactly as listed above.
4. Add application rows beneath the header.
5. If you want the recent movement strip to use real events, add a second tab named `Activity`.
6. Put the locked `Activity` headers in row 1 exactly as listed above.

## Manual Setup: Apps Script

1. Open the Google Sheet.
2. Go to `Extensions -> Apps Script`.
3. Replace the default script with the contents of [scripts/google-apps-script/afterapply-api.gs](C:/Users/ewf83/OneDrive/Desktop/afterapply/scripts/google-apps-script/afterapply-api.gs).
4. If the script is bound to the same spreadsheet, leave `SPREADSHEET_ID` blank.
5. If the script is standalone, set `SPREADSHEET_ID` to the target Google Sheet id.
6. Save the script.
7. Click `Deploy -> New deployment`.
8. Choose `Web app`.
9. Set `Execute as` to `Me`.
10. Set `Who has access` to `Anyone`.
11. Deploy and copy the URL that ends in `/exec`.

## Manual Setup: Local Env

1. Copy `.env.example` to `.env`.
2. Set `VITE_AFTERAPPLY_APPS_SCRIPT_URL` to the deployed Apps Script `/exec` URL.
3. Restart `npm run dev`.

Example:

```env
VITE_AFTERAPPLY_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycb.../exec
```

## Switching Between Demo And Live

- Demo mode: remove `VITE_AFTERAPPLY_APPS_SCRIPT_URL` from `.env` and restart Vite.
- Live mode: add the Apps Script `/exec` URL to `.env` and restart Vite.
- Fallback mode: keep the live URL configured but break the endpoint or headers; the app will show demo data plus a sync warning.

## What The Frontend Now Verifies

- The top-level response must be a JSON object.
- `applications` must be an array of objects.
- `activityLog`, if present, must be an array of objects.
- Sheet statuses are normalized into the canonical frontend statuses only.
- Dates are parsed from ISO strings, US-style date strings, JavaScript-parsable dates, and Google Sheets serials.
- Invalid or missing dates degrade safely instead of crashing the UI.
- Missing live rows still render a polished empty-live-sheet state.

## Expected Real-Data Flow

1. Google Form or another intake path writes a row to the `Applications` sheet.
2. Apps Script exposes the sheet as JSON.
3. The dashboard fetches the Apps Script endpoint.
4. Incoming rows are normalized into the canonical frontend shape.
5. The UI renders live applications, live sync state, and live activity data when present.
6. If the endpoint fails, the UI falls back to demo data without breaking the dashboard.

## Edge Cases Still Worth Testing

- Missing or misspelled `Applications` headers.
- Empty live sheet with only headers and no rows.
- Blank `Next Follow Up` cells.
- Date cells stored as true date objects versus sheet serials.
- Status variants like `Follow Up`, `follow-up`, `Responded`, or `Rejected`.
- Job links without `https://`.
- Activity tab missing entirely.
- Activity tab present but with partial or wrong headers.
- Broken or undeployed Apps Script URL.

## Build

```bash
npm run build
```

The app uses `base: "/afterapply/"` for production builds and `base: "/"` in local dev.
