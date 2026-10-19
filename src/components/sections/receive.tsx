import { ArrowRight, Award, BadgeIndianRupee, CalendarDays, Clock, FileChartColumn, GraduationCap, IndianRupee, MessageSquareText, MonitorPlay, Network, Route, Watch } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { CountdownBlocks } from "@/components/hero/countdown";
import { Bar, Stagger, Tile } from "@/components/motion";
import { Section, SectionHead, Wrap } from "@/components/site";
import { EVENT } from "@/lib/content";
import { cn } from "@/lib/utils";

const MINI = [
  ["Accounting & Reporting", 82],
  ["Audit & Tax", 76],
  ["Costing & Business Finance", 79],
  ["Law & Governance", 68],
  ["Global / International Orientation", 72],
  ["Business Decision-Making", 85],
  ["Numerical & Analytical Orientation", 88],
  ["Communication / Advisory", 74],
] as const;

const tile = "flex flex-col gap-3.5 [&_p]:m-0";
const h3 = "text-[1.15rem] leading-tight font-extrabold";

/** s12 — what every student gets, plus scholarships and watches for top performers. Anchor kept as s12 for existing "Rewards" links. */
export function Receive() {
  return (
    <Section id="s12">
      <Wrap>
        <SectionHead
          eyebrow="What students get · Rewards & scholarships"
          title="Walk Away With More Than Just a Score"
          intro="Career clarity comes first. Every student who completes the National Commerce Olympiad receives the following, and top performers earn rewards on top."
        />
        <Stagger className="grid gap-3.5 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          <Tile tone="navy" className={`${tile} lg:col-start-4 lg:row-start-1 lg:row-span-2`}>
            <span className="ic"><Award /></span>
            <h3 className={h3}>Participation Certificate</h3>
            <p>Every student who successfully completes the Olympiad receives a digital certificate.</p>
            <div className="mt-auto rounded-2xl border-[3px] border-double border-amber bg-white px-4 py-[30px] text-center text-navy transition-transform duration-500 hover:-rotate-2 hover:scale-[1.03]">
              <small className="block text-[0.6rem] font-extrabold tracking-[0.14em] text-teal">CERTIFICATE OF PARTICIPATION</small>
              <b className="mt-2.5 mb-2 block text-[1.6rem] font-extrabold tracking-[-0.02em]">Your Name</b>
              <i className="text-[0.66rem] text-subtle not-italic">National Commerce Olympiad 2027 · ZSkillup</i>
            </div>
          </Tile>
          <Tile tone="teal" className={tile}>
            <span className="ic"><Watch /></span>
            <h3 className={h3}>Digital Watches</h3>
            <p>The Top 10 performers will receive digital watches.</p>
          </Tile>
          <Tile
            tone="amber"
            pad="none"
            className="relative flex flex-col justify-center gap-2 overflow-hidden p-[22px] sm:col-span-2 sm:p-[26px]"
          >
            <span className="absolute -top-[120px] -right-[100px] size-[220px] rounded-full bg-white/18" />
            <span className="relative flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-[14px] bg-navy text-amber">
                <GraduationCap className="size-5" />
              </span>
              <span className="eyebrow">Scholarships</span>
            </span>
            <span className="relative text-[clamp(2.2rem,4vw,3.2rem)] leading-none font-extrabold tracking-[-0.04em]">
              <small className="mr-2 align-middle text-[0.3em] tracking-normal">up to</small>
              {EVENT.scholarship}
              <sup className="ml-1 align-super text-[0.35em]">*</sup>
            </span>
            <p className="relative max-w-[40ch] font-semibold">
              Top-performing eligible students can receive scholarships toward selected graduation programs.
            </p>
          </Tile>
          <Tile className={`${tile} sm:col-span-2`}>
            <span className="ic"><FileChartColumn /></span>
            <h3 className={h3}>Your Personalised Career Report</h3>
            <p>Understand your performance across different skill areas and identify career paths worth exploring.</p>
            <div className="mt-auto grid gap-x-6 gap-y-3 rounded-2xl border border-line bg-canvas px-4 py-3.5 sm:grid-cols-2">
              {MINI.map(([k, v], i) => (
                <div key={k} className="grid gap-1 text-[0.78rem] font-bold text-navy">
                  <div className="flex items-baseline justify-between gap-2">
                    <span>{k}</span>
                    <span className="text-subtle">{v}</span>
                  </div>
                  <Bar value={v} delay={0.2 + i * 0.08} />
                </div>
              ))}
            </div>
          </Tile>
          <Tile tone="mint" className={tile}>
            <span className="ic"><Network /></span>
            <h3 className={h3}>Career Pathway Recommendations</h3>
            <p>Explore pathways across accounting, finance, banking, consulting, business and professional qualifications.</p>
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
          <Tile tone="teal" className="flex flex-col gap-5 sm:col-span-2 lg:col-span-4">
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
        <p className="note-s mt-4">*Scholarship eligibility and applicable programs are subject to terms and conditions.</p>
      </Wrap>
    </Section>
  );
}
