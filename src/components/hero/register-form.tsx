"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { EVENT } from "@/lib/content";
import { cn } from "@/lib/utils";

const field =
  "h-[50px] lg:h-11 rounded-field border-line bg-canvas px-3.5 text-[0.93rem] text-navy placeholder:text-[#8F9BAE] md:text-[0.93rem]";
const label = "text-[0.8rem] font-bold text-navy";

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

/**
 * Registration form. Validates in the browser and shows a confirmation; it is not connected to a
 * backend yet — wire `onSubmit` to the registration API.
 */
export function RegisterForm() {
  const [name, setName] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setName(String(data.get("name") ?? "").trim().split(/\s+/)[0] || "there");
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
              <Label htmlFor="r-name" className={label}>Student full name</Label>
              <Input id="r-name" name="name" required autoComplete="name" placeholder="e.g. Aarav Sharma" className={field} />
            </div>
            <div className="grid gap-[7px] sm:col-span-2 lg:col-span-1">
              <Label htmlFor="r-email" className={label}>Email address</Label>
              <Input id="r-email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={field} />
            </div>
            <div className="grid min-w-0 gap-[7px]">
              <Label htmlFor="r-wa" className={label}>WhatsApp number</Label>
              <PhoneInput id="r-wa" name="whatsapp" />
            </div>
            <div className="grid min-w-0 gap-[7px]">
              <Label htmlFor="r-parent" className={label}>Parent&apos;s number</Label>
              <PhoneInput id="r-parent" name="parent" />
            </div>
            <div className="grid min-w-0 gap-[7px]">
              <Label htmlFor="r-school" className={label}>School name</Label>
              <Input id="r-school" name="school" required placeholder="e.g. DPS R.K. Puram" className={field} />
            </div>
            <div className="grid min-w-0 gap-[7px]">
              <Label htmlFor="r-city" className={label}>City</Label>
              <Input id="r-city" name="city" required autoComplete="address-level2" placeholder="e.g. Jaipur" className={field} />
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
          <Button type="submit" variant="brand" size="pill" className="w-full">
            Register Free <ArrowRight />
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
