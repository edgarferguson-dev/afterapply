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
    <tr className="border-b border-surface-subtle transition-colors hover:bg-surface-100">
      <td className="py-3 pl-4 pr-3 sm:pl-5">
        <div>
          <div className="font-semibold text-sm text-primary">
            {app.company}
          </div>
          <div className="text-xs text-tertiary mt-0.5 max-w-[220px] truncate">
            {app.role}
          </div>
        </div>
      </td>
      <td className="hidden px-3 py-3 lg:table-cell">
        <span className="text-xs text-tertiary font-mono">
          {formatDate(app.dateApplied)}
        </span>
      </td>
      <td className="px-3 py-3">
        <StatusPill status={app.status} />
      </td>
      <td className="hidden px-3 py-3 xl:table-cell">
        <code className="text-[11px] font-mono text-tertiary bg-surface-100 px-1.5 py-0.5 rounded">
          {app.caseCode}
        </code>
      </td>
      <td className="hidden px-3 py-3 md:table-cell">
        <a
          href={app.jobLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] text-tertiary hover:text-secondary transition-colors"
          title={app.jobLink}
        >
          <ExternalLink className="h-3 w-3" strokeWidth={1.5} />
          <span className="sr-only">Job listing</span>
        </a>
      </td>
      <td className="hidden px-3 py-3 sm:table-cell">
        <span className="text-xs text-tertiary font-mono">
          {formatDate(app.lastUpdated)}
        </span>
      </td>
    </tr>
  );
}

function ApplicationCard({ app }) {
  return (
    <div className="rounded-xl border border-surface-subtle bg-surface-100 p-3.5 transition-colors hover:bg-surface-200 hover:border-surface">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-sm text-primary truncate">
            {app.company}
          </h3>
          <p className="text-xs text-tertiary mt-0.5 truncate">{app.role}</p>
        </div>
        <StatusPill status={app.status} size="xs" />
      </div>
      <div className="mt-2.5 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
        <div>
          <span className="text-tertiary uppercase tracking-wider text-[10px] font-medium">
            Applied
          </span>
          <p className="text-secondary font-mono mt-0.5">
            {formatDate(app.dateApplied)}
          </p>
        </div>
        <div>
          <span className="text-tertiary uppercase tracking-wider text-[10px] font-medium">
            Updated
          </span>
          <p className="text-secondary font-mono mt-0.5">
            {formatDate(app.lastUpdated)}
          </p>
        </div>
        <div>
          <span className="text-tertiary uppercase tracking-wider text-[10px] font-medium">
            Case
          </span>
          <p className="text-tertiary font-mono mt-0.5">{app.caseCode}</p>
        </div>
        <div className="flex items-end">
          <a
            href={app.jobLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-tertiary hover:text-secondary transition-colors"
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
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-secondary">
          All Applications
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-tertiary">
            {applications.length} total
          </span>
          <div className="hidden sm:flex items-center gap-1 ml-2">
            <ArrowUpDown className="h-3 w-3 text-tertiary" />
            {["lastUpdated", "dateApplied", "status"].map((key) => (
              <button
                key={key}
                onClick={() => setSortBy(key)}
                className={`text-[10px] px-2 py-0.5 rounded-md font-medium transition-colors ${
                  sortBy === key
                    ? "bg-surface-200 text-primary ring-1 ring-surface-subtle"
                    : "text-tertiary hover:text-secondary"
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
      <div className="hidden sm:block overflow-hidden rounded-xl border border-surface bg-surface-50">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-surface">
              {[
                { label: "Company / Role", className: "pl-4 sm:pl-5", show: "" },
                { label: "Applied", className: "", show: "hidden lg:table-cell" },
                { label: "Status", className: "", show: "" },
                { label: "Case", className: "", show: "hidden xl:table-cell" },
                { label: "Link", className: "", show: "hidden md:table-cell" },
                { label: "Updated", className: "", show: "hidden sm:table-cell" },
              ].map((col) => (
                <th
                  key={col.label}
                  className={`${col.show} ${col.className} px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-widest text-tertiary`}
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
                  className="px-4 py-12 text-center text-sm text-tertiary"
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
      <div className="sm:hidden space-y-2">
        {sorted.length === 0 ? (
          <div className="rounded-xl border border-dashed border-surface-subtle bg-surface-50 py-10 text-center text-sm text-tertiary">
            No applications to show.
          </div>
        ) : (
          sorted.map((app) => <ApplicationCard key={app.id} app={app} />)
        )}
      </div>
    </section>
  );
}
