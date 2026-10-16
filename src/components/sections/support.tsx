import { House, MonitorPlay, UsersRound } from "lucide-react";
import { Stagger, Tile } from "@/components/motion";
import { Section, SectionHead, Wrap } from "@/components/site";
import { WEBINAR_TOPICS } from "@/lib/content";

const SUPPORT = [
  { icon: UsersRound, title: "Personalized counselling", text: "Interpret your report, shortlist pathways and agree on next steps.", tone: "teal" },
  { icon: MonitorPlay, title: "Career webinars", text: "Live sessions with experts on every major commerce pathway.", tone: "white" },
  { icon: House, title: "Parent guidance", text: "Qualification routes, costs and time commitments, explained for families.", tone: "mint" },
] as const;

/** s11 — counselling, webinars and parent guidance after the Olympiad. */
export function Counselling() {
  return (
    <Section id="s11">
      <Wrap>
        <SectionHead eyebrow="After the Olympiad" title="Your report is the start. Here's how to act on it." />
        <Stagger className="grid gap-3.5 sm:grid-cols-3 sm:gap-5">
          {SUPPORT.map(({ icon: Icon, title, text, tone }) => (
            <Tile key={title} tone={tone} className="flex flex-col gap-3.5 sm:min-h-[220px] [&_p]:m-0">
              <span className="ic"><Icon /></span>
              <h3 className="text-[1.15rem] font-extrabold sm:mt-auto">{title}</h3>
              <p>{text}</p>
            </Tile>
          ))}
          <Tile pad="none" className="flex flex-wrap items-center gap-2.5 px-7 py-[22px] sm:col-span-3">
            <b className="mr-2 text-navy">Webinar topics</b>
            {WEBINAR_TOPICS.map((t) => (
              <span
                key={t}
                className="rounded-full border border-line bg-canvas px-3.5 py-[7px] text-[0.86rem] font-bold text-navy transition-colors hover:border-teal hover:bg-mint"
              >
                {t}
              </span>
            ))}
          </Tile>
        </Stagger>
      </Wrap>
    </Section>
  );
}
