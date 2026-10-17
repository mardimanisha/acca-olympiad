"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Countdown } from "@/components/hero/countdown";
import { WhatsAppIcon } from "@/components/mascots";
import { EVENT } from "@/lib/content";
import { cn } from "@/lib/utils";

/** True once the visitor has scrolled past most of the hero (which has its own form and CTA). */
function usePastHero() {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById("s01");
      setPast(hero ? hero.getBoundingClientRect().bottom < window.innerHeight * 0.35 : window.scrollY > 600);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return past;
}

/** Bottom-centre sticky CTA (button + countdown; compact on phones) and the WhatsApp community button. */
export function FloatingActions() {
  const showBar = usePastHero();

  return (
    <>
      <motion.a
        href={EVENT.whatsappHref}
        target="_blank"
        rel="noopener"
        aria-label="Join the WhatsApp community"
        initial={{ opacity: 0, scale: 0.6, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 18 }}
        className={cn(
          "fixed right-3.5 z-50 flex items-center gap-2.5 rounded-full bg-wa font-extrabold text-white shadow-[0_16px_30px_-12px_rgba(37,211,102,.7)] transition-[bottom] duration-500 sm:right-[22px] sm:py-[9px] sm:pr-[18px] sm:pl-[9px] sm:text-[0.9rem]",
          showBar ? "bottom-[124px] sm:bottom-[132px]" : "bottom-4 sm:bottom-[22px]",
        )}
      >
        <span className="grid size-[54px] place-items-center rounded-full bg-wa sm:size-[38px] sm:bg-white">
          <WhatsAppIcon className="size-7 fill-white sm:size-[22px] sm:fill-wa" />
        </span>
        <span className="max-sm:hidden">Join the community</span>
      </motion.a>

      <AnimatePresence>
        {showBar && (
          <motion.div
            key="cta-bar"
            initial={{ y: 140, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 140, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
            className="pointer-events-none fixed inset-x-3 bottom-3 z-45 flex justify-center sm:bottom-5"
          >
            <div className="pointer-events-auto flex w-full flex-col gap-2 rounded-[20px] border border-[rgba(127,224,209,.3)] bg-[linear-gradient(135deg,rgba(1,67,49,.82),rgba(14,124,112,.58))] p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,.14),0_24px_50px_-20px_rgba(1,67,49,.6)] backdrop-blur-xl backdrop-saturate-150 sm:w-[max(360px,calc((min(100vw,1280px)-2*clamp(16px,3vw,32px)-20px)*.375))] sm:px-4 sm:py-3">
              {/* phones: secondary text above the button */}
              <p className="text-center text-[0.74rem] font-bold tracking-[0.02em] text-white sm:hidden">
                Class 11–12 · 28 Nov · ₹0
              </p>

              <div className="flex w-full flex-col items-center gap-1.5">
                <a
                  href="#register"
                  className={buttonVariants({
                    variant: "amber",
                    size: "pill-sm",
                    className: "w-full py-3 text-[0.9rem] lg:text-[0.95rem]",
                  })}
                >
                  Take the Free Career Olympiad <ArrowRight className="size-4" />
                </a>
                <p className="hidden items-center gap-1.5 text-[0.72rem] font-semibold text-white sm:flex">
                  Starts in <Countdown />
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
