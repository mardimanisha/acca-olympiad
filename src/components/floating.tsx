"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Share2 } from "lucide-react";
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

/** Native share sheet where available; otherwise a prefilled WhatsApp message. */
async function shareWithPeers() {
  const data = { title: document.title, text: "Check out this Olympiad — worth a look!", url: "https://acca-olympiad.vercel.app/" };
  try {
    if (navigator.share) await navigator.share(data);
    else window.open(`https://wa.me/?text=${encodeURIComponent(`${data.text} ${data.url}`)}`, "_blank", "noopener");
  } catch {
    // share cancelled
  }
}

/** Bottom-centre sticky CTA (button + countdown) and the WhatsApp community button. */
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
          "fixed right-3.5 z-50 flex items-center gap-2.5 rounded-full bg-wa font-extrabold text-white shadow-[0_16px_30px_-12px_rgba(37,211,102,.7)] transition-[bottom] duration-500 sm:right-[22px] sm:w-[220px] sm:py-[9px] sm:pr-[18px] sm:pl-[9px] sm:text-[0.9rem]",
          showBar ? "bottom-[104px] sm:bottom-[132px] lg:bottom-[22px]" : "bottom-4 sm:bottom-[22px]",
        )}
      >
        <span className="grid size-[54px] place-items-center rounded-full bg-wa sm:size-[38px] sm:bg-white">
          <WhatsAppIcon className="size-7 fill-white sm:size-[22px] sm:fill-wa" />
        </span>
        <span className="max-sm:hidden">Join the community</span>
      </motion.a>

      <motion.button
        type="button"
        onClick={shareWithPeers}
        aria-label="Share with peers"
        initial={{ opacity: 0, scale: 0.6, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ delay: 1.35, type: "spring", stiffness: 260, damping: 18 }}
        className={cn(
          "fixed right-3.5 z-50 flex cursor-pointer items-center gap-2.5 rounded-full bg-navy font-extrabold text-white shadow-[0_16px_30px_-12px_rgba(11,26,61,.6)] transition-[bottom] duration-500 sm:right-[22px] sm:w-[220px] sm:py-[9px] sm:pr-[18px] sm:pl-[9px] sm:text-[0.9rem]",
          showBar ? "bottom-[170px] sm:bottom-[200px] lg:bottom-[90px]" : "bottom-[82px] sm:bottom-[90px]",
        )}
      >
        <span className="grid size-[54px] place-items-center rounded-full bg-navy sm:size-[38px] sm:bg-white">
          <Share2 className="size-6 text-white sm:size-5 sm:text-navy" />
        </span>
        <span className="max-sm:hidden">Share with peers</span>
      </motion.button>

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
            <div className="pointer-events-auto flex w-full flex-col rounded-[20px] border border-[rgba(127,224,209,.3)] bg-[linear-gradient(135deg,rgba(1,67,49,.82),rgba(14,124,112,.58))] p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,.14),0_24px_50px_-20px_rgba(1,67,49,.6)] backdrop-blur-xl backdrop-saturate-150 sm:w-[max(420px,calc((min(100vw,1280px)-2*clamp(16px,3vw,32px)-20px)*.375))] sm:min-h-[100px] sm:justify-center sm:px-4 sm:py-3">
              <div className="flex w-full items-center gap-2 min-[360px]:gap-3">
                <a
                  href="#register"
                  className={buttonVariants({
                    variant: "amber",
                    size: "pill-sm",
                    className: "shrink-0 px-3.5 py-3 text-[0.84rem] min-[360px]:px-4 min-[360px]:text-[0.88rem] sm:px-6 sm:text-[0.9rem] lg:text-[0.95rem]",
                  })}
                >
                  Register Now <ArrowRight className="size-4 max-[359px]:hidden" />
                </a>
                <div className="ml-auto flex flex-col items-center gap-1 whitespace-nowrap text-white">
                  <span className="text-[0.68rem] font-semibold sm:text-[0.72rem]">Starts in</span>
                  <div className="text-[1rem] min-[360px]:text-[1.15rem] sm:text-[1.5rem]">
                    <Countdown showSeconds={false} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
