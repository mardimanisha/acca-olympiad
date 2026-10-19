import Image from "next/image";
import { Stagger, Tile } from "@/components/motion";
import { Section, Wrap } from "@/components/site";

/* Credential illustrations: absolutely placed top-left so the tile height is unchanged. */
const ART = "absolute top-3.5 left-[18px] h-[40px] w-[40px] sm:left-6 sm:top-4";

function MedalArt() {
  return (
    <svg viewBox="0 0 64 64" className={ART} aria-hidden="true">
      <path d="M17 2h12l7 20H24z" fill="#0B1A3D" />
      <path d="M47 2H35l-7 20h12z" fill="#0F8579" />
      <circle cx="32" cy="40" r="19" fill="#C98A12" />
      <circle cx="32" cy="38" r="19" fill="#F6C44F" stroke="#0B1A3D" strokeWidth="2.5" />
      <circle cx="32" cy="38" r="13.5" fill="#FFE29A" stroke="#C98A12" strokeWidth="1.5" />
      <path d="M32 29l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2-4.5-4.4 6.2-.9z" fill="#0B1A3D" />
    </svg>
  );
}

function TrophyArt() {
  return (
    <svg viewBox="0 0 64 64" className={ART} aria-hidden="true">
      <path d="M16 12c-8 0-10 4-9 9s6 9 12 9M48 12c8 0 10 4 9 9s-6 9-12 9" fill="none" stroke="#FFE29A" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M16 6h32v18c0 9-7 15-16 15S16 33 16 24z" fill="#F6C44F" stroke="#fff" strokeWidth="2.5" />
      <path d="M22 10v14c0 6 3 10 7 12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity=".7" />
      <rect x="28" y="38" width="8" height="9" fill="#C98A12" />
      <path d="M20 47h24l3 8H17z" fill="#FFE29A" stroke="#fff" strokeWidth="2.5" strokeLinejoin="round" />
      <text x="32" y="26" textAnchor="middle" fontSize="12" fontWeight="800" fill="#0B1A3D">1</text>
    </svg>
  );
}

function CpaArt() {
  return (
    <svg viewBox="0 0 64 64" className={ART} aria-hidden="true">
      <circle cx="28" cy="32" r="22" fill="#fff" stroke="#0B1A3D" strokeWidth="2.5" />
      <ellipse cx="28" cy="32" rx="9" ry="22" fill="none" stroke="#0F8579" strokeWidth="2" />
      <path d="M6 32h44M9 20h38M9 44h38" stroke="#0F8579" strokeWidth="2" fill="none" />
      <g transform="translate(40 36)">
        <circle r="13" fill="#F59E0B" stroke="#0B1A3D" strokeWidth="2.5" />
        <circle r="8.5" fill="#FFE29A" stroke="#0B1A3D" strokeWidth="1.2" />
        <text y="3.6" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#0B1A3D">CPA</text>
      </g>
    </svg>
  );
}

function CapArt() {
  return (
    <svg viewBox="0 0 64 64" className={ART} aria-hidden="true">
      <path d="M32 10 4 24l28 14 28-14z" fill="#0B1A3D" />
      <path d="M16 33v11c0 6 32 6 32 0V33l-16 8z" fill="#0F8579" stroke="#0B1A3D" strokeWidth="2" strokeLinejoin="round" />
      <path d="M54 27v18" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
      <circle cx="54" cy="48" r="4" fill="#F59E0B" />
    </svg>
  );
}

const CREDENTIALS = [
  { big: "AIR 26", small: "CA – All India Rank 26, Gold Medalist", tone: "mint", art: MedalArt },
  { big: "AIR 1", small: "CS – All India Rank 1, Gold Medalist", tone: "teal", art: TrophyArt },
  { big: "US CPA", small: "US Certified Public Accountant", tone: "mint", art: CpaArt },
  { big: "Topper", small: "B.Com University Topper, University of Rajasthan", tone: "white", art: CapArt },
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
              <b className="block bg-gradient-to-r from-teal-dark via-teal to-navy bg-clip-text text-[clamp(1.6rem,2.6vw,2.2rem)] leading-[1.15] tracking-tight text-transparent">
                Manish Temani
              </b>
            </div>
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
            <Tile key={c.big} tone={c.tone} pad="none" className="relative flex flex-col justify-end p-[18px] sm:p-6">
              <c.art />
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
