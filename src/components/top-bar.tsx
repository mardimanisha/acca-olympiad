import { ArrowRight, Flame } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Wrap } from "@/components/site";
import { Countdown } from "@/components/hero/countdown";
import { EVENT } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Navy strip pinned to the top of the whole page: live countdown, plus the sticky CTA from
 * 640px up (phones get the bottom bar in `floating.tsx` instead).
 */
export function TopBar() {
  return (
    <div className="sticky top-0 z-40 bg-navy text-[0.84rem] font-semibold text-[#C9D2E3]">
      <Wrap className="flex items-center justify-center gap-4 py-2 sm:justify-between">
        <div className="flex items-center gap-3">
          <Flame className="size-4 fill-amber text-amber" aria-hidden />
          <span className="max-md:hidden">
            <b className="text-white">{EVENT.short}</b> starts in
          </span>
          <Countdown />
        </div>
        <div className="flex items-center gap-4 max-sm:hidden">
          <span className="whitespace-nowrap text-haze max-lg:hidden">Class 11–12 · 28 Nov · ₹0</span>
          <a
            href="#register"
            className={cn(buttonVariants({ variant: "amber", size: "pill-sm" }), "px-4 py-2 text-[0.84rem]")}
          >
            Take the Free Career Olympiad <ArrowRight className="size-3.5" />
          </a>
        </div>
      </Wrap>
    </div>
  );
}
