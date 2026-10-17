import Image from "next/image";
import { ArrowRight, Flame } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Wrap } from "@/components/site";
import { Countdown } from "@/components/hero/countdown";
import { EVENT, NAV } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Sticky top of the page: navy countdown strip (with the CTA from 640px up; phones get the bottom
 * bar in `floating.tsx`) and the site header below it.
 */
export function TopBar() {
  return (
    <div className="sticky top-0 z-40">
      <CountdownStrip />
      <SiteHeader />
    </div>
  );
}

function CountdownStrip() {
  return (
    <div className="bg-navy text-[0.84rem] font-semibold text-[#C9D2E3]">
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

function SiteHeader() {
  return (
    <header className="border-b border-line bg-canvas/90 backdrop-blur-md">
      <Wrap className="flex items-center justify-between py-2.5 sm:py-3">
        <a href="#s01" aria-label="ZSkillup home">
          <Image src="/zskillup-logo-black.png" alt="ZSkillup" width={95} height={32} className="h-8 w-auto" preload />
        </a>
        <nav className="hidden gap-1.5 rounded-full border border-line bg-white p-[5px] text-[0.93rem] font-semibold lg:flex">
          {NAV.map((n, i) => (
            <a
              key={n.href}
              href={n.href}
              className={cn(
                "rounded-full px-4 py-2 text-navy transition-colors hover:bg-mint",
                i === 0 && "bg-mint text-teal-deep",
              )}
            >
              {n.label}
            </a>
          ))}
        </nav>
        <a href="#register" className={cn(buttonVariants({ variant: "brand", size: "pill-sm" }), "max-sm:hidden")}>
          Register Free
        </a>
      </Wrap>
    </header>
  );
}
