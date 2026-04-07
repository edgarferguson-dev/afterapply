import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Copy, Plus, QrCode, RadioTower, RefreshCcw, Smartphone, TrainTrack } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { formatDateTime } from "../../lib/utils";

function toneClasses(tone) {
  if (tone === "critical") return "border-[color:rgba(180,83,77,0.16)] bg-[color:rgba(180,83,77,0.08)] text-[color:var(--fp-danger)]";
  if (tone === "review") return "border-[color:rgba(183,128,26,0.16)] bg-[color:rgba(183,128,26,0.08)] text-[color:var(--fp-review)]";
  if (tone === "success") return "border-[color:rgba(47,125,87,0.16)] bg-[color:rgba(47,125,87,0.08)] text-[color:var(--fp-success)]";
  return "border-[color:var(--fp-border)] bg-slate-50 text-slate-700";
}

function stateVariant(state) {
  if (state === "Escalated") return "coral";
  if (state === "Resolved") return "success";
  if (state === "Review needed") return "gold";
  return "aqua";
}

function shareLink(caseItem) {
  return `${window.location.origin}/go/${caseItem.id}`;
}

function routeTemplate(scenarioTemplates, caseItem) {
  return scenarioTemplates.find((entry) => entry.id === caseItem.scenarioId);
}

function QueueCard({ caseItem, selected, onSelect, template }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(caseItem.id)}
      className={`w-full rounded-[26px] border p-4 text-left transition ${selected ? "border-[color:rgba(31,122,108,0.18)] bg-[color:rgba(31,122,108,0.08)]" : "border-[color:var(--fp-border)] bg-[color:var(--fp-surface-strong)] hover:border-slate-300"}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-slate-950">{caseItem.studentName}</p>
            <Badge variant={stateVariant(caseItem.escalationState)}>{caseItem.escalationState}</Badge>
          </div>
          <p className="mt-1 text-sm text-slate-500">{template.routeLabel}</p>
          <p className="mt-3 text-sm leading-6 text-slate-700">{caseItem.blockerTitle}</p>
          <div className="mt-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            <span className="inline-flex size-2 rounded-full" style={{ backgroundColor: template.routeColor }} />
            {caseItem.nextOwnerOffice}
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-slate-600">{caseItem.dueLabel}</p>
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">{caseItem.lastActionLabel}</p>
        </div>
      </div>
    </button>
  );
}

function QRCodePanel({ caseItem, onNavigate, embedded = false }) {
  const [copied, setCopied] = useState(false);
  const src = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(shareLink(caseItem))}`;

  async function handleCopy() {
    await navigator.clipboard.writeText(shareLink(caseItem));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  const content = (
    <>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Student access</p>
            <h3 className="mt-2 text-lg font-semibold tracking-[-0.03em] text-slate-950">QR and share link</h3>
          </div>
          <div className="rounded-2xl bg-[color:var(--fp-ink)] p-3 text-white">
            <QrCode className="size-5" />
          </div>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(240px,280px)_1fr] lg:items-stretch">
          <div className="flex h-full items-center justify-center rounded-[28px] border border-[color:var(--fp-border)] bg-[color:var(--fp-surface-strong)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
            <img src={src} alt="Scenario QR code" className="mx-auto h-[204px] w-[204px] rounded-2xl" />
          </div>
          <div className="flex h-full flex-col justify-between gap-3">
            <div className="rounded-[22px] bg-slate-900/[0.035] p-4 text-sm leading-7 text-slate-600">
              Student route opens the focused blocker flow directly. This is the handoff surface, not a portal.
            </div>
            <div className="rounded-[22px] border border-[color:var(--fp-border)] bg-[color:var(--fp-surface-strong)] p-4 text-sm text-slate-700">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Share link</p>
              <p className="mt-2 break-all font-medium text-slate-900">{shareLink(caseItem)}</p>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <Button variant="secondary" onClick={handleCopy}>
                <Copy className="size-4" />
                {copied ? "Copied" : "Copy link"}
              </Button>
              <Button onClick={() => onNavigate(`/go/${caseItem.id}`)}>
                <Smartphone className="size-4" />
                Open student view
              </Button>
            </div>
          </div>
        </div>
    </>
  );

  if (embedded) {
    return content;
  }

  return (
    <Card className="bg-[linear-gradient(180deg,rgba(255,252,247,0.96),rgba(247,244,238,0.96))]">
      <CardContent className="p-5">{content}</CardContent>
    </Card>
  );
}

