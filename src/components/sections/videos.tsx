"use client";

import { motion } from "motion/react";
import { ArrowRight, Play } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Item, Stagger, Tile } from "@/components/motion";
import { Section, SectionHead, Wrap } from "@/components/site";
import { CHAPTERS, REELS } from "@/lib/content";
import { cn } from "@/lib/utils";

/** s06 — featured video, chapters and 30-second reels. Video sources are not wired up yet. */
export function Videos() {
  return (
    <Section id="s06">
      <Wrap>
        <SectionHead
          eyebrow="Watch · 5 minutes"
          title="Commerce Careers Decoded"
          intro="Qualifications, salaries and your roadmap to success, in one short video."
        />
        <Stagger className="grid gap-3.5 sm:gap-5 lg:grid-cols-4">
          <Tile
            pad="none"
            className="group relative flex min-h-[280px] cursor-pointer flex-col justify-between border-0 bg-linear-135 from-navy to-teal-deep p-6 sm:aspect-[16/8] sm:p-9 lg:col-span-3"
          >
            <div>
              <span className="eyebrow text-aqua">Featured video</span>
              <h3 className="mt-2.5 max-w-[18ch] text-[clamp(1.4rem,2.4vw,2.1rem)] leading-[1.12] font-extrabold tracking-[-0.02em] text-white">
                CA vs ACCA vs CMA vs CPA vs CFA: <em className="text-aqua not-italic">what&apos;s the real difference?</em>
              </h3>
            </div>
            <div className="flex items-end justify-between">
              <button
                aria-label="Play Commerce Careers Decoded"
                className="relative grid size-[72px] cursor-pointer place-items-center rounded-full bg-white"
              >
                <motion.span
                  className="absolute inset-0 rounded-full bg-white/25"
                  animate={{ scale: [1, 1.45], opacity: [0.8, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                />
                <Play className="relative ml-1 size-[26px] fill-teal text-teal transition-transform group-hover:scale-110" />
              </button>
              <span className="flex gap-2 text-[0.84rem] font-bold text-[#CDE7E2]">
                <span className="rounded-lg bg-white/12 px-2.5 py-[5px]">5:04</span>
                <span className="rounded-lg bg-white/12 px-2.5 py-[5px]">CC</span>
              </span>
            </div>
          </Tile>

          <Tile pad="none" className="p-6">
            <h4 className="mb-2 text-[1.05rem] font-bold">Chapters</h4>
            {CHAPTERS.map(([t, label]) => (
              <button
                key={t}
                className="grid w-full cursor-pointer grid-cols-[46px_1fr] border-t border-line py-[11px] text-left text-[0.9rem] leading-[1.35] font-semibold text-navy transition-colors hover:text-teal"
              >
                <b className="text-teal tabular-nums">{t}</b>
                {label}
              </button>
            ))}
          </Tile>

          <Item className="mt-3 flex flex-col items-baseline justify-between gap-x-3 gap-y-0.5 sm:flex-row lg:col-span-4">
            <b className="text-[1.15rem] font-extrabold tracking-[-0.01em] text-navy">Short cuts · 30-second Reels &amp; Shorts</b>
            <small className="text-[0.9rem] font-semibold text-subtle">Quick answers to the questions students ask most</small>
          </Item>

          <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-4 sm:gap-5 sm:overflow-visible sm:px-0 lg:col-span-4">
            {REELS.map((r, i) => (
              <Tile
                key={r.title}
                tone={i % 2 ? "white" : "mint"}
                pad="none"
                whileHover={{ y: -6 }}
                className="group relative flex aspect-[9/13.5] flex-[0_0_calc(50%-18px)] cursor-pointer snap-start flex-col justify-between overflow-hidden p-4 sm:p-[22px]"
              >
                <div className="relative flex items-center justify-between">
                  <span className="text-[0.68rem] font-extrabold tracking-[0.12em] text-teal-deep uppercase">
                    Reel {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={cn("rounded-lg px-[9px] py-1 text-[0.76rem] font-extrabold text-navy tabular-nums", i % 2 ? "bg-mint" : "bg-white")}>
                    {r.dur}
                  </span>
                </div>
                <div className="grid flex-1 place-items-center sm:absolute sm:inset-x-0 sm:top-0 sm:bottom-[30%]">
                  <span className="grid size-14 place-items-center rounded-full border-2 border-teal/25 transition-colors group-hover:border-teal group-hover:bg-white sm:size-[76px]">
                    <Play className="ml-1 size-5 fill-teal text-teal opacity-55 transition-opacity group-hover:opacity-100 sm:size-[26px]" />
                  </span>
                </div>
                <div>
                  <h4 className="relative text-[1.05rem] leading-[1.15] font-extrabold tracking-[-0.02em] sm:text-[1.35rem]">{r.title}</h4>
                  <span className="mt-3.5 inline-flex items-center gap-2 rounded-full bg-teal py-1.5 pr-2.5 pl-1.5 text-[0.76rem] font-bold text-white sm:py-[7px] sm:pr-3.5 sm:pl-2 sm:text-[0.82rem]">
                    <i className="grid size-[22px] place-items-center rounded-full bg-white">
                      <Play className="ml-0.5 size-2.5 fill-teal text-teal" />
                    </i>
                    Play
                  </span>
                  <div className="mt-4 h-1 overflow-hidden rounded bg-teal/15">
                    <i className="block h-full w-[30%] rounded bg-teal transition-[width] duration-700 group-hover:w-full" />
                  </div>
                </div>
              </Tile>
            ))}
          </div>

          <Tile
            pad="none"
            className="flex flex-col items-stretch justify-between gap-[18px] p-[22px] text-center sm:flex-row sm:items-center sm:py-[22px] sm:pr-[26px] sm:pl-8 sm:text-left lg:col-span-4"
          >
            <b className="text-[1.1rem] text-navy">Start exploring your career direction</b>
            <a href="#register" className={buttonVariants({ variant: "brand", size: "pill" })}>
              Take the free Olympiad <ArrowRight />
            </a>
          </Tile>
        </Stagger>
      </Wrap>
    </Section>
  );
}
