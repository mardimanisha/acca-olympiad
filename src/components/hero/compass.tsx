"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { COMPASS } from "@/lib/content";
import { selectCareer } from "@/lib/career-store";
import { cn } from "@/lib/utils";

const CX = 150;
const CY = 200;
const R = 140;
const STEP = 360 / COMPASS.length;
const rad = (deg: number) => ((deg - 90) * Math.PI) / 180;
// rounded so server and browser trig produce identical markup (avoids hydration mismatches)
const round = (n: number) => Math.round(n * 100) / 100;
const polar = (r: number, deg: number) => [round(CX + r * Math.cos(rad(deg))), round(CY + r * Math.sin(rad(deg)))] as const;

const TICKS = Array.from({ length: 60 }, (_, i) => {
  const a = i * 6;
  const major = a % 30 === 0;
  const [x1, y1] = polar(major ? R - 14 : R - 8, a);
  const [x2, y2] = polar(R - 2, a);
  return { x1, y1, x2, y2, major };
});

/**
 * Career compass. The needle sweeps between directions while the hero is on screen; hovering a
 * label points it there, clicking opens that career in the explorer.
 */
export function Compass() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();
  const [active, setActive] = useState(1);
  const activeRef = useRef(1);
  const [paused, setPaused] = useState(false);
  // cumulative rotation so the needle always takes the short way round
  const [angle, setAngle] = useState(STEP);

  const pointAt = useCallback((i: number) => {
    activeRef.current = i;
    setActive(i);
    setAngle((prev) => prev + ((((i * STEP - prev) % 360) + 540) % 360) - 180);
  }, []);

  useEffect(() => {
    if (!inView || paused || reduce) return;
    const id = setInterval(() => pointAt((activeRef.current + 3) % COMPASS.length), 2600);
    return () => clearInterval(id);
  }, [inView, paused, reduce, pointAt]);

  return (
    <svg
      ref={ref}
      viewBox="-95 18 490 368"
      role="group"
      aria-label="Career compass: pick a direction to explore"
      className="mt-[22px] block w-full max-w-[330px] overflow-visible sm:max-w-[360px]"
      onMouseLeave={() => setPaused(false)}
    >
      <circle cx={CX} cy={CY} r={R} className="fill-canvas stroke-navy" strokeWidth={3} />
      <circle cx={CX} cy={CY} r={R - 40} className="fill-none stroke-[#C9D6D3]" />
      <line x1={CX} y1={CY - R + 40} x2={CX} y2={CY + R - 40} className="stroke-[#C9D6D3]" />
      <line x1={CX - R + 40} y1={CY} x2={CX + R - 40} y2={CY} className="stroke-[#C9D6D3]" />
      {TICKS.map(({ major, ...t }, i) => (
        <line key={i} {...t} className="stroke-navy" strokeWidth={major ? 2 : 1} />
      ))}

      {COMPASS.map((c, i) => {
        const deg = i * STEP;
        const on = i === active;
        const [dx, dy] = polar(R + 10, deg);
        const [lx, ly] = polar(R + 26, deg);
        const cos = Math.cos(rad(deg));
        const anchor = Math.abs(cos) < 0.2 ? "middle" : cos > 0 ? "start" : "end";
        const go = () => selectCareer(c.id, { scroll: true });
        return (
          <motion.g
            key={c.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.06, duration: 0.4 }}
            role="button"
            tabIndex={0}
            aria-label={`Explore ${c.long.toLowerCase()}`}
            className="cursor-pointer outline-none [&:focus-visible_text]:underline"
            onMouseEnter={() => {
              setPaused(true);
              pointAt(i);
            }}
            onFocus={() => {
              setPaused(true);
              pointAt(i);
            }}
            onClick={go}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                go();
              }
            }}
          >
            <motion.circle
              cx={dx}
              cy={dy}
              animate={{ r: on ? 6 : 3.5 }}
              className={cn("transition-colors duration-300", on ? "fill-teal" : "fill-navy")}
            />
            {[
              { text: c.long, cls: c.short ? "max-sm:hidden" : "" },
              ...(c.short ? [{ text: c.short, cls: "sm:hidden" }] : []),
            ].map((l) => (
              <text
                key={l.text}
                x={lx}
                y={ly + 5}
                textAnchor={anchor}
                className={cn(
                  "text-[16px] font-extrabold tracking-[0.06em] transition-colors duration-300 sm:text-[15px]",
                  on ? "fill-teal" : "fill-navy",
                  l.cls,
                )}
              >
                {l.text}
              </text>
            ))}
          </motion.g>
        );
      })}

      <motion.g
        initial={{ rotate: -120 }}
        animate={{ rotate: angle }}
        transition={{ type: "spring", stiffness: 60, damping: 9, mass: 0.8 }}
      >
        <polygon points={`${CX},${CY - R + 22} ${CX + 11},${CY} ${CX - 11},${CY}`} fill="#E2531F" />
        <polygon points={`${CX},${CY + R - 22} ${CX + 11},${CY} ${CX - 11},${CY}`} className="fill-navy" />
      </motion.g>
      <circle cx={CX} cy={CY} r={10} className="fill-white stroke-navy" strokeWidth={3} />
    </svg>
  );
}
