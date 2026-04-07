const iso = (value) => new Date(value).toISOString();
const demoNow = new Date("2026-07-15T12:00:00");
const done = new Set(["COMPLETED", "WAIVED"]);
const actionable = new Set(["PENDING", "IN_PROGRESS", "OVERDUE", "BLOCKED"]);

const staff = [
  ["staff-001", "Ariana Brooks", "College Access Counselor", "John Dewey College Access Team", "abrooks@johndeweydemo.org", "7185550110"],
  ["staff-002", "Marcus Liu", "Postsecondary Success Manager", "John Dewey Postsecondary Success Office", "mliu@johndeweydemo.org", "7185550111"],
  ["staff-003", "Tiana Rivera", "Enrollment Specialist", "BMCC Enrollment Support", "trivera@bmccdemo.org", "2125550112"],
];

export const staffUsers = staff.map(([staffId, fullName, role, organizationName, email, phone], index) => ({
  staffId,
  fullName,
  role,
  organizationName,
  email,
  phone,
  active: true,
  createdAt: iso(`2026-01-${String(index + 5).padStart(2, "0")}T09:00:00`),
}));

const studentSeeds = [
  ["stu-001", "Maya", "Johnson", "9175550111", "maya.johnson@email.com", true, true],
  ["stu-002", "Diego", "Santos", "3475550144", "diego.santos@email.com", false, true],
  ["stu-003", "Imani", "Carter", "6465550199", "imani.carter@email.com", true, false],
  ["stu-004", "Noah", "Kim", "9295550177", "noah.kim@email.com", false, false],
  ["stu-005", "Aaliyah", "Price", "7185550166", "aaliyah.price@email.com", true, true],
  ["stu-006", "Luis", "Martinez", "9175550135", "luis.martinez@email.com", true, true],
];

export const students = studentSeeds.map(([studentId, firstName, lastName, phone, email, firstGenFlag, lowIncomeFlag], index) => ({
  studentId,
  firstName,
  lastName,
  fullName: `${firstName} ${lastName}`,
  phone,
  email,
  highSchoolName: "John Dewey High School",
  graduationYear: 2026,
  preferredLanguage: studentId === "stu-006" ? "Spanish" : "English",
  consentSms: true,
  consentEmail: studentId !== "stu-003" && studentId !== "stu-006",
  firstGenFlag,
  lowIncomeFlag,
  createdAt: iso(`2026-05-${String(15 + index).padStart(2, "0")}T09:00:00`),
  updatedAt: iso(`2026-07-${String(10 + index).padStart(2, "0")}T10:00:00`),
}));

const bmcc = "Borough of Manhattan Community College (BMCC)";
const caseSeeds = [
  ["case-001", "stu-001", "staff-001", "ACTIVE", "INTENDS_TO_ENROLL", "HIGH", "2026-05-01T18:00:00", "2026-07-14T16:41:00", "2026-07-14T10:00:00", "2026-07-16T09:00:00", null],
  ["case-002", "stu-002", "staff-002", "ACTIVE", "INTENDS_TO_ENROLL", "MEDIUM", "2026-05-02T14:00:00", "2026-07-13T18:05:00", "2026-07-14T09:30:00", "2026-07-16T08:00:00", null],
  ["case-003", "stu-003", "staff-003", "ACTIVE", "INTENDS_TO_ENROLL", "LOW", "2026-05-01T16:00:00", "2026-07-15T12:50:00", "2026-07-13T09:00:00", "2026-07-17T09:00:00", null],
  ["case-004", "stu-004", "staff-001", "ACTIVE", "ADMITTED", "HIGH", null, null, "2026-07-10T11:45:00", "2026-07-16T10:00:00", null],
  ["case-005", "stu-005", "staff-002", "CLOSED", "ENROLLED", "LOW", "2026-05-03T15:00:00", "2026-07-13T09:10:00", "2026-07-12T10:00:00", null, "Student completed advising, registered, finished orientation, and is ready to start classes at BMCC."],
  ["case-006", "stu-006", "staff-003", "CLOSED", "NOT_ATTENDING", "HIGH", "2026-05-04T17:00:00", "2026-07-15T08:15:00", "2026-07-15T08:00:00", null, "Student confirmed they are not attending BMCC this term and reminders were stopped."],
];

