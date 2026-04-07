import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Copy, MonitorSmartphone, Plus, QrCode, RadioTower, RefreshCcw, Search, Shuffle, Smartphone, TrainTrack } from "lucide-react";
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

function eventTone(type) {
  if (type === "escalation_triggered") return "critical";
  if (type === "awaiting_review" || type === "ownership_changed") return "review";
  if (type === "student_action_received" || type === "student_entered_flow") return "success";
  return "neutral";
}

function eventLabel(type) {
  if (type === "case_created") return "Case created";
  if (type === "scenario_assigned") return "Scenario assigned";
  if (type === "qr_generated") return "QR ready";
  if (type === "student_entered_flow") return "Student entered";
  if (type === "student_action_received") return "Action received";
  if (type === "ownership_changed") return "Ownership changed";
  if (type === "awaiting_review") return "Awaiting review";
  if (type === "escalation_triggered") return "Escalated";
  return "System event";
}

function hasEvent(caseItem, type) {
  return caseItem.timeline.some((entry) => entry.type === type);
}

function processSteps(caseItem) {
  const finalLabel =
    caseItem.escalationState === "Resolved"
      ? "Resolved"
      : caseItem.escalationState === "Review needed"
        ? "Awaiting review"
        : "Active";

  const steps = [
    { id: "triggered", label: "Case triggered", done: true },
    { id: "qr", label: "QR ready", done: hasEvent(caseItem, "qr_generated") },
    { id: "entered", label: "Student entered", done: hasEvent(caseItem, "student_entered_flow") },
    { id: "response", label: "Response received", done: hasEvent(caseItem, "student_action_received") },
    { id: "routed", label: "Routed to office", done: hasEvent(caseItem, "ownership_changed") || hasEvent(caseItem, "awaiting_review") || caseItem.escalationState === "Resolved" || caseItem.escalationState === "Escalated" },
    { id: "final", label: finalLabel, done: caseItem.escalationState === "Resolved" || caseItem.escalationState === "Review needed" || caseItem.escalationState === "Escalated" },
  ];

  const currentIndex = steps.findIndex((step) => !step.done);
  return {
    steps,
    currentIndex: currentIndex === -1 ? steps.length - 1 : currentIndex,
  };
}

function logicSummary(caseItem) {
  let interpretation = "System is waiting for the student to enter the live flow.";
  let nextAction = "Monitor the live session for student entry and response.";

  if (caseItem.lastActionLabel === "Student tapped Need help") {
    interpretation = "System escalated help request to the owning office for human intervention.";
    nextAction = `${caseItem.nextOwnerOffice} should review the blocker and contact the student immediately.`;
  } else if (caseItem.lastActionLabel === "Student tapped I already did this") {
    interpretation = "System flagged completion claim for verification before case closure.";
    nextAction = `${caseItem.nextOwnerOffice} must verify the record and resolve if confirmed.`;
  } else if (caseItem.lastActionLabel === "Student tapped Mark complete") {
    interpretation = "System routed completion to the success office for final confirmation.";
    nextAction = `${caseItem.nextOwnerOffice} should confirm clearance and close the case.`;
  } else if (caseItem.lastActionLabel === "Student tapped I can't do this yet") {
    interpretation = "System escalated active blocker requiring staff intervention.";
    nextAction = `${caseItem.nextOwnerOffice} should review options and set follow-up plan.`;
  } else if (caseItem.lastActionLabel === "Student tapped My plans changed") {
    interpretation = "System flagged potential enrollment intent change for review.";
    nextAction = `${caseItem.nextOwnerOffice} should confirm rerouting or case closure.`;
  } else if (caseItem.lastActionLabel === "Student opened the scenario") {
    interpretation = "Student entered the live flow and system is awaiting response.";
    nextAction = "Monitor for student action and route automatically when received.";
  } else if (caseItem.lastActionLabel === "Demo timer forced escalation") {
    interpretation = "System escalated due to no student response within time window.";
    nextAction = `${caseItem.nextOwnerOffice} must intervene manually.`;
  }

  return { interpretation, nextAction };
}

