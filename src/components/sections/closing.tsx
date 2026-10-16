import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { FadeIn } from "@/components/motion";
import { Wrap } from "@/components/site";
import { EVENT } from "@/lib/content";
import { cn } from "@/lib/utils";

/** s15 — final call to action. */
export function FinalCta() {
  return (
    <section id="s15" className="py-[clamp(48px,6vw,80px)]">
      <Wrap>
        <FadeIn className="relative overflow-hidden rounded-tile bg-navy px-[22px] py-11 text-center text-mist sm:px-8 sm:py-[clamp(48px,6vw,80px)]">
          <span className="pointer-events-none absolute -top-[60%] left-1/2 -ml-[450px] h-[600px] w-[900px] animate-pulse rounded-full bg-[radial-gradient(circle,rgba(14,124,112,.35),transparent_65%)] [animation-duration:5s]" />
          <div className="relative">
            <span className="eyebrow text-aqua">{EVENT.name}</span>
            <h2 className="mx-auto mt-3 max-w-[18ch] text-[clamp(2rem,4vw,3rem)] leading-[1.08] font-extrabold tracking-[-0.03em] text-balance text-white">
              Don&apos;t choose a career just because <em className="text-aqua not-italic">everyone else is.</em>
            </h2>
            <p className="mx-auto mt-3.5 max-w-[54ch] text-[1.05rem]">
              Discover your strengths. Understand your options. Explore careers and qualifications that could be right for you.
            </p>
            <div className="mt-[30px] flex justify-center">
              <a href="#register" className={cn(buttonVariants({ variant: "amber", size: "pill" }), "max-sm:w-full")}>
                Register for Free <ArrowRight />
              </a>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {[EVENT.dateLabel, "60 minutes", "Online", "₹0 fee", `Scholarships up to ${EVENT.scholarship}`].map((m) => (
                <span key={m} className="rounded-full border border-navy-line px-3.5 py-[7px] text-[0.84rem] font-bold text-white">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </FadeIn>
      </Wrap>
    </section>
  );
}

const FOOTER = [
  { title: "Olympiad", links: [["Career explorer", "#s05"], ["Assessment", "#s08"], ["Sample report", "#s10"], ["Rewards", "#s12"]] },
  { title: "Rules & legal", links: [["Assessment rules", "#"], ["Scholarship rules", "#"], ["Privacy notice", "#"], ["Terms", "#"]] },
  { title: "Contact", links: [[EVENT.phone, EVENT.phoneHref], ["WhatsApp community", EVENT.whatsappHref], ["FAQs", "#s14"]] },
];

/** s16 — footer. */
export function Footer() {
  return (
    <section id="s16">
      <footer className="bg-ink-footer pt-12 pb-6 text-[0.9rem] text-[#8E9BB5] max-sm:pb-28">
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
