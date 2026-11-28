/**
 * Registration endpoint, in two steps so the student's mobile number is verified with an SMS OTP first:
 *   step "send" validates the form, checks the rate limits, refuses a registration the sheet already has, texts an OTP
 *   through Message Central and returns a signed token (`src/lib/mobile-otp.ts`); nothing is saved yet. Resend is the
 *   same call again, at most once every 30 seconds.
 *   step "verify" checks the OTP with Message Central, appends the row (with "Mobile verified" and the time) to the
 *   Google Sheet through the Apps Script web app in `google-sheet.gs` and emails a confirmation.
 *
 * Each mobile number can register only once (it is what the OTP verifies; emails may repeat); the sheet script checks it.
 *
 * Env: SHEET_WEBHOOK_URL / SHEET_WEBHOOK_SECRET (`src/lib/sheet.ts`), Message Central and OTP_SECRET
 * (`src/lib/mobile-otp.ts`), Redis for rate limits (`src/lib/otp-store.ts`), SMTP (`src/lib/email.ts`).
 */

import { after } from "next/server";
import { sendConfirmationEmail } from "@/lib/email";
import { OTP_LENGTH, OTP_MINUTES, checkOtp, readToken, sendOtp } from "@/lib/mobile-otp";
import * as store from "@/lib/otp-store";
import { INSTITUTE_CODE, instituteStatus, sheetGet, sheetPost } from "@/lib/sheet";

const FIELDS = ["name", "email", "whatsapp", "parent", "school", "passingYear", "state", "city", "stream"] as const;
type Registration = Record<(typeof FIELDS)[number], string>;

const PHONE = /^[6-9]\d{9}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OTP = new RegExp(`^\\d{${OTP_LENGTH}}$`);

// Rate limits for sending OTPs, and how many codes may be tried for one OTP.
const RESEND_SECONDS = 30;
const LIMITS = [
  { key: "m10", per: "mobile", max: 3, seconds: 600, error: "Too many OTP requests for this number. Please try again in 10 minutes." },
  { key: "day", per: "mobile", max: 6, seconds: 86_400, error: "Too many OTP requests for this number today. Please try again tomorrow." },
  { key: "ip", per: "ip", max: 15, seconds: 3600, error: "Too many OTP requests. Please try again in an hour." },
] as const;
const MAX_TRIES = 5;

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

const ALREADY_REGISTERED = "This mobile number is already registered for the Olympiad.";

/**
 * Asks the sheet whether this mobile number has already registered.
 * Fails open (returns false) when the check itself fails; the save step still refuses duplicates.
 */
async function alreadyRegistered(mobile: string): Promise<boolean> {
  try {
    const reply = await sheetGet({ action: "exists", mobile });
    if (!reply.ok) throw new Error(`sheet replied ${JSON.stringify(reply)}`);
    return reply.exists === true;
  } catch (err) {
    console.error("register: could not check for an existing registration", err);
    return false;
  }
}

/**
 * The institute's name when its link has been switched off in the admin, otherwise null. Fails open when the sheet
 * can't be reached; the script then saves the registration as "Direct" because the institute isn't active.
 */
async function closedInstitute(ref: string): Promise<string | null> {
  try {
    const inst = await instituteStatus(ref);
    return inst && !inst.active ? inst.name : null;
  } catch (err) {
    console.error("register: could not check the institute", err);
    return null;
  }
}

function clientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

/**
 * The error to show when this send is over a rate limit, otherwise null. When the store can't be reached the limits
 * are skipped (logged) rather than blocking registration.
 */
async function rateLimited(mobile: string, ip: string): Promise<string | null> {
  try {
    if (!(await store.claim(`otp:cd:${mobile}`, RESEND_SECONDS))) {
      const wait = (await store.ttl(`otp:cd:${mobile}`)) || RESEND_SECONDS;
      return `Please wait ${wait} seconds before requesting another OTP.`;
    }
    for (const limit of LIMITS) {
      const who = limit.per === "mobile" ? mobile : ip;
      if ((await store.hit(`otp:${limit.key}:${who}`, limit.seconds)) > limit.max) return limit.error;
    }
    return null;
  } catch (err) {
    console.error("register: rate limit check failed, allowing the request", err);
    return null;
  }
}

const SEND_FAILED = {
  pending: "An OTP was just sent to this number. Please wait a minute before requesting another.",
  limit: "Too many OTP requests for this number. Please try again later.",
  "invalid-number": "Please enter a valid 10-digit Indian mobile number.",
  failed: "We couldn't send the OTP right now. Please try again in a minute.",
};

const CHECK_FAILED = {
  wrong: "Incorrect OTP. Please check the code and try again.",
  expired: "This OTP has expired. Tap Resend OTP to get a new one.",
  used: "This OTP has already been used. Tap Resend OTP to get a new one.",
  limit: "Too many incorrect attempts. Tap Resend OTP to get a new code.",
  failed: "We couldn't check the OTP right now. Please try again.",
};

