const now = "2026-04-07T11:00:00.000Z";

export const scenarioTemplates = [
  {
    id: "immunization-records",
    label: "Missing immunization records",
    studentLabel: "Health record hold",
    blockerTitle: "Your health record is still blocking enrollment",
    blockerDetail:
      "BMCC still needs your meningitis acknowledgment before registration can move forward.",
    whyItMatters:
      "This is a real enrollment blocker. Until the acknowledgment is on file, the next office cannot clear your path to advising and registration.",
    recommendedAction: "Open CUNYfirst and submit the meningitis acknowledgment today.",
    urgency: "Needs action today",
    dueLabel: "Due in 24 hours",
    ownerOffice: "Health Compliance",
    helpOffice: "Admissions Support",
    successOffice: "Registrar",
    actions: [
      { id: "mark_complete", label: "Mark complete" },
      { id: "need_help", label: "Need help" },
      { id: "already_did_this", label: "I already did this" },
      { id: "cant_do_yet", label: "I can't do this yet" },
      { id: "plans_changed", label: "My plans changed" },
    ],
  },
  {
    id: "fafsa-verification",
    label: "FAFSA verification hold",
    studentLabel: "Aid verification hold",
    blockerTitle: "Your aid file still needs one document",
    blockerDetail:
      "Financial Aid flagged your file for verification. One document is still missing, so your advising path is paused.",
    whyItMatters:
      "If this stays open, the student can drift into summer without a clear next step and staff may not intervene until it is too late.",
    recommendedAction:
      "Upload the missing verification document or ask for help if you are unsure what BMCC still needs.",
    urgency: "Needs action today",
    dueLabel: "Overdue",
    ownerOffice: "Financial Aid",
    helpOffice: "Financial Aid",
    successOffice: "Advising",
    actions: [
      { id: "mark_complete", label: "Mark complete" },
      { id: "need_help", label: "Need help" },
      { id: "already_did_this", label: "I already did this" },
      { id: "cant_do_yet", label: "I can't do this yet" },
      { id: "plans_changed", label: "My plans changed" },
    ],
  },
  {
    id: "advising-hold",
    label: "Advising not completed",
    studentLabel: "Advising hold",
    blockerTitle: "You still need to complete advising",
    blockerDetail:
      "Registration will not open until your advising appointment is finished.",
    whyItMatters:
      "Students often think they are almost done, but registration remains locked until the advising handoff happens.",
    recommendedAction: "Book or attend the advising session so registration can open next.",
    urgency: "Needs action soon",
    dueLabel: "Due this week",
    ownerOffice: "Advising",
    helpOffice: "Admissions Support",
    successOffice: "Registration",
    actions: [
      { id: "mark_complete", label: "Mark complete" },
      { id: "need_help", label: "Need help" },
      { id: "already_did_this", label: "I already did this" },
      { id: "cant_do_yet", label: "I can't do this yet" },
      { id: "plans_changed", label: "My plans changed" },
    ],
  },
];

const baseTimeline = [
  {
    id: "event-1",
    type: "scenario_started",
    title: "Scenario started by staff",
    detail: "Case was opened from the control room and is ready to share by QR or link.",
    at: now,
  },
];

function buildCase(id, templateId, studentName, options = {}) {
  const template = scenarioTemplates.find((entry) => entry.id === templateId);

  return {
    id,
    scenarioId: template.id,
    studentName,
    collegeName: "BMCC",
    highSchoolName: "John Dewey High School",
    urgency: template.urgency,
    dueLabel: template.dueLabel,
    ownerOffice: template.ownerOffice,
    nextOwnerOffice: options.nextOwnerOffice || template.ownerOffice,
    escalationState: options.escalationState || "Watching",
    status: options.status || "Waiting on student",
    blockerTitle: template.blockerTitle,
    blockerDetail: template.blockerDetail,
    whyItMatters: template.whyItMatters,
    recommendedAction: template.recommendedAction,
    studentState: options.studentState || "Waiting for student response",
    lastActionLabel: options.lastActionLabel || "Scenario created",
    lastUpdatedAt: options.lastUpdatedAt || now,
    shareToken: `${id}-share`,
    alerts: options.alerts || [],
    timeline: options.timeline || baseTimeline,
  };
}

