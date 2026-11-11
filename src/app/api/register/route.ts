/**
 * Registration endpoint, in two steps so the student's email is verified with an OTP first:
 *   step "send" validates the form, refuses an email or mobile number that has already registered, emails a 6-digit OTP and
 *   returns a signed token (`src/lib/otp.ts`); nothing is saved yet. Resend is the same call again.
 *   step "verify" checks the OTP against the token, appends the row to the Google Sheet through the Apps
 *   Script web app in `google-sheet.gs` (deploy steps are in that file) and emails a confirmation.
 *
 * Env: SHEET_WEBHOOK_URL (the web app /exec URL). Optional SHEET_WEBHOOK_SECRET must match SECRET
 * in the script when that is set. Email and OTP env vars are listed in `src/lib/email.ts` and `src/lib/otp.ts`.
 */

import { after } from "next/server";
import { sendConfirmationEmail, sendOtpEmail } from "@/lib/email";
import { OTP_MINUTES, checkOtp, issueOtp } from "@/lib/otp";

const FIELDS = ["name", "email", "whatsapp", "parent", "school", "passingYear", "state", "city", "stream"] as const;
type Registration = Record<(typeof FIELDS)[number], string>;

const PHONE = /^[6-9]\d{9}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OTP = /^\d{6}$/;
const RESEND_SECONDS = 30;

function validate(body: unknown): Registration | string {
  if (!body || typeof body !== "object") return "Invalid request.";
  const src = body as Record<string, unknown>;
  const out = {} as Registration;
  for (const f of FIELDS) {
    const v = typeof src[f] === "string" ? (src[f] as string).trim() : "";
    if (!v && f !== "parent") return `Please fill in ${f}.`;
    if (v.length > 200) return `${f} is too long.`;
    out[f] = v;
  }
  if (!EMAIL.test(out.email)) return "Please enter a valid email address.";
  if (!PHONE.test(out.whatsapp) || (out.parent && !PHONE.test(out.parent))) return "Please enter valid 10-digit mobile numbers.";
  return out;
}

// The form is served from zskillup.com but posts straight to this project's domain, so allow cross-origin calls.
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const json = (body: object, status = 200) => Response.json(body, { status, headers: CORS });

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

const ALREADY_REGISTERED = {
  email: "This email is already registered for the Olympiad. Each email can register only once.",
  mobile: "This mobile number is already registered for the Olympiad. Each number can register only once.",
};
type Taken = keyof typeof ALREADY_REGISTERED;

// An older sheet script only checks email and doesn't say which field matched.
const takenField = (field: unknown): Taken => (field === "mobile" ? "mobile" : "email");

/**
 * Asks the sheet whether this email or mobile number has already registered and returns which one, or null.
 * Fails open (returns null) when the check itself fails; the save step still refuses duplicates.
 */
async function alreadyRegistered(url: string, secret: string, email: string, mobile: string): Promise<Taken | null> {
  try {
    const res = await fetch(`${url}?${new URLSearchParams({ action: "exists", email, mobile, secret })}`, {
      redirect: "follow",
      signal: AbortSignal.timeout(10000),
    });
    const reply = (await res.json().catch(() => null)) as { ok?: boolean; exists?: boolean; field?: string } | null;
    if (!res.ok || !reply?.ok) throw new Error(`sheet replied ${res.status} ${JSON.stringify(reply)}`);
    return reply.exists === true ? takenField(reply.field) : null;
  } catch (err) {
    console.error("register: could not check for an existing registration", err);
    return null;
  }
}

export async function POST(request: Request) {
  const url = process.env.SHEET_WEBHOOK_URL;
  const secret = process.env.SHEET_WEBHOOK_SECRET ?? "";
  if (!url) {
    console.error("register: SHEET_WEBHOOK_URL is not set");
    return json({ ok: false, error: "Registration is not available right now." }, 503);
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  // Honeypot: a hidden field real visitors never fill.
  if (body?.website) return json({ ok: false, error: "Invalid request." }, 400);
  const data = validate(body);
  if (typeof data === "string") return json({ ok: false, error: data }, 400);

  if (body?.step === "send") {
    const taken = await alreadyRegistered(url, secret, data.email, data.whatsapp);
    if (taken) return json({ ok: false, error: ALREADY_REGISTERED[taken] }, 409);
    const { otp, token } = issueOtp(data.email);
    // Gmail SMTP takes a few seconds, so the OTP step opens right away and the email goes out after the reply.
    after(() =>
      sendOtpEmail(data.email, data.name, otp, OTP_MINUTES).catch((err) => console.error("register: could not send OTP email", err)),
    );
    return json({ ok: true, token, resendIn: RESEND_SECONDS });
  }
  if (body?.step !== "verify") return json({ ok: false, error: "Invalid request." }, 400);

  const otp = typeof body.otp === "string" ? body.otp.trim() : "";
  const token = typeof body.token === "string" ? body.token : "";
  if (!OTP.test(otp)) return json({ ok: false, error: "Please enter the 6-digit OTP." }, 400);
  const result = checkOtp(data.email, otp, token);
  if (result === "expired") return json({ ok: false, error: "This OTP has expired. Tap Resend OTP to get a new one." }, 400);
  if (result === "wrong") return json({ ok: false, error: "Incorrect OTP. Please check the code and try again." }, 400);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, verified: "Yes", secret, submittedAt: new Date().toISOString() }),
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
    });
    const reply = (await res.json().catch(() => null)) as { ok?: boolean; error?: string; field?: string } | null;
    if (reply?.error === "duplicate") return json({ ok: false, error: ALREADY_REGISTERED[takenField(reply.field)] }, 409);
    if (!res.ok || !reply?.ok) throw new Error(`sheet replied ${res.status} ${JSON.stringify(reply)}`);
  } catch (err) {
    console.error("register: could not save to sheet", err);
    return json({ ok: false, error: "We couldn't save your registration. Please try again." }, 502);
  }

  // The row is saved, so the confirmation goes out after the reply and a failure is only logged.
  after(() =>
    sendConfirmationEmail(data.email, data.name).catch((err) => console.error("register: could not send confirmation email", err)),
  );

  return json({ ok: true });
}
