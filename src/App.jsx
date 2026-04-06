import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  LayoutPanelTop,
  ShieldCheck,
  Smartphone,
  Users,
} from "lucide-react";
import { StudentMobile } from "./components/summer-melt/StudentMobile";
import { StaffDashboard } from "./components/summer-melt/StaffDashboard";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { caseRecords, kpiStats, workflowSteps } from "./data/summerMeltData";

const initialFilters = {
  risk: "ALL",
  status: "ALL",
  school: "All schools",
  overdueOnly: false,
  noResponseOnly: false,
};

export default function App() {
  const MotionDiv = motion.div;
  const [selectedCaseId, setSelectedCaseId] = useState("case-001");
  const [studentTab, setStudentTab] = useState("today");
  const [filters, setFilters] = useState(initialFilters);

  const filteredRecords = useMemo(
    () =>
      caseRecords.filter((record) => {
        if (filters.risk !== "ALL" && record.riskLevel !== filters.risk) return false;

        if (filters.status !== "ALL") {
          if (["ACTIVE", "CLOSED"].includes(filters.status) && record.caseStatus !== filters.status) {
            return false;
          }

          if (["BLOCKED", "NOT_ATTENDING"].includes(filters.status) && record.enrollmentStatus !== filters.status) {
            return false;
          }
        }

        if (filters.school !== "All schools" && record.collegeName !== filters.school) {
          return false;
        }

        if (filters.overdueOnly && record.overdueCount === 0) return false;
        if (filters.noResponseOnly && record.lastStudentResponseAt) return false;

        return true;
      }),
    [filters],
  );

  const selectedRecord =
    filteredRecords.find((record) => record.caseId === selectedCaseId) ||
    filteredRecords[0] ||
    caseRecords[0];

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f6f8fc_0%,#eef4fb_45%,#f8fafc_100%)] text-slate-900">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(52,96,255,0.16),transparent_28%),radial-gradient(circle_at_85%_14%,rgba(18,201,210,0.12),transparent_20%),radial-gradient(circle_at_bottom_right,rgba(255,123,102,0.08),transparent_24%)]" />
      <main className="relative w-full max-w-[1600px] px-4 py-5 sm:px-6 lg:py-7 xl:mr-auto xl:ml-6 xl:px-8 2xl:ml-10 2xl:pr-10">
        <MotionDiv
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-[32px] border border-white/70 bg-white/72 px-5 py-4 shadow-[0_18px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl"
        >
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="indigo">Summer Melt Case Engine</Badge>
            <Badge variant="aqua">Production-style MVP</Badge>
            <p className="text-sm text-slate-500">
              Case management for the student-to-college transition, from commitment through enrollment.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm">
              <Smartphone className="size-4" />
              Student view
            </Button>
            <Button size="sm">
              <LayoutPanelTop className="size-4" />
              Staff ops
            </Button>
          </div>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.05 }}
          className="mb-6 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]"
        >
          <section className="rounded-[36px] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.82),rgba(242,248,255,0.96))] p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)]">
            <div className="max-w-3xl">
              <Badge variant="indigo">Problem to outcome</Badge>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.07em] text-slate-950 md:text-5xl">
                Accepted students can still melt before day one.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                Summer Melt Case Engine turns that risk window into a focused case
                workflow: assign only the high-stakes enrollment tasks, automate
                reminders around the deadline, and surface blocked or silent cases
                to staff before a student disappears.
              </p>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {[
                {
                  title: "Problem",
                  body: "Students plan to enroll, then miss aid, deposit, health, or registration steps between June and August.",
                },
                {
                  title: "Solution",
                  body: "One student-facing priority at a time, plus a staff queue that shows who is at risk and what to do next.",
                },
                {
                  title: "Why it matters",
                  body: "More students arrive enrolled, fewer cases slip through silence, confusion, or deadline friction.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-[26px] border border-slate-200 bg-white/82 p-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    {item.title}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-700">{item.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[36px] border border-indigo-100 bg-[linear-gradient(135deg,rgba(41,77,225,0.98),rgba(17,185,192,0.9))] p-6 text-white shadow-[0_24px_90px_rgba(36,56,128,0.22)]">
            <div className="flex items-center justify-between gap-4">
              <Badge variant="default" className="border-white/20 bg-white/12 text-white">
                Demo walkthrough
              </Badge>
              <ShieldCheck className="size-5 text-white/75" />
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.06em]">
              One believable intervention arc.
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/78">
              Maya gets a verification reminder, replies for help, is escalated to
              staff, and gets exact instructions to keep aid and enrollment moving.
            </p>
            <div className="mt-6 space-y-3">
              {[
                "Reminder sent before the aid deadline",
                "Student replies DOCS because the portal is confusing",
                "Counselor escalates with task-specific guidance",
                "Case stays active until the blocker is cleared",
              ].map((item, index) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-[22px] border border-white/14 bg-white/10 px-4 py-3"
                >
                  <div className="flex size-7 items-center justify-center rounded-full bg-white/14 text-xs font-semibold">
                    {index + 1}
                  </div>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-white/75">
              <Users className="size-4" />
              For students who need clarity now and staff who need the next best action fast.
            </div>
          </section>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
          className="mb-6 rounded-[32px] border border-white/70 bg-white/74 p-4 shadow-[0_18px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl"
        >
          <div className="grid gap-3 md:grid-cols-3">
            {[
              {
                title: "Student view",
                text: "Shows only the next required step, why it matters, and how to complete it or ask for help.",
                icon: Smartphone,
              },
              {
                title: "Staff view",
                text: "Flags who is blocked, overdue, or silent, then gives a concrete next best action for intervention.",
                icon: LayoutPanelTop,
              },
              {
                title: "Workflow",
                text: "Reminder sent → overdue or HELP reply → escalation → completion or case closure.",
                icon: ArrowRight,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[24px] border border-slate-200 bg-white/86 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-[18px] bg-slate-950 p-2.5 text-white">
                    <item.icon className="size-4" />
                  </div>
                  <p className="font-semibold text-slate-950">{item.title}</p>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </MotionDiv>

        <div className="grid gap-5 xl:grid-cols-[405px_minmax(0,1fr)] 2xl:grid-cols-[425px_minmax(0,1fr)]">
          <div className="xl:sticky xl:top-6 xl:self-start xl:pr-1">
            <StudentMobile
              caseRecord={selectedRecord}
              studentTab={studentTab}
              onStudentTabChange={setStudentTab}
            />
          </div>

          <StaffDashboard
            records={filteredRecords}
            selectedCaseId={selectedRecord.caseId}
            onSelectCase={setSelectedCaseId}
            filters={filters}
            onFilterChange={updateFilter}
            stats={kpiStats}
            workflowSteps={workflowSteps}
          />
        </div>
      </main>
    </div>
  );
}
