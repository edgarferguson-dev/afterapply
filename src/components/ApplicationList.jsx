import { ExternalLink, ArrowUpDown, Grid, List, MoreVertical } from "lucide-react";
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

function DataCard({ app, isPriority = false }) {
  return (
    <div className={`
      data-surface p-4 transition-all duration-300 group
      ${isPriority ? 'ring-2 ring-amber-500/30 glow-amber' : ''}
      hover:scale-[1.02] hover:shadow-xl
      relative overflow-hidden
    `}>
      {/* Priority indicator */}
      {isPriority && (
        <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
      )}
      
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-display text-primary truncate mb-1">
            {app.company}
          </h3>
          <p className="text-secondary text-sm truncate">{app.role}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusPill status={app.status} size="sm" />
          <button className="surface-100 h-8 w-8 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreVertical className="h-4 w-4 text-tertiary" strokeWidth={1.5} />
          </button>
        </div>
      </div>
      
      {/* Metadata grid */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="surface-50 rounded-lg p-2">
          <div className="text-xs text-tertiary uppercase tracking-wider mb-1">Applied</div>
          <div className="text-sm font-mono text-secondary">{formatDate(app.dateApplied)}</div>
        </div>
        <div className="surface-50 rounded-lg p-2">
          <div className="text-xs text-tertiary uppercase tracking-wider mb-1">Updated</div>
          <div className="text-sm font-mono text-secondary">{formatDate(app.lastUpdated)}</div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="surface-100 px-2 py-1 rounded-lg">
          <code className="text-xs font-mono text-tertiary">{app.caseCode}</code>
        </div>
        <a
          href={app.jobLink}
          target="_blank"
          rel="noopener noreferrer"
          className="surface-glass px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs text-secondary hover:text-primary transition-colors"
        >
          <ExternalLink className="h-3 w-3" strokeWidth={1.5} />
          <span>View Listing</span>
        </a>
      </div>
      
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
}

function DataSurface({ applications, sortBy, setSortBy }) {
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
    <div className="data-surface p-6">
      {/* Surface header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="surface-200 h-8 w-8 rounded-lg flex items-center justify-center">
            <Grid className="h-4 w-4 text-primary" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-display text-primary">Application Surface</h2>
            <p className="text-xs text-tertiary">Interactive data layer</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="surface-100 px-3 py-1.5 rounded-lg">
            <span className="text-sm font-bold text-primary">{applications.length}</span>
            <span className="text-xs text-tertiary ml-1">total</span>
          </div>
          
          <div className="surface-glass px-3 py-1.5 rounded-lg flex items-center gap-2">
            <ArrowUpDown className="h-3 w-3 text-tertiary" strokeWidth={1.5} />
            {["lastUpdated", "dateApplied", "status"].map((key) => (
              <button
                key={key}
                onClick={() => setSortBy(key)}
                className={`text-xs px-2 py-1 rounded-md font-medium transition-colors ${
                  sortBy === key
                    ? "surface-200 text-primary border border-arch-subtle"
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
      
      {/* Data grid */}
      {sorted.length === 0 ? (
        <div className="surface-50 border-arch-subtle border-dashed rounded-xl p-12 text-center">
          <List className="h-12 w-12 text-tertiary mx-auto mb-4" strokeWidth={1.5} />
          <h3 className="text-display text-primary mb-2">No Applications</h3>
          <p className="text-secondary">Your application data will appear here once synced.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((app) => (
            <DataCard
              key={app.id}
              app={app}
              isPriority={app.status === "interview"}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ApplicationList({ applications }) {
  const [sortBy, setSortBy] = useState("lastUpdated");

  return (
    <section>
      <DataSurface 
        applications={applications} 
        sortBy={sortBy} 
        setSortBy={setSortBy} 
      />
    </section>
  );
}
