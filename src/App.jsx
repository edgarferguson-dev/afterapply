import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Presentation, ShieldCheck } from "lucide-react";
import { StaffDashboard } from "./components/summer-melt/StaffDashboard";
import { StudentMobile } from "./components/summer-melt/StudentMobile";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import { actionBehaviors, demoStudents, initialCases, scenarioTemplates } from "./data/firstPathData";

const STORAGE_KEY = "first-path-live-cases";

function getTemplate(scenarioId) {
  return scenarioTemplates.find((entry) => entry.id === scenarioId);
}

function getInitialPath() {
  return window.location.pathname || "/";
}

function readCases() {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return initialCases;

  try {
    return JSON.parse(stored);
  } catch {
    return initialCases;
  }
}

function writeCases(cases) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
}

function navigate(path) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function createCase(templateId, studentName) {
  const template = getTemplate(templateId);
  const timestamp = new Date().toISOString();
  const caseId = `case-${Date.now()}`;

  return {
    id: caseId,
    scenarioId: template.id,
    studentName,
    collegeName: "BMCC",
    highSchoolName: "John Dewey High School",
    urgency: template.urgency,
    dueLabel: template.dueLabel,
    ownerOffice: template.ownerOffice,
    nextOwnerOffice: template.ownerOffice,
    escalationState: "Watching",
    status: "Waiting on student",
    blockerTitle: template.blockerTitle,
    blockerDetail: template.blockerDetail,
    whyItMatters: template.whyItMatters,
    recommendedAction: template.recommendedAction,
    studentState: "QR ready to scan",
    lastActionLabel: "Scenario created",
    lastUpdatedAt: timestamp,
    shareToken: `${caseId}-share`,
    alerts: [],
    timeline: [
      {
        id: `${caseId}-started`,
        type: "scenario_started",
        title: "Scenario started by staff",
        detail: `${template.ownerOffice} owns the first follow-up if the student does not respond.`,
        at: timestamp,
      },
    ],
  };
}

function updateCaseWithAction(caseItem, actionId) {
  const template = getTemplate(caseItem.scenarioId);
  const behavior = actionBehaviors[actionId];
  const timestamp = new Date().toISOString();
  const updatedCase = behavior.update(caseItem, template);

  const alert = {
    id: `${caseItem.id}-${actionId}-${timestamp}`,
    tone: behavior.tone,
    title: behavior.alertTitle,
    body: behavior.detail(template),
    office: updatedCase.nextOwnerOffice,
    at: timestamp,
  };

  return {
    ...updatedCase,
    lastUpdatedAt: timestamp,
    alerts: [alert, ...caseItem.alerts].slice(0, 5),
    timeline: [
      {
        id: `${caseItem.id}-${actionId}-${timestamp}`,
        type: "student_action",
        title: updatedCase.lastActionLabel,
        detail: behavior.detail(template),
        at: timestamp,
      },
      ...caseItem.timeline,
    ],
  };
}

function forceEscalation(caseItem) {
  const timestamp = new Date().toISOString();

  return {
    ...caseItem,
    status: "No response",
    escalationState: "Escalated",
    studentState: "No student response yet",
    lastActionLabel: "Demo timer forced escalation",
    lastUpdatedAt: timestamp,
    alerts: [
      {
        id: `${caseItem.id}-silence-${timestamp}`,
        tone: "critical",
        title: "No response escalated",
        body: "Staff outreach is now required because the student did not respond in time.",
        office: caseItem.ownerOffice,
        at: timestamp,
      },
      ...caseItem.alerts,
    ].slice(0, 5),
    timeline: [
      {
        id: `${caseItem.id}-silence-${timestamp}`,
        type: "escalation",
        title: "No response escalated",
        detail: `${caseItem.ownerOffice} should intervene manually.`,
        at: timestamp,
      },
      ...caseItem.timeline,
    ],
  };
}

