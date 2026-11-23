/** POST { password } → { ok, token } for the admin page. See `src/lib/admin-auth.ts`. */

import { adminConfigured, login } from "@/lib/admin-auth";
import { CORS } from "@/lib/sheet";

const json = (body: object, status = 200) => Response.json(body, { status, headers: CORS });

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function POST(request: Request) {
  if (!adminConfigured()) {
    console.error("admin: ADMIN_PASSWORD or OTP_SECRET is not set");
    return json({ ok: false, error: "Admin login is not set up yet." }, 503);
  }
  const body = (await request.json().catch(() => null)) as { password?: unknown } | null;
  const password = typeof body?.password === "string" ? body.password : "";
  const token = login(password);
  if (!token) {
    // Slows down password guessing.
    await new Promise((r) => setTimeout(r, 1000));
    return json({ ok: false, error: "Wrong password." }, 401);
  }
  return json({ ok: true, token });
}
