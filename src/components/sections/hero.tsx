import { Award, CalendarDays, Clock, Compass as CompassIcon, FileChartColumn, GraduationCap, Users } from "lucide-react";
import { Stagger, Tile } from "@/components/motion";
import { Wrap } from "@/components/site";
import { Compass } from "@/components/hero/compass";
import { HeroLogoHome } from "@/components/hero/hero-logo";
import { RegisterForm } from "@/components/hero/register-form";
import { EVENT } from "@/lib/content";

const OFFER = [
  { icon: Clock, text: "1 Free 60-Minute Assessment" },
  { icon: CompassIcon, text: "15+ Career Paths" },
  { icon: FileChartColumn, text: "Your Personalised Career Report" },
];

export function Hero() {
  return (
    <section id="s01" className="pt-1 pb-6 sm:pt-1.5">

      <Wrap>
        <div className="relative mb-4 flex flex-col items-center text-center sm:mb-6">
          <h1 id="hero-title" className="text-[1.45rem] sm:text-[clamp(1.27rem,3.35vw,2.4rem)] leading-[1.05] font-black tracking-[-0.04em] text-balance text-navy">
            <HeroLogoHome />{" "}
            <span className="bg-gradient-to-r from-teal via-teal-deep to-teal bg-clip-text text-transparent">
              National
            </span>
            <br className="sm:hidden" />
            <span className="bg-gradient-to-r from-teal via-teal-deep to-teal bg-clip-text text-transparent sm:ml-[0.25em]">
              Commerce
            </span>{" "}
            <span className="relative inline-block">
              Olympiad
              <svg
                aria-hidden
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
                className="absolute -bottom-2 left-0 h-2.5 w-full text-amber sm:h-3"
              >
                <path
                  d="M2 8 Q 27 1 52 7 T 102 7 T 152 7 T 198 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>
        </div>
        <Stagger className="grid gap-3.5 sm:gap-5 lg:grid-cols-[minmax(0,1fr)_420px] lg:grid-rows-[minmax(max(640px,calc(100svh-140px)),auto)_auto]" step={0.1}>
          <Tile pad="none" className="flex flex-col items-center px-[18px] pt-5 pb-5 text-center sm:min-h-[max(600px,calc(100svh-140px))] sm:px-11 sm:pt-8 sm:pb-7 lg:min-h-0">
            <div className="flex flex-wrap justify-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-mint px-3.5 py-[7px] text-[0.82rem] font-bold text-teal-deep">
                <Users className="size-[15px]" />
                For Commerce Students
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-cream px-3 py-[7px] text-[0.76rem] font-bold whitespace-nowrap text-amber-ink sm:px-3.5 sm:text-[0.82rem]">
                <CalendarDays className="size-[15px]" />
                {EVENT.dateLong} · Online · Completely Free
              </span>
            </div>
            <h2 className="mt-5 text-[3.7vw] leading-[1.2] font-extrabold tracking-[-0.02em] whitespace-nowrap sm:text-xl md:text-2xl lg:text-[1.35rem]">
              Confused About What to Do After <em className="text-teal not-italic">12th Commerce</em>?
            </h2>
            <p className="mt-4 max-w-[52ch] text-[0.98rem]">
              Take the National Commerce Olympiad and discover the career paths worth exploring based on your strengths,
              interests and aptitude.
            </p>
            <div className="relative mt-3 aspect-[490/368] w-full flex-none sm:mt-4 sm:aspect-auto sm:min-h-[220px] sm:flex-1">
              <Compass />
            </div>
            <ul className="mt-3 flex-col items-center gap-2 max-sm:hidden sm:flex sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-5">
              {OFFER.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-1.5 text-[0.92rem] font-bold whitespace-nowrap text-navy">
                  <Icon className="size-[18px] text-teal" />
                  {text}
                </li>
              ))}
            </ul>
            <div className="mt-[22px] w-full border-t border-line pt-5 sm:mt-4 sm:pt-4">
              <p className="flex items-center justify-center gap-2 text-[0.95rem] font-bold text-navy">
                <GraduationCap className="size-[18px] flex-none text-amber" />
                Scholarships up to {EVENT.scholarship} + Certificate for Every Participant*
              </p>
              <p className="mt-1.5 flex items-center justify-center gap-2 text-[0.95rem] font-bold text-navy">
                <Award className="size-[18px] flex-none text-amber" />A Certificate for each school topper
              </p>
              <p className="note-s mt-1.5">*Scholarships for eligible students, subject to published terms.</p>
            </div>
          </Tile>

          <Tile id="register" pad="none" className="flex scroll-mt-20 flex-col px-5 py-6 max-lg:order-4 sm:p-8 lg:p-7">
            <h2 className="text-2xl font-extrabold tracking-[-0.02em] lg:text-[1.35rem]">Register Free</h2>
            <p className="mt-1 text-[0.86rem] text-subtle">Takes under 2 minutes · Confirmation on WhatsApp</p>
            <RegisterForm />
          </Tile>

          <div className="grid min-w-0 gap-3.5 max-lg:order-2 sm:grid-cols-3 sm:gap-5">
            <Tile
              tone="amber"
              pad="none"
              className={REWARD_TILE}
            >
              <ScholarshipArt />
              <span className="eyebrow">Scholarships</span>
              <span className="block text-[clamp(1.7rem,2.6vw,2.2rem)] leading-none font-extrabold tracking-[-0.04em]">
                <small className="mr-1.5 align-middle text-[0.38em] tracking-normal">up to</small>
                {EVENT.scholarship}
              </span>
              <div className="text-[0.95rem] font-semibold">
                For eligible students, towards graduation degree programmes.
                <br />
                <a href="#s12" className="mt-1 inline-flex border-b-2 border-navy font-extrabold text-navy">
                  See all rewards →
                </a>
              </div>
            </Tile>
            <Tile
              tone="teal"
              pad="none"
              className={REWARD_TILE}
            >
              <WatchArt />
              <span className="eyebrow">Top 10 participants</span>
              <span className="block text-[clamp(1.7rem,2.6vw,2.2rem)] leading-none font-extrabold tracking-[-0.04em] text-white">
                Digital watches
              </span>
              <div className="text-[0.95rem] font-semibold">For the top ten performers.</div>
            </Tile>
            <Tile pad="none" className={REWARD_TILE}>
              <CertificateArt />
              <span className="eyebrow">Every participant</span>
              <span className="block text-[clamp(1.7rem,2.6vw,2.2rem)] leading-none font-extrabold tracking-[-0.04em] text-navy">
                Certificate
              </span>
              <div className="text-[0.95rem] font-semibold">Digital participation certificate.</div>
            </Tile>
          </div>

          <Tile tone="navy" pad="none" className="flex flex-col justify-center p-6 max-lg:order-3 sm:px-8 sm:py-7">
            <span className="eyebrow">Olympiad day</span>
            <span className="mt-1.5 block text-[clamp(1.9rem,2.8vw,2.4rem)] leading-[1.05] font-extrabold tracking-[-0.03em] text-white">
              {EVENT.dateLabel}
            </span>
            <p className="mt-2 text-[0.9rem] font-semibold">Commerce Students · one free attempt</p>
          </Tile>
        </Stagger>
      </Wrap>
    </section>
  );
}

