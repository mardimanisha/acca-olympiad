/** Static copy for the NCO 2027 landing page (V15). Career data lives in `careers.ts`. */

export const EVENT = {
  name: "National Commerce Olympiad 2027",
  short: "NCO 2027",
  dateLabel: "20 Dec 2026",
  dateLong: "20 December 2026",
  /** Start time is not confirmed yet; 10:00 IST is a placeholder for the countdown. */
  startsAt: "2026-12-20T10:00:00+05:30",
  phone: "+91 91530 05252",
  phoneHref: "tel:+919153005252",
  whatsappHref: "https://chat.whatsapp.com/D3h7wb45HWF3m7TDz0ykdS",
  scholarship: "₹50,000",
};

export const NAV = [
  { label: "Olympiad", href: "#s01" },
  { label: "Syllabus", href: "#s08" },
  { label: "Rewards", href: "#s12" },
  { label: "FAQs", href: "#s14" },
];

/** Compass labels, clockwise from north; `id` links to the career explorer. `short` is used on narrow screens. */
export const COMPASS: { id: string; long: string; short?: string }[] = [
  { id: "ca", long: "CA" },
  { id: "cs", long: "CS" },
  { id: "acca", long: "ACCA" },
  { id: "cpa", long: "CPA" },
  { id: "cma", long: "CMA" },
  { id: "cfa", long: "CFA" },
  { id: "frm", long: "FRM" },
  { id: "govt", long: "GOVT. CAREERS", short: "GOVT." },
  { id: "entre", long: "ENTREPRENEURSHIP", short: "STARTUP" },
  { id: "higher", long: "HIGHER STUDIES", short: "HIGHER ED" },
];

export type Speaker = "father" | "student";

/** `kind` styles special father messages: the highlighted pitch, the Olympiad summary and the Register link. */
export type Line = { who: Speaker; text: string; kind?: "key" | "about" | "cta" };

/**
 * Chat participants. `photo` is a 3D avatar in /public/avatars (Microsoft Fluent Emoji, MIT — see
 * THIRD_PARTY_NOTICES.md); without a `photo` the illustration is shown.
 */
export const SPEAKERS: Record<Speaker, { name: string; caption: string; photo?: string }> = {
  father: { name: "Father", caption: "Asking the big question", photo: "/avatars/father.png" },
  student: { name: "Student", caption: "Class 12 Commerce", photo: "/avatars/student.png" },
};

export const CONVERSATION: Line[] = [
  { who: "father", text: "What do you want to become?" },
  { who: "student", text: "Maybe something in finance." },
  { who: "father", text: "Finance means what exactly?" },
  { who: "student", text: "I’m not sure… CA? CS? ACCA? CMA? B.Com? BBA? MBA later?" },
  { who: "father", text: "And how will you know which path is right for you?" },
  { who: "student", text: "That’s the problem. I don’t know yet." },
  { who: "father", text: "Then don’t guess." },
  {
    who: "father",
    kind: "key",
    text: "Register for the National Commerce Olympiad and discover careers that may suit your strengths, interests and ambitions.",
  },
  { who: "father", kind: "cta", text: "Register now" },
  {
    who: "father",
    kind: "about",
    text: "It’s a free, 60-minute online Olympiad on 20 Dec 2026 for Commerce Students. You get a personalized career report, and scholarships up to ₹50,000.",
  },
];

/** [label, start time in seconds, title] — timings follow the video script. */
export const CHAPTERS = [
  ["0:00", 0, "The hook: choosing a career after Class 12"],
  ["0:25", 25, "Commerce is bigger than you think"],
  ["1:00", 60, "Understanding the qualifications"],
  ["1:35", 95, "Your career depends on more"],
  ["2:05", 125, "Introducing the National Commerce Olympiad"],
  ["2:35", 155, "The ending: understand where it can take you"],
] as const;

export const REELS = [
  { title: "Is B.Com enough?", dur: "0:32" },
  { title: "CA vs ACCA in 30 seconds", dur: "0:30" },
  { title: "What does a CFA actually do?", dur: "0:28" },
  { title: "Salaries: myth vs reality", dur: "0:40" },
];

export const KEY_FACTS = [
  ["Date", "20 Dec 2026"],
  ["Duration", "60 minutes"],
  ["Mode", "Online"],
  ["Eligibility", "Commerce Students"],
  ["Fee", "₹0 · Free"],
] as const;

export const STEPS = [
  { title: "Register Free", text: "Fill in your basic details and reserve your participation.", tone: "teal" },
  { title: "Take the Online Olympiad", text: "Complete the 60-minute assessment from home.", tone: "white" },
  {
    title: "Receive Your Career Report",
    text: "Understand your performance, strengths and career pathways worth exploring.",
    tone: "mint",
  },
  { title: "Explore Your Options", text: "Learn about careers, courses, qualifications and possible next steps.", tone: "white" },
  {
    title: "Get Guidance",
    text: "Attend career sessions and access counselling to help you understand your options better.",
    tone: "mint",
  },
] as const;

export const WEBINAR_TOPICS = [
  "CA, CS & CMA",
  "ACCA & CPA",
  "CFA & FRM",
  "Corporate finance",
  "Higher studies",
  "Government exams",
  "Entrepreneurship",
];

/**
 * The first two answers are approved copy from V15. The rest are drafted from facts stated
 * elsewhere on the page and should be reviewed before launch.
 */
export const FAQS = [
  {
    q: "Who can participate?",
    a: "All Commerce students can appear.",
  },
  { q: "Is it free?", a: "Yes. There is no participation fee." },
  {
    q: "When is the Olympiad and what time does it start?",
    a: "The Olympiad is on 20 December 2026.",
  },
  {
    q: "Is it online? What device do I need?",
    a: "Yes, it is a 60-minute online assessment.",
  },
  {
    q: "What topics are covered? Is there negative marking?",
    a: "Eight areas: Accounting & Reporting, Audit & Tax, Costing & Business Finance, Law & Governance, Global / International Orientation, Business Decision-Making, Numerical & Analytical Orientation, and Communication / Advisory.",
  },
  {
    q: "Is it only for CA or ACCA aspirants?",
    a: "No. The Olympiad helps you explore 16 commerce paths, from professional qualifications to corporate and markets roles, degrees and higher studies, government careers and entrepreneurship.",
  },
  {
    q: "Do I need to prepare?",
    a: "The Olympiad draws on Commerce topics plus reasoning and interest questions. Any preparation guidance will be shared with registered students.",
  },
  {
    q: "When will I get my report? Is counselling included?",
    a: "Every participant receives a personalized career report after the Olympiad, along with access to career counselling and webinars at no cost.",
  },
  {
    q: "How do scholarships work?",
    a: "Scholarships of up to ₹50,000 are available for eligible students, towards graduation degree programmes.",
  },
  {
    q: "Can a parent attend? What happens after registration?",
    a: "Parents can join our parent guidance sessions on qualification routes, costs and time commitments. After registering you get a confirmation on WhatsApp, followed by exam instructions.",
  },
];
