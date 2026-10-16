"use client";

import { motion } from "motion/react";
import { buttonVariants } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/mascots";
import { EVENT } from "@/lib/content";

/** Floating WhatsApp community button and the mobile sticky Register bar. */
export function FloatingActions() {
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
        className="fixed right-3.5 bottom-[84px] z-50 flex items-center gap-2.5 rounded-full bg-wa font-extrabold text-white shadow-[0_16px_30px_-12px_rgba(37,211,102,.7)] sm:right-[22px] sm:bottom-[22px] sm:py-[9px] sm:pr-[18px] sm:pl-[9px] sm:text-[0.9rem]"
      >
        <span className="grid size-[54px] place-items-center rounded-full bg-wa sm:size-[38px] sm:bg-white">
          <WhatsAppIcon className="size-7 fill-white sm:size-[22px] sm:fill-wa" />
        </span>
        <span className="max-sm:hidden">Join the community</span>
      </motion.a>

      <motion.div
        initial={{ y: 120 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 200, damping: 24 }}
        className="fixed inset-x-3 bottom-3 z-45 flex items-center justify-between gap-2.5 rounded-[18px] bg-navy py-2.5 pr-2.5 pl-4 shadow-[0_18px_40px_-12px_rgba(11,26,61,.6)] sm:hidden"
      >
        <div>
          <b className="block text-[0.9rem] leading-tight text-white">NCO 2027 · Free</b>
          <small className="text-[0.7rem] font-semibold whitespace-nowrap text-haze">28 Nov · Scholarships up to {EVENT.scholarship}</small>
        </div>
        <a href="#register" className={buttonVariants({ variant: "amber", size: "pill-sm", className: "px-3.5 py-3 text-[0.86rem]" })}>
          Register Free
        </a>
      </motion.div>
    </>
  );
}
