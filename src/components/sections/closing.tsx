import Image from "next/image";
import { ArrowRight, CalendarDays } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { FadeIn } from "@/components/motion";
import { Wrap } from "@/components/site";
import { EVENT } from "@/lib/content";
import { cn } from "@/lib/utils";

const PERKS = [`Scholarships up to ${EVENT.scholarship}`, "Career Report", "Certificate", "Career Guidance*"];

/** s15 — final call to action. */
export function FinalCta() {
  return (
    <section id="s15" className="py-[clamp(28px,3.5vw,48px)]">
      <Wrap>
        <FadeIn className="relative overflow-hidden rounded-tile bg-navy px-[22px] py-11 text-center text-mist sm:px-8 sm:py-[clamp(48px,6vw,80px)]">
          <span className="pointer-events-none absolute -top-[60%] left-1/2 -ml-[450px] h-[600px] w-[900px] animate-pulse rounded-full bg-[radial-gradient(circle,rgba(14,124,112,.35),transparent_65%)] [animation-duration:5s]" />
          <div className="relative">
            <span className="eyebrow text-aqua">Class 11 &amp; 12 Commerce Students</span>
            <h2 className="mx-auto mt-3 max-w-[20ch] text-[clamp(2rem,4vw,3rem)] leading-[1.08] font-extrabold tracking-[-0.03em] text-balance text-white">
              You Don&apos;t Need to Decide Your <em className="text-aqua not-italic">Entire Career</em> Today.
            </h2>
            <p className="mx-auto mt-4 max-w-[54ch] text-[1.05rem]">
              But before choosing your next course, college or qualification...
            </p>
            <p className="mx-auto mt-1 max-w-[54ch] text-[1.1rem] font-bold text-white">
              Give yourself 60 minutes to understand your options better.
            </p>

            <p className="mt-7 inline-flex items-center gap-2 rounded-full border border-navy-line px-4 py-2 text-[0.9rem] font-bold text-white">
              <CalendarDays className="size-4 text-aqua" />
              {EVENT.dateLong} · Online · ₹0
            </p>
            <div className="mt-5 flex flex-col items-center">
              <a href="#register" className={cn(buttonVariants({ variant: "amber", size: "pill" }), "max-sm:w-full")}>
                Take the Free Olympiad <ArrowRight />
              </a>
              <p className="mt-2.5 text-[0.88rem] font-semibold">Registration is completely free.</p>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {PERKS.map((m) => (
                <span key={m} className="rounded-full border border-navy-line px-3.5 py-[7px] text-[0.84rem] font-bold text-white">
                  {m}
                </span>
              ))}
            </div>
            <p className="mt-4 text-[0.74rem] opacity-80">
              *Subject to terms and conditions, including scholarship eligibility and applicable programs.
            </p>
          </div>
        </FadeIn>
      </Wrap>
    </section>
  );
}

const FOOTER = [
  { title: "Olympiad", links: [["Syllabus", "#s08"], ["Rewards", "#s12"]] },
  { title: "Rules & legal", links: [["Assessment rules", "#"], ["Scholarship rules", "#"], ["Privacy notice", "#"], ["Terms", "#"]] },
  { title: "Contact", links: [[EVENT.phone, EVENT.phoneHref], ["WhatsApp community", EVENT.whatsappHref], ["FAQs", "#s14"]] },
];

/** s16 — footer. */
export function Footer() {
  return (
    <section id="s16">
      <footer className="bg-ink-footer pt-12 pb-36 text-[0.9rem] text-[#8E9BB5]">
        <Wrap>
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <Image src="/zskillup-logo-white.png" alt="ZSkillup" width={83} height={28} className="h-7 w-auto" />
              <p className="mt-3 max-w-[34ch]">Powered by ZSkillup · Building future-ready careers.</p>
            </div>
            {FOOTER.map((col) => (
              <div key={col.title}>
                <h4 className="mb-3 text-[0.78rem] tracking-[0.12em] text-white uppercase">{col.title}</h4>
                <ul className="grid gap-2 font-semibold">
                  {col.links.map(([label, href]) => (
                    <li key={label}>
                      <a href={href} className="transition-colors hover:text-white">{label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-9 flex flex-wrap justify-between gap-3 border-t border-[#1A2A50] pt-[18px] text-[0.8rem]">
            <span>© 2027 ZSkillup</span>
            <span>Salary figures are indicative and are not a guarantee of employment or pay.</span>
          </div>
        </Wrap>
      </footer>
    </section>
  );
}
