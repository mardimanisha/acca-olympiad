import Image from "next/image";
import { CalendarDays, Clock, Compass as CompassIcon, FileChartColumn, GraduationCap, Users } from "lucide-react";
import { Stagger, Tile } from "@/components/motion";
import { Wrap } from "@/components/site";
import { Compass } from "@/components/hero/compass";
import { RegisterForm } from "@/components/hero/register-form";
import { EVENT } from "@/lib/content";

const OFFER = [
  { icon: Clock, text: "1 Free 60-Minute Assessment" },
  { icon: CompassIcon, text: "15+ Career Paths" },
  { icon: FileChartColumn, text: "Your Personalised Career Report" },
];

export function Hero() {
  return (
    <section id="s01" className="pt-1 pb-6 sm:pt-1.5">

      <Wrap>
        <div className="relative mb-4 flex flex-col items-center text-center sm:mb-6">
          <h1 className="text-[clamp(1.27rem,3.35vw,2.4rem)] leading-[1.05] font-black tracking-[-0.04em] text-balance text-navy">
            <Image
              src="/zskillup-logo-black.png"
              alt="ZSkillup"
              width={95}
              height={32}
              className="mr-1 inline-block h-[1.38em] w-auto translate-y-[0.22em] align-baseline"
            />{" "}
            <span className="bg-gradient-to-r from-teal via-teal-deep to-teal bg-clip-text text-transparent">
              National Commerce
            </span>{" "}
            <span className="relative inline-block">
              Olympiad
              <svg
                aria-hidden
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
                className="absolute -bottom-2 left-0 h-2.5 w-full text-amber sm:h-3"
              >
                <path
                  d="M2 8 Q 27 1 52 7 T 102 7 T 152 7 T 198 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>
        </div>
        <Stagger className="grid gap-3.5 sm:gap-5 lg:grid-cols-[minmax(0,1fr)_420px] lg:grid-rows-[minmax(max(640px,calc(100svh-140px)),auto)_auto]" step={0.1}>
          <Tile pad="none" className="flex min-h-[calc(100svh-130px)] flex-col items-center px-[18px] pt-5 pb-5 text-center sm:min-h-[max(600px,calc(100svh-140px))] sm:px-11 sm:pt-8 sm:pb-7 lg:min-h-0">
            <div className="flex flex-wrap justify-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-mint px-3.5 py-[7px] text-[0.82rem] font-bold text-teal-deep">
                <Users className="size-[15px]" />
                For Commerce Students
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-cream px-3 py-[7px] text-[0.76rem] font-bold whitespace-nowrap text-amber-ink sm:px-3.5 sm:text-[0.82rem]">
                <CalendarDays className="size-[15px]" />
                {EVENT.dateLong} · Online · Completely Free
              </span>
            </div>
            <h2 className="mt-5 max-w-[30ch] text-2xl leading-[1.2] font-extrabold tracking-[-0.02em] text-balance lg:text-[1.35rem]">
              Confused About What to Do After <em className="text-teal not-italic">12th Commerce</em>?
            </h2>
            <p className="mt-4 max-w-[52ch] text-[0.98rem]">
              Take the National Commerce Olympiad and discover the career paths worth exploring based on your strengths,
              interests and aptitude.
            </p>
            <div className="relative mt-3 min-h-[150px] w-full flex-1 sm:mt-4 sm:min-h-[220px]">
              <Compass />
            </div>
            <ul className="mt-3 flex-col items-center gap-2 max-sm:hidden sm:flex sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-5">
              {OFFER.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-1.5 text-[0.92rem] font-bold whitespace-nowrap text-navy">
                  <Icon className="size-[18px] text-teal" />
                  {text}
                </li>
              ))}
            </ul>
            <div className="mt-[22px] w-full border-t border-line pt-5 sm:mt-4 sm:pt-4">
              <p className="flex items-center justify-center gap-2 text-[0.95rem] font-bold text-navy">
                <GraduationCap className="size-[18px] flex-none text-amber" />
                Scholarships up to {EVENT.scholarship} + Certificate for Every Participant*
              </p>
              <p className="note-s mt-1.5">*Scholarships for eligible students, subject to published terms.</p>
            </div>
          </Tile>

          <Tile id="register" pad="none" className="flex scroll-mt-20 flex-col px-5 py-6 sm:p-8 lg:p-7">
            <h2 className="text-2xl font-extrabold tracking-[-0.02em] lg:text-[1.35rem]">Register Free</h2>
            <p className="mt-1 text-[0.86rem] text-subtle">Takes under 2 minutes · Confirmation on WhatsApp</p>
            <RegisterForm />
          </Tile>

          <div className="grid min-w-0 gap-3.5 sm:grid-cols-3 sm:gap-5">
            <Tile
              tone="amber"
              pad="none"
              className="flex flex-col items-start justify-between gap-2.5 p-6 lg:px-[26px]"
            >
              <span className="eyebrow">Scholarships</span>
              <span className="block text-[clamp(1.7rem,2.6vw,2.2rem)] leading-none font-extrabold tracking-[-0.04em]">
                <small className="mr-1.5 align-middle text-[0.38em] tracking-normal">up to</small>
                {EVENT.scholarship}
              </span>
              <div className="text-[0.95rem] font-semibold">
                For eligible students, towards graduation degree programmes.
                <br />
                <a href="#s12" className="mt-2.5 inline-flex border-b-2 border-navy font-extrabold text-navy">
                  See all rewards →
                </a>
              </div>
            </Tile>
            <Tile
              tone="teal"
              pad="none"
              className="flex flex-col items-start justify-between gap-2.5 p-6 lg:px-[26px]"
            >
              <span className="eyebrow">Top 10 participants</span>
              <span className="block text-[clamp(1.7rem,2.6vw,2.2rem)] leading-none font-extrabold tracking-[-0.04em] text-white">
                Digital watches
              </span>
              <div className="text-[0.95rem] font-semibold">For the top ten performers.</div>
            </Tile>
            <Tile pad="none" className="flex flex-col items-start justify-between gap-2.5 p-6 lg:px-[26px]">
              <span className="eyebrow">Every participant</span>
              <span className="block text-[clamp(1.7rem,2.6vw,2.2rem)] leading-none font-extrabold tracking-[-0.04em] text-navy">
                Certificate
              </span>
              <div className="text-[0.95rem] font-semibold">Digital participation certificate.</div>
            </Tile>
          </div>

          <Tile tone="navy" pad="none" className="flex flex-col justify-center p-6 sm:px-8 sm:py-7">
            <span className="eyebrow">Olympiad day</span>
            <span className="mt-1.5 block text-[clamp(1.9rem,2.8vw,2.4rem)] leading-[1.05] font-extrabold tracking-[-0.03em] text-white">
              {EVENT.dateLabel}
            </span>
            <p className="mt-2 text-[0.9rem] font-semibold">Commerce Students · one free attempt</p>
          </Tile>
        </Stagger>
      </Wrap>
    </section>
  );
}
