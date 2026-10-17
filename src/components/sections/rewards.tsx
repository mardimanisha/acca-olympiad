import { ArrowRight, GraduationCap } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Stagger, Tile } from "@/components/motion";
import { Section, SectionHead, Wrap } from "@/components/site";
import { EVENT } from "@/lib/content";
import { cn } from "@/lib/utils";

/** s12 — scholarships, watches and certificates, framed as a bonus to career clarity. */
export function Rewards() {
  return (
    <Section id="s12">
      <Wrap>
        <SectionHead eyebrow="Rewards & scholarships" title="Your Career Clarity Comes First. The Rewards Are a Bonus." />
        <Stagger className="grid gap-3.5 sm:gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <Tile
            tone="amber"
            pad="none"
            className="relative flex min-h-[340px] flex-col justify-end gap-2 overflow-hidden p-[26px] sm:min-h-[420px] sm:p-[34px] lg:row-span-2"
          >
            <span className="absolute -top-[150px] -right-[120px] size-[260px] rounded-full bg-white/18 sm:-top-20 sm:-right-20 sm:size-[340px]" />
            <span className="absolute top-[26px] left-[26px] grid size-16 place-items-center rounded-[18px] bg-navy text-amber sm:top-[34px] sm:left-[34px]">
              <GraduationCap className="size-8" />
            </span>
            <span className="eyebrow relative">Scholarships</span>
            <span className="relative text-[clamp(3rem,6vw,5.2rem)] leading-none font-extrabold tracking-[-0.04em]">
              <small className="mr-2 align-middle text-[0.3em] tracking-normal">up to</small>
              {EVENT.scholarship}
              <sup className="ml-1 align-super text-[0.35em]">*</sup>
            </span>
            <p className="relative max-w-[40ch] text-[1.05rem] font-semibold">
              Top-performing eligible students can receive scholarships of up to {EVENT.scholarship} toward selected
              graduation programs.
            </p>
          </Tile>
          <Tile tone="teal" pad="none" className="flex flex-col gap-2 p-[26px] sm:p-[34px]">
            <span className="eyebrow">Rewards for top performers</span>
            <span className="text-[clamp(2.2rem,3.6vw,3rem)] leading-none font-extrabold tracking-[-0.04em] text-white">
              Digital watches
            </span>
            <p className="font-semibold">The Top 10 performers will receive digital watches.</p>
          </Tile>
          <Tile pad="none" className="flex flex-col gap-2 p-[26px] text-navy sm:p-[34px]">
            <span className="eyebrow">Certificate for every participant</span>
            <span className="text-[clamp(2.2rem,3.6vw,3rem)] leading-none font-extrabold tracking-[-0.04em]">Certificate</span>
            <p className="font-semibold">
              Successfully complete the Olympiad and receive your National Commerce Olympiad Participation Certificate.
            </p>
          </Tile>
          <Tile
            tone="navy"
            className="flex flex-col gap-5 lg:col-span-2 lg:flex-row lg:items-center lg:justify-between lg:gap-10"
          >
            <div>
              <span className="eyebrow">And most importantly</span>
              <p className="mt-2 max-w-[60ch] text-[clamp(1.05rem,1.6vw,1.25rem)] leading-snug font-bold text-white">
                Every participant gets access to career insights that can help them make a better-informed decision after
                Class 12.
              </p>
            </div>
            <a href="#register" className={cn(buttonVariants({ variant: "amber", size: "pill" }), "max-lg:w-full")}>
              Participate for Free <ArrowRight />
            </a>
          </Tile>
        </Stagger>
        <p className="note-s mt-4">*Scholarship eligibility and applicable programs are subject to terms and conditions.</p>
      </Wrap>
    </Section>
  );
}
