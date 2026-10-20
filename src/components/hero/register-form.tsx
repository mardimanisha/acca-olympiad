"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, CircleCheck, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { EVENT } from "@/lib/content";
import { STATES, STATE_CITIES } from "@/lib/locations";
import { cn } from "@/lib/utils";

const field =
  "h-[50px] lg:h-11 rounded-field border-line bg-canvas px-3.5 text-[0.93rem] text-navy placeholder:text-[#8F9BAE] md:text-[0.93rem]";
const label = "text-[0.8rem] font-bold text-navy";
// 2017–2032: ten past years plus the upcoming batches
const FIRST_YEAR = 2017;
const PASSING_YEARS = Array.from({ length: 16 }, (_, i) => String(FIRST_YEAR + i));

function PhoneInput({ id, name }: { id: string; name: string }) {
  return (
    <div className="flex h-[50px] items-center gap-2 rounded-field lg:h-11 border border-line bg-canvas pl-3.5 transition-shadow focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
      <b className="border-r border-line pr-2 text-[0.93rem] text-navy">+91</b>
      <Input
        id={id}
        name={name}
        type="tel"
        inputMode="numeric"
        required
        pattern="[6-9][0-9]{9}"
        maxLength={10}
        title="10-digit Indian mobile number"
        placeholder="98765 43210"
        className="h-full min-w-0 rounded-none border-0 bg-transparent px-0 text-[0.93rem] text-navy shadow-none placeholder:text-[#8F9BAE] focus-visible:ring-0 md:text-[0.93rem]"
      />
    </div>
  );
}

/** Registration form. Validates in the browser, posts to /api/register (Google Sheet) and shows a confirmation. */
export function RegisterForm() {
  const [name, setName] = useState<string | null>(null);
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [year, setYear] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    const form = e.currentTarget;
    const data = new FormData(form);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: get("name"),
          email: get("email"),
          whatsapp: get("whatsapp"),
          parent: get("parent"),
          school: get("school"),
          passingYear: year,
          state,
          city,
          stream: get("stream") || "commerce",
        }),
      });
      const reply = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!res.ok || !reply?.ok) throw new Error(reply?.error || "We couldn't save your registration. Please try again.");
      form.reset();
      setState("");
      setCity("");
      setYear("");
      setName(get("name").split(/\s+/)[0] || "there");
    } catch (err) {
      setError(err instanceof Error && err.message !== "Failed to fetch" ? err.message : "Network error. Please check your connection and try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {name === null ? (
        <motion.form
          key="form"
          onSubmit={onSubmit}
          exit={{ opacity: 0, y: -12 }}
          className="flex flex-1 flex-col"
        >
          <div className="mt-[22px] grid grid-cols-1 gap-x-3 gap-y-[18px] sm:grid-cols-2 lg:mt-4 lg:gap-y-3">
            <div className="grid gap-[7px] sm:col-span-2 lg:col-span-1">
              <Label htmlFor="r-name" className={label}>Student Full Name</Label>
              <Input id="r-name" name="name" required autoComplete="name" placeholder="e.g. Aarav Sharma" className={field} />
            </div>
            <div className="grid gap-[7px] sm:col-span-2 lg:col-span-1">
              <Label htmlFor="r-email" className={label}>Email Address</Label>
              <Input id="r-email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={field} />
            </div>
            <div className="grid min-w-0 gap-[7px]">
              <Label htmlFor="r-wa" className={label}>WhatsApp Number</Label>
              <PhoneInput id="r-wa" name="whatsapp" />
            </div>
            <div className="grid min-w-0 gap-[7px]">
              <Label htmlFor="r-parent" className={label}>Parent&apos;s Number</Label>
              <PhoneInput id="r-parent" name="parent" />
            </div>
            <div className="grid min-w-0 gap-[7px]">
              <Label htmlFor="r-school" className={label}>School Name</Label>
              <Input id="r-school" name="school" required placeholder="e.g. DPS R.K. Puram" className={field} />
            </div>
            <div className="grid min-w-0 gap-[7px]">
              <Label htmlFor="r-year" className={label}>Passing Year</Label>
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
              <Label htmlFor="r-state" className={label}>State</Label>
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
              <Label htmlFor="r-city" className={label}>City</Label>
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
              <span className={label} id="r-stream">Stream</span>
              <RadioGroup name="stream" defaultValue="commerce" aria-labelledby="r-stream" className="grid grid-cols-2 gap-2">
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
          {error && (
            <p role="alert" className="mb-2.5 rounded-xl bg-[#FDECEC] px-3.5 py-2.5 text-center text-[0.84rem] font-semibold text-[#B42318]">
              {error}
            </p>
          )}
          <Button type="submit" variant="brand" size="pill" className="w-full" disabled={sending} aria-busy={sending}>
            {sending ? (
              <>
                <LoaderCircle className="animate-spin" /> Registering…
              </>
            ) : (
              <>
                Register Now <ArrowRight />
              </>
            )}
          </Button>
          <p className="mt-2.5 text-center text-[0.74rem] text-subtle">
            Used for your confirmation, exam instructions and report.{" "}
            <a href="#" className="underline underline-offset-2">Privacy notice</a>
          </p>
        </motion.form>
      ) : (
        <motion.div
          key="done"
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
          <h3 className="mt-5 text-xl font-extrabold">You&apos;re in, {name}!</h3>
          <p className="mt-2 max-w-[30ch] text-[0.95rem]">
            Watch WhatsApp for your confirmation. Exam instructions follow closer to {EVENT.dateLabel}.
          </p>
          <button type="button" onClick={() => setName(null)} className="mt-5 text-sm font-bold text-teal-deep underline underline-offset-4">
            Register another student
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
