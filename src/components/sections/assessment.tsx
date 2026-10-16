import { ChartNoAxesColumn, ChartPie, FileText, Laptop, MessageCircle, Sigma, Target, TrendingUp } from "lucide-react";
import { Item, Stagger, Tile } from "@/components/motion";
import { Section, SectionHead, Wrap } from "@/components/site";
import { KEY_FACTS, STEPS } from "@/lib/content";

const TOPICS = [
  { icon: ChartNoAxesColumn, text: "Accountancy" },
  { icon: Sigma, text: "Maths & Quant Aptitude" },
  { icon: TrendingUp, text: "Economics" },
  { icon: MessageCircle, text: "English & Communication" },
  { icon: ChartPie, text: "Data & Analytical Reasoning" },
  { icon: Laptop, text: "Technology & Digital Awareness" },
  { icon: FileText, text: "Descriptive Case Studies" },
  { icon: Target, text: "Interest & Motivation" },
];

/** s08 — what the Olympiad covers plus key facts. */
export function Assessment() {
  return (
    <Section id="s08">
      <Wrap>
        <SectionHead eyebrow="Assessment details" title="60 minutes. Online. Eight areas that show how you think." />
        <Stagger className="grid gap-3.5 sm:gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <Tile>
            <h3 className="text-[1.15rem] font-extrabold">What the Olympiad covers</h3>
            <div className="mt-[18px] grid gap-3 sm:grid-cols-2">
              {TOPICS.map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-3 rounded-2xl border border-line bg-canvas px-4 py-3.5 text-[0.94rem] leading-[1.3] font-bold text-navy transition-colors hover:border-mint-line hover:bg-mint"
                >
                  <span className="ic size-[38px] rounded-[11px] [&_svg]:size-[18px]">
                    <Icon />
                  </span>
                  {text}
                </div>
              ))}
            </div>
          </Tile>
          <Tile tone="navy">
            <span className="eyebrow">Key facts</span>
            <dl className="mt-2.5 grid">
              {KEY_FACTS.map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-3 border-t border-navy-line py-[15px] first:border-t-0">
                  <dt className="text-[0.72rem] font-extrabold tracking-[0.14em] text-haze uppercase">{k}</dt>
                  <dd className="text-right font-bold text-white">{v}</dd>
                </div>
              ))}
            </dl>
          </Tile>
          <Item className="note-s -mt-1 lg:col-span-2">
            Question pattern, marking scheme, start time and device requirements will be published once confirmed.
          </Item>
        </Stagger>
      </Wrap>
    </Section>
  );
}

/** s09 — four steps to participate. */
export function Steps() {
  return (
    <Section id="s09">
      <Wrap>
        <SectionHead eyebrow="How to participate" title="Four simple steps." center />
        <Stagger className="grid gap-3.5 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4" step={0.12}>
          {STEPS.map((s, i) => (
            <Tile
              key={s.title}
              tone={s.tone}
              pad="none"
              whileHover={{ y: -6 }}
              className="flex flex-col gap-3 p-[22px] sm:min-h-[230px] sm:p-7"
            >
              <span
                className={`grid size-[46px] place-items-center rounded-[14px] text-[1.1rem] font-extrabold ${
                  s.tone === "white" ? "bg-mint text-teal-deep" : "bg-white text-teal"
                }`}
              >
                {i + 1}
              </span>
              <h3 className="mt-1.5 text-[1.15rem] font-extrabold sm:mt-auto">{s.title}</h3>
              <p>{s.text}</p>
            </Tile>
          ))}
        </Stagger>
      </Wrap>
    </Section>
  );
}
