# AfterApply

**Follow up before the opportunity goes cold.**

A dark, modern command-center dashboard for tracking job applications and follow-ups. Built for job seekers who want a system, not a spreadsheet.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Live Google Sheet (optional)

1. Copy `.env.example` to `.env`
2. Set `VITE_AFTERAPPLY_APPS_SCRIPT_URL` to your deployed Apps Script **web app** URL (ends in `/exec`)
3. Restart `npm run dev` so Vite picks up the env var

If the variable is unset, the app uses **demo data** (sync bar: **Demo data**). If the URL is set and the sheet loads, you see **Live data** plus *Last synced …*. If the URL is set but the request fails, the app **falls back to demo data** and the sync bar shows **Live data unavailable — showing demo data** plus the error detail.

## Stack

- **Vite 8** — fast dev server and build tool
- **React 19** — UI framework
- **Tailwind CSS v4** — utility-first styling (via `@tailwindcss/vite`)
- **Lucide React** — icon system
- **Inter + JetBrains Mono** — typography (loaded from Google Fonts)

## Project Structure

```
src/
├── main.jsx                         Entry point
├── App.jsx                          Layout; uses hook for data + loading/error UI
├── index.css                        Tailwind import, scrollbar styles
├── config/
│   └── dataSource.js                Reads VITE_AFTERAPPLY_APPS_SCRIPT_URL
├── api/
│   ├── fetchSheetData.js            GET + JSON parse + error mapping
│   └── normalizeApplication.js      Sheet/API row → dashboard shape (+ aliases)
├── hooks/
│   └── useApplicationsData.js       Load / refresh, fallback, last-synced state
├── data/
│   ├── applicationSchema.js         Canonical `Application` shape + exact sheet header strings
│   └── mockData.js                  Demo applications + activity log
├── components/
│   ├── Header.jsx
│   ├── DataSyncStatus.jsx           Demo / live / fallback sync labels + refresh
│   ├── LiveSheetEmpty.jsx           Banner when live sheet returns zero rows
│   ├── LoadingApplications.jsx      Blocking loader (first live fetch)
│   ├── SummaryCards.jsx
│   ├── ActivityStrip.jsx
│   ├── NeedsAttention.jsx
│   ├── ApplicationList.jsx
│   └── StatusPill.jsx
└── utils/
    └── helpers.js                   Status config, filters, pipeline stats

scripts/google-apps-script/
└── afterapply-api.gs                Sample `doGet` → JSON for the frontend
```

---

## Live data: frontend data flow

1. **`config/dataSource.js`** exposes whether a web app URL is configured (`isLiveDataEnabled`).
2. **`useApplicationsData`** runs on mount:
   - **No URL** → use `mockData` immediately (`dataSource: "mock"`).
   - **URL set** → `fetchSheetData(url)` → normalize rows → `dataSource: "live"` and store `lastSyncedAt` from `generatedAt` (or “now”).
   - **Fetch or parse error** → replace with `mockData`, `dataSource: "fallback"`, surface `error` message.
3. **`App.jsx`** keeps the **same presentational components**; only the arrays (`applications`, `activityLog`) and sync metadata change.
4. **Refresh** calls the same load function again (non-blocking spinner in the sync bar).

---

## 1. Google Sheet column names (Applications tab, row 1)

These headers must appear **exactly** (spelling and spaces). They are defined in code as `APPLICATION_SHEET_HEADERS` in `src/data/applicationSchema.js` and enforced in `scripts/google-apps-script/afterapply-api.gs`.

| Column title     | Meaning |
|------------------|---------|
| `Case Code`      | Unique id for the row (also used as `id` in JSON if you do not send a separate id) |
| `Company`        | Employer name |
| `Role`           | Job title |
| `Date Applied`   | Applied date |
| `Status`         | Pipeline label (see normalization below) |
| `Job Link`       | Listing URL (optional scheme: `https://` added on the client if missing) |
| `Last Updated`   | Last touch / update |
| `Next Follow Up` | Follow-up due date (empty = none) |
| `Notes`          | Free text |

Optional **`Activity`** tab (row 1): `ID`, `Timestamp`, `Action`, `Company`, `Type` — see `ACTIVITY_SHEET_HEADERS` in `applicationSchema.js`.

---

## 2. Apps Script mapping strategy

- **`rowToMap_`** builds an object keyed by **exact** header strings from row 1.
- **`rowToApplication`** reads **only** those canonical headers (no alternate spellings) and returns **camelCase** JSON keys: `id`, `company`, `role`, `dateApplied`, `status`, `caseCode`, `jobLink`, `lastUpdated`, `nextFollowUpDate`, `notes`.
- **`validateApplicationHeaders_`** runs on each request: if any required header is missing, the script returns `{ ok: false, error: "Missing required column(s): …" }` and the UI falls back to demo data.
- **Dates in GAS**: `formatDate_` turns `Date` cells, **serial numbers**, or date strings into `yyyy-MM-dd` in the **script timezone** (`Session.getScriptTimeZone()`).

---

## 3. Frontend normalization rules (`src/api/normalizeApplication.js`)

