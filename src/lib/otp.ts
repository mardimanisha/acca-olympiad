/**
 * Email OTP without a database. The server emails a random code and hands the browser a signed token
 * (expiry + HMAC of email, code and expiry). On verify, the HMAC is recomputed from the code the student
 * typed, so the code itself never leaves the server except in the email.
 *
 * Env: OTP_SECRET (a long random string; changing it invalidates codes already sent).
 */

import { createHmac, randomInt, timingSafeEqual } from "node:crypto";

export const OTP_MINUTES = 10;

function sign(email: string, otp: string, expires: number) {
  const secret = process.env.OTP_SECRET;
  if (!secret) throw new Error("otp: OTP_SECRET is not set");
  return createHmac("sha256", secret).update(`${email.toLowerCase()}|${otp}|${expires}`).digest("base64url");
}

export function issueOtp(email: string) {
  const otp = String(randomInt(0, 1_000_000)).padStart(6, "0");
  const expires = Date.now() + OTP_MINUTES * 60_000;
  return { otp, token: `${expires}.${sign(email, otp, expires)}` };
}

export function checkOtp(email: string, otp: string, token: string): "ok" | "wrong" | "expired" {
  const [exp, mac] = token.split(".");
  const expires = Number(exp);
  if (!expires || !mac) return "wrong";
  if (Date.now() > expires) return "expired";
  const expected = Buffer.from(sign(email, otp, expires));
  const given = Buffer.from(mac);
  return expected.length === given.length && timingSafeEqual(expected, given) ? "ok" : "wrong";
}
