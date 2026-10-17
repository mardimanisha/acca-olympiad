"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
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
        className="fixed right-3.5 bottom-[116px] z-50 flex items-center gap-2.5 rounded-full bg-wa font-extrabold text-white shadow-[0_16px_30px_-12px_rgba(37,211,102,.7)] sm:right-[22px] sm:bottom-[22px] sm:py-[9px] sm:pr-[18px] sm:pl-[9px] sm:text-[0.9rem]"
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
        className="fixed inset-x-3 bottom-3 z-45 flex flex-col gap-1.5 rounded-[18px] bg-navy p-2.5 pt-2 shadow-[0_18px_40px_-12px_rgba(11,26,61,.6)] sm:hidden"
      >
        <small className="text-center text-[0.74rem] font-bold tracking-[0.02em] text-haze">Class 11–12 · 28 Nov · ₹0</small>
        <a
          href="#register"
          className={buttonVariants({ variant: "amber", size: "pill-sm", className: "w-full py-3 text-[0.9rem]" })}
        >
          Take the Free Career Olympiad <ArrowRight className="size-4" />
        </a>
      </motion.div>
    </>
  );
}