export const collegeCases = caseSeeds.map(([caseId, studentId, assignedStaffId, caseStatus, enrollmentStatus, riskLevel, commitmentDate, lastStudentResponseAt, lastOutboundMessageAt, nextSystemCheckAt, closeReason]) => ({
  caseId,
  studentId,
  collegeName: bmcc,
  termName: "Fall 2026",
  intendedEnrollmentDate: iso("2026-08-27T09:00:00"),
  commitmentDate: commitmentDate ? iso(commitmentDate) : null,
  caseStatus,
  enrollmentStatus,
  riskLevel,
  assignedStaffId,
  activeWindowStart: iso("2026-06-01T00:00:00"),
  activeWindowEnd: iso("2026-08-27T23:59:00"),
  lastStudentResponseAt: lastStudentResponseAt ? iso(lastStudentResponseAt) : null,
  lastOutboundMessageAt: lastOutboundMessageAt ? iso(lastOutboundMessageAt) : null,
  nextSystemCheckAt: nextSystemCheckAt ? iso(nextSystemCheckAt) : null,
  caseClosedAt: caseStatus === "CLOSED" ? iso("2026-07-15T13:10:00") : null,
  closeReason,
  createdAt: iso("2026-05-18T09:30:00"),
  updatedAt: iso("2026-07-15T12:50:00"),
}));

const blueprints = {
  BMCC_ADMISSION: ["Admissions", "BMCC admission received", "This opens the rest of your summer enrollment steps.", "Once this is on file, you can confirm your intent to enroll.", "Reply HELP if your acceptance or CUNYfirst record looks wrong.", "https://home.cunyfirst.cuny.edu"],
  INTENT_TO_ENROLL: ["Admissions", "Confirm you plan to enroll at BMCC", "John Dewey and BMCC need to know you are still planning to start at BMCC this fall.", "Aid follow-up starts after your intent is confirmed.", "Reply HELP if your plan changed or you need to talk it through.", "https://home.cunyfirst.cuny.edu"],
  FAFSA_FOLLOW_UP: ["Financial Aid", "Finish FAFSA / aid follow-up", "Your aid follow-up still needs attention before your next step is clear.", "Verification only opens if BMCC flags your aid file for review.", "Reply HELP if FAFSA, TAP, or CUNYfirst aid screens are confusing.", "https://studentaid.gov"],
  VERIFICATION: ["Financial Aid", "Resolve BMCC aid verification", "Your aid package can stay stuck until the requested verification items are cleared.", "Advising should move once aid verification is no longer blocking your file.", "Reply HELP if you already uploaded a document or cannot tell what BMCC still needs.", "https://home.cunyfirst.cuny.edu"],
  MENINGITIS: ["Health Compliance", "Submit meningitis acknowledgement", "BMCC already has your NYC school immunization history. You still need to submit the meningitis acknowledgement.", "Once this is done, your health compliance step is out of the way.", "Reply HELP if you cannot find the meningitis acknowledgement in CUNYfirst.", "https://home.cunyfirst.cuny.edu"],
  ADVISING: ["Advising", "Complete BMCC advising", "Finish advising before registration opens.", "Registration unlocks after advising is complete.", "Reply HELP if you need someone from John Dewey's College Access Team to walk through this with you.", "https://www.bmcc.cuny.edu/admissions/advisement/"],
  REGISTRATION: ["Registration", "Register for classes", "You are not ready to start until classes are actually on your BMCC schedule.", "You can complete orientation after you register for classes.", "Reply HELP if you hit a hold or cannot see open sections.", "https://home.cunyfirst.cuny.edu"],
  ORIENTATION: ["Orientation", "Complete BMCC orientation", "Orientation helps you prepare after registration and closes the summer handoff.", "Once orientation is done, your case can close as enrolled and ready to start.", "Reply HELP if you registered but still cannot access orientation.", "https://www.bmcc.cuny.edu/orientation/"],
};

function makeTask(caseId, studentId, suffix, type, taskStatus, dueDate, extra = {}) {
  const [taskCategory, taskName, studentWhy, unlockText, helpText, externalLink] = blueprints[type];
  return { taskId: `${caseId}-${suffix}`, caseId, studentId, taskType: type, taskCategory, taskName, taskStatus, dueDate: iso(dueDate), priority: 1, completedAt: null, requiresHumanSupport: false, helpRequested: false, lastReminderAt: null, nextReminderAt: null, notes: "", createdAt: iso("2026-06-01T09:00:00"), updatedAt: iso("2026-07-15T09:00:00"), dependsOn: [], studentWhy, unlockText, helpText, externalLink, ...extra };
}

