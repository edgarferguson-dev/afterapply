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

If the variable is unset, the app uses **demo data**. If the URL is set but the request fails, the app **falls back to demo data** and shows an error in the sync bar.

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
│   └── mockData.js                  Demo applications + activity log
├── components/
│   ├── Header.jsx
│   ├── DataSyncStatus.jsx           Demo vs live vs fallback + last synced + refresh
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

The **`normalizeApplication.js`** layer also accepts common aliases (e.g. `date_applied`, `next_follow_up_date`, `Case Code`, `Job Link`) so you can align the script with your sheet headers without renaming every column in the sheet.

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
- **Additions**: `DataSyncStatus` (thin bar under the header), `LoadingApplications` only during the **first** live fetch, and optional empty copy in `ActivityStrip` when the sheet returns no activity rows.

---

## Google Apps Script response (recommended)

Use **`ContentService`** with MIME type **`JSON`** in `doGet`, and deploy as a **Web app** with **Who has access: Anyone** so the browser can call it with `fetch` (CORS).

A full sample is in **`scripts/google-apps-script/afterapply-api.gs`**. It:

- Reads a sheet named **`Applications`** (configurable).
- Maps headers to the camelCase keys the UI expects.
- Optionally reads **`Activity`** for `activityLog`.

Point `VITE_AFTERAPPLY_APPS_SCRIPT_URL` at the deployment URL that ends in **`/exec`**.

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
