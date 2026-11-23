/**
 * Calls to the Google Apps Script web app in `google-sheet.gs`, which owns the master sheet and the institutes list.
 *
 * Env: SHEET_WEBHOOK_URL (the web app /exec URL). Optional SHEET_WEBHOOK_SECRET must match SECRET in the script.
 */

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

/** Shared by the cross-origin routes: pages on zskillup.com call this project's domain directly. */
export const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};