/** On mobile each reward card is two columns: text on the left, art on the right. */
const REWARD_TILE = "flex flex-col items-start justify-between gap-1.5 px-5 py-4 max-sm:grid max-sm:grid-cols-[1fr_auto] max-sm:gap-x-3 lg:px-[22px]";
const ART = "h-[58px] w-full max-sm:col-start-2 max-sm:row-span-4 max-sm:row-start-1 max-sm:h-auto max-sm:w-[116px] max-sm:self-center";

/** Card illustrations for the rewards row. Decorative, so hidden from assistive tech. */
function ScholarshipArt() {
  return (
    <svg viewBox="0 0 220 110" className={ART} aria-hidden="true">
      <defs>
        <linearGradient id="coinG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFE9A8" />
          <stop offset="1" stopColor="#F2B53A" />
        </linearGradient>
      </defs>
      <ellipse cx="110" cy="100" rx="86" ry="7" fill="#0B1A3D" opacity=".14" />
      {/* banknote */}
      <g transform="rotate(-6 70 70)">
        <rect x="20" y="48" width="112" height="56" rx="8" fill="#FFF7E0" stroke="#0B1A3D" strokeWidth="2.5" />
        <rect x="28" y="56" width="96" height="40" rx="5" fill="none" stroke="#0B1A3D" strokeWidth="1.2" strokeDasharray="3 3" opacity=".5" />
        <circle cx="76" cy="76" r="14" fill="#0B1A3D" />
        <text x="76" y="82" textAnchor="middle" fontSize="17" fontWeight="800" fill="#FFE9A8">₹</text>
        <circle cx="38" cy="66" r="3.5" fill="#0B1A3D" opacity=".6" />
        <circle cx="114" cy="86" r="3.5" fill="#0B1A3D" opacity=".6" />
      </g>
      {/* coin stack */}
      {[88, 76, 64].map((y) => (
        <g key={y}>
          <ellipse cx="164" cy={y + 6} rx="26" ry="9" fill="#C98A12" />
          <rect x="138" y={y - 2} width="52" height="8" fill="url(#coinG)" />
          <ellipse cx="164" cy={y - 2} rx="26" ry="9" fill="url(#coinG)" stroke="#0B1A3D" strokeWidth="2" />
        </g>
      ))}
      <text x="164" y="58" textAnchor="middle" fontSize="12" fontWeight="800" fill="#0B1A3D">₹</text>
      {/* graduation cap */}
      <g transform="translate(150 6)">
        <path d="M30 6 L0 20 L30 34 L60 20 Z" fill="#0B1A3D" />
        <path d="M14 28 V40 C14 46 46 46 46 40 V28 L30 36 Z" fill="#14285A" />
        <path d="M56 22 V40" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="56" cy="43" r="3.5" fill="#F59E0B" />
      </g>
    </svg>
  );
}

