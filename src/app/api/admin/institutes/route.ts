/**
 * Institutes for the admin page, stored in the "Institutes" tab of the master sheet (see `google-sheet.gs`).
 *   GET                                      → { ok, institutes }
 *   POST { action: "add", name, email? }     → { ok, institute, warning? }  (creates the institute's spreadsheet)
 *   POST { action: "setActive", code, active } → { ok }
 * Every call needs the admin token from /api/admin/login.
 */

import { isAdmin } from "@/lib/admin-auth";
import { CORS, INSTITUTE_CODE, refreshInstitutes, sheetGet, sheetPost, type SheetReply } from "@/lib/sheet";

const json = (body: object, status = 200) => Response.json(body, { status, headers: CORS });
const UNAUTHORISED = { ok: false, error: "Please sign in again." };

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

/** Passes the script's reply through, turning a failure to reach it into a 502. */
async function relay(request: Request, call: () => Promise<SheetReply>, what: string) {
  try {
    const reply = await call();
    // The form's institute lookups are cached; clear them so a change shows on the next page load.
    if (reply.ok && what !== "list institutes") refreshInstitutes(request);
    if (reply.error === "unknown action") {
      return json({ ok: false, error: "The Google Sheet script is out of date. Paste the new google-sheet.gs and deploy a new version." }, 502);
    }
    return json(reply, reply.ok ? 200 : 400);
  } catch (err) {
    console.error(`admin: could not ${what}`, err);
    return json({ ok: false, error: "Couldn't reach the Google Sheet. Please try again." }, 502);
  }
}

export async function GET(request: Request) {
  if (!isAdmin(request)) return json(UNAUTHORISED, 401);
  return relay(request, () => sheetGet({ action: "institutes" }, 20000), "list institutes");
}

export async function POST(request: Request) {
  if (!isAdmin(request)) return json(UNAUTHORISED, 401);
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const str = (k: string) => (typeof body?.[k] === "string" ? (body[k] as string).trim() : "");

  // An older script ignores `action` and would save the POST as a blank registration, so make sure it knows institutes first.
  try {
    if ((await sheetGet({ action: "institutes" }, 20000)).error === "unknown action") return relay(request, async () => ({ error: "unknown action" }), "");
  } catch (err) {
    console.error("admin: could not reach the sheet", err);
    return json({ ok: false, error: "Couldn't reach the Google Sheet. Please try again." }, 502);
  }

  if (body?.action === "add") {
    const name = str("name");
    const email = str("email");
    if (!name || name.length > 120) return json({ ok: false, error: "Please enter the institute's name (up to 120 characters)." }, 400);
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ ok: false, error: "Please enter a valid email address." }, 400);
    // Creating and sharing a spreadsheet can take several seconds.
    return relay(request, () => sheetPost({ action: "addInstitute", name, email }, 45000), "add an institute");
  }
  if (body?.action === "setActive") {
    const code = str("code");
    if (!INSTITUTE_CODE.test(code) || typeof body.active !== "boolean") return json({ ok: false, error: "Invalid request." }, 400);
    return relay(request, () => sheetPost({ action: "setInstituteActive", code, active: body.active }), "update an institute");
  }
  return json({ ok: false, error: "Invalid request." }, 400);
}
