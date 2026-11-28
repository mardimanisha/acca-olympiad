"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, CircleCheck, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { STATES, STATE_CITIES } from "@/lib/locations";
import { cn } from "@/lib/utils";

const field =
  "h-[50px] lg:h-11 rounded-field border-line bg-canvas px-3.5 text-[0.93rem] text-navy placeholder:text-[#8F9BAE] md:text-[0.93rem]";
const label = "text-[0.8rem] font-bold text-navy";
// 2017–2032: ten past years plus the upcoming batches
const FIRST_YEAR = 2017;
const PASSING_YEARS = Array.from({ length: 16 }, (_, i) => String(FIRST_YEAR + i));

const Req = () => <span aria-hidden className="ml-0.5 text-[#B42318]">*</span>;

type Values = Record<"name" | "email" | "whatsapp" | "parent" | "school" | "passingYear" | "state" | "city" | "stream", string>;

const ORIGIN = process.env.NEXT_PUBLIC_ASSET_URL ?? "";
const API = `${ORIGIN}/api/register`;
/** Posts one step of the registration and returns the reply, throwing the server's message on failure. */
async function post(body: object) {
  // Posts to the project origin: zskillup.com adds a trailing slash to proxied paths, which this app redirects away.
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const reply = (await res.json().catch(() => null)) as { ok?: boolean; error?: string; token?: string; resendIn?: number } | null;
  if (!res.ok || !reply?.ok) throw new Error(reply?.error || "Something went wrong. Please try again.");
  return reply;
}

/**
 * Tells Google Tag Manager (GTM-59FB7JZ4, see GoogleTag.tsx) that a registration was saved. Called only after the
 * server answers { ok: true } to the verify step, so OTP requests and failed attempts never count. GA4 should map
 * its registration conversion to this event, not to gtm.formSubmit (which both form buttons trigger).
 */
function trackRegistration() {
  try {
    const w = window as unknown as { dataLayer?: object[] };
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ event: "registration_success", registration_type: "National Commerce Olympiad" });
  } catch {}
}

const errorText = (err: unknown) =>
  err instanceof Error && err.message !== "Failed to fetch" ? err.message : "Network error. Please check your connection and try again.";

/**
 * Partner institute links add `?ref=<code>`. The code is kept for 30 days so a student who opens the link and
 * registers later is still counted for that institute; a newer link replaces it. When the institute has been switched
 * off in the admin, its link shows that registrations through it are closed and the form can't be sent; a code that
 * was only remembered from an earlier visit is dropped instead, so that student registers as "Direct".
 */
const REF_KEY = "nco-ref";
const REF_DAYS = 30;
const REF_CODE = /^[a-z0-9](?:[a-z0-9-]{0,58}[a-z0-9])?$/;

type PageRef = { ref: string; fromUrl: boolean };
const NO_REF: PageRef = { ref: "", fromUrl: false };

function readRef(): PageRef {
  try {
    const fromUrl = (new URLSearchParams(window.location.search).get("ref") ?? "").trim().toLowerCase();
    if (REF_CODE.test(fromUrl)) {
      localStorage.setItem(REF_KEY, JSON.stringify({ ref: fromUrl, at: Date.now() }));
      return { ref: fromUrl, fromUrl: true };
    }
    const saved = JSON.parse(localStorage.getItem(REF_KEY) ?? "null") as { ref?: string; at?: number } | null;
    if (saved?.ref && REF_CODE.test(saved.ref) && Date.now() - (saved.at ?? 0) < REF_DAYS * 86_400_000) {
      return { ref: saved.ref, fromUrl: false };
    }
  } catch {}
  return NO_REF;
}

function forgetRef() {
  try {
    localStorage.removeItem(REF_KEY);
  } catch {}
}

type Lookup = { name: string; active: boolean } | null;

/** Asks this project's API about the institute; null when the code is unknown or the lookup fails. */
function lookUp(code: string): Promise<Lookup> {
  return fetch(`${ORIGIN}/api/institute?ref=${encodeURIComponent(code)}`)
    .then((res) => res.json())
    .then((reply: { name?: unknown; active?: unknown }) =>
      typeof reply?.name === "string" ? { name: reply.name, active: reply.active === true } : null,
    )
    .catch(() => null);
}

