import { GraduationCap } from "lucide-react";
import { Stagger, Tile } from "@/components/motion";
import { Section, SectionHead, Wrap } from "@/components/site";
import { EVENT } from "@/lib/content";

/** s12 — scholarships, watches and certificates. */
export function Rewards() {
  return (
    <Section id="s12">
      <Wrap>
        <SectionHead eyebrow="Rewards & scholarships" title="Participate. Perform. Get rewarded." />
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
            </span>
            <p className="relative max-w-[34ch] text-[1.1rem] font-semibold">For eligible students, towards graduation degree programmes.</p>
            <span className="relative mt-[18px] max-w-[52ch] text-[0.76rem] opacity-85">
              A maximum, not a guaranteed award. Subject to published terms and selection criteria.
            </span>
          </Tile>
          <Tile tone="teal" pad="none" className="flex flex-col gap-2 p-[26px] sm:p-[34px]">
            <span className="eyebrow">Top 10 participants</span>
            <span className="text-[clamp(2.2rem,3.6vw,3rem)] leading-none font-extrabold tracking-[-0.04em] text-white">Digital watches</span>
            <p className="font-semibold">For the top ten performers.</p>
            <span className="mt-auto pt-3.5 text-[0.76rem] opacity-85">Ranking rules to be published.</span>
          </Tile>
          <Tile pad="none" className="flex flex-col gap-2 p-[26px] text-navy sm:p-[34px]">
            <span className="eyebrow">Every participant</span>
            <span className="text-[clamp(2.2rem,3.6vw,3rem)] leading-none font-extrabold tracking-[-0.04em]">Certificate</span>
            <p className="font-semibold">Digital participation certificate.</p>
            <span className="mt-auto pt-3.5 text-[0.76rem] opacity-85">Subject to final participation rules.</span>
          </Tile>
        </Stagger>
      </Wrap>
    </Section>
  );
}