export async function POST(request: Request) {
  if (!process.env.SHEET_WEBHOOK_URL) {
    console.error("register: SHEET_WEBHOOK_URL is not set");
    return json({ ok: false, error: "Registration is not available right now." }, 503);
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  // Honeypot: a hidden field real visitors never fill.
  if (body?.website) return json({ ok: false, error: "Invalid request." }, 400);
  const data = validate(body);
  if (typeof data === "string") return json({ ok: false, error: data }, 400);
  const mobile = data.whatsapp;

  // Partner institute code from the link; the sheet script checks it against the Institutes tab and records "Direct" otherwise.
  const rawRef = typeof body?.ref === "string" ? body.ref.trim().toLowerCase() : "";
  const ref = INSTITUTE_CODE.test(rawRef) ? rawRef : "";
  const closed = ref ? await closedInstitute(ref) : null;
  if (closed) return json({ ok: false, error: `We are not accepting registrations through ${closed} at the moment.` }, 403);

  if (body?.step === "send") {
    const limited = await rateLimited(mobile, clientIp(request));
    if (limited) return json({ ok: false, error: limited }, 429);
    if (await alreadyRegistered(mobile)) return json({ ok: false, error: ALREADY_REGISTERED }, 409);

    let sent;
    try {
      sent = await sendOtp(mobile);
    } catch (err) {
      console.error("register: could not send OTP", err);
      sent = { ok: false as const, reason: "failed" as const };
    }
    if (!sent.ok) {
      // Nothing went out, so don't make the student wait for the resend cooldown.
      await store.del(`otp:cd:${mobile}`).catch(() => {});
      return json({ ok: false, error: SEND_FAILED[sent.reason] }, sent.reason === "failed" ? 502 : 429);
    }
    return json({ ok: true, token: sent.token, resendIn: RESEND_SECONDS, otpLength: OTP_LENGTH, minutes: OTP_MINUTES });
  }
  if (body?.step !== "verify") return json({ ok: false, error: "Invalid request." }, 400);

  const otp = typeof body.otp === "string" ? body.otp.trim() : "";
  const token = typeof body.token === "string" ? body.token : "";
  if (!OTP.test(otp)) return json({ ok: false, error: `Please enter the ${OTP_LENGTH}-digit OTP.` }, 400);
  const claims = readToken(token, mobile);
  if (claims === "expired") return json({ ok: false, error: CHECK_FAILED.expired }, 400);
  if (claims === "invalid") return json({ ok: false, error: "Please request a new OTP for this mobile number." }, 400);
  const id = claims.verificationId;

  // One OTP completes one registration. A code that was right but whose save failed may be retried without asking
  // Message Central again (it would answer "already verified").
  let verifiedAt: string | null;
  try {
    if (await store.get(`otp:used:${id}`)) return json({ ok: false, error: CHECK_FAILED.used }, 400);
    verifiedAt = await store.get(`otp:ok:${id}`);
    if (!verifiedAt && (await store.hit(`otp:try:${id}`, OTP_MINUTES * 60 + 60)) > MAX_TRIES) {
      return json({ ok: false, error: CHECK_FAILED.limit }, 429);
    }
  } catch (err) {
    console.error("register: OTP store unavailable", err);
    verifiedAt = null;
  }

  if (!verifiedAt) {
    let result;
    try {
      result = await checkOtp(id, otp);
    } catch (err) {
      console.error("register: could not check OTP", err);
      result = "failed" as const;
    }
    if (result !== "ok") return json({ ok: false, error: CHECK_FAILED[result] }, result === "failed" ? 502 : 400);
    verifiedAt = new Date().toISOString();
    await store.set(`otp:ok:${id}`, verifiedAt, 15 * 60).catch((err) => console.error("register: OTP store unavailable", err));
  }

  try {
    const reply = await sheetPost({
      ...data,
      ref,
      mobileVerified: "Yes",
      mobileVerifiedAt: verifiedAt,
      submittedAt: new Date().toISOString(),
    });
    if (reply.error === "duplicate") return json({ ok: false, error: ALREADY_REGISTERED }, 409);
    if (!reply.ok) throw new Error(`sheet replied ${JSON.stringify(reply)}`);
  } catch (err) {
    console.error("register: could not save to sheet", err);
    return json({ ok: false, error: "We couldn't save your registration. Please try again." }, 502);
  }

  await Promise.all([store.set(`otp:used:${id}`, "1", 86_400), store.del(`otp:ok:${id}`)]).catch((err) =>
    console.error("register: OTP store unavailable", err),
  );

  // The row is saved, so the confirmation goes out after the reply and a failure is only logged.
  after(() =>
    sendConfirmationEmail(data.email, data.name).catch((err) => console.error("register: could not send confirmation email", err)),
  );

  return json({ ok: true });
}
