import Image from "next/image";
import { ArrowRight, CalendarDays, Clock, Flame, GraduationCap, IndianRupee, Monitor, Users } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Stagger, Tile } from "@/components/motion";
import { Wrap } from "@/components/site";
import { Countdown } from "@/components/hero/countdown";
import { Compass } from "@/components/hero/compass";
import { RegisterForm } from "@/components/hero/register-form";
import { EVENT, NAV } from "@/lib/content";
import { cn } from "@/lib/utils";

const FACTS = [
  { icon: Clock, text: "60 minutes" },
  { icon: Monitor, text: "Online" },
  { icon: IndianRupee, text: "₹0 fee" },
  { icon: Users, text: "20,000+ students" },
];

export function Hero() {
  return (
    <section id="s01" className="pb-8">
      <div className="sticky top-0 z-40 bg-navy text-[0.84rem] font-semibold text-[#C9D2E3]">
        <Wrap className="flex items-center justify-center gap-3 py-2">
          <Flame className="size-4 fill-amber text-amber" aria-hidden />
          <span className="max-sm:hidden">
            <b className="text-white">{EVENT.short}</b> starts in
          </span>
          <Countdown />
          <span className="max-sm:hidden">· {EVENT.dateLabel}</span>
        </Wrap>
      </div>

      <header>
        <Wrap className="flex items-center justify-between py-[22px]">
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

      <Wrap>
        <Stagger className="grid gap-3.5 sm:gap-5 lg:grid-cols-[minmax(0,1fr)_420px]" step={0.1}>
          <Tile pad="none" className="flex flex-col items-center px-[18px] pt-7 pb-6 text-center sm:px-11 sm:pt-10 sm:pb-[34px]">
            <div className="flex flex-wrap justify-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-mint px-3.5 py-[7px] text-[0.82rem] font-bold text-teal-deep">
                <CalendarDays className="size-[15px]" />
                {EVENT.dateLabel} · Class 11 &amp; 12 Commerce
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-cream px-3.5 py-[7px] text-[0.82rem] font-bold text-amber-ink">
                <GraduationCap className="size-[15px]" />
                Scholarships up to {EVENT.scholarship}
              </span>
            </div>
            <h1 className="mt-5 max-w-[22ch] text-[clamp(1.85rem,2.8vw,2.45rem)] leading-[1.12] font-extrabold tracking-[-0.03em] text-balance">
              Commerce has <em className="text-teal not-italic">100s</em> of careers. Which one is right for you?
            </h1>
            <div className="mt-2.5 text-[1.1rem] font-semibold text-teal">Discover your strengths. Explore your future.</div>
            <Compass />
            <div className="mt-[18px] text-[1.45rem] leading-[1.15] font-extrabold tracking-[-0.02em] text-navy">
              Which direction is yours?
              <b className="mt-2 block text-[0.8rem] tracking-[0.12em] text-teal">15 CAREER PATHS · 1 FREE OLYMPIAD</b>
            </div>
            <div className="mt-[18px] flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
              <a href="#register" className={buttonVariants({ variant: "brand", size: "pill" })}>
                Register Free <ArrowRight />
              </a>
              <a href="#s05" className={buttonVariants({ variant: "navy-outline", size: "pill" })}>
                Explore Career Paths
              </a>
            </div>
            <div className="mt-[26px] flex w-full flex-wrap justify-center gap-x-[18px] gap-y-2.5 border-t border-line pt-5 sm:gap-x-7">
              {FACTS.map(({ icon: Icon, text }) => (
                <span key={text} className="flex items-center gap-2 text-[0.95rem] font-bold text-navy">
                  <Icon className="size-[18px] text-teal" />
                  {text}
                </span>
              ))}
            </div>
          </Tile>

          <Tile id="register" pad="none" className="flex scroll-mt-16 flex-col px-5 py-6 sm:p-8">
            <h2 className="text-2xl font-extrabold tracking-[-0.02em]">Register free</h2>
            <p className="mt-1 text-[0.86rem] text-subtle">Takes under 2 minutes · confirmation on WhatsApp</p>
            <RegisterForm />
          </Tile>

          <Tile
            tone="amber"
            pad="none"
            className="flex flex-col items-start gap-2.5 p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-9 sm:py-7"
          >
            <div>
              <span className="eyebrow">Scholarships</span>
              <span className="mt-1.5 block text-[clamp(2.2rem,3.6vw,3rem)] leading-none font-extrabold tracking-[-0.04em]">
                <small className="mr-1.5 align-middle text-[0.38em] tracking-normal">up to</small>
                {EVENT.scholarship}
              </span>
            </div>
            <div className="max-w-[36ch] text-[0.95rem] font-semibold">
              For eligible students, towards graduation degree programmes. Top 10 also win digital watches.
              <br />
              <a href="#s12" className="mt-2.5 inline-flex border-b-2 border-navy font-extrabold text-navy">
                See all rewards →
              </a>
            </div>
          </Tile>

          <Tile tone="navy" pad="none" className="flex flex-col justify-center p-6 sm:px-8 sm:py-7">
            <span className="eyebrow">Olympiad day</span>
            <span className="mt-1.5 block text-[clamp(1.9rem,2.8vw,2.4rem)] leading-[1.05] font-extrabold tracking-[-0.03em] text-white">
              {EVENT.dateLabel}
            </span>
            <p className="mt-2 text-[0.9rem] font-semibold">Class 11 &amp; 12 Commerce · one free attempt</p>
          </Tile>
        </Stagger>
      </Wrap>
    </section>
  );
}