export const tasks = [
  makeTask("case-001", "stu-001", "admit", "BMCC_ADMISSION", "COMPLETED", "2026-05-10T23:59:00", { completedAt: iso("2026-05-06T13:00:00") }),
  makeTask("case-001", "stu-001", "intent", "INTENT_TO_ENROLL", "COMPLETED", "2026-05-20T23:59:00", { completedAt: iso("2026-05-12T18:15:00") }),
  makeTask("case-001", "stu-001", "aid", "FAFSA_FOLLOW_UP", "COMPLETED", "2026-06-20T23:59:00", { completedAt: iso("2026-06-12T13:00:00"), priority: 2, notes: "FAFSA and TAP are on file in CUNYfirst." }),
  makeTask("case-001", "stu-001", "verification", "VERIFICATION", "OVERDUE", "2026-07-14T23:59:00", { priority: 3, requiresHumanSupport: true, helpRequested: true, lastReminderAt: iso("2026-07-14T10:00:00"), nextReminderAt: iso("2026-07-16T10:00:00"), dependsOn: ["case-001-aid"], notes: "BMCC flagged the file for verification. Income worksheet is still missing in CUNYfirst." }),
  makeTask("case-001", "stu-001", "meningitis", "MENINGITIS", "PENDING", "2026-07-22T23:59:00", { priority: 2, lastReminderAt: iso("2026-07-11T09:00:00"), nextReminderAt: iso("2026-07-18T09:00:00"), dependsOn: ["case-001-intent"] }),
  makeTask("case-001", "stu-001", "advising", "ADVISING", "BLOCKED", "2026-07-25T23:59:00", { priority: 3, requiresHumanSupport: true, dependsOn: ["case-001-meningitis", "case-001-verification"], notes: "Advising will move once verification is resolved and the health acknowledgement is done." }),
  makeTask("case-001", "stu-001", "registration", "REGISTRATION", "PENDING", "2026-07-31T23:59:00", { priority: 2, dependsOn: ["case-001-advising"] }),
  makeTask("case-001", "stu-001", "orientation", "ORIENTATION", "PENDING", "2026-08-05T23:59:00", { dependsOn: ["case-001-registration"] }),
  makeTask("case-002", "stu-002", "admit", "BMCC_ADMISSION", "COMPLETED", "2026-05-10T23:59:00", { completedAt: iso("2026-05-05T17:00:00") }),
  makeTask("case-002", "stu-002", "intent", "INTENT_TO_ENROLL", "COMPLETED", "2026-05-20T23:59:00", { completedAt: iso("2026-05-11T17:00:00") }),
  makeTask("case-002", "stu-002", "aid", "FAFSA_FOLLOW_UP", "IN_PROGRESS", "2026-07-18T23:59:00", { priority: 2, lastReminderAt: iso("2026-07-14T09:30:00"), nextReminderAt: iso("2026-07-16T09:30:00"), notes: "Student said TAP looks complete but BMCC aid review still needs one follow-up item." }),
  makeTask("case-002", "stu-002", "verification", "VERIFICATION", "WAIVED", "2026-07-20T23:59:00", { dependsOn: ["case-002-aid"], notes: "No verification request is currently on file." }),
  makeTask("case-002", "stu-002", "meningitis", "MENINGITIS", "COMPLETED", "2026-07-08T23:59:00", { completedAt: iso("2026-07-02T11:00:00"), dependsOn: ["case-002-intent"] }),
  makeTask("case-002", "stu-002", "advising", "ADVISING", "OVERDUE", "2026-07-12T23:59:00", { priority: 3, lastReminderAt: iso("2026-07-14T09:30:00"), nextReminderAt: iso("2026-07-16T18:00:00"), dependsOn: ["case-002-meningitis"], notes: "Student has not finished the BMCC advising appointment, so registration is still closed." }),
  makeTask("case-002", "stu-002", "registration", "REGISTRATION", "PENDING", "2026-07-30T23:59:00", { priority: 2, dependsOn: ["case-002-advising"] }),
  makeTask("case-002", "stu-002", "orientation", "ORIENTATION", "PENDING", "2026-08-04T23:59:00", { dependsOn: ["case-002-registration"] }),
  makeTask("case-003", "stu-003", "admit", "BMCC_ADMISSION", "COMPLETED", "2026-05-10T23:59:00", { completedAt: iso("2026-05-04T11:45:00") }),
  makeTask("case-003", "stu-003", "intent", "INTENT_TO_ENROLL", "COMPLETED", "2026-05-20T23:59:00", { completedAt: iso("2026-05-09T17:30:00") }),
  makeTask("case-003", "stu-003", "aid", "FAFSA_FOLLOW_UP", "COMPLETED", "2026-06-20T23:59:00", { completedAt: iso("2026-06-15T10:00:00") }),
  makeTask("case-003", "stu-003", "verification", "VERIFICATION", "WAIVED", "2026-06-25T23:59:00", { dependsOn: ["case-003-aid"], notes: "No verification needed." }),
  makeTask("case-003", "stu-003", "meningitis", "MENINGITIS", "COMPLETED", "2026-07-10T23:59:00", { completedAt: iso("2026-07-03T16:20:00"), dependsOn: ["case-003-intent"] }),
  makeTask("case-003", "stu-003", "advising", "ADVISING", "COMPLETED", "2026-07-14T23:59:00", { completedAt: iso("2026-07-09T14:40:00"), dependsOn: ["case-003-meningitis"] }),
  makeTask("case-003", "stu-003", "registration", "REGISTRATION", "COMPLETED", "2026-07-14T23:59:00", { completedAt: iso("2026-07-12T11:15:00"), dependsOn: ["case-003-advising"], notes: "Student registered for classes in CUNYfirst." }),
  makeTask("case-003", "stu-003", "orientation", "ORIENTATION", "PENDING", "2026-07-22T23:59:00", { priority: 2, lastReminderAt: iso("2026-07-13T09:00:00"), nextReminderAt: iso("2026-07-18T09:00:00"), dependsOn: ["case-003-registration"] }),
  makeTask("case-004", "stu-004", "admit", "BMCC_ADMISSION", "COMPLETED", "2026-05-10T23:59:00", { completedAt: iso("2026-05-07T09:30:00") }),
  makeTask("case-004", "stu-004", "intent", "INTENT_TO_ENROLL", "OVERDUE", "2026-07-09T23:59:00", { priority: 3, lastReminderAt: iso("2026-07-10T11:45:00"), nextReminderAt: iso("2026-07-16T11:45:00"), requiresHumanSupport: true, notes: "BMCC admission is on file, but the student has not confirmed whether BMCC is still the plan." }),
  makeTask("case-004", "stu-004", "aid", "FAFSA_FOLLOW_UP", "PENDING", "2026-07-20T23:59:00", { dependsOn: ["case-004-intent"] }),
  makeTask("case-004", "stu-004", "verification", "VERIFICATION", "PENDING", "2026-07-24T23:59:00", { dependsOn: ["case-004-aid"] }),
  makeTask("case-004", "stu-004", "meningitis", "MENINGITIS", "PENDING", "2026-07-26T23:59:00", { dependsOn: ["case-004-intent"] }),
  makeTask("case-004", "stu-004", "advising", "ADVISING", "PENDING", "2026-07-30T23:59:00", { dependsOn: ["case-004-meningitis"] }),
  makeTask("case-004", "stu-004", "registration", "REGISTRATION", "PENDING", "2026-08-05T23:59:00", { dependsOn: ["case-004-advising"] }),
  makeTask("case-004", "stu-004", "orientation", "ORIENTATION", "PENDING", "2026-08-10T23:59:00", { dependsOn: ["case-004-registration"] }),
  makeTask("case-005", "stu-005", "admit", "BMCC_ADMISSION", "COMPLETED", "2026-05-10T23:59:00", { completedAt: iso("2026-05-05T13:00:00") }),
  makeTask("case-005", "stu-005", "intent", "INTENT_TO_ENROLL", "COMPLETED", "2026-05-20T23:59:00", { completedAt: iso("2026-05-08T13:00:00") }),
  makeTask("case-005", "stu-005", "aid", "FAFSA_FOLLOW_UP", "COMPLETED", "2026-06-18T23:59:00", { completedAt: iso("2026-06-07T13:00:00") }),
  makeTask("case-005", "stu-005", "verification", "VERIFICATION", "WAIVED", "2026-06-22T23:59:00", { dependsOn: ["case-005-aid"] }),
  makeTask("case-005", "stu-005", "meningitis", "MENINGITIS", "COMPLETED", "2026-07-01T23:59:00", { completedAt: iso("2026-06-27T14:40:00"), dependsOn: ["case-005-intent"] }),
  makeTask("case-005", "stu-005", "advising", "ADVISING", "COMPLETED", "2026-07-07T23:59:00", { completedAt: iso("2026-06-28T09:15:00"), dependsOn: ["case-005-meningitis"] }),
  makeTask("case-005", "stu-005", "registration", "REGISTRATION", "COMPLETED", "2026-07-10T23:59:00", { completedAt: iso("2026-06-30T08:40:00"), dependsOn: ["case-005-advising"] }),
  makeTask("case-005", "stu-005", "orientation", "ORIENTATION", "COMPLETED", "2026-07-15T23:59:00", { completedAt: iso("2026-07-12T16:20:00"), dependsOn: ["case-005-registration"] }),
  makeTask("case-006", "stu-006", "admit", "BMCC_ADMISSION", "COMPLETED", "2026-05-10T23:59:00", { completedAt: iso("2026-05-05T14:00:00") }),
  makeTask("case-006", "stu-006", "intent", "INTENT_TO_ENROLL", "COMPLETED", "2026-05-20T23:59:00", { completedAt: iso("2026-05-11T14:00:00") }),
  makeTask("case-006", "stu-006", "aid", "FAFSA_FOLLOW_UP", "WAIVED", "2026-06-18T23:59:00", { notes: "Case closed after student changed plans." }),
  makeTask("case-006", "stu-006", "verification", "VERIFICATION", "WAIVED", "2026-06-24T23:59:00", { dependsOn: ["case-006-aid"], notes: "Case closed after student changed plans." }),
  makeTask("case-006", "stu-006", "meningitis", "MENINGITIS", "WAIVED", "2026-07-05T23:59:00", { dependsOn: ["case-006-intent"], notes: "Case closed after student changed plans." }),
  makeTask("case-006", "stu-006", "advising", "ADVISING", "WAIVED", "2026-07-12T23:59:00", { dependsOn: ["case-006-meningitis"], notes: "Case closed after student changed plans." }),
  makeTask("case-006", "stu-006", "registration", "REGISTRATION", "WAIVED", "2026-07-20T23:59:00", { dependsOn: ["case-006-advising"], notes: "Case closed after student changed plans." }),
  makeTask("case-006", "stu-006", "orientation", "ORIENTATION", "WAIVED", "2026-07-24T23:59:00", { dependsOn: ["case-006-registration"], notes: "Case closed after student changed plans." }),
];

