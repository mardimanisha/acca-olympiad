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
    <section id="s01" className="pt-4 pb-6 sm:pt-6">

      <Wrap>
        <Stagger className="grid gap-3.5 sm:gap-5 lg:grid-cols-[minmax(0,1fr)_420px]" step={0.1}>
          <Tile pad="none" className="flex flex-col items-center px-[18px] pt-7 pb-6 text-center sm:px-11 sm:pt-10 sm:pb-[34px]">
            <div className="flex flex-wrap justify-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-mint px-3.5 py-[7px] text-[0.82rem] font-bold text-teal-deep">
                <Users className="size-[15px]" />
                For Class 11 &amp; 12 Commerce Students
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-cream px-3 py-[7px] text-[0.76rem] font-bold whitespace-nowrap text-amber-ink sm:px-3.5 sm:text-[0.82rem]">
                <CalendarDays className="size-[15px]" />
                {EVENT.dateLong} · Online · Completely Free
              </span>
            </div>
            <h1 className="mt-5 max-w-[22ch] text-[clamp(1.85rem,2.8vw,2.45rem)] leading-[1.12] font-extrabold tracking-[-0.03em] text-balance">
              Confused About What to Do After <em className="text-teal not-italic">12th Commerce</em>?
            </h1>
            <p className="mt-4 max-w-[52ch] text-[0.98rem]">
              Take the National Commerce Olympiad and discover the career paths worth exploring based on your strengths,
              interests and aptitude.
            </p>
            <Compass />
            <ul className="mt-[18px] flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-5">
              {OFFER.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-1.5 text-[0.92rem] font-bold whitespace-nowrap text-navy">
                  <Icon className="size-[18px] text-teal" />
                  {text}
                </li>
              ))}
            </ul>
            <div className="mt-[22px] w-full border-t border-line pt-5">
              <p className="flex items-center justify-center gap-2 text-[0.95rem] font-bold text-navy">
                <GraduationCap className="size-[18px] flex-none text-amber" />
                Scholarships up to {EVENT.scholarship} + Certificate for Every Participant*
              </p>
              <p className="note-s mt-1.5">*Scholarships for eligible students, subject to published terms.</p>
            </div>
          </Tile>

          <Tile id="register" pad="none" className="flex scroll-mt-28 flex-col px-5 py-6 sm:scroll-mt-32 sm:p-8">
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
