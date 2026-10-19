"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, ChevronDown } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Bar, FadeIn, Stagger, Tile } from "@/components/motion";
import { Section, SectionHead, Wrap } from "@/components/site";
import { CAREER_BY_ID, CAREER_ORDER, GROUPS, type Career } from "@/lib/careers";
import { selectCareer, useSelectedCareer } from "@/lib/career-store";
import { cn } from "@/lib/utils";

const LEVELS = ["Entry level", "Mid-career", "Senior"];

const EASE = [0.22, 1, 0.36, 1] as const;

function useDesktop() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setOn(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return on;
}

function CareerTab({ id, active }: { id: string; active: string }) {
  const c = CAREER_BY_ID[id];
  const on = id === active;
  return (
    <button
      role="tab"
      aria-selected={on}
      aria-controls="career-panel"
      onClick={() => selectCareer(id)}
      className={cn(
        "relative flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-[0.9rem] font-bold whitespace-nowrap text-white outline-none focus-visible:ring-2 focus-visible:ring-aqua",
        "max-lg:w-auto max-lg:border max-lg:border-navy-line lg:whitespace-normal",
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
}

function CareerList({ active }: { active: string }) {
  const desktop = useDesktop();
  const activeGroup = GROUPS.find(([, ids]) => ids.includes(active))?.[0] ?? null;
  // one group open at a time; null = all collapsed
  const [open, setOpen] = useState<string | null>(activeGroup);
  // follow the selection when it moves to another group (prev/next arrows)
  useEffect(() => {
    setOpen(activeGroup);
  }, [activeGroup]);

  if (!desktop) {
    return (
      <Tile tone="navy" pad="none" className="flex gap-1.5 overflow-x-auto p-2.5 [scrollbar-width:none]" role="tablist" aria-label="Career paths">
        {GROUPS.flatMap(([, ids]) => ids).map((id) => (
          <CareerTab key={id} id={id} active={active} />
        ))}
      </Tile>
    );
  }

  return (
    <Tile tone="navy" pad="none" className="flex flex-col gap-1 overflow-y-auto p-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist" aria-label="Career paths">
      {GROUPS.map(([group, ids]) => {
        const isOpen = open === group;
        return (
          <motion.div
            key={group}
            initial={false}
            animate={{ flexGrow: isOpen ? 0 : 1 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="flex min-h-0 flex-col"
          >
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : group)}
              className={cn(
                "flex flex-1 cursor-pointer items-center justify-between gap-2 rounded-xl border px-3 text-left font-extrabold text-aqua uppercase outline-none hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-aqua",
                "transition-[font-size,letter-spacing,padding,border-color,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                isOpen ? "border-transparent py-2.5 text-[0.7rem] tracking-[0.14em]" : "border-navy-line py-4 text-[0.92rem] tracking-[0.04em]",
              )}
            >
              <span className="min-w-0">{group}</span>
              <ChevronDown className={cn("size-4 flex-none transition-transform duration-500", isOpen && "rotate-180")} />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="items"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div className="grid gap-0.5 pt-0.5 pb-1.5">
                    {ids.map((id) => (
                      <CareerTab key={id} id={id} active={active} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </Tile>
  );
}

function CareerPanel({ c }: { c: Career }) {
  const i = CAREER_ORDER.indexOf(c.id);
  const prev = CAREER_ORDER[(i + CAREER_ORDER.length - 1) % CAREER_ORDER.length];
  const next = CAREER_ORDER[(i + 1) % CAREER_ORDER.length];

  return (
    <motion.div
      className="flex h-full flex-col"
      key={c.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between gap-4 px-5 pt-[22px] pb-3 sm:px-8 sm:pt-6 sm:pb-4">
        <div>
          <span className="text-[0.72rem] font-extrabold tracking-[0.12em] text-teal uppercase">{c.cat}</span>
          <h3 className="mt-1.5 text-[1.75rem] font-extrabold tracking-[-0.02em]">{c.name}</h3>
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

      <div className="flex-1 px-4 pb-5 sm:px-8 sm:pb-8 lg:pb-5">
        <table className="w-full lg:h-full border-separate border-spacing-0 overflow-hidden rounded-2xl border border-line text-left text-[0.88rem]">
          <tbody className="[&_td]:border-t [&_td]:border-line [&_td]:px-4 [&_td]:py-2 lg:[&_td]:py-2 [&_th]:border-t [&_th]:border-line [&_th]:bg-mint [&_th]:px-4 [&_th]:py-2 [&_th]:align-top [&_th]:text-[0.68rem] [&_th]:font-extrabold [&_th]:tracking-[0.12em] [&_th]:whitespace-nowrap [&_th]:text-teal-deep [&_th]:uppercase [&_tr:first-child_td]:border-t-0 [&_tr:first-child_th]:border-t-0">
            <tr>
              <th scope="row">What you&apos;ll do</th>
              <td>{c.work}</td>
            </tr>
            <tr>
              <th scope="row">Typical roles</th>
              <td className="font-bold text-navy">{c.roles.slice(0, 3).join(" · ")}</td>
            </tr>
            <tr>
              <th scope="row">Route</th>
              <td className="font-bold text-navy">{c.route.join(" → ")}</td>
            </tr>
            <tr>
              <th scope="row">Duration</th>
              <td className="font-bold text-navy">{c.dur}</td>
            </tr>
            <tr>
              <th scope="row">Approx. cost</th>
              <td className="font-bold text-navy">{c.cost}</td>
            </tr>
            <tr>
              <th scope="row">Key skills</th>
              <td className="font-bold text-navy">{c.skills.slice(0, 4).join(" · ")}</td>
            </tr>
            <tr>
              <th scope="row">Good fit if you…</th>
              <td>
                <ul className="grid gap-1.5">
                  {c.fit.slice(0, 2).map((r) => (
                    <li key={r} className="flex gap-2">
                      <Check className="mt-[3px] size-3.5 flex-none text-teal" strokeWidth={3} />
                      {r}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
            <tr>
              <th scope="row">
                Salary / year
                <span className="mt-1.5 block text-[0.6rem] tracking-[0.04em] text-amber-ink normal-case">Sample data · verify</span>
              </th>
              <td>
                {c.sal.map((s, k) => (
                  <div
                    key={LEVELS[k]}
                    className="grid grid-cols-[74px_1fr_88px] items-center gap-2 py-1 text-[0.8rem] font-bold text-navy sm:grid-cols-[100px_1fr_110px] sm:gap-3"
                  >
                    <span>{LEVELS[k]}</span>
                    <Bar value={c.w[k]} delay={0.1 + k * 0.12} trackClassName="h-2.5 bg-mint" />
                    <span className="text-right">{s}</span>
                  </div>
                ))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

/** s05 — pick one of 16 careers and see the work, route, cost, skills and salary ranges. */
export function CareerExplorer() {
  const active = useSelectedCareer();
  const c = CAREER_BY_ID[active];

  return (
    <Section id="s05" className="lg:flex lg:min-h-svh lg:flex-col lg:justify-center">
      <Wrap>
        <SectionHead
          eyebrow="Career explorer"
          title="“Commerce” Is Not One Career."
          intro="Pick a path to see what it takes."
        />
        <Stagger className="grid items-start gap-3.5 sm:gap-5 lg:min-h-[clamp(540px,calc(100svh-290px),760px)] lg:grid-cols-[320px_minmax(0,1fr)] lg:items-stretch">
          <CareerList active={active} />
          <Tile pad="none" id="career-panel" role="tabpanel" aria-live="polite" className="overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <CareerPanel key={c.id} c={c} />
            </AnimatePresence>
          </Tile>
        </Stagger>
        <FadeIn className="mt-5 flex justify-center">
          <a href="#register" className={cn(buttonVariants({ variant: "brand", size: "pill" }), "max-sm:w-full")}>
            Take the Olympiad &amp; Discover My Path <ArrowRight />
          </a>
        </FadeIn>
      </Wrap>
    </Section>
  );
}
