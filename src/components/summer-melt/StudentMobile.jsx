import { ArrowLeft, ArrowUpRight, Clock3 } from "lucide-react";
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
        <Card className="w-full border-white/75 bg-white/90">
          <CardContent className="p-6 text-center">
            <p className="text-lg font-semibold text-slate-950">Scenario not found</p>
            <p className="mt-2 text-sm text-slate-600">The QR or share link does not point to an active case.</p>
          </CardContent>
        </Card>
      </main>
    );
  }

  const template = scenarioTemplates.find((entry) => entry.id === caseRecord.scenarioId);

  return (
    <main className={`relative ${preview ? "" : "mx-auto min-h-screen max-w-md px-4 py-6"}`}>
      {!preview && (
        <div className="mb-4 flex items-center justify-between">
          <button type="button" onClick={() => onNavigate?.("/admin")} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
            <ArrowLeft className="size-4" />
            Staff view
          </button>
          <Badge variant="aqua">Student scenario</Badge>
        </div>
      )}

      <div className="relative overflow-hidden rounded-[40px] border border-white/70 bg-[linear-gradient(180deg,rgba(251,252,250,0.96),rgba(241,245,241,0.98))] p-3 shadow-[0_30px_90px_rgba(15,23,42,0.12)]">
        <div className="mx-auto mb-3 h-1.5 w-28 rounded-full bg-slate-900/10" />
        <div className="overflow-hidden rounded-[32px] border border-white/80 bg-white/88">
          <div className="border-b border-slate-200/80 px-5 pb-5 pt-6">
            <div className="flex items-center justify-between gap-3">
              <Badge variant="indigo">First Path</Badge>
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{caseRecord.highSchoolName}</span>
            </div>
            <h1 className="mt-4 text-[2rem] font-semibold tracking-[-0.05em] text-slate-950">{template.studentLabel}</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">You only need to handle this one blocker right now for {caseRecord.collegeName}.</p>
          </div>

          <div className="space-y-4 px-4 py-4">
            <Card className="border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,248,244,0.98))] shadow-none">
              <CardContent className="p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="gold">{caseRecord.urgency}</Badge>
                  <Badge variant={stateBadgeVariant(caseRecord.escalationState)}>{caseRecord.escalationState}</Badge>
                </div>
                <h2 className="mt-4 text-2xl font-semibold tracking-[-0.05em] text-slate-950">{caseRecord.blockerTitle}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{caseRecord.blockerDetail}</p>
                <div className="mt-4 rounded-[24px] bg-slate-950 px-4 py-4 text-white">
                  <div className="flex items-center gap-2 text-white/70">
                    <Clock3 className="size-4" />
                    <span className="text-xs font-semibold uppercase tracking-[0.16em]">Timing</span>
                  </div>
                  <p className="mt-2 text-lg font-semibold">{caseRecord.dueLabel}</p>
                  <p className="mt-1 text-sm text-white/70">Staff sees this case update immediately after you choose an action.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/84 shadow-none">
              <CardContent className="space-y-4 p-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Why this matters</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{caseRecord.whyItMatters}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Recommended next step</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{caseRecord.recommendedAction}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/84 shadow-none">
              <CardContent className="p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">What you can tell us</p>
                <div className="mt-4 grid gap-3">
                  {template.actions.map((action) => (
                    <Button key={action.id} variant={action.id === "need_help" ? "secondary" : action.id === "plans_changed" ? "ghost" : "default"} className={`w-full justify-between ${action.id !== "mark_complete" ? "shadow-none" : ""}`} onClick={() => onAction(caseRecord.id, action.id)}>
                      {action.label}
                      <ArrowUpRight className="size-4" />
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/84 shadow-none">
              <CardContent className="space-y-3 p-5">
                <div className="rounded-[20px] border border-slate-200 bg-slate-50/80 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Latest update</p>
                  <p className="mt-2 font-semibold text-slate-950">{caseRecord.lastActionLabel}</p>
                  <p className="mt-1 text-sm text-slate-500">{formatDateTime(caseRecord.lastUpdatedAt)}</p>
                </div>
                <div className="rounded-[20px] border border-slate-200 bg-slate-50/80 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Next office</p>
                  <p className="mt-2 font-semibold text-slate-950">{caseRecord.nextOwnerOffice}</p>
                  <p className="mt-1 text-sm text-slate-500">Your update routes to the right team instead of disappearing into a general portal.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}

