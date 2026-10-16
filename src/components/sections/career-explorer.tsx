"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Bar, Stagger, Tile } from "@/components/motion";
import { Section, SectionHead, Wrap } from "@/components/site";
import { CAREER_BY_ID, CAREER_ORDER, GROUPS, type Career } from "@/lib/careers";
import { selectCareer, useSelectedCareer } from "@/lib/career-store";
import { cn } from "@/lib/utils";

const LEVELS = ["Entry level", "Mid-career", "Senior"];
const lbl = "mb-2.5 text-[0.68rem] font-extrabold tracking-[0.14em] text-subtle uppercase";
const blk = "rounded-[18px] border border-line bg-canvas px-5 py-[18px]";

function CareerList({ active }: { active: string }) {
  return (
    <Tile
      tone="navy"
      pad="none"
      className="flex gap-1.5 overflow-x-auto p-2.5 [scrollbar-width:none] lg:grid lg:gap-0.5 lg:overflow-visible lg:p-3"
      role="tablist"
      aria-label="Career paths"
    >
      {GROUPS.map(([group, ids]) => (
        <div key={group} className="contents">
          <div className="hidden px-3 pt-3.5 pb-1 text-[0.66rem] font-extrabold tracking-[0.14em] text-aqua uppercase first:pt-2 lg:block">
            {group}
          </div>
          {ids.map((id) => {
            const c = CAREER_BY_ID[id];
            const on = id === active;
            return (
              <button
                key={id}
                role="tab"
                aria-selected={on}
                aria-controls="career-panel"
                onClick={() => selectCareer(id)}
                className={cn(
                  "relative flex cursor-pointer items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-[0.9rem] font-bold whitespace-nowrap text-white outline-none focus-visible:ring-2 focus-visible:ring-aqua",
                  "max-lg:border max-lg:border-navy-line lg:whitespace-normal",
                  !on && "transition-colors hover:bg-white/5",
                )}
              >
                {on && (
                  <motion.span
                    layoutId="career-pill"
                    className="absolute inset-0 rounded-xl bg-teal"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative">{c.name}</span>
                <small className={cn("relative hidden text-[0.74rem] font-semibold whitespace-nowrap lg:inline", on ? "text-[#D5EFEA]" : "text-haze")}>
                  {c.entry}
                </small>
              </button>
            );
          })}
        </div>
      ))}
    </Tile>
  );
}

function CareerPanel({ c }: { c: Career }) {
  const i = CAREER_ORDER.indexOf(c.id);
  const prev = CAREER_ORDER[(i + CAREER_ORDER.length - 1) % CAREER_ORDER.length];
  const next = CAREER_ORDER[(i + 1) % CAREER_ORDER.length];

  return (
    <motion.div
      key={c.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between gap-4 px-5 pt-[22px] pb-[18px] sm:px-8 sm:pt-[30px] sm:pb-6">
        <div>
          <span className="text-[0.72rem] font-extrabold tracking-[0.12em] text-teal uppercase">{c.cat}</span>
          <h3 className="mt-1.5 text-[1.75rem] font-extrabold tracking-[-0.02em]">{c.name}</h3>
          <p className="mt-1.5 max-w-[56ch] text-base">{c.one}</p>
        </div>
        <div className="hidden gap-1.5 sm:flex">
          {[
            { id: prev, label: "Previous career", Icon: ArrowLeft },
            { id: next, label: "Next career", Icon: ArrowRight },
          ].map(({ id, label, Icon }) => (
            <button
              key={label}
              onClick={() => selectCareer(id)}
              aria-label={label}
              className="grid size-10 cursor-pointer place-items-center rounded-full border border-line bg-canvas text-navy transition-colors hover:bg-mint"
            >
              <Icon className="size-4" />
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 px-4 pb-[18px] sm:grid-cols-2 sm:gap-3.5 sm:px-8 sm:pb-8">
        <div className={blk}>
          <div className={lbl}>What you&apos;ll do</div>
          <p className="text-[0.94rem]">{c.work}</p>
        </div>
        <div className={blk}>
          <div className={lbl}>Typical roles</div>
          <div className="flex flex-wrap gap-1.5">
            {c.roles.map((r) => (
              <span key={r} className="rounded-full bg-mint px-[11px] py-1.5 text-[0.82rem] font-bold text-teal-deep">{r}</span>
            ))}
          </div>
        </div>

        <div className={cn(blk, "sm:col-span-2")}>
          <div className={lbl}>Route into the field</div>
          <ol className="flex flex-wrap items-start gap-y-3.5 sm:flex-nowrap">
            {c.route.map((r, k) => (
              <motion.li
                key={r}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + k * 0.08 }}
                className={cn(
                  "relative flex-[0_0_33.33%] px-1 pt-[26px] text-center text-[0.8rem] font-bold text-navy sm:flex-1",
                  // dashed connector to the next step
                  "after:absolute after:top-3 after:left-1/2 after:w-full after:border-t-2 after:border-dashed after:border-[#B9DCD5] last:after:hidden max-sm:[&:nth-child(3n)]:after:hidden",
                )}
              >
                <span
                  className={cn(
                    "absolute top-1.5 left-1/2 z-10 -ml-[7px] size-3.5 rounded-full border-[3px] border-teal",
                    k === c.route.length - 1 ? "bg-teal" : "bg-white",
                  )}
                />
                {r}
              </motion.li>
            ))}
          </ol>
        </div>

        <div className="grid gap-3.5 sm:col-span-2 sm:grid-cols-3">
          {[
            ["Qualification", c.qual],
            ["Duration", c.dur],
            ["Approx. cost", c.cost],
          ].map(([k, v]) => (
            <div key={k} className="rounded-2xl bg-mint px-4 py-3.5">
              <small className="block text-[0.66rem] font-extrabold tracking-[0.12em] text-teal-deep uppercase">{k}</small>
              <b className="mt-1 block text-[0.9rem] leading-[1.35] text-navy">{v}</b>
            </div>
          ))}
        </div>

        <div className={blk}>
          <div className={lbl}>Key skills</div>
          <div className="flex flex-wrap gap-1.5">
            {c.skills.map((r) => (
              <span key={r} className="rounded-full border border-line bg-white px-[11px] py-1.5 text-[0.82rem] font-bold text-navy">{r}</span>
            ))}
          </div>
        </div>
        <div className={blk}>
          <div className={lbl}>Good fit if you…</div>
          <ul className="grid gap-2 text-[0.92rem]">
            {c.fit.map((r) => (
              <li key={r} className="flex gap-2.5">
                <span className="mt-[3px] grid size-4 flex-none place-items-center rounded-full bg-mint text-teal-deep">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                {r}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[18px] bg-mint px-5 py-[18px] sm:col-span-2">
          <div className="mb-2.5 flex items-center justify-between gap-2.5">
            <b className="text-[0.95rem] text-navy">Indicative salary · per year</b>
            <span className="rounded-md bg-cream px-2 py-1 text-[0.68rem] font-extrabold tracking-[0.04em] text-amber-ink">SAMPLE DATA · VERIFY</span>
          </div>
          {c.sal.map((s, k) => (
            <div
              key={LEVELS[k]}
              className="mt-2 grid grid-cols-[74px_1fr_92px] items-center gap-2 text-[0.8rem] font-bold text-navy sm:grid-cols-[100px_1fr_120px] sm:gap-3 sm:text-[0.86rem]"
            >
              <span>{LEVELS[k]}</span>
              <Bar value={c.w[k]} delay={0.1 + k * 0.12} trackClassName="h-2.5 bg-white" />
              <span className="text-right">{s}</span>
            </div>
          ))}
          <p className="mt-2.5 text-[0.76rem] text-subtle">
            {c.salNote ?? "Indicative ranges, not promises. Pay varies by employer, city, experience, skills and qualification."}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/** s05 — pick one of 15 careers and see the work, route, cost, skills and salary ranges. */
export function CareerExplorer() {
  const active = useSelectedCareer();
  const c = CAREER_BY_ID[active];

  return (
    <Section id="s05">
      <Wrap>
        <SectionHead
          eyebrow="Career explorer"
          title="15 commerce paths. Tap one to see what it really takes."
          intro="The work, the route, duration, cost, skills and indicative salary ranges."
        />
        <Stagger className="grid items-start gap-3.5 sm:gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
          <CareerList active={active} />
          <Tile pad="none" id="career-panel" role="tabpanel" aria-live="polite" className="overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <CareerPanel key={c.id} c={c} />
            </AnimatePresence>
          </Tile>
        </Stagger>
      </Wrap>
    </Section>
  );
}
