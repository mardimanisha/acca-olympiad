import Image from "next/image";
import { House, MonitorPlay, UsersRound } from "lucide-react";
import { Stagger, Tile } from "@/components/motion";
import { Section, SectionHead, Wrap } from "@/components/site";

const SUPPORT = [
  {
    icon: UsersRound,
    img: "/support/counsellor-office.jpg",
    alt: "Career counsellor in a one-to-one consultation",
    fade: "from-teal",
    title: "Personalized counselling",
    text: "Interpret your report, shortlist pathways and agree on next steps.",
    tone: "teal",
  },
  {
    icon: MonitorPlay,
    img: "/support/webinar-presenter.jpg",
    alt: "Expert presenting charts in a live online session",
    fade: "from-white",
    title: "Career webinars",
    text: "Live sessions with experts on every major commerce pathway.",
    tone: "white",
  },
  {
    icon: House,
    img: "/support/parents-advisor.jpg",
    alt: "Advisor walking parents through their options",
    fade: "from-mint",
    title: "Parent guidance",
    text: "Qualification routes, costs and time commitments, explained for families.",
    tone: "mint",
  },
] as const;

/** s11 — counselling, webinars and parent guidance after the Olympiad. */
export function Counselling() {
  return (
    <Section id="s11">
      <Wrap>
        <SectionHead eyebrow="After the Olympiad" title="Your report is the start. Here's how to act on it." />
        <Stagger className="grid gap-3.5 sm:grid-cols-3 sm:gap-5">
          {SUPPORT.map(({ icon: Icon, img, alt, fade, title, text, tone }) => (
            <Tile
              key={title}
              tone={tone}
              pad="none"
              className="group flex flex-col overflow-hidden [&_.ic]:bg-white [&_.ic]:text-teal-deep [&_.ic]:shadow-md [&_p]:m-0"
            >
              <div className="relative h-[190px] overflow-hidden">
                <Image
                  src={img}
                  alt={alt}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover object-[50%_30%] transition-transform duration-700 group-hover:scale-105"
                />
                {/* fade the photo into the card's tone */}
                <div className={`absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t to-transparent ${fade}`} />
              </div>
              <div className="relative flex flex-1 flex-col gap-3 px-[22px] pb-[22px] sm:px-[30px] sm:pb-[30px]">
                <span className="ic -mt-[23px]"><Icon /></span>
                <h3 className="text-[1.15rem] font-extrabold">{title}</h3>
                <p>{text}</p>
              </div>
            </Tile>
          ))}
        </Stagger>
      </Wrap>
    </Section>
  );
}
