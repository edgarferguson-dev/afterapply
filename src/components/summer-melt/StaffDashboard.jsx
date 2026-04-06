import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CheckCheck,
  CircleAlert,
  Clock3,
  Flag,
  Filter,
  GraduationCap,
  HandHelping,
  Inbox,
  MessageCircleWarning,
  Sparkles,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Progress } from "../ui/progress";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { formatDate, formatDateTime, formatPhone, titleCase } from "../../lib/utils";

function riskVariant(risk) {
  if (risk === "HIGH") return "coral";
  if (risk === "MEDIUM") return "gold";
  return "success";
}

function taskVariant(status) {
  if (status === "OVERDUE" || status === "BLOCKED") return "coral";
  if (status === "IN_PROGRESS") return "gold";
  if (status === "COMPLETED" || status === "WAIVED") return "success";
  return "indigo";
}

function taskSurface(task) {
  if (task.helpRequested) {
    return "border-cyan-200 bg-[linear-gradient(135deg,rgba(236,254,255,0.92),rgba(255,255,255,0.96))]";
  }

  if (task.taskStatus === "OVERDUE") {
    return "border-rose-200 bg-[linear-gradient(135deg,rgba(255,241,242,0.94),rgba(255,255,255,0.96))]";
  }

  if (task.taskStatus === "BLOCKED") {
    return "border-amber-200 bg-[linear-gradient(135deg,rgba(255,251,235,0.94),rgba(255,255,255,0.96))]";
  }

  return "border-slate-200 bg-slate-50/90";
}

function queueEmpty(filters) {
  return (
    filters.risk !== "ALL" ||
    filters.status !== "ALL" ||
    filters.school !== "All schools" ||
    filters.overdueOnly ||
    filters.noResponseOnly
  );
}

