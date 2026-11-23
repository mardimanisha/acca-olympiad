/**
 * Password login for the Olympiad admin page, without a database. A correct password returns a signed token
 * (expiry + HMAC); the admin page keeps it for the browser tab and sends it as `Authorization: Bearer <token>`.
 * A bearer token rather than a cookie because the page is reached through zskillup.com while the API lives on
 * this project's own domain.
 *
 * Env: ADMIN_PASSWORD (the shared admin password) and OTP_SECRET (also used for email OTPs). Changing either one
 * signs everyone out.
 */

import { createHmac, timingSafeEqual } from "node:crypto";

const SESSION_HOURS = 12;

function key() {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.OTP_SECRET;
  if (!password || !secret) return null;
  return `${secret}|${password}`;
}

const sign = (k: string, expires: number) => createHmac("sha256", k).update(`admin|${expires}`).digest("base64url");

function same(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export const adminConfigured = () => key() !== null;

/** A session token when the password is right, otherwise null. */
export function login(password: string): string | null {
  const k = key();
  if (!k || !same(password, process.env.ADMIN_PASSWORD!)) return null;
  const expires = Date.now() + SESSION_HOURS * 3_600_000;
  return `${expires}.${sign(k, expires)}`;
}

/** True when the request carries an unexpired token signed with the current password. */
export function isAdmin(request: Request): boolean {
  const k = key();
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const [exp, mac] = token.split(".");
  const expires = Number(exp);
  if (!k || !expires || !mac || Date.now() > expires) return false;
  return same(mac, sign(k, expires));
}