function LandingPage() {
  const MotionDiv = motion.div;

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-5 py-8 sm:px-8">
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="grid w-full gap-6 lg:grid-cols-[1.15fr_0.85fr]"
      >
        <section className="rounded-[36px] border border-white/70 bg-white/80 p-7 shadow-[0_28px_90px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-10">
          <div className="flex flex-wrap gap-2">
            <Badge variant="indigo">First Path</Badge>
            <Badge variant="aqua">Live onboarding exception demo</Badge>
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.07em] text-slate-950 sm:text-5xl">
            One blocker. One student action. One live office handoff.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
            First Path is a narrow demo of admitted-student onboarding in a CUNY-style workflow.
            Staff starts a scenario, shares a QR code, and watches the student response update the
            dashboard live.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={() => navigate("/admin")} className="justify-between">
              Open staff control room <ArrowRight className="size-4" />
            </Button>
            <Button variant="secondary" onClick={() => navigate("/go/case-101")}>
              Open student scenario
            </Button>
          </div>
        </section>

        <section className="grid gap-4">
          <Card className="border-white/75 bg-[linear-gradient(180deg,rgba(249,251,255,0.94),rgba(243,247,251,0.98))]">
            <CardContent className="p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Core wedge</p>
              <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                <p>Staff triggers a scenario for one real blocker.</p>
                <p>Student scans a QR and chooses one realistic response.</p>
                <p>The correct office sees the change immediately.</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-white/75 bg-slate-950 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white/10 p-3">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Built for class credibility</p>
                  <p className="mt-1 text-sm text-white/70">Not a portal. Not a CRM. Just the exception loop.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </MotionDiv>
    </main>
  );
}

export default function App() {
  const [path, setPath] = useState(getInitialPath);
  const [cases, setCases] = useState(readCases);
  const [selectedCaseId, setSelectedCaseId] = useState(() => readCases()[0]?.id ?? initialCases[0].id);
  const [presentationMode, setPresentationMode] = useState(false);

  useEffect(() => {
    writeCases(cases);
  }, [cases]);

  useEffect(() => {
    const onPopState = () => setPath(getInitialPath());
    const onStorage = (event) => {
      if (event.key === STORAGE_KEY) {
        setCases(readCases());
      }
    };

    window.addEventListener("popstate", onPopState);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const selectedCase = useMemo(
    () => cases.find((caseItem) => caseItem.id === selectedCaseId) || cases[0],
    [cases, selectedCaseId],
  );


  const scenarioPath = path.startsWith("/go/") ? path.split("/go/")[1] : null;
  const scenarioCase = scenarioPath ? cases.find((caseItem) => caseItem.id === scenarioPath) : null;

  function handleCreateCase(templateId) {
    const studentName =
      demoStudents.find((name) => !cases.some((caseItem) => caseItem.studentName === name)) ||
      `Demo Student ${cases.length + 1}`;
    const newCase = createCase(templateId, studentName);
    setCases((current) => [newCase, ...current]);
    setSelectedCaseId(newCase.id);
    navigate("/admin");
  }

  function handleStudentAction(caseId, actionId) {
    setCases((current) =>
      current.map((caseItem) =>
        caseItem.id === caseId ? updateCaseWithAction(caseItem, actionId) : caseItem,
      ),
    );
  }

  function handleForceEscalation(caseId) {
    setCases((current) =>
      current.map((caseItem) => (caseItem.id === caseId ? forceEscalation(caseItem) : caseItem)),
    );
  }

  function handleResetDemo() {
    setCases(initialCases);
    setSelectedCaseId(initialCases[0].id);
    writeCases(initialCases);
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#f5f7f4_0%,#eef2ee_52%,#f7f8f5_100%)] text-slate-900">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(22,130,115,0.12),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(35,80,156,0.08),transparent_18%),radial-gradient(circle_at_bottom_right,rgba(186,136,76,0.08),transparent_24%)]" />

      {path === "/" && <LandingPage />}

      {path === "/admin" && selectedCase && (
        <StaffDashboard
          cases={cases}
          selectedCase={selectedCase}
          scenarioTemplates={scenarioTemplates}
          presentationMode={presentationMode}
          onNavigate={navigate}
          onCreateCase={handleCreateCase}
          onResetDemo={handleResetDemo}
          onSelectCase={setSelectedCaseId}
          onForceEscalation={handleForceEscalation}
          onTogglePresentation={() => setPresentationMode((current) => !current)}
        >
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            <Presentation className="size-4" />
            Live phone preview
          </div>
          <StudentMobile caseRecord={selectedCase} onAction={handleStudentAction} preview />
        </StaffDashboard>
      )}

      {path.startsWith("/go/") && (
        <StudentMobile
          caseRecord={scenarioCase}
          onAction={handleStudentAction}
          onNavigate={navigate}
        />
      )}

      {!path.startsWith("/go/") && !["/", "/admin"].includes(path) && <LandingPage />}

      {path !== "/" && (
        <button
          type="button"
          onClick={() => navigate("/")}
          className="fixed bottom-5 right-5 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/88 px-4 py-2 text-sm font-semibold text-slate-700 shadow-[0_18px_40px_rgba(15,23,42,0.1)] backdrop-blur"
        >
          First Path
          <ExternalLink className="size-4" />
        </button>
      )}
    </div>
  );
}