export function StaffDashboard({
  records,
  selectedCaseId,
  onSelectCase,
  filters,
  onFilterChange,
  stats,
  workflowSteps,
}) {
  const MotionDiv = motion.div;
  const selectedCase = records.find((record) => record.caseId === selectedCaseId) || records[0];
  const schoolOptions = ["All schools", ...new Set(records.map((record) => record.collegeName))];

  const overviewCards = [
    {
      label: "Students in active transition",
      value: stats.activeCases,
      helper: "Cases still being worked between commitment and verified enrollment",
      icon: Inbox,
      accent: "from-indigo-500/16 to-cyan-400/10",
    },
    {
      label: "Need staff attention now",
      value: stats.highRisk,
      helper: "Students with blocked tasks, missed deadlines, or silence signals",
      icon: CircleAlert,
      accent: "from-rose-500/16 to-orange-300/14",
    },
    {
      label: "Missed deadline steps",
      value: stats.overdueTasks,
      helper: "Critical tasks already overdue and still triggering follow-up",
      icon: Clock3,
      accent: "from-orange-400/16 to-rose-400/12",
    },
    {
      label: "Resolved outcomes",
      value: stats.closedCases,
      helper: "Cases closed after enrollment confirmation or a plan change",
      icon: CheckCheck,
      accent: "from-emerald-400/16 to-cyan-300/14",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.78),rgba(244,249,255,0.92))]">
          <CardContent className="p-7">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="max-w-2xl">
                <Badge variant="indigo">Staff command center</Badge>
                <h1 className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-slate-950 md:text-5xl">
                  See who needs help right now.
                </h1>
                <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
                  Cases move from reminder to escalation to closure with enough context
                  for staff to act fast, not hunt through portals.
                </p>
              </div>
              <div className="grid min-w-[260px] gap-3 rounded-[28px] border border-indigo-100 bg-[linear-gradient(180deg,rgba(48,85,255,0.06),rgba(18,201,210,0.04))] p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-[18px] bg-slate-950 p-3 text-white">
                    <Sparkles className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Live workflow
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      Automations surface the right intervention point
                    </p>
                  </div>
                </div>
                <div className="grid gap-3">
                  {workflowSteps.map((step) => (
                    <div
                      key={step.id}
                      className={`rounded-[22px] border px-4 py-3 ${
                        step.state === "done"
                          ? "border-emerald-200 bg-emerald-50/80"
                          : step.state === "active"
                            ? "border-indigo-200 bg-indigo-50/80"
                            : step.state === "warning"
                              ? "border-rose-200 bg-rose-50/80"
                              : "border-slate-200 bg-white/70"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-slate-900">{step.label}</p>
                        <Badge
                          variant={
                            step.state === "done"
                              ? "success"
                              : step.state === "active"
                                ? "indigo"
                                : step.state === "warning"
                                  ? "coral"
                                  : "default"
                          }
                        >
                          {step.state}
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm text-slate-500">{step.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
          {overviewCards.map((card) => (
            <MotionDiv key={card.label} whileHover={{ y: -2 }} transition={{ duration: 0.18 }}>
              <Card className="h-full bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(248,250,253,0.95))]">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-500">{card.label}</p>
                      <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-slate-950">
                        {card.value}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-500">{card.helper}</p>
                    </div>
                    <div className={`rounded-[24px] bg-gradient-to-br ${card.accent} p-4`}>
                      <card.icon className="size-5 text-slate-900" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </MotionDiv>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
        <Card className="bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(247,250,253,0.92))]">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>Case queue</CardTitle>
                <CardDescription>
                  Filter by urgency, status, school, and response patterns.
                </CardDescription>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-500">
                <Filter className="size-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {["ALL", "HIGH", "MEDIUM", "LOW"].map((value) => (
                <button
                  key={value}
                  onClick={() => onFilterChange("risk", value)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    filters.risk === value
                      ? "bg-slate-950 text-white"
                      : "border border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                  }`}
                >
                  {value === "ALL" ? "All risk" : titleCase(value)}
                </button>
              ))}
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <select
                value={filters.status}
                onChange={(event) => onFilterChange("status", event.target.value)}
                className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none"
              >
                <option value="ALL">All status</option>
                <option value="ACTIVE">Active</option>
                <option value="CLOSED">Closed</option>
                <option value="BLOCKED">Blocked</option>
                <option value="NOT_ATTENDING">Not attending</option>
              </select>
              <select
                value={filters.school}
                onChange={(event) => onFilterChange("school", event.target.value)}
                className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none"
              >
                {schoolOptions.map((school) => (
                  <option key={school} value={school}>
                    {school}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { key: "overdueOnly", label: "Overdue only" },
                { key: "noResponseOnly", label: "No response" },
              ].map((toggle) => (
                <button
                  key={toggle.key}
                  onClick={() => onFilterChange(toggle.key, !filters[toggle.key])}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    filters[toggle.key]
                      ? "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
                      : "border border-slate-200 bg-white text-slate-500"
                  }`}
                >
                  {toggle.label}
                </button>
              ))}
            </div>

            <ScrollArea className="h-[560px] pr-2">
              <div className="space-y-3">
                {records.length === 0 && (
                  <div className="rounded-[26px] border border-dashed border-slate-200 bg-slate-50/80 px-5 py-12 text-center">
                    <p className="text-base font-semibold text-slate-900">
                      No cases match this view.
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {queueEmpty(filters)
                        ? "Clear one or two filters to bring students back into the queue."
                        : "The queue will populate when active summer cases are available."}
                    </p>
                  </div>
                )}
                {records.map((record) => (
                  <button
                    key={record.caseId}
                    onClick={() => onSelectCase(record.caseId)}
                    className={`w-full rounded-[26px] border p-4 text-left transition ${
                      selectedCase.caseId === record.caseId
                        ? "border-indigo-200 bg-[linear-gradient(135deg,rgba(42,89,255,0.08),rgba(29,216,208,0.04))]"
                        : "border-slate-200 bg-white/80 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {record.student.firstName[0]}
                            {record.student.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-slate-950">
                              {record.student.fullName}
                            </p>
                            <Badge variant={riskVariant(record.riskLevel)}>
                              {record.riskLevel}
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm text-slate-500">{record.collegeName}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {record.overdueCount > 0 && (
                              <Badge variant="coral">{record.overdueCount} overdue</Badge>
                            )}
                            {record.blockedCount > 0 && (
                              <Badge variant="gold">{record.blockedCount} blocked</Badge>
                            )}
                            {record.helpRequestedCount > 0 && (
                              <Badge variant="aqua">{record.helpRequestedCount} help</Badge>
                            )}
                            {record.escalated && <Badge variant="coral">Escalated</Badge>}
                            {record.lastStudentResponseAt ? (
                              <Badge variant="aqua">
                                Responded {formatDate(record.lastStudentResponseAt)}
                              </Badge>
                            ) : (
                              <Badge variant="coral">No response</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <ArrowUpRight className="mt-1 size-4 text-slate-400" />
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(248,251,255,0.96))]">
            <CardHeader className="border-b border-slate-200/80 pb-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <Avatar className="size-14 rounded-[22px]">
                    <AvatarFallback className="text-base">
                      {selectedCase.student.firstName[0]}
                      {selectedCase.student.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle className="text-2xl text-slate-950">
                        {selectedCase.student.fullName}
                      </CardTitle>
                      <Badge variant={riskVariant(selectedCase.riskLevel)}>
                        {selectedCase.riskLevel} risk
                      </Badge>
                      <Badge
                        variant={selectedCase.caseStatus === "CLOSED" ? "success" : "indigo"}
                      >
                        {titleCase(selectedCase.caseStatus)}
                      </Badge>
                    </div>
                    <CardDescription className="mt-2 max-w-2xl text-sm leading-6">
                      {selectedCase.collegeName} • {selectedCase.termName} • Intended start{" "}
                      {formatDate(selectedCase.intendedEnrollmentDate)}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary">Send reminder</Button>
                  <Button variant="coral">Escalate</Button>
                  <Button>Mark task complete</Button>
                  <Button variant="ghost">Close case</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-6 p-6 xl:grid-cols-[0.7fr_1.3fr]">
              <div className="space-y-4">
                <div className="rounded-[26px] border border-rose-100 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(253,242,248,0.9))] p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Why this student is at risk
                    </p>
                    <Badge variant={riskVariant(selectedCase.riskLevel)}>
                      {selectedCase.riskLevel}
                    </Badge>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedCase.riskReasons.map((reason) => (
                      <Badge key={reason} variant="coral">
                        {reason}
                      </Badge>
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {selectedCase.riskReasons.length > 0
                      ? "These signals are why the case is in the active intervention queue."
                      : "This case is stable right now and mainly needs routine follow-through."}
                  </p>
                </div>

                <div className="rounded-[26px] border border-slate-200 bg-white/80 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Profile
                  </p>
                  <div className="mt-4 space-y-3 text-sm text-slate-600">
                    <div className="flex justify-between gap-4">
                      <span>High school</span>
                      <span className="font-semibold text-slate-900">
                        {selectedCase.student.highSchoolName}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span>Phone</span>
                      <span className="font-semibold text-slate-900">
                        {formatPhone(selectedCase.student.phone)}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span>Email</span>
                      <span className="font-semibold text-slate-900">
                        {selectedCase.student.email}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span>Support owner</span>
                      <span className="font-semibold text-slate-900">
                        {selectedCase.staff.fullName}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span>Last response</span>
                      <span className="font-semibold text-slate-900">
                        {selectedCase.lastStudentResponseAt
                          ? formatDateTime(selectedCase.lastStudentResponseAt)
                          : "No response yet"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-[26px] border border-slate-200 bg-[linear-gradient(180deg,rgba(245,250,255,0.9),rgba(255,255,255,0.92))] p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Next action
                    </p>
                    <Badge variant={taskVariant(selectedCase.urgentTask.taskStatus)}>
                      {titleCase(selectedCase.urgentTask.taskStatus)}
                    </Badge>
                  </div>
                  <h3 className="mt-3 text-xl font-semibold tracking-[-0.04em] text-slate-950">
                    {selectedCase.urgentTask.taskName}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {selectedCase.urgentTask.notes ||
                      "Urgent student-facing action with a linked reminder path and a visible stop condition when complete."}
                  </p>
                  <div className="mt-4 rounded-[20px] border border-slate-200 bg-white/90 p-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Due</span>
                      <span className="font-semibold text-slate-900">
                        {formatDate(selectedCase.urgentTask.dueDate)}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-slate-500">Reminder state</span>
                      <span className="font-semibold text-slate-900">
                        {selectedCase.urgentTask.taskStatus === "OVERDUE"
                          ? "Overdue outreach live"
                          : selectedCase.urgentTask.nextReminderAt
                            ? `Next send ${formatDate(selectedCase.urgentTask.nextReminderAt)}`
                            : "No reminder queued"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-[26px] border border-indigo-100 bg-[linear-gradient(135deg,rgba(238,244,255,0.95),rgba(255,255,255,0.96))] p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Next best action
                      </p>
                      <h3 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-slate-950">
                        {selectedCase.nextBestAction.title}
                      </h3>
                    </div>
                    <div className="rounded-[18px] bg-indigo-600 p-3 text-white">
                      <Flag className="size-4" />
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {selectedCase.nextBestAction.detail}
                  </p>
                  <div className="mt-4 rounded-[18px] border border-white/80 bg-white/90 px-4 py-3 text-sm">
                    <span className="font-medium text-slate-500">Owner</span>
                    <span className="ml-2 font-semibold text-slate-900">
                      {selectedCase.nextBestAction.owner}
                    </span>
                  </div>
                </div>

                <div className="rounded-[26px] border border-slate-200 bg-white/80 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Interventions
                  </p>
                  <div className="mt-4 space-y-3">
                    {selectedCase.interventions.length === 0 ? (
                      <div className="rounded-[20px] border border-dashed border-slate-200 bg-slate-50/80 px-4 py-8 text-center text-sm text-slate-500">
                        No intervention logged yet. The case is still running through automation.
                      </div>
                    ) : (
                      selectedCase.interventions.map((item) => (
                        <div
                          key={item.interventionId}
                          className="rounded-[20px] border border-slate-200 bg-slate-50/90 p-4"
                        >
                          <div className="flex items-center gap-2">
                            <MessageCircleWarning className="size-4 text-rose-500" />
                            <p className="text-sm font-semibold text-slate-900">
                              {titleCase(item.interventionType)}
                            </p>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-slate-600">{item.reason}</p>
                          <p className="mt-2 text-sm text-slate-500">
                            Follow-up {formatDateTime(item.followUpDueAt)}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-[28px] border border-slate-200 bg-white/85 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Case workflow
                      </p>
                      <h3 className="mt-2 text-lg font-semibold text-slate-950">
                        Reminder to resolution path
                      </h3>
                    </div>
                    <Badge variant={selectedCase.escalated ? "coral" : "aqua"}>
                      {selectedCase.escalated ? "Escalated" : "In automation"}
                    </Badge>
                  </div>
                  <div className="mt-5 grid gap-3 md:grid-cols-5">
                    {[
                      { label: "Reminder sent", active: selectedCase.workflowState.reminderSent },
                      { label: "Overdue", active: selectedCase.workflowState.overdue },
                      { label: "Help requested", active: selectedCase.workflowState.helpRequested },
                      { label: "Escalated", active: selectedCase.workflowState.escalated },
                      {
                        label: selectedCase.caseStatus === "CLOSED" ? "Closed" : "Completed",
                        active: selectedCase.workflowState.completedOrClosed,
                      },
                    ].map((step) => (
                      <div
                        key={step.label}
                        className={`rounded-[22px] border px-4 py-4 ${
                          step.active
                            ? "border-cyan-200 bg-cyan-50/80"
                            : "border-slate-200 bg-slate-50/80"
                        }`}
                      >
                        <div
                          className={`size-2.5 rounded-full ${
                            step.active ? "bg-cyan-500" : "bg-slate-300"
                          }`}
                        />
                        <p className="mt-4 text-sm font-semibold text-slate-900">
                          {step.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[28px] border border-slate-200 bg-white/85 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Tasks
                      </p>
                      <h3 className="mt-2 text-lg font-semibold text-slate-950">
                        Completion path for this case
                      </h3>
                    </div>
                    <div className="min-w-48">
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-slate-500">Progress</span>
                        <span className="font-semibold text-slate-900">
                          {selectedCase.progress}%
                        </span>
                      </div>
                      <Progress value={selectedCase.progress} />
                    </div>
                  </div>
                  <div className="mt-5 space-y-3">
                    {selectedCase.tasks.map((task) => (
                      <div
                        key={task.taskId}
                        className={`grid gap-3 rounded-[22px] border p-4 md:grid-cols-[1.2fr_0.7fr_0.7fr_0.6fr] md:items-center ${taskSurface(task)}`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-slate-900">{task.taskName}</p>
                            <Badge variant={taskVariant(task.taskStatus)}>
                              {titleCase(task.taskStatus)}
                            </Badge>
                            {task.helpRequested && (
                              <Badge variant="aqua">
                                <HandHelping className="size-3" />
                                Help requested
                              </Badge>
                            )}
                          </div>
                          <p className="mt-2 text-sm text-slate-500">{task.taskCategory}</p>
                        </div>
                        <div className="text-sm text-slate-600">
                          <p className="font-medium text-slate-400">Due</p>
                          <p className="mt-1 font-semibold text-slate-900">
                            {formatDate(task.dueDate)}
                          </p>
                        </div>
                        <div className="text-sm text-slate-600">
                          <p className="font-medium text-slate-400">Reminder</p>
                          <p className="mt-1 font-semibold text-slate-900">
                            {task.nextReminderAt ? formatDate(task.nextReminderAt) : "Stopped"}
                          </p>
                        </div>
                        <div className="text-sm text-slate-600">
                          <p className="font-medium text-slate-400">Support</p>
                          <p className="mt-1 font-semibold text-slate-900">
                            {task.helpRequested
                              ? "Student asked for help"
                              : task.requiresHumanSupport
                                ? "Needs staff"
                                : "Auto"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                  <div className="rounded-[28px] border border-slate-200 bg-white/85 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Message timeline
                    </p>
                    <div className="mt-4 space-y-4">
                      {selectedCase.messages.length === 0 ? (
                        <div className="rounded-[20px] border border-dashed border-slate-200 bg-slate-50/80 px-4 py-8 text-center text-sm text-slate-500">
                          Message history will appear here once reminders or replies are logged.
                        </div>
                      ) : (
                        selectedCase.messages.map((message, index) => (
                          <div key={message.messageId} className="relative pl-6">
                            {index !== selectedCase.messages.length - 1 && (
                              <span className="absolute left-[9px] top-7 h-[calc(100%+10px)] w-px bg-slate-200" />
                            )}
                            <span className="absolute left-0 top-1 size-5 rounded-full border border-white bg-slate-950" />
                            <p className="text-sm font-semibold text-slate-900">
                              {message.sentBy === "system"
                                ? "System reminder"
                                : message.sentBy === "student"
                                  ? "Student reply"
                                  : "Counselor response"}
                            </p>
                            <p className="mt-1 text-sm leading-6 text-slate-600">{message.body}</p>
                            <p className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
                              {formatDateTime(
                                message.sentAt || message.receivedAt || message.createdAt,
                              )}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-slate-200 bg-white/85 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Case notes
                    </p>
                    <div className="mt-4 space-y-3">
                      {selectedCase.caseNotes.length === 0 ? (
                        <div className="rounded-[20px] border border-dashed border-slate-200 bg-slate-50/80 px-4 py-8 text-center text-sm text-slate-500">
                          No staff notes yet for this case.
                        </div>
                      ) : (
                        selectedCase.caseNotes.map((note) => (
                          <div
                            key={note.noteId}
                            className="rounded-[20px] border border-slate-200 bg-slate-50/90 p-4"
                          >
                            <p className="text-sm font-semibold text-slate-900">
                              {titleCase(note.noteType)}
                            </p>
                            <p className="mt-2 text-sm leading-6 text-slate-600">{note.noteText}</p>
                            <p className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
                              {formatDateTime(note.createdAt)}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "Critical steps completed",
                value: `${stats.completionRate}%`,
                note: "Of all required summer tasks, this share is already done or waived",
              },
              {
                label: "Aid verification cleared",
                value: `${stats.verificationResolved}%`,
                note: "Students who no longer have verification or FAFSA correction blocking aid",
              },
              {
                label: "Students responding",
                value: `${stats.responseRate}%`,
                note: "Share of students replying to outreach instead of going silent",
              },
              {
                label: "Verified enrolled",
                value: `${stats.enrolledRate}%`,
                note: "Students already confirmed enrolled and moved out of the intervention queue",
              },
            ].map((metric) => (
              <Card
                key={metric.label}
                className="bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(248,250,255,0.96))]"
              >
                <CardContent className="p-5">
                  <p className="text-sm font-medium text-slate-500">{metric.label}</p>
                  <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-slate-950">
                    {metric.value}
                  </p>
                  <Separator className="my-4" />
                  <p className="text-sm leading-6 text-slate-500">{metric.note}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(248,250,255,0.96))]">
              <CardHeader>
                <CardTitle>Outcome mix</CardTitle>
                <CardDescription>
                  Simple portfolio view for leadership and staff huddles.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                {[
                  { label: "Verified enrolled", value: 42, tone: "bg-emerald-500" },
                  { label: "Needs intervention", value: 33, tone: "bg-rose-500" },
                  { label: "On track", value: 25, tone: "bg-indigo-500" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[22px] border border-slate-200 bg-slate-50/90 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <p className="font-semibold text-slate-900">{item.label}</p>
                      <p className="text-sm font-semibold text-slate-500">{item.value}%</p>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200">
                      <div
                        className={`h-2 rounded-full ${item.tone}`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="overflow-hidden bg-[linear-gradient(135deg,rgba(36,56,128,0.98),rgba(16,185,188,0.9))] text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
                      Focus this morning
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
                      Protect yield before move-in.
                    </h3>
                  </div>
                  <GraduationCap className="size-8 text-white/80" />
                </div>
                <p className="mt-4 text-sm leading-7 text-white/80">
                  Priority cases are concentrated around aid verification, overdue
                  deposits, and students who have gone quiet after a status check.
                </p>
                <div className="mt-6 space-y-3">
                  {[
                    "2 cases escalated from HELP or no-response logic",
                    "1 case ready to close after enrollment verification",
                    "3 reminders queued for the next system check",
                  ].map((line) => (
                    <div
                      key={line}
                      className="rounded-[20px] border border-white/16 bg-white/10 px-4 py-3 text-sm"
                    >
                      {line}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}