const msg = (messageId, caseId, studentId, taskId, direction, sentBy, body, at, extra = {}) => ({
  messageId, caseId, studentId, taskId, channel: "SMS", direction, messageType: direction === "INBOUND" ? "STUDENT_REPLY" : "REMINDER", templateKey: null, body, deliveryStatus: direction === "INBOUND" ? "RECEIVED" : "DELIVERED", sentBy, providerMessageId: messageId.replace("msg", "sms"), sentAt: direction === "OUTBOUND" ? iso(at) : null, receivedAt: direction === "INBOUND" ? iso(at) : null, createdAt: iso(at), ...extra,
});

export const messages = [
  msg("msg-001", "case-001", "stu-001", "case-001-verification", "OUTBOUND", "system", "BMCC still needs one verification item in CUNYfirst before your aid review can finish. Reply HELP if you want John Dewey's College Access Team to go through it with you.", "2026-07-14T10:00:00", { messageType: "REMINDER_1_DAY", templateKey: "bmcc_verification_due" }),
  msg("msg-002", "case-001", "stu-001", "case-001-verification", "INBOUND", "student", "HELP I uploaded one doc already but I still can't tell what BMCC wants.", "2026-07-14T16:41:00"),
  msg("msg-003", "case-001", "stu-001", "case-001-verification", "OUTBOUND", "staff-001", "I checked your case. BMCC is still missing the income worksheet in CUNYfirst. Send a screenshot if you want, and we can walk through it today.", "2026-07-14T17:05:00", { messageType: "COUNSELOR_REPLY" }),
  msg("msg-004", "case-002", "stu-002", "case-002-advising", "OUTBOUND", "system", "Your BMCC advising step is still incomplete. Finish advising before registration opens. Reply HELP if you want someone from John Dewey to walk through the hold with you.", "2026-07-14T09:30:00", { messageType: "OVERDUE", templateKey: "bmcc_advising_overdue" }),
  msg("msg-005", "case-002", "stu-002", "case-002-aid", "INBOUND", "student", "I already did the TAP update. Do I still need anything else before advising?", "2026-07-13T18:05:00"),
  msg("msg-006", "case-002", "stu-002", "case-002-advising", "OUTBOUND", "system", "Thanks. BMCC aid follow-up looks okay right now. Your next required step is advising. Once advising is complete, registration can open.", "2026-07-14T09:45:00", { messageType: "TARGETED_FOLLOW_UP", templateKey: "bmcc_advising_targeted" }),
  msg("msg-007", "case-003", "stu-003", "case-003-orientation", "OUTBOUND", "system", "You already registered for classes. You can complete orientation after you register for classes, and that's the last step before your case can close.", "2026-07-13T09:00:00", { templateKey: "bmcc_orientation" }),
  msg("msg-008", "case-004", "stu-004", "case-004-intent", "OUTBOUND", "system", "Checking in from Summer Melt Case Engine: are you still planning to start at BMCC this fall? Reply YES, HELP, or NOT ATTENDING.", "2026-07-10T11:45:00", { messageType: "STATUS_CHECK", templateKey: "bmcc_intent_check" }),
  msg("msg-009", "case-005", "stu-005", "case-005-orientation", "OUTBOUND", "system", "You registered for classes and completed BMCC orientation. Your John Dewey summer case is ready to close as enrolled and ready to start classes.", "2026-07-12T10:00:00", { messageType: "COMPLETION", templateKey: "bmcc_ready" }),
  msg("msg-010", "case-006", "stu-006", null, "OUTBOUND", "system", "Before we keep sending BMCC reminders, are you still attending this fall? Reply HELP, NOT ATTENDING, or DONE if your plans changed.", "2026-07-15T08:00:00", { messageType: "STATUS_CHECK", templateKey: "bmcc_attending_check" }),
  msg("msg-011", "case-006", "stu-006", null, "INBOUND", "student", "NOT ATTENDING", "2026-07-15T08:15:00"),
];

