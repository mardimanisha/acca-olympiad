"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { MotionConfig, motion, type HTMLMotionProps, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Respect the visitor's reduced-motion setting everywhere. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ ease: EASE }}>
      {children}
    </MotionConfig>
  );
}

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/** Parent that reveals its `Tile`/`Item` children one after another when scrolled into view. */
export function Stagger({
  className,
  delay = 0,
  step = 0.08,
  amount = 0.15,
  ...props
}: HTMLMotionProps<"div"> & { delay?: number; step?: number; amount?: number }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: step, delayChildren: delay } } }}
      {...props}
    />
  );
}

/** Generic child of `Stagger`. */
export function Item({ className, ...props }: HTMLMotionProps<"div">) {
  return <motion.div variants={itemVariants} className={className} {...props} />;
}

/** Standalone fade-up for blocks that are not inside a `Stagger`. */
export function FadeIn({ className, delay = 0, ...props }: HTMLMotionProps<"div"> & { delay?: number }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE, delay } },
      }}
      {...props}
    />
  );
}

export const tileVariants = cva("min-w-0 rounded-tile border", {
  variants: {
    tone: {
      white: "border-line bg-white",
      mint: "border-mint-line bg-mint [&_.ic]:bg-white",
      navy: "border-navy bg-navy text-mist [&_.eyebrow]:text-aqua [&_h3]:text-white [&_.ic]:bg-white/10 [&_.ic]:text-aqua",
      teal: "border-teal bg-teal text-[#D5EFEA] [&_.eyebrow]:text-aqua [&_h3]:text-white [&_.ic]:bg-white/10 [&_.ic]:text-aqua",
      amber: "border-amber bg-amber text-navy [&_.eyebrow]:text-[#6B4500]",
    },
    pad: {
      default: "p-[22px] sm:p-[30px]",
      none: "",
    },
  },
  defaultVariants: { tone: "white", pad: "default" },
});

/** The bento tile: rounded card in one of five brand tones. Animates when inside a `Stagger`. */
export function Tile({
  className,
  tone,
  pad,
  ...props
}: HTMLMotionProps<"div"> & VariantProps<typeof tileVariants>) {
  return <motion.div variants={itemVariants} className={cn(tileVariants({ tone, pad }), className)} {...props} />;
}

/** Progress / score bar that fills from 0 when it scrolls into view. */
export function Bar({
  value,
  className,
  trackClassName,
  delay = 0,
}: {
  value: number;
  className?: string;
  trackClassName?: string;
  delay?: number;
}) {
  return (
    <span className={cn("block h-[7px] overflow-hidden rounded-full bg-[#DCEBE7]", trackClassName)}>
      <motion.i
        className={cn("block h-full rounded-full bg-teal", className)}
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay, ease: EASE }}
      />
    </span>
  );
}

/** Strike-through line that draws across its parent (position: relative) when scrolled into view. */
export function StrikeLine({ className, delay = 0.4 }: { className?: string; delay?: number }) {
  return (
    <motion.span
      aria-hidden
      className={cn("pointer-events-none absolute inset-x-0 top-1/2 h-[3px] origin-left -translate-y-1/2 rounded-full bg-orange", className)}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    />
  );
}
