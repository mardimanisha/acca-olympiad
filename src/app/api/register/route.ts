/**
 * Registration endpoint. Validates the form and appends it as a row to the Google Sheet through
 * the Apps Script web app in `google-sheet.gs` (deploy steps are in that file).
 *
 * Env: SHEET_WEBHOOK_URL (the web app /exec URL). Optional SHEET_WEBHOOK_SECRET must match SECRET
 * in the script when that is set.
 */

const FIELDS = ["name", "email", "whatsapp", "parent", "school", "passingYear", "state", "city", "stream"] as const;
type Registration = Record<(typeof FIELDS)[number], string>;

const PHONE = /^[6-9]\d{9}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

export async function POST(request: Request) {
  const url = process.env.SHEET_WEBHOOK_URL;
  const secret = process.env.SHEET_WEBHOOK_SECRET ?? "";
  if (!url) {
    console.error("register: SHEET_WEBHOOK_URL is not set");
    return json({ ok: false, error: "Registration is not available right now." }, 503);
  }

  const body = await request.json().catch(() => null);
  const data = validate(body);
  if (typeof data === "string") return json({ ok: false, error: data }, 400);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, secret, submittedAt: new Date().toISOString() }),
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
    });
    const reply = (await res.json().catch(() => null)) as { ok?: boolean } | null;
    if (!res.ok || !reply?.ok) throw new Error(`sheet replied ${res.status} ${JSON.stringify(reply)}`);
  } catch (err) {
    console.error("register: could not save to sheet", err);
    return json({ ok: false, error: "We couldn't save your registration. Please try again." }, 502);
  }

  return json({ ok: true });
}
