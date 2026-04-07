import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Copy, Plus, QrCode, RefreshCcw, Smartphone } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { formatDateTime } from "../../lib/utils";

function toneClasses(tone) {
  if (tone === "critical") return "border-rose-200 bg-rose-50 text-rose-700";
  if (tone === "review") return "border-amber-200 bg-amber-50 text-amber-700";
  if (tone === "success") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  return "border-slate-200 bg-slate-50 text-slate-700";
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

function QRCodePanel({ caseItem, onNavigate }) {
  const [copied, setCopied] = useState(false);
  const src = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(shareLink(caseItem))}`;

  async function handleCopy() {
    await navigator.clipboard.writeText(shareLink(caseItem));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <Card className="border-white/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(245,248,244,0.98))]">
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Student access</p>
            <h3 className="mt-2 text-lg font-semibold tracking-[-0.03em] text-slate-950">QR and share link</h3>
          </div>
          <div className="rounded-2xl bg-slate-950 p-3 text-white">
            <QrCode className="size-5" />
          </div>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-[220px_1fr] lg:items-center">
          <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
            <img src={src} alt="Scenario QR code" className="mx-auto h-[188px] w-[188px] rounded-2xl" />
          </div>
          <div className="space-y-3">
            <div className="rounded-[22px] border border-slate-200 bg-slate-50/90 p-4 text-sm text-slate-600">
              Student route opens the focused blocker flow directly. This is the handoff surface, not a portal.
            </div>
            <div className="rounded-[22px] border border-slate-200 bg-white p-4 text-sm text-slate-700">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Share link</p>
              <p className="mt-2 break-all font-medium text-slate-900">{shareLink(caseItem)}</p>
            </div>
            <div className="flex flex-wrap gap-2">
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
      </CardContent>
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

  const alerts = useMemo(
    () => cases.flatMap((caseItem) => caseItem.alerts.map((alert) => ({ ...alert, caseId: caseItem.id, studentName: caseItem.studentName }))).sort((a, b) => new Date(b.at) - new Date(a.at)),
    [cases],
  );

  const activeCases = useMemo(
    () => [...cases].sort((a, b) => new Date(b.lastUpdatedAt) - new Date(a.lastUpdatedAt)),
    [cases],
  );

  const selectedTemplate = scenarioTemplates.find((entry) => entry.id === templateId);

  return (
    <main className="relative mx-auto w-full max-w-[1540px] px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
      <MotionDiv initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42, ease: "easeOut" }} className="space-y-4">
        <section className={`grid gap-4 ${presentationMode ? "xl:grid-cols-[1.06fr_0.94fr]" : "xl:grid-cols-[1.12fr_0.88fr]"}`}>
          <Card className="border-white/75 bg-white/82">
            <CardContent className="p-6 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="indigo">First Path</Badge>
                    <Badge variant="aqua">Staff control room</Badge>
                  </div>
                  <h1 className="mt-4 text-3xl font-semibold tracking-[-0.06em] text-slate-950 sm:text-4xl">
                    Live onboarding exception handoff
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                    Start one scenario, share one QR, and watch the student response update the owning office in real time.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={onTogglePresentation}>Presentation mode</Button>
                  <Button variant="secondary" onClick={onResetDemo}>
                    <RefreshCcw className="size-4" />
                    Reset demo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/75 bg-[linear-gradient(180deg,rgba(247,250,247,0.92),rgba(255,255,255,0.98))]">
            <CardContent className="p-6 sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Start scenario</p>
              <div className="mt-4 grid gap-3">
                <label className="text-sm font-medium text-slate-600" htmlFor="scenario-template">Scenario template</label>
                <select id="scenario-template" value={templateId} onChange={(event) => setTemplateId(event.target.value)} className="h-12 rounded-[18px] border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none">
                  {scenarioTemplates.map((template) => (
                    <option key={template.id} value={template.id}>{template.label}</option>
                  ))}
                </select>
                <div className="rounded-[22px] border border-slate-200 bg-slate-50/85 p-4 text-sm leading-6 text-slate-600">
                  <p className="font-semibold text-slate-900">{selectedTemplate.blockerTitle}</p>
                  <p className="mt-2">Owned by {selectedTemplate.ownerOffice}. Student sees one blocker, one recommended action, and a short list of realistic responses.</p>
                </div>
                <Button onClick={() => onCreateCase(templateId)}>
                  <Plus className="size-4" />
                  Start scenario
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className={`grid gap-4 ${presentationMode ? "xl:grid-cols-[0.8fr_1.2fr]" : "xl:grid-cols-[0.76fr_0.64fr_0.6fr]"}`}>
          <Card className="border-white/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(247,249,246,0.98))]">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Active cases</p>
                  <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-slate-950">Control queue</h2>
                </div>
                <Badge variant="default">{activeCases.length} live</Badge>
              </div>
              <div className="mt-4 space-y-3">
                {activeCases.map((caseItem) => (
                  <button
                    key={caseItem.id}
                    type="button"
                    onClick={() => onSelectCase(caseItem.id)}
                    className={`w-full rounded-[24px] border p-4 text-left transition ${selectedCase.id === caseItem.id ? "border-emerald-200 bg-emerald-50/70" : "border-slate-200 bg-white hover:border-slate-300"}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-slate-950">{caseItem.studentName}</p>
                          <Badge variant={stateVariant(caseItem.escalationState)}>{caseItem.escalationState}</Badge>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">{caseItem.blockerTitle}</p>
                        <div className="mt-3 grid gap-1 text-sm text-slate-600">
                          <p><span className="font-medium text-slate-500">Status:</span> {caseItem.status}</p>
                          <p><span className="font-medium text-slate-500">Owner:</span> {caseItem.nextOwnerOffice}</p>
                          <p><span className="font-medium text-slate-500">Last update:</span> {caseItem.lastActionLabel}</p>
                        </div>
                      </div>
                      <div className="text-right text-sm text-slate-500">
                        <p>{caseItem.urgency}</p>
                        <p className="mt-2">{caseItem.dueLabel}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="border-white/75 bg-white/88">
              <CardContent className="p-5 sm:p-6">
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
                <div className="mt-5 grid gap-3">
                  <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Current blocker</p>
                    <h3 className="mt-2 text-lg font-semibold text-slate-950">{selectedCase.blockerTitle}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{selectedCase.blockerDetail}</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-[22px] border border-slate-200 bg-white p-4 text-sm text-slate-700">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Owner now</p>
                      <p className="mt-2 font-semibold text-slate-950">{selectedCase.nextOwnerOffice}</p>
                    </div>
                    <div className="rounded-[22px] border border-slate-200 bg-white p-4 text-sm text-slate-700">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Student state</p>
                      <p className="mt-2 font-semibold text-slate-950">{selectedCase.studentState}</p>
                    </div>
                    <div className="rounded-[22px] border border-slate-200 bg-white p-4 text-sm text-slate-700">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Last changed</p>
                      <p className="mt-2 font-semibold text-slate-950">{formatDateTime(selectedCase.lastUpdatedAt)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <QRCodePanel caseItem={selectedCase} onNavigate={onNavigate} />

            <Card className="border-white/75 bg-white/88">
              <CardContent className="p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Case timeline</p>
                <div className="mt-4 space-y-3">
                  {selectedCase.timeline.map((entry) => (
                    <div key={entry.id} className="rounded-[20px] border border-slate-200 bg-slate-50/80 p-4">
                      <p className="text-sm font-semibold text-slate-900">{entry.title}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{entry.detail}</p>
                      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{formatDateTime(entry.at)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {!presentationMode && children}

            <Card className="border-white/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(247,250,247,0.98))]">
              <CardContent className="p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Alerts</p>
                <div className="mt-4 space-y-3">
                  {alerts.length === 0 ? (
                    <div className="rounded-[20px] border border-dashed border-slate-200 bg-slate-50/70 p-6 text-sm text-slate-500">
                      No alerts yet. Student actions will show up here.
                    </div>
                  ) : (
                    alerts.map((alert) => (
                      <div key={alert.id} className={`rounded-[20px] border p-4 ${toneClasses(alert.tone)}`}>
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-semibold">{alert.title}</p>
                          <Badge variant="default">{alert.office}</Badge>
                        </div>
                        <p className="mt-2 text-sm leading-6">{alert.body}</p>
                        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] opacity-70">{alert.studentName} · {formatDateTime(alert.at)}</p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </MotionDiv>
    </main>
  );
}

