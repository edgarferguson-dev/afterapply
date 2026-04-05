import { ExternalLink, ArrowUpDown } from "lucide-react";
import { useState } from "react";
import StatusPill from "./StatusPill";
import { formatDate } from "../utils/helpers";

const STATUS_ORDER = {
  interview: 0,
  responded: 1,
  followed_up: 2,
  waiting: 3,
  closed: 4,
};

function ApplicationRow({ app }) {
  return (
    <tr className="border-b border-zinc-800/30 transition-colors hover:bg-zinc-800/15">
      <td className="py-3.5 pl-5 pr-3 sm:pl-6">
        <div>
          <div className="font-semibold text-sm text-zinc-200">
            {app.company}
          </div>
          <div className="text-xs text-zinc-500 mt-0.5 max-w-[220px] truncate">
            {app.role}
          </div>
        </div>
      </td>
      <td className="hidden px-3 py-3.5 lg:table-cell">
        <span className="text-xs text-zinc-500 font-mono">
          {formatDate(app.dateApplied)}
        </span>
      </td>
      <td className="px-3 py-3.5">
        <StatusPill status={app.status} />
      </td>
      <td className="hidden px-3 py-3.5 xl:table-cell">
        <code className="text-[11px] font-mono text-zinc-600 bg-zinc-800/40 px-1.5 py-0.5 rounded">
          {app.caseCode}
        </code>
      </td>
      <td className="hidden px-3 py-3.5 md:table-cell">
        <a
          href={app.jobLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors"
          title={app.jobLink}
        >
          <ExternalLink className="h-3 w-3" strokeWidth={1.5} />
          <span className="sr-only">Job listing</span>
        </a>
      </td>
      <td className="hidden px-3 py-3.5 sm:table-cell">
        <span className="text-xs text-zinc-500 font-mono">
          {formatDate(app.lastUpdated)}
        </span>
      </td>
    </tr>
  );
}

function ApplicationCard({ app }) {
  return (
    <div className="rounded-xl border border-zinc-800/40 bg-zinc-900/30 p-4 transition-colors hover:bg-zinc-800/20 hover:border-zinc-700/40">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-sm text-zinc-200 truncate">
            {app.company}
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5 truncate">{app.role}</p>
        </div>
        <StatusPill status={app.status} size="xs" />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
        <div>
          <span className="text-zinc-600 uppercase tracking-wider text-[10px] font-medium">
            Applied
          </span>
          <p className="text-zinc-400 font-mono mt-0.5">
            {formatDate(app.dateApplied)}
          </p>
        </div>
        <div>
          <span className="text-zinc-600 uppercase tracking-wider text-[10px] font-medium">
            Updated
          </span>
          <p className="text-zinc-400 font-mono mt-0.5">
            {formatDate(app.lastUpdated)}
          </p>
        </div>
        <div>
          <span className="text-zinc-600 uppercase tracking-wider text-[10px] font-medium">
            Case
          </span>
          <p className="text-zinc-500 font-mono mt-0.5">{app.caseCode}</p>
        </div>
        <div className="flex items-end">
          <a
            href={app.jobLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            <ExternalLink className="h-3 w-3" strokeWidth={1.5} />
            Listing
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ApplicationList({ applications }) {
  const [sortBy, setSortBy] = useState("lastUpdated");

  const sorted = [...applications].sort((a, b) => {
    if (sortBy === "lastUpdated") {
      return new Date(b.lastUpdated) - new Date(a.lastUpdated);
    }
    if (sortBy === "status") {
      return (STATUS_ORDER[a.status] ?? 5) - (STATUS_ORDER[b.status] ?? 5);
    }
    if (sortBy === "dateApplied") {
      return new Date(b.dateApplied) - new Date(a.dateApplied);
    }
    return 0;
  });

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
          All Applications
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-zinc-600">
            {applications.length} total
          </span>
          <div className="hidden sm:flex items-center gap-1 ml-2">
            <ArrowUpDown className="h-3 w-3 text-zinc-600" />
            {["lastUpdated", "dateApplied", "status"].map((key) => (
              <button
                key={key}
                onClick={() => setSortBy(key)}
                className={`text-[10px] px-2 py-0.5 rounded-md font-medium transition-colors ${
                  sortBy === key
                    ? "bg-zinc-800 text-zinc-300 ring-1 ring-zinc-700/50"
                    : "text-zinc-600 hover:text-zinc-400"
                }`}
              >
                {key === "lastUpdated"
                  ? "Recent"
                  : key === "dateApplied"
                  ? "Applied"
                  : "Status"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-hidden rounded-xl border border-zinc-800/50 bg-zinc-900/20">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-zinc-800/50">
              {[
                { label: "Company / Role", className: "pl-5 sm:pl-6", show: "" },
                { label: "Applied", className: "", show: "hidden lg:table-cell" },
                { label: "Status", className: "", show: "" },
                { label: "Case", className: "", show: "hidden xl:table-cell" },
                { label: "Link", className: "", show: "hidden md:table-cell" },
                { label: "Updated", className: "", show: "hidden sm:table-cell" },
              ].map((col) => (
                <th
                  key={col.label}
                  className={`${col.show} ${col.className} px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-zinc-600`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-14 text-center text-sm text-zinc-500"
                >
                  No applications to show.
                </td>
              </tr>
            ) : (
              sorted.map((app) => <ApplicationRow key={app.id} app={app} />)
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-2.5">
        {sorted.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-800/50 bg-zinc-900/20 py-12 text-center text-sm text-zinc-500">
            No applications to show.
          </div>
        ) : (
          sorted.map((app) => <ApplicationCard key={app.id} app={app} />)
        )}
      </div>
    </section>
  );
}
