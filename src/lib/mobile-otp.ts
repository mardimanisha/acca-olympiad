/**
 * Mobile OTP through Message Central VerifyNow (https://www.messagecentral.com/product/verify-now/api-india).
 * Message Central makes the code and texts it; we get back a verificationId and later ask it whether the code the
 * student typed is right. The browser holds a token we sign (mobile number, verificationId and expiry, HMAC with
 * OTP_SECRET), so a verificationId can only be used for the number it was sent to and only until it expires.
 *
 * Env:
 *   MC_CUSTOMER_ID  the customer ID from the Message Central console
 *   MC_KEY          the Base64 of the console password, as the API expects it
 *   OTP_SECRET      a long random string (also signs admin sessions; changing it invalidates OTPs in flight)
 * Local development: without MC_CUSTOMER_ID / MC_KEY (or with MC_DEV_MODE=1) no SMS is sent and the code is printed
 * to the dev server's console instead. Dev mode never runs in a production build.
 */

import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import * as store from "@/lib/otp-store";

const BASE = "https://cpaas.messagecentral.com";
export const OTP_LENGTH = 6;
export const OTP_MINUTES = 5;

function devMode() {
  if (process.env.NODE_ENV === "production") return false;
  return process.env.MC_DEV_MODE === "1" || !process.env.MC_CUSTOMER_ID || !process.env.MC_KEY;
}

// ---- signed token ----

type Claims = { m: string; v: string; e: number };

function mac(payload: string) {
  const secret = process.env.OTP_SECRET;
  if (!secret) throw new Error("otp: OTP_SECRET is not set");
  return createHmac("sha256", secret).update(`mobile-otp|${payload}`).digest("base64url");
}

function signToken(mobile: string, verificationId: string, expires: number) {
  const payload = Buffer.from(JSON.stringify({ m: mobile, v: verificationId, e: expires } satisfies Claims)).toString("base64url");
  return `${payload}.${mac(payload)}`;
}

/** The verificationId in the token when it is ours, unchanged, for this mobile number and not expired. */
export function readToken(token: string, mobile: string): { verificationId: string } | "expired" | "invalid" {
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return "invalid";
  const expected = Buffer.from(mac(payload));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return "invalid";
  let claims: Claims;
  try {
    claims = JSON.parse(Buffer.from(payload, "base64url").toString()) as Claims;
  } catch {
    return "invalid";
  }
  if (claims.m !== mobile || typeof claims.v !== "string") return "invalid";
  if (Date.now() > claims.e) return "expired";
  return { verificationId: claims.v };
}

// ---- Message Central ----

let auth: { token: string; at: number } | null = null;
// Message Central doesn't document the token's lifetime, so refresh it every few hours and whenever a call is refused.
const AUTH_MAX_AGE = 6 * 3600_000;

async function authToken(fresh = false): Promise<string> {
  if (!fresh && auth && Date.now() - auth.at < AUTH_MAX_AGE) return auth.token;
  const params = new URLSearchParams({
    customerId: process.env.MC_CUSTOMER_ID!,
    key: process.env.MC_KEY!,
    scope: "NEW",
    country: "91",
  });
  const res = await fetch(`${BASE}/auth/v1/authentication/token?${params}`, {
    headers: { accept: "*/*" },
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });
  const reply = (await res.json().catch(() => null)) as { status?: number; token?: string } | null;
  if (!res.ok || !reply?.token) throw new Error(`otp: Message Central auth failed ${res.status} ${JSON.stringify(reply)}`);
  auth = { token: reply.token, at: Date.now() };
  return auth.token;
}

type McReply = {
  responseCode?: number | string;
  message?: string;
  data?: { verificationId?: string | number; responseCode?: string | number; verificationStatus?: string; errorMessage?: string | null } | null;
};

async function call(method: "GET" | "POST", path: string, params: Record<string, string>): Promise<McReply> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await fetch(`${BASE}${path}?${new URLSearchParams(params)}`, {
      method,
      headers: { authToken: await authToken(attempt > 0), accept: "*/*" },
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    // An expired or revoked auth token: get a new one and try once more.
    if ((res.status === 401 || res.status === 403) && attempt === 0) continue;
    const reply = (await res.json().catch(() => null)) as McReply | null;
    if (!reply) throw new Error(`otp: Message Central replied ${res.status} without JSON`);
    return reply;
  }
  throw new Error("otp: Message Central refused the auth token");
}

const code = (r: McReply) => Number(r.data?.responseCode ?? r.responseCode);

// ---- send / check ----

export type SendResult = { ok: true; token: string } | { ok: false; reason: "pending" | "limit" | "invalid-number" | "failed" };

/** Texts a new OTP to the 10-digit Indian mobile number. */
export async function sendOtp(mobile: string): Promise<SendResult> {
  const expires = Date.now() + OTP_MINUTES * 60_000;
  if (devMode()) {
    const verificationId = `dev-${randomInt(1e9, 1e10)}`;
    const otp = String(randomInt(0, 10 ** OTP_LENGTH)).padStart(OTP_LENGTH, "0");
    await store.set(`otp:dev:${verificationId}`, otp, OTP_MINUTES * 60);
    console.log(`\n[dev OTP] +91 ${mobile}: ${otp}  (no SMS sent; set MC_CUSTOMER_ID and MC_KEY to send real SMS)\n`);
    return { ok: true, token: signToken(mobile, verificationId, expires) };
  }

  const reply = await call("POST", "/verification/v3/send", {
    countryCode: "91",
    customerId: process.env.MC_CUSTOMER_ID!,
    flowType: "SMS",
    mobileNumber: mobile,
    otpLength: String(OTP_LENGTH),
  });
  const id = reply.data?.verificationId;
  if (code(reply) === 200 && id != null) return { ok: true, token: signToken(mobile, String(id), expires) };
  console.error("otp: Message Central send failed", JSON.stringify(reply));
  switch (code(reply)) {
    case 506:
      return { ok: false, reason: "pending" };
    case 800:
      return { ok: false, reason: "limit" };
    case 511:
      return { ok: false, reason: "invalid-number" };
    default:
      return { ok: false, reason: "failed" };
  }
}

export type CheckResult = "ok" | "wrong" | "expired" | "used" | "limit" | "failed";

/** Asks Message Central whether `otp` is the code it sent for this verificationId. */
export async function checkOtp(verificationId: string, otp: string): Promise<CheckResult> {
  if (devMode() || verificationId.startsWith("dev-")) {
    if (!devMode()) return "failed";
    const expected = await store.get(`otp:dev:${verificationId}`);
    if (expected === null) return "expired";
    if (expected !== otp) return "wrong";
    await store.del(`otp:dev:${verificationId}`);
    return "ok";
  }

  const reply = await call("GET", "/verification/v3/validateOtp", { verificationId, code: otp, flowType: "SMS" });
  const status = code(reply);
  if (status === 200 && reply.data?.verificationStatus === "VERIFICATION_COMPLETED") return "ok";
  switch (status) {
    case 702:
    case 700:
      return "wrong";
    case 705:
      return "expired";
    case 703:
      return "used";
    case 800:
      return "limit";
    default:
      console.error("otp: Message Central validate failed", JSON.stringify(reply));
      return "failed";
  }
}
