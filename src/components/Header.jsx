import { ArrowUpRight, Orbit, Radar, Sparkles } from "lucide-react";

export default function Header({ stats }) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="mx-auto mb-4 w-full max-w-[84rem] px-4 pt-4 sm:px-6 lg:px-8 lg:pt-6">
      <div className="hero-panel px-5 py-5 sm:px-7 sm:py-7 lg:px-8 lg:py-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(21rem,0.9fr)] lg:items-end">
          <div className="space-y-5">
            <span className="eyebrow">
              <span className="eyebrow-dot" />
              Follow-up control surface
            </span>

            <div className="max-w-3xl">
              <div className="mb-3 flex items-center gap-3 text-[color:var(--text-secondary)]">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                  <Orbit className="h-5 w-5 text-[color:var(--accent-cyan)]" strokeWidth={1.7} />
                </div>
                <span className="section-label">AfterApply</span>
              </div>
              <h1 className="display-title max-w-3xl text-[color:var(--text-primary)]">
                <span className="text-white/92">A calmer system</span>{" "}
                <span className="text-[color:var(--accent-cyan)]">for keeping momentum</span>{" "}
                <span className="text-white/78">on every application.</span>
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-[color:var(--text-secondary)] sm:text-[15px]">
                Follow up before opportunities go cold, keep context close, and move through the pipeline with the discipline of a premium product dashboard instead of a spreadsheet.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="metric-tile sm:col-span-2">
              <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                  <p className="mini-kicker">Active pipeline</p>
                  <p className="mt-2 text-4xl font-semibold tracking-[-0.08em] text-[color:var(--text-primary)]">
                    {stats?.activePipeline ?? 0}
                  </p>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 p-2.5">
                  <Radar className="h-4 w-4 text-[color:var(--accent-blue)]" strokeWidth={1.7} />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-[color:var(--text-secondary)]">
                <span className="mono-meta">{today}</span>
                <span className="inline-flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-[color:var(--accent-cyan)]" strokeWidth={1.8} />
                  Premium follow-up layer
                </span>
              </div>
            </div>

            <div className="metric-tile">
              <p className="mini-kicker">Response rate</p>
              <p className="mt-3 text-2xl font-semibold tracking-[-0.06em] text-[color:var(--text-primary)]">
                {stats?.responseRate ?? 0}%
              </p>
              <p className="mt-2 text-xs text-[color:var(--text-muted)]">
                Based on responded and interview outcomes.
              </p>
            </div>

            <div className="metric-tile">
              <p className="mini-kicker">Interviews</p>
              <p className="mt-3 text-2xl font-semibold tracking-[-0.06em] text-[color:var(--text-primary)]">
                {stats?.interviewCount ?? 0}
              </p>
              <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-[color:var(--text-secondary)]">
                <ArrowUpRight className="h-3.5 w-3.5 text-[color:var(--accent-green)]" strokeWidth={1.8} />
                Highest-conviction opportunities stay surfaced.
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
