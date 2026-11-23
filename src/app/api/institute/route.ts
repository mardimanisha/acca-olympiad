/**
 * GET ?ref=<code> → { ok, name, active } for a partner institute, or { ok, name: null } for an unknown code (or when
 * the sheet can't be reached). The registration form uses it to show "Registering via …", or that the institute's link
 * is closed when it has been switched off in the admin. The server checks again when the registration is sent.
 */

import { CORS, INSTITUTE_CODE, instituteStatus } from "@/lib/sheet";

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function GET(request: Request) {
  const ref = (new URL(request.url).searchParams.get("ref") ?? "").trim().toLowerCase();
  let inst: { name: string; active: boolean } | null = null;
  if (INSTITUTE_CODE.test(ref)) {
    try {
      inst = await instituteStatus(ref);
    } catch (err) {
      console.error("institute: lookup failed", err);
    }
  }
  return Response.json(
    { ok: true, name: inst?.name ?? null, active: inst?.active ?? false },
    // A short CDN cache for repeat visits; turning a link off in the admin shows on the form within about a minute.
    { headers: { ...CORS, "Cache-Control": "public, s-maxage=60, stale-while-revalidate=60" } },
  );
}
