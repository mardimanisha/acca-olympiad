/**
 * GET ?ref=<code> → { ok, name } for an active partner institute, or { ok, name: null }. The registration form
 * uses it to show "Registering via …"; the institute is looked up again when the registration is saved.
 */

import { CORS, INSTITUTE_CODE, sheetGet } from "@/lib/sheet";

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function GET(request: Request) {
  const ref = (new URL(request.url).searchParams.get("ref") ?? "").trim().toLowerCase();
  let name: string | null = null;
  if (INSTITUTE_CODE.test(ref)) {
    try {
      const reply = await sheetGet({ action: "institute", ref });
      const inst = reply.institute as { name?: unknown } | null | undefined;
      if (reply.ok && typeof inst?.name === "string") name = inst.name;
    } catch (err) {
      console.error("institute: lookup failed", err);
    }
  }
  return Response.json(
    { ok: true, name },
    // Lets the CDN answer repeat visits from the same link for a few minutes.
    { headers: { ...CORS, "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } },
  );
}
