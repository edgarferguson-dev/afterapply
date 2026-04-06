import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  BadgeHelp,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  CircleDashed,
  GraduationCap,
  MessageSquareText,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";
import { ScrollArea } from "../ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { formatDate, formatDateTime, titleCase } from "../../lib/utils";

const categoryOrder = ["Financial Aid", "Enrollment", "Campus Setup", "Health Forms"];

const urgencyCopy = {
  OVERDUE: "Overdue",
  BLOCKED: "Blocked",
  IN_PROGRESS: "In progress",
  PENDING: "Coming up",
  COMPLETED: "Done",
  WAIVED: "Waived",
};

function taskTone(status) {
  if (status === "COMPLETED" || status === "WAIVED") return "success";
  if (status === "OVERDUE" || status === "BLOCKED") return "coral";
  if (status === "IN_PROGRESS") return "gold";
  return "indigo";
}

function getDeadlineState(dueDate, status) {
  if (status === "OVERDUE") {
    return { label: "Past due", detail: "This deadline already passed.", variant: "coral" };
  }

  const today = new Date("2026-07-05T12:00:00");
  const target = new Date(dueDate);
  const days = Math.ceil((target - today) / (1000 * 60 * 60 * 24));

  if (days <= 2) {
    return { label: `${days <= 0 ? "Due now" : `${days} days left`}`, detail: "This needs attention right away.", variant: "coral" };
  }

  if (days <= 7) {
    return { label: `${days} days left`, detail: "A reminder is already active for this deadline.", variant: "gold" };
  }

  return { label: `${days} days left`, detail: "You still have time, but this is your next required step.", variant: "aqua" };
}

function getTaskWhy(task) {
  switch (task.taskType) {
    case "VERIFICATION_DOCUMENTS":
    case "FAFSA_CORRECTION":
      return "Your college cannot finish aid until this is cleared, which can hold up your enrollment.";
    case "DEPOSIT":
      return "This protects your seat. Missing it can put your place in the class at risk.";
    case "ORIENTATION_REGISTRATION":
      return "Orientation unlocks key enrollment steps and helps keep registration on track.";
    case "HEALTH_FORMS":
      return "Your college still needs these before move-in or the start of classes.";
    case "COURSE_REGISTRATION":
      return "You need classes on your schedule before the term begins.";
    default:
      return "This is one of the required steps your college still needs before move-in.";
  }
}

const tabMotion = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.28, ease: "easeOut" },
};

