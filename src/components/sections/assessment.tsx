import { ArrowRight, ChartNoAxesColumn, ChartPie, FileText, Laptop, MessageCircle, Sigma, Smile, Target, TrendingUp } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Item, Stagger, Tile } from "@/components/motion";
import { Section, SectionHead, Wrap } from "@/components/site";
import { KEY_FACTS, STEPS } from "@/lib/content";
import { cn } from "@/lib/utils";

const TOPICS = [
  { icon: ChartNoAxesColumn, title: "Accountancy", text: "Your understanding of fundamental accounting concepts." },
  { icon: Sigma, title: "Maths & Quantitative Aptitude", text: "Numbers, calculations and quantitative thinking." },
  { icon: TrendingUp, title: "Economics", text: "Understanding of economic concepts and real-world applications." },
  { icon: MessageCircle, title: "English & Communication", text: "Comprehension, communication and interpretation." },
  { icon: ChartPie, title: "Data & Analytical Reasoning", text: "Patterns, logic, data interpretation and problem solving." },
  { icon: Laptop, title: "Technology & Digital Awareness", text: "Awareness of technology and today's digital business environment." },
  { icon: FileText, title: "Case-Based Questions", text: "How you apply concepts to practical situations." },
  { icon: Target, title: "Interest & Motivation", text: "The areas of commerce and finance that naturally interest you." },
];

/** s08 — what the Olympiad assesses, key facts and a no-pressure note. */
export function Assessment() {
  return (
    <Section id="s08">
      <Wrap>
        <SectionHead
          eyebrow="Assessment details"
          title="60 Minutes That Could Give You Much More Clarity About Your Next 5 Years."
          intro="The Olympiad looks beyond textbook marks alone. It explores different areas that can help indicate how you think, analyse, communicate and approach problems."
        />
        <Stagger className="grid gap-3.5 sm:gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <Tile>
            <h3 className="text-[1.15rem] font-extrabold">You Will Be Assessed Across:</h3>
            <div className="mt-[18px] grid gap-3 sm:grid-cols-2">
              {TOPICS.map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  className="flex items-start gap-3 rounded-2xl border border-line bg-canvas px-4 py-3.5 transition-colors hover:border-mint-line hover:bg-mint"
                >
                  <span className="ic size-[38px] rounded-[11px] [&_svg]:size-[18px]">
                    <Icon />
                  </span>
                  <div>
                    <b className="block text-[0.94rem] leading-[1.3] text-navy">{title}</b>
                    <p className="mt-1 text-[0.85rem] leading-snug">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </Tile>
          <Tile tone="navy" className="flex flex-col">
            <span className="eyebrow">Key facts</span>
            <dl className="mt-2.5 grid flex-1 auto-rows-fr">
              {KEY_FACTS.map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-3 border-t border-navy-line py-[15px] first:border-t-0">
                  <dt className="text-[0.72rem] font-extrabold tracking-[0.14em] text-haze uppercase">{k}</dt>
                  <dd className="text-right font-bold text-white">{v}</dd>
                </div>
              ))}
            </dl>
          </Tile>
          <Tile tone="mint" className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6 lg:col-span-2">
            <span className="ic"><Smile /></span>
            <div>
              <h3 className="text-[1.15rem] leading-snug font-extrabold">
                You don&apos;t need to prepare like it&apos;s a board exam.{" "}
                <span className="text-teal-deep">Come as you are.</span>
              </h3>
              <p className="mt-1 text-[0.98rem]">
                The goal is to understand your current strengths and help you explore what comes next.
              </p>
            </div>
          </Tile>
          <Item className="note-s -mt-1 lg:col-span-2">
            Question pattern, marking scheme, start time and device requirements will be published once confirmed.
          </Item>
        </Stagger>
      </Wrap>
    </Section>
  );
}

/** s09 — five steps from registering to getting guidance. */
export function Steps() {
  return (
    <Section id="s09">
      <Wrap>
        <SectionHead eyebrow="How it works" title="From “I Don't Know” to “Now I Know What to Explore.”" center />
        <Stagger className="grid gap-3.5 sm:grid-cols-2 sm:gap-5 lg:grid-cols-5" step={0.12}>
          {STEPS.map((s, i) => (
            <Tile
              key={s.title}
              tone={s.tone}
              pad="none"
              whileHover={{ y: -6 }}
              className={cn(
                "flex flex-col gap-3 p-[22px] sm:min-h-[230px] sm:p-6",
                i === STEPS.length - 1 && "sm:col-span-2 lg:col-span-1",
              )}
            >
              <span
                className={cn(
                  "grid size-[46px] place-items-center rounded-[14px] text-[1rem] font-extrabold",
                  s.tone === "white" ? "bg-mint text-teal-deep" : "bg-white text-teal",
                )}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-[1.1rem] leading-snug font-extrabold">{s.title}</h3>
              <p>{s.text}</p>
            </Tile>
          ))}
          <Tile
            tone="navy"
            className="flex flex-col gap-5 sm:col-span-2 lg:col-span-5 lg:flex-row lg:items-center lg:justify-between lg:gap-10"
          >
            <div>
              <p className="text-[clamp(1.15rem,1.8vw,1.4rem)] font-extrabold text-white">That&apos;s it.</p>
              <p className="mt-1 max-w-[60ch] text-[1.02rem] font-semibold text-aqua">
                One free assessment can become the starting point for a much smarter career conversation.
              </p>
            </div>
            <a href="#register" className={cn(buttonVariants({ variant: "amber", size: "pill" }), "max-lg:w-full")}>
              Start With the Free Olympiad <ArrowRight />
            </a>
          </Tile>
        </Stagger>
      </Wrap>
    </Section>
  );
}
