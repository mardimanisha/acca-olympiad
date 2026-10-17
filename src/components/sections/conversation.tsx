"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ArrowRight, Info } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FadeIn } from "@/components/motion";
import { FatherAvatar, StudentAvatar } from "@/components/mascots";
import { Section, Wrap } from "@/components/site";
import { CONVERSATION, SPEAKERS, type Line, type Speaker } from "@/lib/content";
import { cn } from "@/lib/utils";

const FIRST_DELAY = 500;
const TYPING_DELAY = 950;

/** Large avatar with name and caption, flanking the chat. Highlights while that person is "talking". */
function Person({ who, active, className }: { who: Speaker; active: boolean; className?: string }) {
  const p = SPEAKERS[who];
  return (
    <div className={cn("flex items-center gap-2.5 md:flex-col md:gap-0 md:text-center", className)}>
      <motion.div animate={{ scale: active ? 1.06 : 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
        <Avatar
          className={cn(
            "size-11 overflow-hidden shadow-[0_14px_30px_-14px_rgba(11,26,61,.45)] ring-[3px] transition-[box-shadow] duration-300 after:hidden md:size-20 md:ring-4 lg:size-[104px]",
            active ? "ring-teal/45" : "ring-white",
            who === "father" ? "bg-mint" : "bg-cream",
          )}
        >
          {p.photo ? (
            // next/image renders the photo in the server HTML; base-ui's AvatarImage only swapped it in
            // after a client-side load check, which left the illustration showing in some browsers
            <Image
              src={p.photo}
              alt={p.name}
              fill
              sizes="(min-width: 640px) 104px, 72px"
              // father art is half-length, student art is head only: zoom so both faces read at a similar size
              className={cn("object-contain", who === "father" ? "translate-y-[14%] scale-[1.3]" : "translate-y-[6%] scale-[0.92]")}
            />
          ) : (
            <AvatarFallback className={who === "father" ? "bg-mint" : "bg-cream"}>
              {who === "father" ? <FatherAvatar /> : <StudentAvatar />}
            </AvatarFallback>
          )}
        </Avatar>
      </motion.div>
      <div className="flex flex-col md:mt-3 md:items-center">
        <b className="text-[0.92rem] leading-tight text-navy md:text-[0.98rem]">{p.name}</b>
        <small className="text-[0.72rem] font-medium text-subtle md:text-[0.78rem]">{p.caption}</small>
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <span className="flex gap-1" aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.i
          key={i}
          className="block size-1.5 rounded-full bg-subtle"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </span>
  );
}

function BubbleContent({ line, shown }: { line: Line; shown: boolean }) {
  if (line.kind === "key") {
    const [before, after] = line.text.split("National Commerce Olympiad");
    return (
      <>
        {before}
        <b className="font-bold text-teal-deep">National Commerce Olympiad</b>
        {after}
      </>
    );
  }
  if (line.kind === "about") {
    return (
      <span className="flex gap-2">
        <Info className="mt-0.5 size-4 flex-none text-teal" />
        <span>{line.text}</span>
      </span>
    );
  }
  if (line.kind === "cta") {
    return (
      <a
        href="#register"
        tabIndex={shown ? undefined : -1}
        className={cn(buttonVariants({ variant: "brand", size: "pill-sm" }), "px-4 py-2.5 text-[0.88rem]")}
      >
        {line.text} <ArrowRight className="size-4" />
      </a>
    );
  }
  return line.text;
}

function ClosingBanner() {
  return (
    <div className="w-full max-w-[640px] rounded-[18px] bg-teal px-4 py-3 text-center text-white sm:px-6 sm:py-3.5 md:w-auto">
      <p className="text-[0.92rem] leading-[1.3] font-bold tracking-[-0.01em] sm:text-[1.02rem]">
        Don&apos;t choose a path just because others are choosing it.
      </p>
      <p className="mt-0.5 text-[0.8rem] font-medium text-[#D6F0EB] sm:text-[0.85rem]">
        Take the test. Explore your options. Make an informed start.
      </p>
    </div>
  );
}

function RegisterButton() {
  return (
    <a href="#register" className={cn(buttonVariants({ variant: "brand", size: "pill" }), "w-full flex-none md:w-fit")}>
      Register Free <ArrowRight />
    </a>
  );
}

/** s03 — father/student chat that plays out message by message, with typing dots, when scrolled into view. */
export function Conversation() {
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inView = useInView(panelRef, { once: true, amount: 0.3 });
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const total = CONVERSATION.length;
  const visible = reduce ? total : step;
  const typing = inView && !reduce && visible < total ? visible : -1;

  useEffect(() => {
    if (!inView || reduce || step >= total) return;
    const t = setTimeout(() => setStep((s) => s + 1), step === 0 ? FIRST_DELAY : TYPING_DELAY);
    return () => clearTimeout(t);
  }, [inView, reduce, step, total]);

  // Shrink the messages just enough that the whole chat fits the panel (no inner scrolling).
  useEffect(() => {
    const panel = panelRef.current;
    const list = listRef.current;
    if (!panel || !list) return;
    const fit = () => {
      list.style.zoom = "1";
      const cs = getComputedStyle(panel);
      const room = panel.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      const need = list.scrollHeight;
      list.style.zoom = need > room ? String(Math.max(0.7, room / need)) : "1";
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(panel);
    document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, []);

  const speaking: Speaker | null =
    typing >= 0 ? CONVERSATION[typing].who : visible > 0 && visible < total ? CONVERSATION[visible - 1].who : null;

  return (
    <Section id="s03">
      <Wrap>
        <FadeIn className="rounded-tile border border-line bg-white px-4 py-[clamp(28px,4vw,48px)] sm:px-[clamp(24px,4vw,48px)]">
          <div className="text-center">
            <span className="eyebrow">A familiar conversation</span>
            <h2 className="mt-2.5 text-[clamp(1.8rem,3vw,2.4rem)] leading-[1.1] font-extrabold tracking-[-0.03em]">
              One conversation. <span className="block text-teal">So many unanswered questions.</span>
            </h2>
          </div>

          <div className="mx-auto mt-8 grid w-full max-w-[1100px] grid-cols-2 items-center gap-x-4 gap-y-3 md:mt-10 md:h-[max(460px,calc(100svh-210px))] md:grid-cols-[1fr_minmax(0,600px)_1fr] md:gap-x-8">
            <Person who="father" active={speaking === "father"} className="md:col-start-1 md:row-start-1 md:justify-self-end" />
            <Person
              who="student"
              active={speaking === "student"}
              className="max-md:flex-row-reverse max-md:justify-self-end max-md:text-right md:col-start-3 md:row-start-1 md:justify-self-start"
            />

            <div
              ref={panelRef}
              className="col-span-2 flex flex-col justify-center rounded-[20px] border border-line bg-[#F3F8F6] p-3 sm:p-4 md:col-span-1 md:col-start-2 md:row-start-1 md:h-full md:min-h-0 md:overflow-hidden"
              aria-label="Conversation between a father and a student"
              aria-live="polite"
            >
              <div ref={listRef} className="flex flex-col gap-2.5">
                {CONVERSATION.map((line, i) => {
                  const student = line.who === "student";
                  const shown = i < visible;
                  const wide = line.kind === "key" || line.kind === "about";
                  return (
                    <div key={line.text} className={cn("relative flex", student ? "justify-end" : "justify-start")}>
                      <motion.div
                        initial={false}
                        animate={shown ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 320, damping: 26 }}
                        aria-hidden={!shown}
                        className={cn(
                          "origin-bottom-left text-[0.9rem] leading-[1.4] font-medium text-navy",
                          line.kind === "cta"
                            ? "p-0"
                            : "rounded-[14px] border px-3.5 py-2.5 shadow-[0_8px_18px_-16px_rgba(11,26,61,.5)]",
                          line.kind !== "cta" &&
                            (student
                              ? "max-w-[85%] origin-bottom-right rounded-br-[4px] border-mint-line bg-mint"
                              : "max-w-[85%] rounded-bl-[4px] border-line bg-white"),
                          wide && "max-w-full",
                          line.kind === "key" && "border-[#F6D9A0] bg-[#FFF8EA]",
                        )}
                      >
                        <BubbleContent line={line} shown={shown} />
                      </motion.div>
                      {i === typing && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={cn(
                            "absolute top-0 flex h-9 items-center rounded-[14px] border px-3.5",
                            student ? "right-0 rounded-br-[4px] border-mint-line bg-mint" : "left-0 rounded-bl-[4px] border-line bg-white",
                          )}
                        >
                          <TypingDots />
                        </motion.span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center gap-4">
            <ClosingBanner />
            <RegisterButton />
          </div>
        </FadeIn>
      </Wrap>
    </Section>
  );
}