function QueueCard({ caseItem, selected, onSelect, template }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(caseItem.id)}
      className={`w-full rounded-lg border p-2 text-left transition ${selected ? "border-[color:rgba(31,122,108,0.3)] bg-[color:rgba(31,122,108,0.1)]" : "border-slate-200 bg-white hover:border-slate-300"}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <p className="text-xs font-semibold text-slate-950">{caseItem.studentName}</p>
            <Badge variant={stateVariant(caseItem.escalationState)} className="text-[9px] px-1 py-0.5">{caseItem.escalationState}</Badge>
          </div>
          <p className="mt-1 text-[10px] text-slate-500">{template.routeLabel}</p>
          <p className="mt-1 text-xs leading-4 text-slate-700 truncate">{caseItem.blockerTitle}</p>
          <div className="mt-1 flex items-center gap-1">
            <span className="inline-flex size-1.5 rounded-full" style={{ backgroundColor: template.routeColor }} />
            <p className="text-[9px] font-semibold text-slate-500">{caseItem.nextOwnerOffice}</p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-[10px] font-medium text-slate-600">{caseItem.dueLabel}</p>
          <p className="mt-1 text-[9px] uppercase tracking-[0.14em] text-slate-400">{caseItem.lastActionLabel}</p>
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
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [officeFilter, setOfficeFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");
  const [scenarioFilter, setScenarioFilter] = useState("all");
  const selectedRoute = routeTemplate(scenarioTemplates, selectedCase);

  const alerts = useMemo(
    () => cases.flatMap((caseItem) => caseItem.alerts.map((alert) => ({ ...alert, caseId: caseItem.id, studentName: caseItem.studentName }))).sort((a, b) => new Date(b.at) - new Date(a.at)),
    [cases],
  );

  const activeCases = useMemo(
    () => [...cases].sort((a, b) => new Date(b.lastUpdatedAt) - new Date(a.lastUpdatedAt)),
    [cases],
  );
  const filteredCases = useMemo(
    () =>
      activeCases.filter((caseItem) => {
        const template = routeTemplate(scenarioTemplates, caseItem);
        const query = searchQuery.trim().toLowerCase();
        const matchesQuery =
          !query ||
          caseItem.studentName.toLowerCase().includes(query) ||
          caseItem.id.toLowerCase().includes(query) ||
          caseItem.blockerTitle.toLowerCase().includes(query);
        const matchesStatus = statusFilter === "all" || caseItem.escalationState === statusFilter;
        const matchesOffice = officeFilter === "all" || caseItem.nextOwnerOffice === officeFilter;
        const matchesUrgency = urgencyFilter === "all" || caseItem.urgency === urgencyFilter;
        const matchesScenario = scenarioFilter === "all" || template.id === scenarioFilter;
        return matchesQuery && matchesStatus && matchesOffice && matchesUrgency && matchesScenario;
      }),
    [activeCases, officeFilter, scenarioFilter, scenarioTemplates, searchQuery, statusFilter, urgencyFilter],
  );

  const selectedTemplate = scenarioTemplates.find((entry) => entry.id === templateId);
  const selectedProcess = processSteps(selectedCase);
  const selectedLogic = logicSummary(selectedCase);
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
  const automationEvents = useMemo(
    () =>
      activeCases
        .flatMap((caseItem) =>
          caseItem.timeline.map((entry) => ({
            ...entry,
            caseId: caseItem.id,
            studentName: caseItem.studentName,
            sessionId: caseItem.sessionId,
          })),
        )
        .filter((entry) =>
          [
            "case_created",
            "scenario_assigned",
            "qr_generated",
            "student_entered_flow",
            "student_action_received",
            "ownership_changed",
            "escalation_triggered",
            "awaiting_review",
          ].includes(entry.type),
        )
        .sort((a, b) => new Date(b.at) - new Date(a.at))
        .slice(0, 8),
    [activeCases],
  );

  return (
    <main className="relative h-screen w-full overflow-hidden bg-slate-50">
      <MotionDiv initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42, ease: "easeOut" }} className="h-full overflow-y-auto">
        <section className="grid h-full grid-rows-[auto_1fr] gap-0">
          <div className="grid grid-cols-2 gap-0 border-b border-slate-200 bg-[linear-gradient(135deg,#162126_0%,#1c2d33_48%,#23444e_100%)] text-white">
            <div className="border-r border-slate-700/30 p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="border-white/10 bg-white/10 text-white/72 text-xs">First Path</Badge>
                  <Badge variant="default" className="border-white/10 bg-white/10 text-white/72 text-xs">Live handoff</Badge>
                </div>
                <div className="flex gap-1">
                  <Button variant="secondary" size="sm" className="border-white/12 bg-white/10 text-white hover:bg-white/14 px-2 py-1 text-xs" onClick={onTogglePresentation}>Present</Button>
                  <Button variant="secondary" size="sm" className="border-white/12 bg-white/10 text-white hover:bg-white/14 px-2 py-1 text-xs" onClick={onResetDemo}>
                    <RefreshCcw className="size-3" />
                  </Button>
                </div>
              </div>
              <h1 className="mt-2 text-lg font-semibold tracking-[-0.04em]">Control room for stuck students</h1>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {[
                  { label: "Live", value: metrics.live },
                  { label: "Escalated", value: metrics.escalated },
                  { label: "Watching", value: metrics.watching },
                  { label: "Resolved", value: metrics.resolved },
                ].map((metric) => (
                  <div key={metric.label} className="rounded-lg border border-white/10 bg-white/7 px-2 py-2 text-center">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/52">{metric.label}</p>
                    <p className="mt-1 text-lg font-semibold tracking-[-0.04em]">{metric.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Dispatch</p>
                  <h2 className="mt-1 text-sm font-semibold tracking-[-0.02em]">Start new route</h2>
                </div>
                <div className="rounded-lg bg-[color:var(--fp-ink)] p-2 text-white">
                  <RadioTower className="size-4" />
                </div>
              </div>
              <div className="mt-2 grid gap-2">
                <select value={templateId} onChange={(event) => setTemplateId(event.target.value)} className="h-8 rounded-lg border border-white/20 bg-white/10 px-2 text-xs text-white outline-none">
                  {scenarioTemplates.map((template) => (
                    <option key={template.id} value={template.id} className="text-slate-900">{template.label}</option>
                  ))}
                </select>
                <div className="rounded-lg bg-white/10 p-2 text-xs leading-5 text-white/80">
                  <div className="flex items-center gap-1">
                    <span className="inline-flex size-2 rounded-full" style={{ backgroundColor: selectedTemplate.routeColor }} />
                    <p className="font-semibold text-white">{selectedTemplate.routeLabel}</p>
                  </div>
                  <p className="mt-1 text-white/80">{selectedTemplate.blockerTitle}</p>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <Button size="sm" onClick={() => onCreateCase(templateId, "hero")} className="h-7 text-xs">
                    <Plus className="size-3" />
                    Hero
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => onCreateCase(templateId, "shuffle")} className="h-7 text-xs">
                    <Shuffle className="size-3" />
                    Shuffle
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid h-full grid-cols-3 gap-0">
          <div className="border-r border-slate-200 bg-white">
            <div className="border-b border-slate-200 p-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Active cases</p>
                  <h2 className="mt-1 text-sm font-semibold tracking-[-0.02em] text-slate-950">Control queue</h2>
                </div>
                <Badge variant="default" className="text-xs">{filteredCases.length}</Badge>
              </div>
              <div className="mt-2 grid gap-2">
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search student, case, blocker"
                  className="h-8 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none"
                />
                <div className="grid grid-cols-2 gap-1">
                  <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-7 rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-700 outline-none">
                    <option value="all">All</option>
                    <option value="Watching">Watching</option>
                    <option value="Escalated">Escalated</option>
                    <option value="Review needed">Review</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                  <select value={officeFilter} onChange={(event) => setOfficeFilter(event.target.value)} className="h-7 rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-700 outline-none">
                    <option value="all">All offices</option>
                    {["Admissions Support", "Financial Aid", "Health Compliance", "Advising", "Registrar"].map((office) => (
                      <option key={office} value={office}>{office}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
              <div className="p-2 space-y-2">
                {filteredCases.map((caseItem) => (
                  <QueueCard
                    key={caseItem.id}
                    caseItem={caseItem}
                    selected={selectedCase.id === caseItem.id}
                    onSelect={onSelectCase}
                    template={routeTemplate(scenarioTemplates, caseItem)}
                  />
                ))}
                {filteredCases.length === 0 && (
                  <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-3 text-center text-xs text-slate-500">
                    No cases match filters
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border-r border-slate-200 bg-slate-50">
            <div className="border-b border-slate-200 p-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Selected case</p>
                  <h2 className="mt-1 text-sm font-semibold tracking-[-0.02em] text-slate-950">{selectedCase.studentName}</h2>
                </div>
                <div className="flex gap-1">
                  <Badge variant="gold" className="text-[9px]">{selectedCase.urgency}</Badge>
                  <Badge variant={stateVariant(selectedCase.escalationState)} className="text-[9px]">{selectedCase.escalationState}</Badge>
                </div>
              </div>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
              <div className="p-3 space-y-3">
                <div className="rounded-lg bg-white p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">Current blocker</p>
                      <h3 className="mt-1 text-sm font-semibold tracking-[-0.02em] text-slate-950">{selectedCase.blockerTitle}</h3>
                    </div>
                    <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-1">
                      <span className="inline-flex size-1.5 rounded-full" style={{ backgroundColor: selectedRoute.routeColor }} />
                      <p className="text-[9px] font-semibold text-slate-600">{selectedRoute.routeLabel}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-600">{selectedCase.blockerDetail}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {selectedRoute.routeStops.map((stop, index) => {
                      const active = stop === selectedRoute.currentStop;
                      return (
                        <div key={stop} className="flex items-center gap-1">
                          <div className={`flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] ${active ? "text-white" : "bg-slate-100 text-slate-500"}`} style={active ? { backgroundColor: selectedRoute.routeColor } : undefined}>
                            <span className={`inline-flex size-1 rounded-full ${active ? "bg-white" : "bg-slate-300"}`} />
                            {stop}
                          </div>
                          {index < selectedRoute.routeStops.length - 1 && <div className="h-px w-2 bg-slate-200" />}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-lg bg-white p-3">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">Process steps</p>
                  <div className="mt-2 grid grid-cols-3 gap-1">
                    {selectedProcess.steps.map((step, index) => {
                      const isCurrent = index === selectedProcess.currentIndex;
                      const isDone = step.done;
                      return (
                        <div key={step.id} className={`rounded border px-2 py-2 text-center ${isCurrent ? "border-blue-200 bg-blue-50" : isDone ? "border-green-200 bg-green-50" : "border-slate-200 bg-white"}`}>
                          <div className="flex items-center justify-center gap-1">
                            <span className={`inline-flex size-1.5 rounded-full ${isCurrent ? "bg-blue-500" : isDone ? "bg-green-500" : "bg-slate-300"}`} />
                            <p className="text-[8px] font-semibold text-slate-600">{index + 1}</p>
                          </div>
                          <p className="mt-1 text-[9px] font-semibold text-slate-700">{step.label}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-white p-2">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">Owner</p>
                    <p className="mt-1 text-xs font-semibold text-slate-950">{selectedCase.nextOwnerOffice}</p>
                  </div>
                  <div className="rounded-lg bg-white p-2">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">Student state</p>
                    <p className="mt-1 text-xs font-semibold text-slate-950">{selectedCase.studentState}</p>
                  </div>
                </div>

                <div className="rounded-lg bg-blue-50 p-3">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-blue-600">System decision</p>
                  <p className="mt-1 text-xs font-semibold text-blue-900">{selectedLogic.interpretation}</p>
                </div>

                <div className="rounded-lg bg-slate-100 p-3">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-600">Next action</p>
                  <p className="mt-1 text-xs font-semibold text-slate-900">{selectedLogic.nextAction}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white">
            <div className="border-b border-slate-200 p-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Student access</p>
                  <h3 className="mt-1 text-sm font-semibold tracking-[-0.02em] text-slate-950">QR & live preview</h3>
                </div>
                <Badge variant="default" className="text-[9px]">{selectedRoute.routeLabel}</Badge>
              </div>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
              <div className="p-3 space-y-3">
                {presentationMode && (
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">Presentation</p>
                        <p className="mt-1 text-xs font-semibold text-slate-950">Mirrored session</p>
                      </div>
                      <Badge variant="aqua" className="text-[9px]">Live preview</Badge>
                    </div>
                    <div className="mt-2">
                      {children}
                    </div>
                  </div>
                )}

                {!presentationMode && children}

                <div className="rounded-lg border border-slate-200 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">System activity</p>
                      <p className="mt-1 text-xs font-semibold text-slate-950">Automation feed</p>
                    </div>
                    <Badge variant="default" className="text-[9px]">{automationEvents.length}</Badge>
                  </div>
                  <div className="mt-2 space-y-2">
                    {automationEvents.slice(0, 4).map((event) => (
                      <div key={event.id} className={`rounded border p-2 text-xs ${toneClasses(eventTone(event.type))}`}>
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <p className="text-[8px] font-semibold uppercase tracking-[0.12em] opacity-70">{eventLabel(event.type)}</p>
                            <p className="mt-1 text-xs font-semibold">{event.title}</p>
                          </div>
                          <Badge variant="default" className="text-[8px]">{event.sessionId}</Badge>
                        </div>
                        <p className="mt-1 text-xs leading-4">{event.detail}</p>
                        <div className="mt-1 flex items-center justify-between gap-1 text-[8px] font-semibold uppercase tracking-[0.12em] opacity-70">
                          <span>{event.studentName}</span>
                          <span>{formatDateTime(event.at)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">Alerts</p>
                      <p className="mt-1 text-xs font-semibold text-slate-950">Ownership changes</p>
                    </div>
                    <Badge variant="default" className="text-[9px]">{alerts.length}</Badge>
                  </div>
                  <div className="mt-2 space-y-2">
                    {alerts.length === 0 ? (
                      <div className="rounded border border-dashed border-slate-200 bg-slate-50 p-2 text-center text-xs text-slate-500">
                        No alerts yet
                      </div>
                    ) : (
                      alerts.slice(0, 3).map((alert) => (
                        <div key={alert.id} className={`rounded border p-2 text-xs ${toneClasses(alert.tone)}`}>
                          <div className="flex items-start justify-between gap-1">
                            <div>
                              <p className="text-xs font-semibold">{alert.title}</p>
                              <p className="mt-1 text-[8px] opacity-80">{alert.studentName}</p>
                            </div>
                            <Badge variant="default" className="text-[8px]">{alert.office}</Badge>
                          </div>
                          <p className="mt-1 text-xs leading-4">{alert.body}</p>
                          <p className="mt-1 text-[8px] font-semibold uppercase tracking-[0.12em] opacity-70">{formatDateTime(alert.at)}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </MotionDiv>
    </main>
  );
}