function WatchArt() {
  return (
    <svg viewBox="0 0 220 110" className={ART} aria-hidden="true">
      <defs>
        <linearGradient id="bezelG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E9F3F1" />
          <stop offset="1" stopColor="#8FB5AE" />
        </linearGradient>
        <linearGradient id="screenG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0B1A3D" />
          <stop offset="1" stopColor="#0B3D45" />
        </linearGradient>
      </defs>
      <ellipse cx="110" cy="102" rx="70" ry="6" fill="#000" opacity=".22" />
      {/* straps */}
      <path d="M84 4 H136 L132 30 H88 Z" fill="#0B1A3D" />
      <path d="M88 80 H132 L136 106 H84 Z" fill="#0B1A3D" />
      <g fill="#3E6F69">
        <circle cx="110" cy="92" r="1.8" />
        <circle cx="110" cy="98" r="1.8" />
        <circle cx="110" cy="14" r="1.8" />
      </g>
      {/* case */}
      <rect x="68" y="24" width="84" height="62" rx="20" fill="url(#bezelG)" />
      <rect x="152" y="46" width="6" height="18" rx="3" fill="#8FB5AE" />
      <rect x="74" y="30" width="72" height="50" rx="15" fill="url(#screenG)" />
      {/* activity rings */}
      <circle cx="94" cy="55" r="15" fill="none" stroke="#1d4a52" strokeWidth="5" />
      <circle cx="94" cy="55" r="15" fill="none" stroke="#7DE3D2" strokeWidth="5" strokeLinecap="round" strokeDasharray="70 100" transform="rotate(-90 94 55)" />
      <circle cx="94" cy="55" r="8" fill="none" stroke="#5a3d12" strokeWidth="4" />
      <circle cx="94" cy="55" r="8" fill="none" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" strokeDasharray="36 100" transform="rotate(-90 94 55)" />
      <text x="131" y="52" textAnchor="middle" fontSize="15" fontWeight="800" fill="#fff">10:28</text>
      <text x="131" y="66" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#7DE3D2">TOP 10</text>
      <path d="M78 36 Q96 32 112 35" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" opacity=".25" fill="none" />
    </svg>
  );
}

function CertificateArt() {
  return (
    <svg viewBox="0 0 220 110" className={ART} aria-hidden="true">
      <ellipse cx="110" cy="102" rx="84" ry="6" fill="#0B1A3D" opacity=".12" />
      <g transform="rotate(-3 110 55)">
        <rect x="26" y="10" width="168" height="88" rx="6" fill="#FFFDF6" stroke="#0B1A3D" strokeWidth="2.5" />
        <rect x="33" y="17" width="154" height="74" rx="3" fill="none" stroke="#0F8579" strokeWidth="1.5" />
        <rect x="37" y="21" width="146" height="66" rx="2" fill="none" stroke="#F59E0B" strokeWidth="1" strokeDasharray="2 3" />
        <text x="110" y="34" textAnchor="middle" fontSize="8" fontWeight="800" letterSpacing="1.6" fill="#0F8579">CERTIFICATE</text>
        <text x="110" y="43" textAnchor="middle" fontSize="5.5" fontWeight="700" letterSpacing="1" fill="#6B7A90">OF PARTICIPATION</text>
        <path d="M70 58 C78 50 84 66 92 58 S106 52 114 58 S130 62 150 56" stroke="#0B1A3D" strokeWidth="2" fill="none" strokeLinecap="round" />
        <rect x="64" y="64" width="92" height="1.5" rx=".75" fill="#B8C3D3" />
        <rect x="76" y="72" width="68" height="2.5" rx="1.25" fill="#DCE5EE" />
        <rect x="88" y="78" width="44" height="2.5" rx="1.25" fill="#DCE5EE" />
        {/* signature */}
        <path d="M48 78 q5 -8 9 0 t9 -2" stroke="#0B1A3D" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      </g>
      {/* rosette */}
      <g transform="translate(158 62)">
        <path d="M-12 14 L-18 38 L-8 32 L-2 40 L2 16 Z" fill="#D97706" />
        <path d="M12 14 L18 38 L8 32 L2 40 L-2 16 Z" fill="#F59E0B" />
        <circle cx="0" cy="0" r="19" fill="#F59E0B" stroke="#0B1A3D" strokeWidth="2.5" />
        {Array.from({ length: 12 }).map((_, i) => (
          <circle key={i} cx={Math.cos((i / 12) * Math.PI * 2) * 19} cy={Math.sin((i / 12) * Math.PI * 2) * 19} r="3" fill="#F59E0B" stroke="#0B1A3D" strokeWidth="1.5" />
        ))}
        <circle cx="0" cy="0" r="13" fill="#FFE9A8" stroke="#0B1A3D" strokeWidth="1.5" />
        <path d="M0 -7 L2.2 -2.2 L7.4 -1.8 L3.4 1.6 L4.7 6.6 L0 3.9 L-4.7 6.6 L-3.4 1.6 L-7.4 -1.8 L-2.2 -2.2 Z" fill="#0B1A3D" />
      </g>
    </svg>
  );
}