export const messageReplies = [
  { replyId: "reply-001", messageId: "msg-002", caseId: "case-001", studentId: "stu-001", channel: "SMS", rawText: "HELP I uploaded one doc already but I still can't tell what BMCC wants.", parsedIntent: "Needs Help", parsedConfidence: 0.97, requiresEscalation: true, createdTaskUpdate: true, receivedAt: iso("2026-07-14T16:41:00"), processedAt: iso("2026-07-14T16:42:00") },
  { replyId: "reply-002", messageId: "msg-005", caseId: "case-002", studentId: "stu-002", channel: "SMS", rawText: "I already did the TAP update. Do I still need anything else before advising?", parsedIntent: "Completed", parsedConfidence: 0.9, requiresEscalation: false, createdTaskUpdate: true, receivedAt: iso("2026-07-13T18:05:00"), processedAt: iso("2026-07-13T18:06:00") },
  { replyId: "reply-003", messageId: "msg-011", caseId: "case-006", studentId: "stu-006", channel: "SMS", rawText: "NOT ATTENDING", parsedIntent: "Not Attending", parsedConfidence: 0.99, requiresEscalation: true, createdTaskUpdate: true, receivedAt: iso("2026-07-15T08:15:00"), processedAt: iso("2026-07-15T08:15:00") },
];

