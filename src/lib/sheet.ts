/**
 * Calls to the Google Apps Script web app in `google-sheet.gs`, which owns the master sheet and the institutes list.
 *
 * Env: SHEET_WEBHOOK_URL (the web app /exec URL). Optional SHEET_WEBHOOK_SECRET must match SECRET in the script.
 */

import { revalidateTag } from "next/cache";
import { after } from "next/server";

export type SheetReply = { ok?: boolean; error?: string; [key: string]: unknown };

function config() {
  const url = process.env.SHEET_WEBHOOK_URL;
  if (!url) throw new Error("sheet: SHEET_WEBHOOK_URL is not set");
  return { url, secret: process.env.SHEET_WEBHOOK_SECRET ?? "" };
}

async function read(res: Response): Promise<SheetReply> {
  const reply = (await res.json().catch(() => null)) as SheetReply | null;
  if (!res.ok || !reply) throw new Error(`sheet replied ${res.status} ${JSON.stringify(reply)}`);
  return reply;
}

/** GET with `action` and its parameters. Throws when the script can't be reached or doesn't answer with JSON. */
export async function sheetGet(params: Record<string, string>, timeoutMs = 10000) {
  const { url, secret } = config();
  const res = await fetch(`${url}?${new URLSearchParams({ ...params, secret })}`, {
    redirect: "follow",
    cache: "no-store",
    signal: AbortSignal.timeout(timeoutMs),
  });
  return read(res);
}

/** POST a JSON body. Throws when the script can't be reached or doesn't answer with JSON. */
export async function sheetPost(body: object, timeoutMs = 15000) {
  const { url, secret } = config();
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, secret }),
    redirect: "follow",
    cache: "no-store",
    signal: AbortSignal.timeout(timeoutMs),
  });
  return read(res);
}

/** Institute codes as the script makes them: lowercase letters, digits and single hyphens, up to 60 characters. */
export const INSTITUTE_CODE = /^[a-z0-9](?:[a-z0-9-]{0,58}[a-z0-9])?$/;

/** Cache tag for the institutes list; the admin routes clear it whenever an institute is added or switched on/off. */
export const INSTITUTES_TAG = "institutes";

type InstituteRow = { code?: unknown; name?: unknown; active?: unknown };

/**
 * The institutes list from the script, kept in Next's data cache so the form's lookup answers in milliseconds instead
 * of waiting several seconds for Apps Script. Cleared on every admin change (see INSTITUTES_TAG); also refreshed every
 * 10 minutes in case the Institutes tab is edited by hand.
 */
async function cachedInstitutes(): Promise<InstituteRow[]> {
  const { url, secret } = config();
  const res = await fetch(`${url}?${new URLSearchParams({ action: "institutes", secret })}`, {
    redirect: "follow",
    cache: "force-cache",
    next: { tags: [INSTITUTES_TAG], revalidate: 600 },
    signal: AbortSignal.timeout(15000),
  });
  const reply = await read(res);
  if (!reply.ok || !Array.isArray(reply.institutes)) {
    // Don't keep a failed answer in the cache.
    revalidateTag(INSTITUTES_TAG, { expire: 0 });
    throw new Error(`sheet replied ${JSON.stringify(reply)}`);
  }
  return reply.institutes as InstituteRow[];
}

/**
 * Clears the cached institutes list (call from a route handler after an admin change). Then, once the response has
 * gone out, makes one lookup through this project's own /api/institute so the list is cached again and the next
 * student's page doesn't wait for Apps Script. The reload has to be a separate request: one made inside the same
 * request would still see the old cache entry and store it again.
 */
export function refreshInstitutes(request: Request) {
  revalidateTag(INSTITUTES_TAG, { expire: 0 });
  const lookup = `${new URL(request.url).origin}${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/api/institute?ref=cache-warm-up`;
  after(() => fetch(lookup, { cache: "no-store" }).then(() => undefined, (err) => console.error("sheet: could not reload institutes", err)));
}

/**
 * A partner institute's name and whether its link is switched on, or null for an unknown code. Throws when the sheet
 * can't be reached. Only for route handlers (it may clear the cache).
 */
export async function instituteStatus(code: string): Promise<{ name: string; active: boolean } | null> {
  if (!INSTITUTE_CODE.test(code)) return null;
  const inst = (await cachedInstitutes()).find((i) => i.code === code);
  return inst && typeof inst.name === "string" ? { name: inst.name, active: inst.active === true } : null;
}

/** Shared by the cross-origin routes: pages on zskillup.com call this project's domain directly. */
export const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};
