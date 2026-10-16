import Image from "next/image";
import { Stagger, Tile } from "@/components/motion";
import { Section, Wrap } from "@/components/site";

const CREDS = [
  { big: "AIR 26", small: "CA", tone: "mint" },
  { big: "AIR 1", small: "CS", tone: "teal" },
  { big: "US CPA", small: "Licensed", tone: "mint" },
  { big: "20+ yrs", small: "Finance & education", tone: "white" },
] as const;

/** s07 — mentor profile with credential tiles. */
export function Mentor() {
  return (
    <Section id="s07">
      <Wrap>
        <Stagger className="grid grid-cols-2 gap-3.5 sm:gap-5 lg:grid-cols-[minmax(0,.9fr)_repeat(4,minmax(0,.55fr))]">
          <Tile pad="none" className="group relative col-span-2 aspect-[4/4.4] overflow-hidden bg-mint lg:col-span-1 lg:row-span-2 lg:aspect-auto lg:min-h-[520px]">
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
          <Tile pad="none" className="col-span-2 p-6 sm:p-9 lg:col-span-4">
            <span className="eyebrow">Meet your mentor</span>
            <h2 className="h-sub max-w-[24ch]">Learn from someone who has walked the professional journey.</h2>
            <p className="mt-3.5 max-w-[62ch] text-[1.02rem]">
              Manish Temani brings 20+ years of experience in finance and professional education, including leadership
              experience at Barclays. Manish guides students on finance career paths and the skills employers value.
            </p>
            <p className="note-s mt-4">Employer names are shown as career history only and do not imply endorsement.</p>
          </Tile>
          {CREDS.map((c) => (
            <Tile key={c.big} tone={c.tone} pad="none" className="flex flex-col justify-end p-[18px] sm:p-6">
              <b className={`block text-[1.3rem] leading-[1.1] font-extrabold tracking-[-0.02em] sm:text-[1.6rem] ${c.tone === "teal" ? "text-white" : "text-teal-deep"}`}>
                {c.big}
              </b>
              <small className={`text-[0.85rem] font-bold ${c.tone === "teal" ? "text-white" : "text-navy"}`}>{c.small}</small>
            </Tile>
          ))}
        </Stagger>
      </Wrap>
    </Section>
  );
}
