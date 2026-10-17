import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Bar, Stagger, Tile } from "@/components/motion";
import { Section, SectionHead, Wrap } from "@/components/site";
import { cn } from "@/lib/utils";

const SCORES = [
  ["Accountancy", 82],
  ["Quant", 68],
  ["Economics", 74],
  ["Data & logic", 88],
  ["Communication", 61],
] as const;

const PATHWAYS = [
  "Accounting & Audit",
  "Corporate Finance",
  "Financial Analysis",
  "Investment Research",
  "Banking & Financial Services",
  "Risk & Treasury",
];

const PLAN = [
  ["Next 3 months", "Research careers & qualifications"],
  ["6 months", "Build relevant skills"],
  ["12 months", "Shortlist your next step"],
] as const;

const num = "grid size-[38px] flex-none place-items-center rounded-[11px] bg-mint text-[0.82rem] font-extrabold text-teal-deep";
const h3 = "text-[1.15rem] leading-snug font-extrabold";

/** s10 — what the personalised report helps a student understand, in three parts. */
export function Report() {
  return (
    <Section id="s10">
      <Wrap>
        <SectionHead
          eyebrow="Sample career report"
          title="Your Result Should Answer More Than “How Much Did I Score?”"
          intro="After the Olympiad, you'll receive a personalised report designed to help you understand three things:"
        />
        <Stagger className="grid gap-3.5 sm:gap-5 lg:grid-cols-3">
          <Tile className="flex flex-col gap-3.5">
            <span className={num}>01</span>
            <h3 className={h3}>Where Are You Strong?</h3>
            <p>
              See how you performed across areas such as Accountancy, Quantitative Aptitude, Economics, Data &amp; Logic
              and Communication.
            </p>
            <div className="mt-auto grid gap-1.5 rounded-2xl border border-line bg-canvas px-4 py-3.5">
              {SCORES.map(([k, v], i) => (
                <div key={k} className="grid grid-cols-[96px_1fr_26px] items-center gap-2 text-[0.76rem] font-bold text-navy">
                  <span>{k}</span>
                  <Bar value={v} delay={0.15 + i * 0.1} />
                  <span className="text-right text-subtle">{v}</span>
                </div>
              ))}
            </div>
          </Tile>

          <Tile tone="mint" className="flex flex-col gap-3.5">
            <span className={cn(num, "bg-white")}>02</span>
            <h3 className={h3}>Which Careers Should You Explore?</h3>
            <p>
              Based on your responses and performance, discover career pathways that may be worth learning more about.
            </p>
            <div className="mt-auto">
              <small className="text-[0.7rem] font-extrabold tracking-[0.12em] text-teal-deep uppercase">For example</small>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {PATHWAYS.map((p) => (
                  <li key={p} className="rounded-full border border-mint-line bg-white px-3 py-1.5 text-[0.8rem] font-bold text-navy">
                    {p}
                  </li>
                ))}
                <li className="px-1.5 py-1.5 text-[0.8rem] font-bold text-teal-deep">and more.</li>
              </ul>
            </div>
          </Tile>

          <Tile className="flex flex-col gap-3.5">
            <span className={num}>03</span>
            <h3 className={h3}>What Could You Do Next?</h3>
            <p>
              Your report will help you understand possible next steps over the coming months, from researching
              qualifications and careers to building relevant skills.
            </p>
            <ol className="mt-auto grid gap-2">
              {PLAN.map(([k, v]) => (
                <li key={k} className="rounded-xl bg-mint px-3.5 py-2.5 text-[0.85rem] font-semibold text-navy">
                  <b className="block text-[0.64rem] tracking-widest text-teal-deep uppercase">{k}</b>
                  {v}
                </li>
              ))}
            </ol>
          </Tile>

          <Tile
            tone="navy"
            className="flex flex-col gap-5 lg:col-span-3 lg:flex-row lg:items-center lg:justify-between lg:gap-10"
          >
            <div>
              <p className="text-[clamp(1.1rem,1.7vw,1.3rem)] leading-snug font-extrabold text-white">
                The objective isn&apos;t to decide your entire life from one test.
              </p>
              <p className="mt-1 text-[1.02rem] font-semibold text-aqua">It&apos;s to make your next decision more informed.</p>
            </div>
            <a href="#register" className={cn(buttonVariants({ variant: "amber", size: "pill" }), "max-lg:w-full")}>
              I Want My Career Report <ArrowRight />
            </a>
          </Tile>
        </Stagger>
        <p className="note-s mt-4">
          The report supports exploration. It is not a definitive aptitude diagnosis or a guarantee of career fit.
        </p>
      </Wrap>
    </Section>
  );
}
