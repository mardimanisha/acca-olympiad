import { Award, FileChartColumn, IndianRupee, MessageSquareText, MonitorPlay, Network } from "lucide-react";
import { Bar, Stagger, Tile } from "@/components/motion";
import { Section, SectionHead, Wrap } from "@/components/site";

const MINI = [
  ["Accountancy", 82],
  ["Data & logic", 88],
  ["Economics", 74],
] as const;

const tile = "flex flex-col gap-3.5 [&_p]:m-0";

/** s04 — the six things every participant receives. */
export function Receive() {
  return (
    <Section id="s04">
      <Wrap>
        <SectionHead
          eyebrow="What you receive"
          title="More than a score. A starting map for your career."
          intro="Six things every participant gets after the Olympiad, at no cost."
        />
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