export const caseNotes = [
  { noteId: "note-001", caseId: "case-001", studentId: "stu-001", staffId: "staff-001", noteType: "AID_VERIFICATION", noteText: "Student needs the BMCC income worksheet. John Dewey team offered same-day walkthrough and screenshot review.", visibleToStudent: false, createdAt: iso("2026-07-14T17:12:00") },
  { noteId: "note-002", caseId: "case-002", studentId: "stu-002", staffId: "staff-002", noteType: "ADVISING_BLOCK", noteText: "Student thought aid follow-up was the current blocker. Staff confirmed advising is the next required step and sent a targeted follow-up.", visibleToStudent: false, createdAt: iso("2026-07-14T09:40:00") },
  { noteId: "note-003", caseId: "case-006", studentId: "stu-006", staffId: "staff-003", noteType: "RECLASSIFY", noteText: "Student texted NOT ATTENDING. Case moved to closed and all BMCC reminder steps were waived.", visibleToStudent: false, createdAt: iso("2026-07-15T08:20:00") },
];

export const interventions = [
  { interventionId: "int-001", caseId: "case-001", studentId: "stu-001", staffId: "staff-001", interventionType: "MANUAL_OUTREACH", reason: "Student replied HELP and said verification instructions are unclear.", outcome: "Counselor checked CUNYfirst, identified the missing worksheet, and sent task-specific guidance.", followUpDueAt: iso("2026-07-16T15:00:00"), createdAt: iso("2026-07-14T17:10:00") },
  { interventionId: "int-002", caseId: "case-002", studentId: "stu-002", staffId: "staff-002", interventionType: "TARGETED_MESSAGE", reason: "Student replied that aid was already done, but advising remains overdue.", outcome: "System sent a new message that moved the Today panel to advising and explained registration stays locked until advising is complete.", followUpDueAt: iso("2026-07-16T17:00:00"), createdAt: iso("2026-07-14T09:45:00") },
  { interventionId: "int-003", caseId: "case-006", studentId: "stu-006", staffId: "staff-003", interventionType: "INTENT_RECLASSIFICATION", reason: "Student replied not attending after a status check.", outcome: "Case closed, reminders stopped, and outcome was documented for staff follow-up.", followUpDueAt: iso("2026-07-16T12:00:00"), createdAt: iso("2026-07-15T08:20:00") },
];

const daysSince = (value) => (value ? Math.floor((demoNow - new Date(value)) / 86400000) : null);
const joinText = (items) => items.length < 3 ? items.join(" and ") : `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`;
function hydrateTasks(caseTasks) {
  return caseTasks.map((task) => {
    const unlocked = task.dependsOn.length === 0 || task.dependsOn.every((taskId) => {
      const dep = caseTasks.find((entry) => entry.taskId === taskId);
      return dep && done.has(dep.taskStatus);
    });
    return { ...task, unlocked, lockedReason: unlocked || done.has(task.taskStatus) ? null : task.unlockText };
  });
}