// Read once per page load (the server render has no ref). The lookup starts right here, on the first client render,
// rather than after the form has mounted, so a closed link's message appears as early as possible.
let pageRef: PageRef | null = null;
let pageLookup: Promise<Lookup> | null = null;
function getRef() {
  if (!pageRef) {
    pageRef = readRef();
    if (pageRef.ref) pageLookup = lookUp(pageRef.ref);
  }
  return pageRef;
}
const noSubscribe = () => () => {};

/**
 * The partner institute for this visit: its code (sent with the registration), its name once confirmed, and
 * `closed` when the link the student opened belongs to an institute that has been switched off.
 */
function useInstitute() {
  const { ref: code, fromUrl } = useSyncExternalStore(noSubscribe, getRef, () => NO_REF);
  const [found, setFound] = useState<{ name: string; active: boolean } | null>(null);
  useEffect(() => {
    if (!code) return;
    let live = true;
    (pageLookup ?? lookUp(code)).then((inst) => {
      if (!inst || !live) return;
      if (!inst.active && !fromUrl) forgetRef();
      setFound(inst);
    });
    return () => {
      live = false;
    };
  }, [code, fromUrl]);
  // A remembered code for a switched-off institute isn't sent, so that registration counts as "Direct".
  const dropped = found !== null && !found.active && !fromUrl;
  return {
    ref: dropped ? "" : code,
    name: found && !dropped ? found.name : "",
    closed: found !== null && !found.active && fromUrl,
  };
}

/**
 * Ref for a step that replaces the taller form. On mobile the page below moves up when the form shrinks, leaving the
 * visitor on the next section, so bring the new step back into view if it has ended up off screen.
 */