- **Canonical shape**: every row is merged into the `Application` typedef in `applicationSchema.js` before it hits React.
- **Status** (`normalizeStatus`): input is trimmed, lowercased, spaces/slashes collapsed to `_`, hyphens normalized. If the value is already one of `waiting` \| `followed_up` \| `responded` \| `interview` \| `closed`, it is kept. Otherwise a fixed **alias map** maps common sheet labels (e.g. `pending`, `applied`, `follow-up`, `rejected`) to a canonical status. Anything unknown becomes **`waiting`** (predictable UI).
- **Dates** (`parseIsoDate`): supports **ISO / partial ISO** (`YYYY-MM-DD` prefix), **JavaScript-parsable strings** (locale-dependent), **US `M/D/YYYY`**, **Google Sheets / Excel serial numbers** (numbers that look like serials, not years `1900–2100`). Invalid values become `null` / empty strings as appropriate; `nextFollowUpDate` is **`null`** when absent.
- **Resilience**: the client still accepts legacy keys (`Company`, `date_applied`, etc.) so older deployments or hand-built JSON do not brick the dashboard.
- **Display helpers** (`formatDate`, `relativeDay`, `daysFromNow`) treat invalid dates as **—** / safe defaults so bad cells do not throw.

---

## 4. Edge cases that break or weaken the live connection

| Issue | Effect |
|--------|--------|
| Missing or misspelled header in row 1 | Script throws → `ok: false` → UI shows **Live data unavailable — showing demo data** |
| Web app not redeployed after changing the sheet or script | Browser may hit an old deployment URL or cached code |
| Wrong **Execute as** / **Who has access** | CORS or 403; fetch fails → fallback |
| HTML login page instead of JSON (wrong URL, auth wall) | JSON parse error → fallback |
| **Activity** tab renamed or columns wrong | Activity feed may be empty strings; applications still work |
| Plain **year** stored as a number (e.g. `2026`) in a date cell | Not treated as a serial → date may fail to parse → empty date in UI |
| **Ambiguous** non-US date strings | Parsed via `Date` (browser locale); prefer ISO `YYYY-MM-DD` in the sheet |
| **Duplicate `Case Code`** values | Rows still render; attention logic and ids may be confusing — keep codes unique |
| Empty sheet (headers only) | Valid `ok: true` with `applications: []` → **Live data** + empty-state banner and zeroed metrics |

---

## Exact JSON shape expected from the endpoint

The fetch layer expects **JSON** (not JSONP). Top-level object:

```json
{
  "ok": true,
  "generatedAt": "2026-04-05T18:30:00.000Z",
  "applications": [ /* see below */ ],
  "activityLog": [ /* optional; omit or [] if none */ ]
}
```

On failure, the script may return:

```json
{ "ok": false, "error": "Human-readable message" }
```

Each **application** (after normalization) matches:

| Field | Type | Notes |
|--------|------|--------|
| `id` | string | Stable row id; falls back to `caseCode` or `row-{index}` |
| `company` | string | |
| `role` | string | |
| `dateApplied` | string | `YYYY-MM-DD` preferred; ISO or Sheets date serial accepted |
| `status` | string | `waiting` \| `followed_up` \| `responded` \| `interview` \| `closed` |
| `caseCode` | string | |
| `jobLink` | string | URL or `#` |
| `lastUpdated` | string | `YYYY-MM-DD` |
| `nextFollowUpDate` | string \| null | Empty → `null` |
| `notes` | string | Optional |

Each **activity** entry (optional):

```json
{
  "id": "ev-1",
  "timestamp": "2026-04-05",
  "action": "Recruiter replied",
  "company": "Acme Corp",
  "type": "response"
}
```

`type` should be one of: `milestone`, `follow_up`, `response`, `signal`, `applied` (invalid values become `applied`).

The **`normalizeApplication.js`** layer still accepts common **legacy** keys (e.g. `date_applied`, alternate header spellings) so hand-edited JSON or older scripts stay compatible; the **recommended** path is camelCase JSON from the locked Apps Script mapping above.

---

## Fetch logic (clean separation)

| Concern | File |
|--------|------|
| Env / whether live mode is on | `src/config/dataSource.js` |
| HTTP + JSON + `ok: false` handling | `src/api/fetchSheetData.js` |
| Row → dashboard shape, dates, status | `src/api/normalizeApplication.js` |
| Loading, error, fallback, refresh, last sync | `src/hooks/useApplicationsData.js` |
| UI wiring only | `src/App.jsx` |

---

## Preserving the UI while swapping data sources

- **No changes** to `SummaryCards`, `NeedsAttention`, `ApplicationList`, `StatusPill`, or `Header` layout beyond what they already accept as props.
- **`App.jsx`** still passes `applications` and `activityLog` into the same tree.
- **Additions**: `DataSyncStatus` (sync-state labels), `LoadingApplications` (first live fetch), `LiveSheetEmpty` (live + zero rows), and empty copy in `ActivityStrip` when there is no activity data.

---

## Google Apps Script deployment

Use **`ContentService`** with MIME type **`JSON`** in `doGet`, and deploy as a **Web app** with **Who has access: Anyone** so the browser can call it with `fetch` (CORS).

**`scripts/google-apps-script/afterapply-api.gs`** validates required **Applications** headers, maps each row to camelCase JSON, and optionally reads **`Activity`**. Point `VITE_AFTERAPPLY_APPS_SCRIPT_URL` at the deployment URL that ends in **`/exec`**.

---

## Mock / demo data shape

Same as live shape; see `src/data/mockData.js`.

## Suggested Actions

The `NeedsAttention` section assigns a contextual action label to each item:

| Context                    | Action Label      |
|----------------------------|-------------------|
| Overdue follow-up          | Send follow-up    |
| Due today (waiting)        | Send follow-up    |
| Followed up, no reply      | Waiting on reply  |
| Responded, pending action  | Waiting on reply  |
| Interview stage            | Interview prep    |
| Closed application         | Archive           |

## Build for Production

```bash
npm run build
```

Output goes to `dist/`. Deploy to Vercel, Netlify, or any static host.

Set `VITE_AFTERAPPLY_APPS_SCRIPT_URL` in the host’s environment (or build-time env) the same way as locally.