export function StudentMobile({ caseRecord, studentTab, onStudentTabChange }) {
  const MotionDiv = motion.div;
  const deadlineState = getDeadlineState(
    caseRecord.urgentTask.dueDate,
    caseRecord.urgentTask.taskStatus,
  );
  const groupedTasks = categoryOrder.map((category) => ({
    category,
    items: caseRecord.tasks.filter((task) => task.taskCategory === category),
  }));

  const latestMessages = [...caseRecord.messages].sort(
    (a, b) =>
      new Date(b.sentAt || b.receivedAt || b.createdAt) -
      new Date(a.sentAt || a.receivedAt || a.createdAt),
  );

  return (
    <div className="relative mx-auto w-full max-w-[410px]">
      <div className="absolute -inset-8 bg-[radial-gradient(circle_at_top,rgba(58,125,255,0.28),transparent_50%),radial-gradient(circle_at_bottom_right,rgba(30,216,207,0.28),transparent_42%)] blur-3xl" />
      <MotionDiv
        initial={{ opacity: 0, y: 22, rotate: -2 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[42px] border border-white/60 bg-[linear-gradient(180deg,rgba(246,249,255,0.96),rgba(238,244,251,0.98))] p-3 shadow-[0_32px_120px_rgba(27,52,111,0.2)]"
      >
        <div className="mx-auto mb-3 h-1.5 w-28 rounded-full bg-slate-900/10" />
        <div className="overflow-hidden rounded-[34px] border border-white/70 bg-[linear-gradient(180deg,#f7fbff_0%,#eef5fb_100%)]">
          <div className="border-b border-slate-200/80 px-5 pb-5 pt-6">
            <div className="mb-4 flex items-center justify-between">
              <Badge variant="aqua">Student app</Badge>
              <span className="text-xs font-medium text-slate-500">
                Case #{caseRecord.caseId.slice(-3)}
              </span>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Summer Melt Case Engine</p>
                <h2 className="mt-2 text-[2rem] font-semibold tracking-[-0.05em] text-slate-950">
                  You&apos;re close.
                </h2>
                <p className="mt-2 max-w-[18rem] text-sm leading-6 text-slate-600">
                  Here&apos;s your next step to stay on track for {caseRecord.collegeName}.
                </p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Accepted • committed • finishing enrollment
                </p>
              </div>
              <Card className="overflow-hidden border-indigo-100/80 bg-[linear-gradient(135deg,rgba(43,88,255,0.96),rgba(22,198,212,0.86))] text-white shadow-none">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/75">
                        Progress
                      </p>
                      <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                        {caseRecord.completedCount} of {caseRecord.tasks.length}
                      </p>
                      <p className="mt-1 text-sm text-white/78">required steps completed</p>
                    </div>
                    <div className="rounded-[24px] border border-white/20 bg-white/10 px-4 py-3 text-right backdrop-blur">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/70">Case</p>
                      <p className="mt-2 text-sm font-semibold">
                        {titleCase(caseRecord.caseStatus)}
                      </p>
                    </div>
                  </div>
                  <Progress
                    value={caseRecord.progress}
                    className="mt-5 bg-white/20"
                    indicatorClassName="bg-white"
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="px-4 py-4">
            <Tabs value={studentTab} onValueChange={onStudentTabChange}>
              <TabsList className="grid w-full grid-cols-4 bg-white/90">
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="checklist">Checklist</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
                <TabsTrigger value="plan">Plan</TabsTrigger>
              </TabsList>

              <div className="mt-4 min-h-[590px]">
                <AnimatePresence mode="wait">
                  <TabsContent key={studentTab} value={studentTab}>
                    {studentTab === "today" && (
                      <MotionDiv {...tabMotion} className="space-y-4">
                        <Card className="overflow-hidden border-white/80 bg-white/88">
                          <CardContent className="p-5">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                                  Today&apos;s priority
                                </p>
                                <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                                  {caseRecord.urgentTask.taskName}
                                </h3>
                              </div>
                              <div className="rounded-[22px] bg-indigo-50 p-3 text-indigo-600">
                                <CalendarClock className="size-5" />
                              </div>
                            </div>
                            <div className="mt-4 rounded-[26px] border border-rose-100/60 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(248,250,252,0.96))] p-4">
                              <div className="flex items-center justify-between gap-3">
                                <Badge variant={taskTone(caseRecord.urgentTask.taskStatus)}>
                                  {urgencyCopy[caseRecord.urgentTask.taskStatus]}
                                </Badge>
                                <Badge variant={deadlineState.variant}>{deadlineState.label}</Badge>
                              </div>
                              <div className="mt-4 rounded-[20px] bg-slate-950 px-4 py-3 text-white">
                                <p className="text-xs uppercase tracking-[0.18em] text-white/65">
                                  Due date
                                </p>
                                <p className="mt-2 text-lg font-semibold">
                                  {formatDate(caseRecord.urgentTask.dueDate)}
                                </p>
                                <p className="mt-1 text-sm text-white/70">{deadlineState.detail}</p>
                              </div>
                            </div>
                            <div className="mt-4 space-y-3 rounded-[24px] border border-slate-200 bg-slate-50/90 p-4">
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                  Why this matters
                                </p>
                                <p className="mt-2 text-sm leading-6 text-slate-700">
                                  {getTaskWhy(caseRecord.urgentTask)}
                                </p>
                              </div>
                              <div className="rounded-[18px] border border-cyan-100 bg-cyan-50/80 px-3 py-2 text-sm text-slate-600">
                                {caseRecord.urgentTask.taskStatus === "OVERDUE"
                                  ? "Overdue outreach is active until this step is complete."
                                  : caseRecord.urgentTask.helpRequested
                                    ? "Your counselor already knows you may need help here."
                                    : "If you finish this, reminders for this task stop automatically."}
                              </div>
                            </div>
                            <div className="mt-5 grid gap-3">
                              <Button className="w-full justify-between text-base">
                                Open link
                                <ArrowUpRight className="size-4" />
                              </Button>
                              <Button variant="secondary" className="w-full justify-between">
                                Need help
                                <BadgeHelp className="size-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                className="w-full justify-between rounded-2xl"
                              >
                                Complete this step
                                <CheckCircle2 className="size-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-white/82">
                          <CardContent className="p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                              Case workflow
                            </p>
                            <div className="mt-4 grid grid-cols-5 gap-2">
                              {[
                                {
                                  label: "Reminder",
                                  active: caseRecord.workflowState.reminderSent,
                                },
                                { label: "Overdue", active: caseRecord.workflowState.overdue },
                                {
                                  label: "Help",
                                  active: caseRecord.workflowState.helpRequested,
                                },
                                {
                                  label: "Escalated",
                                  active: caseRecord.workflowState.escalated,
                                },
                                {
                                  label: "Done",
                                  active: caseRecord.workflowState.completedOrClosed,
                                },
                              ].map((step, index) => (
                                <div key={step.label} className="relative text-center">
                                  {index !== 4 && (
                                    <div className="absolute left-[58%] top-3 h-px w-full bg-slate-200" />
                                  )}
                                  <div
                                    className={`relative mx-auto flex size-6 items-center justify-center rounded-full border ${
                                      step.active
                                        ? "border-cyan-400 bg-cyan-400 shadow-[0_0_0_4px_rgba(34,211,238,0.12)]"
                                        : "border-slate-200 bg-white"
                                    }`}
                                  />
                                  <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                                    {step.label}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        <div className="grid grid-cols-2 gap-3">
                          <Card className="bg-white/82">
                            <CardContent className="p-4">
                              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                                Support
                              </p>
                              <p className="mt-3 text-sm font-semibold text-slate-900">
                                {caseRecord.staff.fullName}
                              </p>
                              <p className="mt-1 text-sm text-slate-500">
                                {caseRecord.staff.role}
                              </p>
                            </CardContent>
                          </Card>
                          <Card className="bg-white/82">
                            <CardContent className="p-4">
                              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                                Next check
                              </p>
                              <p className="mt-3 text-sm font-semibold text-slate-900">
                                {formatDateTime(caseRecord.nextSystemCheckAt)}
                              </p>
                              <p className="mt-1 text-sm text-slate-500">
                                Reminder stops once done
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                      </MotionDiv>
                    )}

                    {studentTab === "checklist" && (
                      <MotionDiv {...tabMotion} className="space-y-4">
                        {groupedTasks.map(
                          (group) =>
                            group.items.length > 0 && (
                              <Card key={group.category} className="bg-white/86">
                                <CardContent className="p-5">
                                  <div className="mb-4 flex items-center justify-between">
                                    <h3 className="text-base font-semibold text-slate-900">
                                      {group.category}
                                    </h3>
                                    <span className="text-xs font-medium text-slate-400">
                                      {group.items.length} tasks
                                    </span>
                                  </div>
                                  <div className="space-y-3">
                                    {group.items.map((item) => (
                                      <button
                                        key={item.taskId}
                                        className="flex w-full items-center justify-between rounded-[22px] border border-slate-200 bg-slate-50/90 p-4 text-left transition hover:border-slate-300 hover:bg-white"
                                      >
                                        <div>
                                          <div className="flex items-center gap-2">
                                            <p className="font-semibold text-slate-900">
                                              {item.taskName}
                                            </p>
                                            <Badge variant={taskTone(item.taskStatus)}>
                                              {urgencyCopy[item.taskStatus]}
                                            </Badge>
                                          </div>
                                          <p className="mt-2 text-sm text-slate-500">
                                            Due {formatDate(item.dueDate)}
                                          </p>
                                        </div>
                                        <ChevronRight className="size-5 text-slate-400" />
                                      </button>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>
                            ),
                        )}
                      </MotionDiv>
                    )}

                    {studentTab === "messages" && (
                      <MotionDiv {...tabMotion} className="space-y-4">
                        <Card className="bg-white/84">
                          <CardContent className="p-0">
                            <ScrollArea className="h-[560px] px-5 py-5">
                              <div className="space-y-4">
                                {latestMessages.length === 0 && (
                                  <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50/80 px-4 py-8 text-center text-sm text-slate-500">
                                    Messages will show here when reminders or counselor replies are sent.
                                  </div>
                                )}
                                {latestMessages.map((message) => {
                                  const isOutbound = message.direction === "OUTBOUND";
                                  const isStudent = message.sentBy === "student";

                                  return (
                                    <div
                                      key={message.messageId}
                                      className={`flex ${
                                        isStudent ? "justify-end" : "justify-start"
                                      }`}
                                    >
                                      <div
                                        className={`max-w-[86%] rounded-[24px] px-4 py-3 text-sm leading-6 shadow-sm ${
                                          isStudent
                                            ? "bg-slate-950 text-white"
                                            : isOutbound
                                              ? "border border-indigo-100 bg-indigo-50 text-slate-700"
                                              : "border border-cyan-100 bg-cyan-50 text-slate-700"
                                        }`}
                                      >
                                        <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] opacity-70">
                                          {isStudent
                                            ? "You"
                                            : message.sentBy === "system"
                                              ? "System"
                                              : "Counselor"}
                                        </div>
                                        <p>{message.body}</p>
                                        <p className="mt-2 text-[11px] opacity-60">
                                          {formatDateTime(
                                            message.sentAt ||
                                              message.receivedAt ||
                                              message.createdAt,
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </ScrollArea>
                          </CardContent>
                        </Card>
                      </MotionDiv>
                    )}

                    {studentTab === "plan" && (
                      <MotionDiv {...tabMotion} className="space-y-4">
                        <Card className="overflow-hidden bg-[linear-gradient(135deg,#ffffff,#f0f8ff)]">
                          <CardContent className="p-5">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                                  College plan
                                </p>
                                <h3 className="mt-3 text-xl font-semibold tracking-[-0.04em] text-slate-950">
                                  {caseRecord.collegeName}
                                </h3>
                              </div>
                              <div className="rounded-[20px] bg-slate-950 p-3 text-white">
                                <GraduationCap className="size-5" />
                              </div>
                            </div>
                            <div className="mt-6 space-y-4">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Intended enrollment</span>
                                <span className="font-semibold text-slate-900">
                                  {formatDate(caseRecord.intendedEnrollmentDate)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Case status</span>
                                <Badge
                                  variant={
                                    caseRecord.caseStatus === "CLOSED"
                                      ? "success"
                                      : "indigo"
                                  }
                                >
                                  {titleCase(caseRecord.caseStatus)}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Assigned support</span>
                                <span className="font-semibold text-slate-900">
                                  {caseRecord.staff.fullName}
                                </span>
                              </div>
                              <div className="rounded-[24px] border border-slate-200 bg-white/90 p-4">
                                <div className="mb-3 flex items-center justify-between">
                                  <span className="text-sm font-medium text-slate-500">
                                    Progress
                                  </span>
                                  <span className="text-sm font-semibold text-slate-900">
                                    {caseRecord.progress}%
                                  </span>
                                </div>
                                <Progress value={caseRecord.progress} />
                              </div>
                              <div className="rounded-[24px] border border-cyan-100 bg-cyan-50/80 p-4 text-sm text-slate-600">
                                <div className="mb-2 flex items-center gap-2 text-slate-900">
                                  <ShieldCheck className="size-4 text-cyan-600" />
                                  Reminders stop when a task is complete.
                                </div>
                                If you get stuck or something changes, send a help message and
                                your counselor steps in.
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </MotionDiv>
                    )}
                  </TabsContent>
                </AnimatePresence>
              </div>
            </Tabs>
          </div>

          <div className="border-t border-slate-200/80 px-5 py-4">
            <div className="flex items-center justify-around text-xs font-semibold text-slate-400">
              <div className="flex flex-col items-center gap-1 text-indigo-600">
                <CircleDashed className="size-4" />
                Today
              </div>
              <div className="flex flex-col items-center gap-1">
                <CheckCircle2 className="size-4" />
                Checklist
              </div>
              <div className="flex flex-col items-center gap-1">
                <MessageSquareText className="size-4" />
                Messages
              </div>
              <div className="flex flex-col items-center gap-1">
                <GraduationCap className="size-4" />
                Plan
              </div>
            </div>
          </div>
        </div>
      </MotionDiv>
    </div>
  );
}

