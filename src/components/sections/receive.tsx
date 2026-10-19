import { ArrowRight, Award, BadgeIndianRupee, CalendarDays, Clock, FileChartColumn, IndianRupee, MessageSquareText, MonitorPlay, Network, Route } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { CountdownBlocks } from "@/components/hero/countdown";
import { Bar, Stagger, Tile } from "@/components/motion";
import { Section, SectionHead, Wrap } from "@/components/site";
import { EVENT } from "@/lib/content";
import { cn } from "@/lib/utils";

const MINI = [
  ["Accountancy", 82],
  ["Data & logic", 88],
  ["Economics", 74],
] as const;

const tile = "flex flex-col gap-3.5 [&_p]:m-0";
const h3 = "text-[1.15rem] leading-tight font-extrabold";

/** s04 — why the Olympiad is more than a test score, then what every student gets. */
export function Receive() {
  return (
    <Section id="s04">
      <Wrap>
        <SectionHead
          eyebrow="What students get"
          title="Walk Away With More Than Just a Score"
          intro="Every student who completes the National Commerce Olympiad receives:"
        />
        <Stagger className="grid gap-3.5 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          <Tile className={`${tile} sm:col-span-2`}>
            <span className="ic"><FileChartColumn /></span>
            <h3 className={h3}>Your Personalised Career Report</h3>
            <p>Understand your performance across different skill areas and identify career paths worth exploring.</p>
            <div className="mt-auto grid gap-2 rounded-2xl border border-line bg-canvas px-4 py-3.5">
              {MINI.map(([k, v], i) => (
                <div key={k} className="grid grid-cols-[96px_1fr_28px] items-center gap-2.5 text-[0.78rem] font-bold text-navy">
                  <span>{k}</span>
                  <Bar value={v} delay={0.2 + i * 0.12} />
                  <span className="text-right text-subtle">{v}</span>
                </div>
              ))}
            </div>
          </Tile>
          <Tile tone="mint" className={tile}>
            <span className="ic"><Network /></span>
            <h3 className={h3}>Career Pathway Recommendations</h3>
            <p>Explore pathways across accounting, finance, banking, consulting, business and professional qualifications.</p>
          </Tile>
          <Tile tone="navy" className={`${tile} lg:col-start-4 lg:row-span-2`}>
            <span className="ic"><Award /></span>
            <h3 className={h3}>Participation Certificate</h3>
            <p>Every student who successfully completes the Olympiad receives a digital certificate.</p>
            <div className="mt-auto rounded-2xl border-[3px] border-double border-amber bg-white px-4 py-[30px] text-center text-navy transition-transform duration-500 hover:-rotate-2 hover:scale-[1.03]">
              <small className="block text-[0.6rem] font-extrabold tracking-[0.14em] text-teal">CERTIFICATE OF PARTICIPATION</small>
              <b className="mt-2.5 mb-2 block text-[1.6rem] font-extrabold tracking-[-0.02em]">Your Name</b>
              <i className="text-[0.66rem] text-subtle not-italic">National Commerce Olympiad 2027 · ZSkillup</i>
            </div>
          </Tile>
          <Tile className={tile}>
            <span className="ic"><Route /></span>
            <h3 className={h3}>Career Roadmaps</h3>
            <p>See what you can study after Class 12, which qualifications may be relevant and how different career routes work.</p>
          </Tile>
          <Tile tone="mint" className={tile}>
            <span className="ic"><IndianRupee /></span>
            <h3 className={h3}>Salary &amp; Career Insights</h3>
            <p>Understand the kinds of roles, industries and earning opportunities available across different finance and commerce careers.</p>
          </Tile>
          <Tile className={tile}>
            <span className="ic"><MessageSquareText /></span>
            <h3 className={h3}>Career Counselling</h3>
            <p>Get guidance to help you make sense of your report and explore your next steps.</p>
          </Tile>
          <Tile tone="mint" className={tile}>
            <span className="ic"><MonitorPlay /></span>
            <h3 className={h3}>Career Discovery Sessions</h3>
            <p>Attend expert-led sessions covering careers, qualifications, college choices and the changing world of finance.</p>
          </Tile>
          <Tile tone="teal" className="flex flex-col gap-5 sm:col-span-2 lg:col-span-3">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
              <div>
                <span className="eyebrow">Olympiad starts in</span>
                <p className="mt-1.5 max-w-[26ch] text-[1.05rem] font-semibold text-white">
                  Register free and get your personalised career report.
                </p>
              </div>
              <CountdownBlocks className="grid grid-cols-4 gap-2 sm:gap-3 lg:min-w-[380px]" />
            </div>
            <div className="mt-auto flex flex-col gap-3 border-t border-white/15 pt-5 lg:flex-row lg:items-center lg:justify-between">
              <dl className="grid grid-cols-3 gap-2 sm:gap-3">
                {[
                  { icon: CalendarDays, k: "Date", v: EVENT.dateLabel },
                  { icon: Clock, k: "Duration", v: "60 minutes" },
                  { icon: BadgeIndianRupee, k: "Fee", v: "Free" },
                ].map(({ icon: Icon, k, v }) => (
                  <div key={k} className="rounded-xl bg-white/10 px-3 py-2.5">
                    <dt className="flex items-center gap-1.5 text-[0.66rem] font-extrabold tracking-[0.12em] text-aqua uppercase">
                      <Icon className="size-3.5" /> {k}
                    </dt>
                    <dd className="mt-0.5 text-[0.95rem] font-bold whitespace-nowrap text-white">{v}</dd>
                  </div>
                ))}
              </dl>
              <a href="#register" className={cn(buttonVariants({ variant: "amber", size: "pill" }), "max-lg:w-full")}>
                Get My Career Report <ArrowRight />
              </a>
            </div>
          </Tile>
        </Stagger>
      </Wrap>
    </Section>
  );
}
