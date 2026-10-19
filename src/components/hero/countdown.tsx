"use client";

import { useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EVENT } from "@/lib/content";

const TARGET = new Date(EVENT.startsAt).getTime();

function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 1000);
  return () => clearInterval(id);
}
const nowInSeconds = () => Math.floor(Date.now() / 1000);

const UNITS = [
  ["d", "Days"],
  ["h", "Hours"],
  ["m", "Mins"],
  ["s", "Secs"],
] as const;

/** Remaining time split into d/h/m/s; `null` values on the server and before hydration. */
function useCountdown() {
  const now = useSyncExternalStore(subscribe, nowInSeconds, () => null);
  let s = now === null ? 0 : Math.max(0, Math.floor(TARGET / 1000) - now);
  const values = [86400, 3600, 60, 1].map((size) => {
    const v = Math.floor(s / size);
    s %= size;
    return now === null ? null : v;
  });
  return UNITS.map(([unit, label], i) => ({ unit, label, value: values[i] }));
}

/** Two-digit number that rolls when it changes. */
function Rolling({ value }: { value: number | null }) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={value ?? "-"}
        initial={{ y: "-100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ duration: 0.35 }}
      >
        {value === null ? "--" : String(value).padStart(2, "0")}
      </motion.span>
    </AnimatePresence>
  );
}

/** Compact live d/h/m/s countdown for the top bar. Renders dashes on the server, then ticks on the client. */
export function Countdown({ showSeconds = true }: { showSeconds?: boolean }) {
  const parts = useCountdown();
  return (
    <span className="inline-flex gap-[5px]" aria-label="Time until the Olympiad starts" role="timer">
      {(showSeconds ? parts : parts.slice(0, 3)).map(({ unit, value }) => (
        <span
          key={unit}
          className="relative inline-flex overflow-hidden rounded-md bg-white/10 px-[7px] py-0.5 font-extrabold text-white tabular-nums"
        >
          <Rolling value={value} />
          <i className="ml-px self-end text-[0.78em] text-haze not-italic">{unit}</i>
        </span>
      ))}
    </span>
  );
}

/** Large countdown: one block per unit with its label underneath. For dark (teal/navy) cards. */
export function CountdownBlocks({ className }: { className?: string }) {
  const parts = useCountdown();
  return (
    <div className={className} aria-label="Time until the Olympiad starts" role="timer">
      {parts.map(({ unit, label, value }) => (
        <div key={unit} className="flex flex-col items-center rounded-2xl bg-white/12 px-2 py-3 sm:py-4">
          <span className="relative flex overflow-hidden text-[clamp(1.7rem,3vw,2.4rem)] leading-none font-extrabold text-white tabular-nums">
            <Rolling value={value} />
          </span>
          <small className="mt-1.5 text-[0.68rem] font-bold tracking-[0.12em] text-[#D5EFEA] uppercase">{label}</small>
        </div>
      ))}
    </div>
  );
}
