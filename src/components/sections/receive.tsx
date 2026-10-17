import { Award, Check, FileChartColumn, IndianRupee, MessageSquareText, MonitorPlay, Network } from "lucide-react";
import { Bar, FadeIn, Stagger, StrikeLine, Tile } from "@/components/motion";
import { Section, SectionHead, Wrap } from "@/components/site";

const MINI = [
  ["Accountancy", 82],
  ["Data & logic", 88],
  ["Economics", 74],
] as const;

const UNDERSTAND = [
  "What you're naturally stronger at.",
  "Which commerce and finance careers you should explore.",
  "What qualifications lead to those careers.",
  "What skills you should start building.",
  "And what your next step after Class 12 could look like.",
];

const tile = "flex flex-col gap-3.5 [&_p]:m-0";

/** s04 — why the Olympiad is more than a test score, then the six things every participant receives. */
export function Receive() {
  return (
    <Section id="s04">
      <Wrap>
        <SectionHead eyebrow="More than a score" title="This Is Not Just Another School Test." />
        <Stagger className="grid gap-3.5 sm:gap-5 lg:grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)]">
          <Tile className="flex flex-col justify-center gap-5">
            <p className="text-[1.02rem] font-semibold text-navy">Your result isn&apos;t meant to simply tell you:</p>
            <div className="self-start rounded-2xl border border-line bg-canvas px-6 py-5">
              <span className="relative inline-block text-[clamp(1.5rem,2.6vw,2.1rem)] leading-none font-extrabold tracking-[-0.02em] text-subtle">
                &ldquo;You scored 72/100.&rdquo;
                <StrikeLine />
              </span>
            </div>
          </Tile>
          <Tile tone="mint">
            <p className="text-[1.02rem] font-semibold text-navy">It is designed to help you understand:</p>
            <ul className="mt-4 grid gap-3">
              {UNDERSTAND.map((u) => (
                <li key={u} className="flex gap-3 text-[1rem] leading-snug font-bold text-navy">
                  <span className="mt-0.5 grid size-5 flex-none place-items-center rounded-full bg-teal text-white">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  {u}
                </li>
              ))}
            </ul>
          </Tile>
          <Tile
            tone="navy"
            className="flex flex-col gap-1.5 lg:col-span-2"
          >
            <h3 className="text-[clamp(1.15rem,1.8vw,1.4rem)] font-extrabold">
              You don&apos;t need to have your entire career figured out today.
            </h3>
            <p className="text-[1.02rem] font-semibold text-aqua">You just need a better starting point.</p>
          </Tile>
        </Stagger>

        <FadeIn className="mt-12 mb-[22px] flex flex-col items-start gap-1 sm:mt-16 sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <h3 className="text-[clamp(1.3rem,2vw,1.6rem)] font-extrabold tracking-[-0.02em]">What every participant receives</h3>
          <p className="max-w-[44ch] text-[1.02rem]">Six things every participant gets after the Olympiad, at no cost.</p>
        </FadeIn>
        <Stagger className="grid gap-3.5 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          <Tile className={`${tile} sm:col-span-2`}>
            <span className="ic"><FileChartColumn /></span>
            <h3 className="text-[1.15rem] leading-tight font-extrabold">Personalized career report</h3>
            <p>Your performance, strengths, interests and the pathways that may suit you, in one clear report.</p>
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
            <span className="ic"><IndianRupee /></span>
            <h3 className="text-[1.15rem] leading-tight font-extrabold">Career-wise salary insights</h3>
            <p>Indicative entry, mid-career and senior salary ranges for each path, so you can compare realistically.</p>
          </Tile>
          <Tile tone="navy" className={`${tile} lg:col-start-4 lg:row-span-2`}>
            <span className="ic"><Award /></span>
            <h3 className="text-[1.15rem] leading-tight font-extrabold">Participation certificate</h3>
            <p>A digital certificate for every participant of the National Commerce Olympiad 2027.</p>
            <div className="mt-auto rounded-2xl border-[3px] border-double border-amber bg-white px-4 py-[30px] text-center text-navy transition-transform duration-500 hover:-rotate-2 hover:scale-[1.03]">
              <small className="block text-[0.6rem] font-extrabold tracking-[0.14em] text-teal">CERTIFICATE OF PARTICIPATION</small>
              <b className="mt-2.5 mb-2 block text-[1.6rem] font-extrabold tracking-[-0.02em]">Your Name</b>
              <i className="text-[0.66rem] text-subtle not-italic">National Commerce Olympiad 2027 · ZSkillup</i>
            </div>
          </Tile>
          <Tile className={tile}>
            <span className="ic"><Network /></span>
            <h3 className="text-[1.15rem] leading-tight font-extrabold">Career pathway mapping</h3>
            <p>Degrees, professional qualifications, skills and alternative routes for each pathway.</p>
          </Tile>
          <Tile tone="mint" className={tile}>
            <span className="ic"><MessageSquareText /></span>
            <h3 className="text-[1.15rem] leading-tight font-extrabold">Career counselling</h3>
            <p>Understand your report and plan your next steps with guidance from career experts.</p>
          </Tile>
          <Tile className={tile}>
            <span className="ic"><MonitorPlay /></span>
            <h3 className="text-[1.15rem] leading-tight font-extrabold">Career discovery webinars</h3>
            <p>Sessions on professional qualifications, corporate roles, higher studies, government careers and entrepreneurship.</p>
          </Tile>
        </Stagger>
      </Wrap>
    </Section>
  );
}