function keepInView(el: HTMLElement | null) {
  if (!el) return;
  requestAnimationFrame(() => {
    const { top, bottom } = el.getBoundingClientRect();
    if (top < 0 || bottom > window.innerHeight) el.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

function PhoneInput({
  id,
  name,
  required = true,
  defaultValue,
}: {
  id: string;
  name: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <div className="flex h-[50px] items-center gap-2 rounded-field lg:h-11 border border-line bg-canvas pl-3.5 transition-shadow focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
      <b className="border-r border-line pr-2 text-[0.93rem] text-navy">+91</b>
      <Input
        id={id}
        name={name}
        type="tel"
        inputMode="numeric"
        required={required}
        defaultValue={defaultValue}
        pattern="[6-9][0-9]{9}"
        maxLength={10}
        title="10-digit Indian mobile number"
        placeholder="98765 43210"
        className="h-full min-w-0 rounded-none border-0 bg-transparent px-0 text-[0.93rem] text-navy shadow-none placeholder:text-[#8F9BAE] focus-visible:ring-0 md:text-[0.93rem]"
      />
    </div>
  );
}

/**
 * Registration form. Validates in the browser, then verifies the student's mobile number with an SMS OTP
 * (/api/register step "send"), and only after the right code saves to the Google Sheet and emails a
 * confirmation (step "verify").
 */
export function RegisterForm() {
  const [name, setName] = useState<string | null>(null);
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [year, setYear] = useState("");
  // Set once the OTP has been sent; kept when going back so "Change number" doesn't wipe the form.
  const [values, setValues] = useState<Values | null>(null);
  const [step, setStep] = useState<"form" | "otp">("form");
  const [otp, setOtp] = useState("");
  const [resendIn, setResendIn] = useState(0);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [honeypot, setHoneypot] = useState("");
  // Signed by the server for the OTP it texted; sent back with the code to verify it.
  const [token, setToken] = useState("");
  const institute = useInstitute();

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending || institute.closed) return;
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    const next: Values = {
      name: get("name"),
      email: get("email"),
      whatsapp: get("whatsapp"),
      parent: get("parent"),
      school: get("school"),
      passingYear: year,
      state,
      city,
      stream: get("stream") || "commerce",
    };
    setHoneypot(get("website"));
    setSending(true);
    setError("");
    try {
      const reply = await post({ ...next, ref: institute.ref, website: get("website"), step: "send" });
      setToken(reply.token ?? "");
      setValues(next);
      setOtp("");
      setResendIn(reply.resendIn ?? 30);
      setStep("otp");
    } catch (err) {
      setError(errorText(err));
    } finally {
      setSending(false);
    }
  }

  async function onResend() {
    if (!values || sending || resendIn > 0) return;
    setSending(true);
    setError("");
    try {
      const reply = await post({ ...values, ref: institute.ref, website: honeypot, step: "send" });
      setToken(reply.token ?? "");
      setOtp("");
      setResendIn(reply.resendIn ?? 30);
    } catch (err) {
      setError(errorText(err));
    } finally {
      setSending(false);
    }
  }

  async function onVerify(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!values || sending) return;
    setSending(true);
    setError("");
    try {
      await post({ ...values, ref: institute.ref, otp, token, website: honeypot, step: "verify" });
      trackRegistration();
      setToken("");
      setState("");
      setCity("");
      setYear("");
      setValues(null);
      setStep("form");
      setName(values.name.split(/\s+/)[0] || "there");
    } catch (err) {
      setError(errorText(err));
    } finally {
      setSending(false);
    }
  }

  function backToForm() {
    setError("");
    setStep("form");
  }

  const errorBox = error && (
    <p role="alert" className="mb-2.5 rounded-xl bg-[#FDECEC] px-3.5 py-2.5 text-center text-[0.84rem] font-semibold text-[#B42318]">
      {error}
    </p>
  );

  return (
    <AnimatePresence mode="wait" initial={false}>
      {name === null && step === "form" ? (
        <motion.form
          key="form"
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className="flex flex-1 flex-col"
        >
          {/* Honeypot: hidden from people, filled by bots; the server then refuses the registration. */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
          {institute.closed && (
            <p role="alert" className="mt-[18px] rounded-xl bg-[#FDECEC] px-3.5 py-2.5 text-center text-[0.84rem] font-semibold text-[#B42318] lg:mt-3">
              We are not accepting registrations through <b className="font-extrabold">{institute.name}</b> at the moment.
            </p>
          )}
          <div className="mt-[22px] grid grid-cols-1 gap-x-3 gap-y-[18px] sm:grid-cols-2 lg:mt-4 lg:gap-y-3">
            <div className="grid gap-[7px] sm:col-span-2 lg:col-span-1">
              <Label htmlFor="r-name" className={label}>Student Full Name<Req /></Label>
              <Input id="r-name" name="name" required autoComplete="name" defaultValue={values?.name} placeholder="e.g. Aarav Sharma" className={field} />
            </div>
            <div className="grid gap-[7px] sm:col-span-2 lg:col-span-1">
              <Label htmlFor="r-email" className={label}>Email Address<Req /></Label>
              <Input id="r-email" name="email" type="email" required autoComplete="email" defaultValue={values?.email} placeholder="you@example.com" className={field} />
            </div>
            <div className="grid min-w-0 gap-[7px]">
              <Label htmlFor="r-wa" className={label}>Mobile Number<Req /></Label>
              <PhoneInput id="r-wa" name="whatsapp" defaultValue={values?.whatsapp} />
            </div>
            <div className="grid min-w-0 gap-[7px]">
              <Label htmlFor="r-parent" className={label}>Parent&apos;s Number</Label>
              <PhoneInput id="r-parent" name="parent" required={false} defaultValue={values?.parent} />
            </div>
            <div className="grid min-w-0 gap-[7px]">
              <Label htmlFor="r-school" className={label}>School Name<Req /></Label>
              <Input id="r-school" name="school" required defaultValue={values?.school} placeholder="e.g. DPS R.K. Puram" className={field} />
            </div>
            <div className="grid min-w-0 gap-[7px]">
              <Label htmlFor="r-year" className={label}>Passing Year<Req /></Label>
              <Select name="passingYear" required value={year || null} onValueChange={(v) => setYear(v ?? "")}>
                <SelectTrigger id="r-year" placeholder="Select year" />
                <SelectContent>
                  {PASSING_YEARS.map((y) => (
                    <SelectItem key={y} value={y}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid min-w-0 gap-[7px]">
              <Label htmlFor="r-state" className={label}>State<Req /></Label>
              <Select
                name="state"
                required
                autoComplete="address-level1"
                value={state || null}
                onValueChange={(v) => {
                  setState(v ?? "");
                  setCity("");
                }}
              >
                <SelectTrigger id="r-state" placeholder="Select your state" />
                <SelectContent>
                  {STATES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid min-w-0 gap-[7px]">
              <Label htmlFor="r-city" className={label}>City<Req /></Label>
              <Select
                name="city"
                required
                disabled={!state}
                autoComplete="address-level2"
                value={city || null}
                onValueChange={(v) => setCity(v ?? "")}
              >
                <SelectTrigger id="r-city" placeholder={state ? "Select your city" : "Select a state first"} />
                <SelectContent>
                  {(STATE_CITIES[state] ?? []).map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-[7px] sm:col-span-2">
              <span className={label} id="r-stream">Stream<Req /></span>
              <RadioGroup name="stream" defaultValue={values?.stream ?? "commerce"} aria-labelledby="r-stream" className="grid grid-cols-2 gap-2">
                {[
                  ["commerce", "Commerce"],
                  ["others", "Others"],
                ].map(([value, text]) => (
                  <Label
                    key={value}
                    className={cn(
                      "flex h-[50px] lg:h-11 cursor-pointer items-center gap-2.5 rounded-field border-[1.5px] border-line px-3.5 text-[0.92rem] font-bold text-navy transition-colors",
                      "has-data-checked:border-teal has-data-checked:bg-mint",
                    )}
                  >
                    <RadioGroupItem value={value} className="size-[18px] border-2 border-[#B8C3D3] bg-white" />
                    {text}
                  </Label>
                ))}
              </RadioGroup>
            </div>
          </div>
          <div className="min-h-[22px] flex-1" />
          {errorBox}
          <Button type="submit" variant="brand" size="pill" className="w-full" disabled={sending || institute.closed} aria-busy={sending}>
            {sending ? (
              <>
                <LoaderCircle className="animate-spin" /> Sending OTP…
              </>
            ) : (
              <>
                Register Now <ArrowRight />
              </>
            )}
          </Button>
          <p className="mt-2.5 text-center text-[0.74rem] text-subtle">
            We&apos;ll send an OTP by SMS to verify the mobile number.{" "}
            <a href="#" className="underline underline-offset-2">Privacy notice</a>
          </p>
        </motion.form>
      ) : name === null && values ? (
        <motion.form
          key="otp"
          ref={keepInView}
          onSubmit={onVerify}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className="flex flex-1 flex-col"
        >
          <div className="mt-[22px] grid gap-[7px] lg:mt-4">
            <Label htmlFor="r-otp" className={label}>Enter OTP<Req /></Label>
            <p className="text-[0.88rem] text-subtle">
              We sent a 6-digit code by SMS to <b className="whitespace-nowrap text-navy">+91 {values.whatsapp.slice(0, 5)} {values.whatsapp.slice(5)}</b>.
              It&apos;s valid for 5 minutes.{" "}
              <button type="button" onClick={backToForm} className="font-bold text-teal-deep underline underline-offset-4">
                Change number
              </button>
            </p>
            <Input
              id="r-otp"
              name="otp"
              required
              autoFocus
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              title="6-digit OTP"
              placeholder="••••••"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className={cn(field, "mt-2 text-center text-lg font-bold tracking-[0.5em] md:text-lg")}
            />
            <p className="text-[0.84rem] text-subtle">
              Didn&apos;t get it?{" "}
              {resendIn > 0 ? (
                <span>Resend in {resendIn}s</span>
              ) : (
                <button
                  type="button"
                  onClick={onResend}
                  disabled={sending}
                  className="font-bold text-teal-deep underline underline-offset-4 disabled:opacity-50"
                >
                  Resend OTP
                </button>
              )}
            </p>
          </div>
          <div className="min-h-[22px] flex-1" />
          {errorBox}
          <Button type="submit" variant="brand" size="pill" className="w-full" disabled={sending || otp.length !== 6} aria-busy={sending}>
            {sending ? (
              <>
                <LoaderCircle className="animate-spin" /> Verifying…
              </>
            ) : (
              <>
                Verify &amp; Register <ArrowRight />
              </>
            )}
          </Button>
        </motion.form>
      ) : (
        <motion.div
          key="done"
          ref={keepInView}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 flex flex-1 flex-col items-center justify-center rounded-[20px] bg-mint p-8 text-center"
          role="status"
        >
          <motion.span
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.1 }}
            className="grid size-16 place-items-center rounded-full bg-teal text-white"
          >
            <CircleCheck className="size-8" />
          </motion.span>
          <h3 className="mt-5 text-xl font-extrabold">Congratulations, you are registered!</h3>
          <button type="button" onClick={() => setName(null)} className="mt-5 text-sm font-bold text-teal-deep underline underline-offset-4">
            Register another student
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
