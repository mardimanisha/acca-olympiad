import Image from "next/image";
import { Award, BookOpen, Briefcase, Compass } from "lucide-react";
import { Stagger, Tile } from "@/components/motion";
import { Section, Wrap } from "@/components/site";

const PILLARS = [
  { icon: BookOpen, title: "Commerce education", tone: "mint" },
  { icon: Award, title: "Professional qualifications", tone: "navy" },
  { icon: Briefcase, title: "Employability", tone: "white" },
  { icon: Compass, title: "Career readiness", tone: "mint" },
] as const;

/** s13 — about ZSkillup. */
export function About() {
  return (
    <Section id="s13">
      <Wrap>
        <Stagger className="grid gap-3.5 sm:grid-cols-2 sm:gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,.9fr)_minmax(0,.9fr)]">
          <Tile pad="none" className="flex flex-col justify-center p-[26px] sm:col-span-2 sm:p-[38px] lg:col-span-1 lg:row-span-2">
            <Image src="/zskillup-logo-black.png" alt="ZSkillup" width={101} height={34} className="h-[34px] w-auto self-start" />
            <h2 className="h-sub mt-[22px]">Helping commerce students choose with clarity.</h2>
            <p className="mt-3.5 text-[1.02rem]">
              ZSkillup works across commerce education, professional qualifications, employability and career readiness.
              The Olympiad helps students make informed decisions before choosing a degree or professional pathway.
            </p>
          </Tile>
          {PILLARS.map(({ icon: Icon, title, tone }) => (
            <Tile key={title} tone={tone} className="flex flex-col gap-3.5 sm:min-h-[170px]">
              <span className="ic"><Icon /></span>
              <h3 className="text-[1.15rem] font-extrabold sm:mt-auto">{title}</h3>
            </Tile>
          ))}
        </Stagger>
      </Wrap>
    </Section>
  );
}
