"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { Check, Copy, ExternalLink, LoaderCircle, LogOut, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Institute = {
  code: string;
  name: string;
  sheetUrl: string;
  email: string;
  active: boolean;
  addedAt: string;
  registrations: number;
};

// The API lives on this project's own domain; the page is usually reached through zskillup.com.
const API = `${process.env.NEXT_PUBLIC_ASSET_URL ?? ""}/api/admin`;
/** Public page the links point to; `?ref=` tags the registration, `#register` scrolls to the form. */
const PAGE_URL = "https://www.zskillup.com/National-Commerce-Olympiad-2026/";
/** On a local dev server, links open the local copy so referral registrations can be tested before deploying. */
function pageUrl() {
  if (typeof window === "undefined" || !/^(localhost|127\.0\.0\.1)$/.test(window.location.hostname)) return PAGE_URL;
  return `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/`;
}
const instituteLink = (code: string) => `${pageUrl()}?ref=${encodeURIComponent(code)}#register`;

/** The admin token, kept in sessionStorage so a reload stays signed in until the tab is closed. */
const TOKEN_KEY = "nco-admin-token";
const tokenListeners = new Set<() => void>();
let tokenCache: string | null = null;
function getToken() {
  if (tokenCache === null) {
    try {
      tokenCache = sessionStorage.getItem(TOKEN_KEY) ?? "";
    } catch {
      tokenCache = "";
    }
  }
  return tokenCache;
}
function setStoredToken(token: string) {
  tokenCache = token;
  try {
    if (token) sessionStorage.setItem(TOKEN_KEY, token);
    else sessionStorage.removeItem(TOKEN_KEY);
  } catch {}
  tokenListeners.forEach((fn) => fn());
}
function subscribeToken(fn: () => void) {
  tokenListeners.add(fn);
  return () => tokenListeners.delete(fn);
}

class SignedOut extends Error {}

async function call<T>(path: string, token: string, body?: object): Promise<T & { warning?: string }> {
  let res: Response;
  try {
    res = await fetch(`${API}${path}`, {
      method: body ? "POST" : "GET",
      headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
      body: body && JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    throw new Error("Network error. Please check your connection and try again.");
  }
  const reply = (await res.json().catch(() => null)) as ({ ok?: boolean; error?: string } & T) | null;
  if (res.status === 401 && path !== "/login") throw new SignedOut(reply?.error);
  if (!res.ok || !reply?.ok) throw new Error(reply?.error || "Something went wrong. Please try again.");
  return reply as T & { warning?: string };
}

const field = "h-11 rounded-field border-line bg-white px-3.5 text-[0.93rem] text-navy placeholder:text-[#8F9BAE] md:text-[0.93rem]";
const label = "text-[0.8rem] font-bold text-navy";

function Alert({ tone = "error", children }: { tone?: "error" | "ok" | "warn"; children: React.ReactNode }) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "rounded-xl px-3.5 py-2.5 text-[0.86rem] font-semibold",
        tone === "error" && "bg-[#FDECEC] text-[#B42318]",
        tone === "ok" && "bg-mint text-teal-deep",
        tone === "warn" && "bg-cream text-amber-ink",
      )}
    >
      {children}
    </p>
  );
}

function Login({ onToken }: { onToken: (t: string) => void }) {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const { token } = await call<{ token: string }>("/login", "", { password });
      onToken(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't sign in.");
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-svh place-items-center bg-canvas px-4">
      <form onSubmit={submit} className="grid w-full max-w-[380px] gap-4 rounded-[20px] border border-line bg-white p-7 shadow-sm">
        <div>
          <h1 className="text-xl font-extrabold text-navy">Olympiad admin</h1>
          <p className="mt-1 text-[0.88rem] text-subtle">National Commerce Olympiad 2026</p>
        </div>
        <div className="grid gap-[7px]">
          <Label htmlFor="a-pass" className={label}>Password</Label>
          <Input
            id="a-pass"
            type="password"
            required
            autoFocus
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={field}
          />
        </div>
        {error && <Alert>{error}</Alert>}
        <Button type="submit" variant="brand" size="pill-sm" className="w-full" disabled={busy || !password}>
          {busy && <LoaderCircle className="animate-spin" />} Sign in
        </Button>
      </form>
    </div>
  );
}

