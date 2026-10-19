import Image from "next/image";
import { Stagger, Tile } from "@/components/motion";
import { Section, Wrap } from "@/components/site";

const CREDENTIALS = [
  { big: "AIR 26", small: "CA – All India Rank 26, Gold Medalist", tone: "mint" },
  { big: "AIR 1", small: "CS – All India Rank 1, Gold Medalist", tone: "teal" },
  { big: "US CPA", small: "US Certified Public Accountant", tone: "mint" },
  { big: "Topper", small: "B.Com University Topper, University of Rajasthan", tone: "white" },
] as const;

/** s07 — mentor photo, intro and four credential tiles. */
export function Mentor() {
  return (
    <Section id="s07">
      <Wrap>
        <Stagger className="grid grid-cols-2 gap-3.5 sm:gap-5 lg:grid-cols-[minmax(0,.9fr)_repeat(4,minmax(0,.55fr))]">
          <Tile
            pad="none"
            className="group relative col-span-2 aspect-[4/4.4] overflow-hidden bg-mint lg:col-span-1 lg:row-span-2 lg:aspect-auto lg:min-h-[470px]"
          >
            <Image
              src="/manish-temani.jpg"
              alt="Manish Temani"
              fill
              sizes="(min-width: 1104px) 360px, 100vw"
              className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-x-4 bottom-4 rounded-[18px] bg-white/96 px-[18px] py-3.5 backdrop-blur">
              <b className="block text-[1.1rem] text-navy">Manish Temani</b>            </div>
          </Tile>

          <Tile pad="none" className="col-span-2 p-6 sm:p-9 lg:col-span-4">
            <span className="eyebrow">Meet your mentor</span>
            <h2 className="h-sub max-w-[26ch]">Learn About Careers From Someone Who Understands Them.</h2>
            <p className="mt-4 text-[1.15rem] font-extrabold text-navy">Manish Temani</p>
            <p className="mt-1.5 max-w-[62ch] text-[1.02rem]">
              For more than two decades, Manish Temani has worked closely with students and professionals navigating
              careers in accounting, finance and professional education.
            </p>
          </Tile>

          {CREDENTIALS.map((c) => (
            <Tile key={c.big} tone={c.tone} pad="none" className="flex flex-col justify-end p-[18px] sm:p-6">
              <b
                className={`block text-[1.3rem] leading-[1.1] font-extrabold tracking-[-0.02em] sm:text-[1.6rem] ${
                  c.tone === "teal" ? "text-white" : "text-teal-deep"
                }`}
              >
                {c.big}
              </b>
              <small className={`mt-0.5 text-[0.85rem] leading-snug font-bold ${c.tone === "teal" ? "text-white" : "text-navy"}`}>
                {c.small}
              </small>
            </Tile>
          ))}
        </Stagger>
      </Wrap>
    </Section>
  );
}