export const initialCases = [
  buildCase("case-101", "fafsa-verification", "Maya Johnson", {
    escalationState: "Escalated",
    status: "Needs support",
    studentState: "Student asked for help",
    lastActionLabel: "Student tapped Need help",
    lastUpdatedAt: "2026-04-07T10:42:00.000Z",
    nextOwnerOffice: "Financial Aid",
    alerts: [
      {
        id: "alert-101",
        tone: "critical",
        title: "Help request routed to Financial Aid",
        body: "Student said they cannot tell which document is still missing.",
        office: "Financial Aid",
        at: "2026-04-07T10:42:00.000Z",
      },
    ],
    timeline: [
      ...baseTimeline,
      {
        id: "event-101",
        type: "student_action",
        title: "Student asked for help",
        detail: "Financial Aid now owns the next step.",
        at: "2026-04-07T10:42:00.000Z",
      },
    ],
  }),
  buildCase("case-102", "advising-hold", "Diego Santos", {
    studentState: "QR ready to scan",
    lastUpdatedAt: "2026-04-07T10:55:00.000Z",
  }),
  buildCase("case-103", "immunization-records", "Imani Carter", {
    escalationState: "Review needed",
    status: "Verifying completion",
    studentState: "Student says this was already done",
    lastActionLabel: "Student tapped I already did this",
    lastUpdatedAt: "2026-04-07T09:58:00.000Z",
    nextOwnerOffice: "Registrar",
    alerts: [
      {
        id: "alert-103",
        tone: "review",
        title: "Completion needs verification",
        body: "Registrar should confirm that the acknowledgment actually posted.",
        office: "Registrar",
        at: "2026-04-07T09:58:00.000Z",
      },
    ],
    timeline: [
      ...baseTimeline,
      {
        id: "event-103",
        type: "student_action",
        title: "Student says the step is already complete",
        detail: "Ownership moved from Health Compliance to Registrar review.",
        at: "2026-04-07T09:58:00.000Z",
      },
    ],
  }),
];

export const demoStudents = ["Maya Johnson", "Diego Santos", "Imani Carter", "Noah Kim", "Aaliyah Price"];

export const actionBehaviors = {
  mark_complete: {
    status: "Resolved",
    escalationState: "Resolved",
    tone: "success",
    alertTitle: "Completion reported by student",
    update(caseItem, template) {
      return {
        ...caseItem,
        status: "Resolved",
        escalationState: "Resolved",
        nextOwnerOffice: template.successOffice,
        studentState: "Student marked the blocker complete",
        lastActionLabel: "Student tapped Mark complete",
      };
    },
    detail: (template) => `${template.successOffice} should confirm the item and close the case if cleared.`,
  },
  need_help: {
    status: "Needs support",
    escalationState: "Escalated",
    tone: "critical",
    alertTitle: "Help request submitted",
    update(caseItem, template) {
      return {
        ...caseItem,
        status: "Needs support",
        escalationState: "Escalated",
        nextOwnerOffice: template.helpOffice,
        studentState: "Student asked for help",
        lastActionLabel: "Student tapped Need help",
      };
    },
    detail: (template) => `${template.helpOffice} now owns the next action.`,
  },
  already_did_this: {
    status: "Verifying completion",
    escalationState: "Review needed",
    tone: "review",
    alertTitle: "Student says this is already done",
    update(caseItem, template) {
      return {
        ...caseItem,
        status: "Verifying completion",
        escalationState: "Review needed",
        nextOwnerOffice: template.successOffice,
        studentState: "Student says the blocker is already cleared",
        lastActionLabel: "Student tapped I already did this",
      };
    },
    detail: (template) => `${template.successOffice} should verify before staff closes the case.`,
  },
  cant_do_yet: {
    status: "Blocked",
    escalationState: "Escalated",
    tone: "critical",
    alertTitle: "Student cannot complete the step yet",
    update(caseItem, template) {
      return {
        ...caseItem,
        status: "Blocked",
        escalationState: "Escalated",
        nextOwnerOffice: template.ownerOffice,
        studentState: "Student says they cannot do this yet",
        lastActionLabel: "Student tapped I can't do this yet",
      };
    },
    detail: (template) => `${template.ownerOffice} should review the blocker and set a follow-up plan.`,
  },
  plans_changed: {
    status: "Plans changed",
    escalationState: "Escalated",
    tone: "critical",
    alertTitle: "Student reported a change of plans",
    update(caseItem) {
      return {
        ...caseItem,
        status: "Plans changed",
        escalationState: "Escalated",
        nextOwnerOffice: "Admissions Support",
        studentState: "Student says their enrollment plans changed",
        lastActionLabel: "Student tapped My plans changed",
      };
    },
    detail: () => "Admissions Support should review whether the case should be closed or rerouted.",
  },
};
