import { ArrowLeft, ArrowUpRight, Clock3, Route } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { formatDateTime } from "../../lib/utils";
import { scenarioTemplates } from "../../data/firstPathData";

function stateBadgeVariant(state) {
  if (state === "Escalated") return "coral";
  if (state === "Resolved") return "success";
  if (state === "Review needed") return "gold";
  return "aqua";
}

export function StudentMobile({ caseRecord, onAction, onNavigate, preview = false }) {
  if (!caseRecord) {
    return (
      <main className="relative mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-8">
        <Card className="w-full bg-[color:var(--fp-surface)]">
          <CardContent className="p-6 text-center">
            <p className="text-lg font-semibold text-slate-950">Scenario not found</p>
            <p className="mt-2 text-sm text-slate-600">The QR or share link does not point to an active case.</p>
          </CardContent>
        </Card>
      </main>
    );
  }

  const template = scenarioTemplates.find((entry) => entry.id === caseRecord.scenarioId);
  const currentStopIndex = template.routeStops.findIndex((stop) => stop === template.currentStop);

  return (
    <main className={`relative ${preview ? "" : "mx-auto min-h-screen max-w-[470px] px-4 py-6"}`}>
      {!preview && (
        <div className="mb-4 flex items-center justify-between">
          <button type="button" onClick={() => onNavigate?.("/admin")} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
            <ArrowLeft className="size-4" />
            Staff view
          </button>
          <Badge variant="aqua">Student scenario</Badge>
        </div>
      )}

      <div className="relative overflow-hidden rounded-[36px] border border-[color:var(--fp-line)] bg-[linear-gradient(180deg,#fbfaf7_0%,#f3efe8_100%)] p-3 shadow-[var(--fp-shadow-md)]">
        <div className="mx-auto mb-3 h-1.5 w-28 rounded-full bg-slate-900/10" />
        <div className="overflow-hidden rounded-[28px] border border-[color:var(--fp-line)] bg-[color:var(--fp-surface)]">
          <div className="border-b border-[color:var(--fp-line)] px-5 pb-5 pt-6">
            <div className="flex items-center justify-between gap-3">
              <Badge variant="indigo">First Path</Badge>
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{template.routeLabel}</span>
            </div>

            <div className="mt-5 rounded-full border border-[color:rgba(0,120,198,0.18)] bg-[color:rgba(0,120,198,0.08)] px-4 py-3">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--fp-blue)]">
                <Route className="size-3.5" />
                You are here
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {template.routeStops.map((stop, index) => {
                  const isCurrent = index === currentStopIndex;
                  const isComplete = index < currentStopIndex;
                  return (
                    <div key={stop} className="flex items-center gap-2">
                      <div className={`flex items-center gap-2 rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] ${isCurrent ? "text-white" : isComplete ? "bg-[color:rgba(0,147,60,0.08)] text-[color:var(--fp-green)]" : "bg-[color:var(--fp-surface)] text-slate-500 border border-[color:var(--fp-line)]"}`} style={isCurrent ? { backgroundColor: template.routeColor } : undefined}>
                        <span className={`inline-flex size-2 rounded-full ${isCurrent ? "bg-white" : isComplete ? "bg-[color:var(--fp-green)]" : "bg-[color:var(--fp-line)]"}`} />
                        {stop}
                      </div>
                      {index < template.routeStops.length - 1 && <div className="h-px w-4 bg-[color:var(--fp-line)] sm:w-6" />}
                    </div>
                  );
                })}
              </div>
            </div>

            <h1 className="mt-5 text-[2rem] font-semibold tracking-[-0.06em] text-slate-950">{template.studentLabel}</h1>
            <p className="mt-2 text-sm leading-7 text-slate-600">This is your current stop. Finishing it unlocks the next part of your enrollment route.</p>
          </div>

          <div className="space-y-3 px-4 py-4">
            <Card className="bg-[color:var(--fp-surface)] shadow-none">
              <CardContent className="p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={stateBadgeVariant(caseRecord.escalationState)}>{caseRecord.escalationState}</Badge>
                  <Badge variant="gold">{caseRecord.urgency}</Badge>
                </div>
                <h2 className="mt-4 text-[1.85rem] font-semibold tracking-[-0.05em] text-slate-950">{caseRecord.blockerTitle}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{caseRecord.blockerDetail}</p>
              </CardContent>
            </Card>

            <div className="rounded-[18px] bg-[color:rgba(255,99,25,0.08)] px-4 py-4 text-[color:#9A3E12]">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em]">
                <Clock3 className="size-4" />
                Timing and urgency
              </div>
              <div className="mt-2 text-base font-semibold">{caseRecord.dueLabel}</div>
              <div className="mt-1 text-sm leading-6">{caseRecord.whyItMatters}</div>
            </div>

            <Card className="bg-[color:var(--fp-surface)] shadow-none">
              <CardContent className="p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Next stop if this clears</p>
                <p className="mt-2 text-sm leading-7 text-slate-700">{caseRecord.recommendedAction}</p>
              </CardContent>
            </Card>

            <Card className="bg-[color:var(--fp-surface)] shadow-none">
              <CardContent className="p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Choose your update</p>
                <div className="mt-4 grid gap-3">
                  {template.actions.map((action) => {
                    const isPrimary = action.id === "mark_complete";
                    const isGhost = action.id === "plans_changed";
                    return (
                      <Button
                        key={action.id}
                        variant={isPrimary ? "default" : isGhost ? "ghost" : "secondary"}
                        className={`w-full justify-between rounded-[16px] h-12 ${!isPrimary && !isGhost ? "border-[color:var(--fp-line)] bg-[color:var(--fp-surface)]" : ""} ${isGhost ? "justify-start px-0 text-slate-600" : ""}`}
                        onClick={() => onAction(caseRecord.id, action.id)}
                      >
                        {action.label}
                        {!isGhost && <ArrowUpRight className="size-4" />}
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[18px] border border-[color:var(--fp-line)] bg-[color:var(--fp-surface-2)] px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Latest update</p>
                <p className="mt-2 font-semibold text-slate-950">{caseRecord.lastActionLabel}</p>
                <p className="mt-1 text-sm text-slate-500">{formatDateTime(caseRecord.lastUpdatedAt)}</p>
              </div>
              <div className="rounded-[18px] border border-[color:var(--fp-line)] bg-[color:var(--fp-surface-2)] px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Update sent to</p>
                <p className="mt-2 font-semibold text-slate-950">{caseRecord.nextOwnerOffice}</p>
                <p className="mt-1 text-sm text-slate-500">That office now owns the next action on your route.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