export function StaffDashboard({
  cases,
  selectedCase,
  scenarioTemplates,
  presentationMode,
  onNavigate,
  onCreateCase,
  onResetDemo,
  onSelectCase,
  onForceEscalation,
  onTogglePresentation,
  children,
}) {
  const MotionDiv = motion.div;
  const [templateId, setTemplateId] = useState(scenarioTemplates[0].id);
  const selectedRoute = routeTemplate(scenarioTemplates, selectedCase);

  const alerts = useMemo(
    () => cases.flatMap((caseItem) => caseItem.alerts.map((alert) => ({ ...alert, caseId: caseItem.id, studentName: caseItem.studentName }))).sort((a, b) => new Date(b.at) - new Date(a.at)),
    [cases],
  );

  const activeCases = useMemo(
    () => [...cases].sort((a, b) => new Date(b.lastUpdatedAt) - new Date(a.lastUpdatedAt)),
    [cases],
  );

  const selectedTemplate = scenarioTemplates.find((entry) => entry.id === templateId);
  const metrics = {
    live: activeCases.length,
    escalated: activeCases.filter((item) => item.escalationState === "Escalated").length,
    watching: activeCases.filter((item) => item.escalationState === "Watching").length,
    resolved: activeCases.filter((item) => item.escalationState === "Resolved").length,
  };
  const officeBoard = ["Admissions Support", "Financial Aid", "Health Compliance", "Advising", "Registrar"].map((office) => ({
    office,
    count: activeCases.filter((item) => item.nextOwnerOffice === office).length,
  }));

  return (
    <main className="relative mx-auto w-full max-w-[1500px] px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
      <MotionDiv initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42, ease: "easeOut" }} className="space-y-4">
        <section className="grid gap-4 xl:grid-cols-[1.16fr_0.84fr]">
          <Card className="overflow-hidden bg-[linear-gradient(135deg,#162126_0%,#1c2d33_48%,#23444e_100%)] text-white">
            <CardContent className="p-7 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="default" className="border-white/10 bg-white/10 text-white/72">First Path</Badge>
                    <Badge variant="default" className="border-white/10 bg-white/10 text-white/72">NYC handoff board</Badge>
                  </div>
                  <h1 className="mt-5 max-w-3xl text-3xl font-semibold tracking-[-0.08em] sm:text-[3rem] sm:leading-[1.02]">
                    A control room for the moment a student gets stuck.
                  </h1>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-white/68">
                    Built like an operations board, not a portal. Staff starts one route, tracks one live handoff, and sees the next office light up when the student responds.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" className="border-white/12 bg-white/10 text-white hover:bg-white/14" onClick={onTogglePresentation}>Presentation mode</Button>
                  <Button variant="secondary" className="border-white/12 bg-white/10 text-white hover:bg-white/14" onClick={onResetDemo}>
                    <RefreshCcw className="size-4" />
                    Reset demo
                  </Button>
                </div>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-4">
                {[
                  { label: "Live routes", value: metrics.live },
                  { label: "Escalated", value: metrics.escalated },
                  { label: "Watching", value: metrics.watching },
                  { label: "Resolved", value: metrics.resolved },
                ].map((metric) => (
                  <div key={metric.label} className="rounded-[24px] border border-white/10 bg-white/7 px-4 py-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/52">{metric.label}</p>
                    <p className="mt-3 text-3xl font-semibold tracking-[-0.05em]">{metric.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[linear-gradient(180deg,rgba(252,249,244,0.96),rgba(255,253,249,0.98))]">
            <CardContent className="p-6 sm:p-7">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Dispatch</p>
                  <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-slate-950">Start a new route</h2>
                </div>
                <div className="rounded-2xl bg-[color:var(--fp-ink)] p-3 text-white">
                  <RadioTower className="size-5" />
                </div>
              </div>
              <div className="mt-4 grid gap-3">
                <label className="text-sm font-medium text-slate-600" htmlFor="scenario-template">Scenario template</label>
                <select id="scenario-template" value={templateId} onChange={(event) => setTemplateId(event.target.value)} className="h-12 rounded-[18px] border border-[color:var(--fp-border)] bg-white px-4 text-sm text-slate-700 outline-none">
                  {scenarioTemplates.map((template) => (
                    <option key={template.id} value={template.id}>{template.label}</option>
                  ))}
                </select>
                <div className="rounded-[24px] bg-slate-900/[0.035] p-4 text-sm leading-7 text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex size-3 rounded-full" style={{ backgroundColor: selectedTemplate.routeColor }} />
                    <p className="font-semibold text-slate-900">{selectedTemplate.routeLabel}</p>
                  </div>
                  <p className="mt-3 text-slate-700">{selectedTemplate.blockerTitle}</p>
                  <p className="mt-2">Owned by {selectedTemplate.ownerOffice}. Student sees one blocker and one short set of responses.</p>
                </div>
                <Button onClick={() => onCreateCase(templateId)}>
                  <Plus className="size-4" />
                  Start scenario
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.36fr)_minmax(320px,0.74fr)] xl:items-start">
          <div className="space-y-4">
            <div className="grid gap-4 xl:grid-cols-[minmax(320px,0.72fr)_minmax(0,1.28fr)] xl:items-start">
              <Card className="bg-[linear-gradient(180deg,rgba(255,252,247,0.95),rgba(248,244,239,0.96))]">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Active cases</p>
                      <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-slate-950">Control queue</h2>
                    </div>
                    <Badge variant="default">{activeCases.length} live</Badge>
                  </div>
                  <div className="mt-4 rounded-[18px] border border-[color:var(--fp-line)] bg-[color:var(--fp-surface-2)] px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Legend</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge variant="aqua">Awaiting student</Badge>
                      <Badge variant="gold">Support requested</Badge>
                      <Badge variant="coral">Escalated</Badge>
                      <Badge variant="success">Resolved</Badge>
                    </div>
                  </div>
                  <div className="mt-4 space-y-3">
                    {activeCases.map((caseItem) => (
                      <QueueCard
                        key={caseItem.id}
                        caseItem={caseItem}
                        selected={selectedCase.id === caseItem.id}
                        onSelect={onSelectCase}
                        template={routeTemplate(scenarioTemplates, caseItem)}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[linear-gradient(180deg,rgba(255,253,249,0.96),rgba(249,245,239,0.96))]">
                <CardContent className="p-6 sm:p-7">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="gold">{selectedCase.urgency}</Badge>
                        <Badge variant={stateVariant(selectedCase.escalationState)}>{selectedCase.escalationState}</Badge>
                      </div>
                      <h2 className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-slate-950">{selectedCase.studentName}</h2>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{selectedCase.highSchoolName} to {selectedCase.collegeName}</p>
                    </div>
                    <Button variant="secondary" onClick={() => onForceEscalation(selectedCase.id)}>
                      <AlertTriangle className="size-4" />
                      Escalate silence
                    </Button>
                  </div>
                  <div className="mt-6 space-y-4">
                    <div className="rounded-[28px] bg-[color:var(--fp-ink)] px-5 py-5 text-white">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">Current blocker</p>
                          <h3 className="mt-3 text-xl font-semibold tracking-[-0.04em]">{selectedCase.blockerTitle}</h3>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/72">
                          <TrainTrack className="size-3.5" />
                          {selectedRoute.routeLabel}
                        </div>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-white/72">{selectedCase.blockerDetail}</p>
                      <div className="mt-5 flex flex-wrap items-center gap-2">
                        {selectedRoute.routeStops.map((stop, index) => {
                          const active = stop === selectedRoute.currentStop;
                          return (
                            <div key={stop} className="flex items-center gap-2">
                              <div className={`flex items-center gap-2 rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] ${active ? "text-white" : "bg-white/8 text-white/54"}`} style={active ? { backgroundColor: selectedRoute.routeColor } : undefined}>
                                <span className={`inline-flex size-2 rounded-full ${active ? "bg-white" : "bg-white/30"}`} />
                                {stop}
                              </div>
                              {index < selectedRoute.routeStops.length - 1 && <div className="h-px w-4 bg-white/14 sm:w-6" />}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-[24px] bg-white/72 p-4 text-sm text-slate-700">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Owner now</p>
                        <p className="mt-2 font-semibold text-slate-950">{selectedCase.nextOwnerOffice}</p>
                      </div>
                      <div className="rounded-[24px] bg-white/72 p-4 text-sm text-slate-700">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Student state</p>
                        <p className="mt-2 font-semibold text-slate-950">{selectedCase.studentState}</p>
                      </div>
                      <div className="rounded-[24px] bg-white/72 p-4 text-sm text-slate-700">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Last changed</p>
                        <p className="mt-2 font-semibold text-slate-950">{formatDateTime(selectedCase.lastUpdatedAt)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-[linear-gradient(180deg,rgba(255,252,247,0.96),rgba(249,245,240,0.96))]">
              <CardContent className="p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Student access</p>
                    <h3 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-slate-950">Live handoff surface</h3>
                  </div>
                  <Badge variant="default">{selectedRoute.routeLabel}</Badge>
                </div>
                <div className="mt-4 rounded-[24px] border border-[color:var(--fp-line)] bg-[color:rgba(255,255,255,0.64)] p-4 sm:p-5">
                  <QRCodePanel caseItem={selectedCase} onNavigate={onNavigate} embedded />
                </div>
                <div className="mt-4 rounded-[24px] border border-[color:var(--fp-line)] bg-[color:rgba(255,255,255,0.58)] p-4 sm:p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Latest movement</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {selectedCase.timeline.slice(0, 4).map((entry, index) => (
                      <div key={entry.id} className="relative rounded-[22px] bg-white/82 p-4">
                        <div className="absolute left-4 top-5 flex size-6 items-center justify-center rounded-full text-[11px] font-semibold text-white" style={{ backgroundColor: index === 0 ? selectedRoute.routeColor : "#9aa4aa" }}>
                          {index + 1}
                        </div>
                        <div className="pl-10">
                          <p className="text-sm font-semibold text-slate-900">{entry.title}</p>
                          <p className="mt-1 text-sm leading-6 text-slate-600">{entry.detail}</p>
                          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{formatDateTime(entry.at)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid content-start gap-4 xl:self-start">
            {!presentationMode && children}

            <Card className="bg-[linear-gradient(180deg,rgba(255,252,247,0.96),rgba(248,244,239,0.96))]">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Signals</p>
                    <h3 className="mt-2 text-lg font-semibold tracking-[-0.03em] text-slate-950">Ownership changes and follow-up</h3>
                  </div>
                  <Badge variant="default">{alerts.length}</Badge>
                </div>
                <div className="mt-4 space-y-3">
                  {alerts.length === 0 ? (
                    <div className="rounded-[24px] border border-dashed border-[color:var(--fp-border)] bg-slate-50/70 p-6 text-sm text-slate-500">
                      No alerts yet. Student actions will show up here.
                    </div>
                  ) : (
                    alerts.map((alert) => (
                      <div key={alert.id} className={`rounded-[22px] border p-4 ${toneClasses(alert.tone)}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold">{alert.title}</p>
                            <p className="mt-1 text-sm opacity-80">{alert.studentName}</p>
                          </div>
                          <Badge variant="default">{alert.office}</Badge>
                        </div>
                        <p className="mt-3 text-sm leading-6">{alert.body}</p>
                        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] opacity-70">{formatDateTime(alert.at)}</p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden bg-[linear-gradient(135deg,#162126_0%,#1b2a2f_45%,#1d3940_100%)] text-white">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">Office board</p>
                    <h3 className="mt-2 text-lg font-semibold tracking-[-0.03em]">Where the next action goes</h3>
                  </div>
                  <RadioTower className="size-5 text-white/60" />
                </div>
                <div className="mt-5 space-y-3">
                  {officeBoard.map((row) => (
                    <div key={row.office} className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-[20px] border border-white/8 bg-white/7 px-4 py-4">
                      <div>
                        <p className="text-sm font-semibold">{row.office}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.14em] text-white/48">Active ownership</p>
                      </div>
                      <div className="text-2xl font-semibold tracking-[-0.04em]">{row.count}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </MotionDiv>
    </main>
  );
}