function buildCaseRecord(item) {
  const student = students.find((entry) => entry.studentId === item.studentId);
  const staff = staffUsers.find((entry) => entry.staffId === item.assignedStaffId);
  const tasksForCase = hydrateTasks(tasks.filter((entry) => entry.caseId === item.caseId).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)));
  const caseMessages = messages.filter((entry) => entry.caseId === item.caseId).sort((a, b) => new Date(a.sentAt || a.receivedAt || a.createdAt) - new Date(b.sentAt || b.receivedAt || b.createdAt));
  const caseReplies = messageReplies.filter((entry) => entry.caseId === item.caseId).sort((a, b) => new Date(b.processedAt) - new Date(a.processedAt));
  const caseInterventions = interventions.filter((entry) => entry.caseId === item.caseId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const caseCaseNotes = caseNotes.filter((entry) => entry.caseId === item.caseId);
  const urgentTask = tasksForCase.find((entry) => entry.unlocked && actionable.has(entry.taskStatus)) || tasksForCase.find((entry) => !done.has(entry.taskStatus)) || tasksForCase[0];
  const latestReply = caseReplies[0] || null;
  const overdueTasks = tasksForCase.filter((entry) => entry.taskStatus === "OVERDUE");
  const blockedTasks = tasksForCase.filter((entry) => entry.taskStatus === "BLOCKED");
  const helpTasks = tasksForCase.filter((entry) => entry.helpRequested);
  const responseGap = item.lastStudentResponseAt ? daysSince(item.lastStudentResponseAt) : null;
  const reasons = [
    tasksForCase.some((entry) => entry.taskCategory === "Financial Aid" && ["OVERDUE", "BLOCKED"].includes(entry.taskStatus)) ? "aid follow-up is stalled" : null,
    tasksForCase.some((entry) => entry.taskType === "MENINGITIS" && !done.has(entry.taskStatus) && entry.unlocked) ? "meningitis acknowledgement is incomplete" : null,
    tasksForCase.some((entry) => entry.taskType === "ADVISING" && !done.has(entry.taskStatus) && entry.unlocked) ? "advising is incomplete" : null,
    tasksForCase.some((entry) => entry.taskType === "REGISTRATION" && !done.has(entry.taskStatus) && entry.unlocked) ? "registration has not started" : null,
    !item.lastStudentResponseAt ? "no student response is on file" : null,
    responseGap !== null && responseGap >= 5 ? `no response has been received in ${responseGap} days` : null,
    latestReply?.parsedIntent === "Not Attending" ? "student said they are not attending" : null,
  ].filter(Boolean);
  const aiRiskSummary = reasons.length ? `Student is ${item.riskLevel.toLowerCase()} risk because ${joinText(reasons)}.` : "Student is low risk because the required BMCC enrollment steps are moving in sequence.";
  const aiSuggestedAction = latestReply?.parsedIntent === "Needs Help"
    ? "Send exact verification instructions and offer a same-day walkthrough."
    : urgentTask.taskType === "ADVISING"
      ? "Prompt student to complete advising before registration can proceed."
      : urgentTask.taskType === "ORIENTATION"
        ? "Remind the student orientation comes after registration and closes the case."
        : !item.lastStudentResponseAt
          ? "Escalate from automation to a John Dewey outreach attempt now."
          : `Prompt the student to complete ${urgentTask.taskName.toLowerCase()} next.`;
  const automationTriggerSource = latestReply ? `Student reply: ${latestReply.parsedIntent}` : item.lastOutboundMessageAt ? "Scheduled reminder cadence" : "Case creation";
  const studentActionState = done.has(urgentTask.taskStatus)
    ? "Complete"
    : urgentTask.unlocked
      ? `Current step: ${urgentTask.taskName}`
      : `Waiting on prior step before ${urgentTask.taskName.toLowerCase()}`;
  const staffActionState = item.caseStatus === "CLOSED"
    ? "Document final outcome"
    : latestReply?.parsedIntent === "Needs Help"
      ? "Needs immediate staff follow-up"
      : !item.lastStudentResponseAt
        ? "Student is silent; call or text from John Dewey"
        : `Monitor ${urgentTask.taskName.toLowerCase()}`;
  const progress = Math.round((tasksForCase.filter((entry) => done.has(entry.taskStatus)).length / tasksForCase.length) * 100);

  return {
    ...item,
    student,
    staff,
    tasks: tasksForCase,
    messages: caseMessages,
    messageReplies: caseReplies,
    interventions: caseInterventions,
    caseNotes: caseCaseNotes,
    progress,
    completedCount: tasksForCase.filter((entry) => done.has(entry.taskStatus)).length,
    overdueCount: overdueTasks.length,
    blockedCount: blockedTasks.length,
    helpRequestedCount: helpTasks.length,
    urgentTask,
    noResponse: !item.lastStudentResponseAt,
    escalated: caseInterventions.length > 0 || helpTasks.length > 0 || !item.lastStudentResponseAt,
    riskReasons: reasons,
    nextBestAction: { title: aiSuggestedAction, detail: aiSuggestedAction, owner: staff.fullName },
    aiReplyIntent: latestReply?.parsedIntent || "Unknown",
    aiRiskSummary,
    aiSuggestedAction,
    automationTriggerSource,
    studentActionState,
    staffActionState,
    institutionContext: {
      highSchool: "John Dewey High School",
      supportTeam: "John Dewey College Access Team",
      successOffice: "John Dewey Postsecondary Success Office",
      collegeSupport: "BMCC Enrollment Support",
      disclaimer: "Demo scenario modeled on NYC public high school to CUNY workflows. It does not imply an official partnership.",
    },
    workflowState: {
      reminderSent: Boolean(urgentTask.lastReminderAt || item.lastOutboundMessageAt),
      overdue: urgentTask.taskStatus === "OVERDUE" || overdueTasks.length > 0,
      helpRequested: helpTasks.length > 0 || latestReply?.parsedIntent === "Needs Help",
      escalated: caseInterventions.length > 0 || helpTasks.length > 0 || !item.lastStudentResponseAt,
      completedOrClosed: item.caseStatus === "CLOSED" || (urgentTask.taskType === "ORIENTATION" && done.has(urgentTask.taskStatus)),
    },
  };
}