function CopyLink({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const link = instituteLink(code);
  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      window.prompt("Copy this link:", link);
    }
  }
  return (
    <div className="flex min-w-0 items-center gap-2">
      <code className="min-w-0 flex-1 truncate rounded-lg bg-canvas px-2.5 py-1.5 text-[0.78rem] text-navy" title={link}>
        {link}
      </code>
      <Button variant="outline" size="sm" onClick={copy} aria-label={`Copy link for ${code}`}>
        {copied ? <Check /> : <Copy />} {copied ? "Copied" : "Copy"}
      </Button>
    </div>
  );
}

function AddInstitute({
  token,
  onAdded,
  onSignedOut,
}: {
  token: string;
  onAdded: (i: Institute, warning?: string) => void;
  onSignedOut: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const reply = await call<{ institute: Institute }>("/institutes", token, { action: "add", name, email });
      setName("");
      setEmail("");
      onAdded(reply.institute, reply.warning);
    } catch (err) {
      if (err instanceof SignedOut) return onSignedOut();
      setError(err instanceof Error ? err.message : "Couldn't add the institute.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-[20px] border border-line bg-white p-5 sm:p-6">
      <div>
        <h2 className="text-lg font-extrabold text-navy">Add an institute</h2>
        <p className="mt-1 text-[0.86rem] text-subtle">
          This creates the institute&apos;s own Google Sheet and its registration link. If you give an email, the sheet
          is shared with it (view only).
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <div className="grid gap-[7px]">
          <Label htmlFor="i-name" className={label}>Institute name</Label>
          <Input
            id="i-name"
            required
            maxLength={120}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Delhi Commerce Academy"
            className={field}
          />
        </div>
        <div className="grid gap-[7px]">
          <Label htmlFor="i-email" className={label}>
            Institute email <span className="font-medium text-subtle">(optional)</span>
          </Label>
          <Input
            id="i-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="contact@institute.com"
            className={field}
          />
        </div>
        <Button type="submit" variant="brand" size="pill-sm" className="h-11" disabled={busy || !name.trim()}>
          {busy ? <LoaderCircle className="animate-spin" /> : <Plus />} {busy ? "Creating sheet…" : "Add institute"}
        </Button>
      </div>
      {error && <Alert>{error}</Alert>}
    </form>
  );
}

export function AdminPanel() {
  // null on the server render, so the login form doesn't flash for a signed-in admin.
  const token = useSyncExternalStore<string | null>(subscribeToken, getToken, () => null);
  const [institutes, setInstitutes] = useState<Institute[] | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState<{ tone: "ok" | "warn"; text: string } | null>(null);
  const [toggling, setToggling] = useState("");
  const loading = refreshing || (!!token && institutes === null && !error);

  const signOut = useCallback(() => {
    setStoredToken("");
    setInstitutes(null);
    setError("");
    setNotice(null);
  }, []);

  const fail = useCallback(
    (err: unknown, fallback: string) => {
      if (err instanceof SignedOut) signOut();
      else setError(err instanceof Error ? err.message : fallback);
    },
    [signOut],
  );

  useEffect(() => {
    if (!token) return;
    let live = true;
    call<{ institutes: Institute[] }>("/institutes", token)
      .then((reply) => live && setInstitutes(reply.institutes))
      .catch((err) => live && fail(err, "Couldn't load institutes."));
    return () => {
      live = false;
    };
  }, [token, fail]);

  async function refresh() {
    if (!token || refreshing) return;
    setRefreshing(true);
    setError("");
    try {
      const reply = await call<{ institutes: Institute[] }>("/institutes", token);
      setInstitutes(reply.institutes);
    } catch (err) {
      fail(err, "Couldn't load institutes.");
    } finally {
      setRefreshing(false);
    }
  }

  async function toggle(inst: Institute) {
    if (!token || toggling) return;
    const active = !inst.active;
    setToggling(inst.code);
    setError("");
    setNotice(null);
    try {
      await call("/institutes", token, { action: "setActive", code: inst.code, active });
      // Set (not flip) the state that was saved, so a late reply can't undo another change.
      setInstitutes((list) => list?.map((i) => (i.code === inst.code ? { ...i, active } : i)) ?? null);
      setNotice({
        tone: "ok",
        text: active
          ? `${inst.name} is on again. Its link accepts registrations, and the Institutes tab says Yes.`
          : `${inst.name} is off. Its link now shows that registrations are closed, and the Institutes tab says No.`,
      });
    } catch (err) {
      fail(err, "Couldn't update the institute.");
    } finally {
      setToggling("");
    }
  }

  if (token === null) return <div className="min-h-svh bg-canvas" />;
  if (!token) {
    return (
      <Login onToken={setStoredToken} />
    );
  }

  return (
    <div className="min-h-svh bg-canvas">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
          <div className="min-w-0">
            <h1 className="truncate text-[1.05rem] font-extrabold text-navy">Olympiad admin</h1>
            <p className="text-[0.8rem] text-subtle">Partner institutes</p>
          </div>
          <Button variant="outline" size="sm" onClick={signOut}>
            <LogOut /> Sign out
          </Button>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1100px] gap-5 px-4 py-6 sm:px-6">
        <AddInstitute
          token={token}
          onSignedOut={signOut}
          onAdded={(inst, warning) => {
            setInstitutes((list) => [...(list ?? []), inst]);
            setNotice(
              warning
                ? { tone: "warn", text: warning }
                : { tone: "ok", text: `${inst.name} added. Copy its link below and send it to the institute.` },
            );
          }}
        />
        {notice && <Alert tone={notice.tone}>{notice.text}</Alert>}

        <section className="grid gap-3 rounded-[20px] border border-line bg-white p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-navy">Institutes</h2>
              <p className="mt-1 text-[0.86rem] text-subtle">
                Students who register through a link are listed under that institute in the master sheet&apos;s
                &ldquo;Referral Institution&rdquo; column and copied into its own sheet. Everyone else is &ldquo;Direct&rdquo;.
              </p>
            </div>
            <Button variant="outline" size="icon-sm" onClick={refresh} disabled={loading} aria-label="Refresh">
              <RefreshCw className={cn(loading && "animate-spin")} />
            </Button>
          </div>
          {error && <Alert>{error}</Alert>}
          {institutes === null ? (
            loading && <p className="py-6 text-center text-[0.9rem] text-subtle">Loading…</p>
          ) : institutes.length === 0 ? (
            <p className="py-6 text-center text-[0.9rem] text-subtle">No institutes yet. Add the first one above.</p>
          ) : (
            <ul className="grid gap-3">
              {institutes.map((inst) => (
                <li key={inst.code} className={cn("grid gap-3 rounded-2xl border border-line p-4", !inst.active && "bg-canvas")}>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-extrabold break-words text-navy">
                        {inst.name}
                        {!inst.active && (
                          <span className="ml-2 rounded-full bg-line px-2 py-0.5 text-[0.72rem] font-bold text-subtle">Off</span>
                        )}
                      </p>
                      <p className="text-[0.8rem] break-words text-subtle">
                        {inst.registrations} {inst.registrations === 1 ? "registration" : "registrations"}
                        {inst.email && <> · shared with {inst.email}</>}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {inst.sheetUrl && (
                        <a
                          href={inst.sheetUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex h-7 items-center gap-1 rounded-lg border border-line px-2.5 text-[0.8rem] font-medium text-navy hover:bg-muted"
                        >
                          <ExternalLink className="size-3.5" /> Sheet
                        </a>
                      )}
                      <Button variant="outline" size="sm" onClick={() => toggle(inst)} disabled={!!toggling}>
                        {toggling === inst.code && <LoaderCircle className="animate-spin" />}
                        {toggling === inst.code ? (inst.active ? "Turning off…" : "Turning on…") : inst.active ? "Turn off" : "Turn on"}
                      </Button>
                    </div>
                  </div>
                  <CopyLink code={inst.code} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
