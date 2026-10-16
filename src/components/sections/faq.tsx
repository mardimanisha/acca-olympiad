"use client";

import { MessageCircle, Phone, Plus } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Stagger, Tile } from "@/components/motion";
import { Section, Wrap } from "@/components/site";
import { EVENT, FAQS } from "@/lib/content";

/** s14 — FAQs with a help tile. */
export function Faq() {
  return (
    <Section id="s14">
      <Wrap>
        <Stagger className="grid items-start gap-3.5 sm:gap-5 lg:grid-cols-[minmax(0,.75fr)_minmax(0,1.25fr)]">
          <div className="grid gap-3.5 sm:gap-5">
            <Tile tone="mint" pad="none" className="p-6 sm:p-[34px]">
              <span className="eyebrow">FAQs</span>
              <h2 className="h-section leading-[1.1]">Questions, answered.</h2>
              <p className="mt-2.5">Everything students and parents usually ask before registering.</p>
            </Tile>
            <Tile tone="navy" className="grid gap-3">
              <b className="text-[1.05rem] text-white">Need help?</b>
              <a href={EVENT.phoneHref} className="flex items-center gap-2.5 font-bold text-white hover:text-aqua">
                <Phone className="size-[18px] text-aqua" /> {EVENT.phone}
              </a>
              <a href={EVENT.whatsappHref} target="_blank" rel="noopener" className="flex items-center gap-2.5 font-bold text-white hover:text-aqua">
                <MessageCircle className="size-[18px] text-aqua" /> Chat on WhatsApp
              </a>
            </Tile>
          </div>

          <Tile pad="none" className="px-5 py-1 sm:px-[30px] sm:py-2">
            <Accordion multiple defaultValue={[0, 1]}>
              {FAQS.map((f, i) => (
                <AccordionItem key={f.q} value={i} className="border-line">
                  <AccordionTrigger className="items-center gap-3.5 py-[18px] text-base font-bold text-navy hover:no-underline **:data-[slot=accordion-trigger-icon]:hidden">
                    {f.q}
                    <span className="ml-auto grid size-7 flex-none place-items-center rounded-full bg-mint text-teal-deep transition-transform duration-300 group-aria-expanded/accordion-trigger:rotate-45">
                      <Plus className="size-4" strokeWidth={3} />
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-[18px] text-[0.93rem] text-body sm:pr-11">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Tile>
        </Stagger>
      </Wrap>
    </Section>
  );
}