export const caseRecords = collegeCases.map(buildCaseRecord);

export const kpiStats = {
  activeCases: collegeCases.filter((item) => item.caseStatus === "ACTIVE").length,
  highRisk: collegeCases.filter((item) => item.riskLevel === "HIGH" && item.caseStatus === "ACTIVE").length,
  overdueTasks: tasks.filter((item) => item.taskStatus === "OVERDUE").length,
  closedCases: collegeCases.filter((item) => item.caseStatus === "CLOSED").length,
  completionRate: Math.round((tasks.filter((item) => done.has(item.taskStatus)).length / tasks.length) * 100),
  verificationResolved: Math.round((tasks.filter((item) => item.taskType === "VERIFICATION" && done.has(item.taskStatus)).length / tasks.filter((item) => item.taskType === "VERIFICATION").length) * 100),
  responseRate: 67,
  enrolledRate: Math.round((collegeCases.filter((item) => item.enrollmentStatus === "ENROLLED").length / collegeCases.length) * 100),
  stuckOnAid: caseRecords.filter((item) => item.caseStatus === "ACTIVE" && item.tasks.some((task) => task.taskCategory === "Financial Aid" && ["OVERDUE", "BLOCKED", "IN_PROGRESS"].includes(task.taskStatus))).length,
  blockedOnImmunization: caseRecords.filter((item) => item.caseStatus === "ACTIVE" && item.tasks.some((task) => task.taskType === "MENINGITIS" && !done.has(task.taskStatus))).length,
  advisingIncomplete: caseRecords.filter((item) => item.caseStatus === "ACTIVE" && item.tasks.some((task) => task.taskType === "ADVISING" && !done.has(task.taskStatus))).length,
  notRegistered: caseRecords.filter((item) => item.caseStatus === "ACTIVE" && item.tasks.some((task) => task.taskType === "REGISTRATION" && !done.has(task.taskStatus))).length,
  needsInterventionNow: caseRecords.filter((item) => item.caseStatus === "ACTIVE" && item.riskLevel === "HIGH").length,
  onTrack: caseRecords.filter((item) => item.caseStatus === "ACTIVE" && item.riskLevel === "LOW").length,
};

export const workflowSteps = [
  { id: "admit", label: "Admitted to BMCC", detail: "The case starts once BMCC admission is on file for a John Dewey senior.", state: "done" },
  { id: "intent", label: "Intent confirmed", detail: "Student confirms BMCC is still the plan, which keeps the transition active.", state: "done" },
  { id: "aid", label: "Aid follow-up", detail: "FAFSA, TAP, and any CUNYfirst aid follow-up are handled before later steps become the focus.", state: "active" },
  { id: "verification", label: "Verification if flagged", detail: "If BMCC requests verification, the aid blocker stays front and center until it clears.", state: "warning" },
  { id: "meningitis", label: "Meningitis acknowledgement", detail: "NYC immunization history is already available, so the remaining health task is usually the meningitis acknowledgement.", state: "active" },
  { id: "advising-registration", label: "Advising then registration", detail: "Registration does not become the current task until advising is complete.", state: "warning" },
  { id: "orientation-close", label: "Orientation and case close", detail: "Orientation comes after registration, and the case closes when the student is enrolled and ready to start classes.", state: "idle" },
];

