import Image from "next/image";
import { BadgeCheck, GraduationCap, Medal } from "lucide-react";
import { Stagger, Tile } from "@/components/motion";
import { Section, Wrap } from "@/components/site";

const CREDENTIALS = [
  { icon: Medal, text: "CA - All India Rank 26, Gold Medalist" },
  { icon: Medal, text: "CS - All India Rank 1, Gold Medalist" },
  { icon: BadgeCheck, text: "US CPA" },
  { icon: GraduationCap, text: "B.Com University Topper, University of Rajasthan" },
];

/** s07 — mentor profile and credentials. */
export function Mentor() {
  return (
    <Section id="s07">
      <Wrap>
        <Stagger className="grid gap-3.5 sm:gap-5 lg:grid-cols-[minmax(0,.9fr)_minmax(0,2.2fr)]">
          <Tile
            pad="none"
            className="group relative aspect-[4/4.4] overflow-hidden bg-mint lg:aspect-auto"
          >
            <Image
              src="/manish-temani.jpg"
              alt="Manish Temani"
              fill
              sizes="(min-width: 1104px) 360px, 100vw"
              className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-x-4 bottom-4 rounded-[18px] bg-white/96 px-[18px] py-3.5 backdrop-blur">
              <b className="block text-[1.1rem] text-navy">Manish Temani</b>
              <small className="font-semibold text-subtle">CA (AIR 26) · CS (AIR 1) · US CPA</small>
            </div>
          </Tile>

          <Tile pad="none" className="p-6 sm:p-9">
            <span className="eyebrow">Meet your mentor</span>
            <h2 className="h-sub max-w-[26ch]">Learn About Careers From Someone Who Understands Them.</h2>
            <p className="mt-5 text-[1.15rem] font-extrabold text-navy">Manish Temani</p>
            <ul className="mt-3 grid gap-2.5 sm:grid-cols-2 sm:gap-x-6">
              {CREDENTIALS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-2.5 text-[0.93rem] leading-snug font-bold text-navy">
                  <span className="mt-px grid size-6 flex-none place-items-center rounded-full bg-mint text-teal-deep">
                    <Icon className="size-3.5" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
            <p className="mt-5 max-w-[66ch] text-[1.02rem]">
              For more than two decades, Manish Temani has worked closely with students and professionals navigating
              careers in accounting, finance and professional education.
            </p>
          </Tile>

        </Stagger>
      </Wrap>
    </Section>
  );
}
