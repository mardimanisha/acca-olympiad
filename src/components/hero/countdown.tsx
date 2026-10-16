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

function parts(nowS: number) {
  let s = Math.max(0, Math.floor(TARGET / 1000) - nowS);
  const d = Math.floor(s / 86400);
  s %= 86400;
  const h = Math.floor(s / 3600);
  s %= 3600;
  const m = Math.floor(s / 60);
  s %= 60;
  return [
    [d, "d"],
    [h, "h"],
    [m, "m"],
    [s, "s"],
  ] as const;
}

/** Live d/h/m/s countdown. Renders dashes on the server, then ticks on the client. */
export function Countdown() {
  const now = useSyncExternalStore(subscribe, nowInSeconds, () => null);

  return (
    <span className="inline-flex gap-[5px]" aria-label="Time until the Olympiad starts" role="timer">
      {(now === null ? (["d", "h", "m", "s"] as const).map((u) => [null, u] as const) : parts(now)).map(([v, u]) => (
        <span
          key={u}
          className="relative inline-flex overflow-hidden rounded-md bg-white/10 px-[7px] py-0.5 font-extrabold text-white tabular-nums"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={v ?? "-"}
              initial={{ y: "-100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              {v === null ? "--" : String(v).padStart(2, "0")}
            </motion.span>
          </AnimatePresence>
          <i className="ml-px self-end text-[0.78em] text-haze not-italic">{u}</i>
        </span>
      ))}
    </span>
  );
}
