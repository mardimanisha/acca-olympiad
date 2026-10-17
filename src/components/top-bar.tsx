import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { Wrap } from "@/components/site";
import { NAV } from "@/lib/content";
import { cn } from "@/lib/utils";

/** Sticky site header. The countdown and main CTA live in the bottom bar (`floating.tsx`). */
export function TopBar() {
  return (
    <div className="sticky top-0 z-40">
      <SiteHeader />
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="bg-canvas/90 backdrop-blur-md">
      <Wrap className="flex items-center justify-between py-2.5 sm:py-3">
        <a href="#s01" aria-label="ZSkillup home">
          <Image src="/zskillup-logo-black.png" alt="ZSkillup" width={95} height={32} className="h-8 w-auto" preload />
        </a>
        <nav className="hidden gap-1.5 rounded-full border border-line bg-white p-[5px] text-[0.93rem] font-semibold lg:flex">
          {NAV.map((n, i) => (
            <a
              key={n.href}
              href={n.href}
              className={cn(
                "rounded-full px-4 py-2 text-navy transition-colors hover:bg-mint",
                i === 0 && "bg-mint text-teal-deep",
              )}
            >
              {n.label}
            </a>
          ))}
        </nav>
        <a href="#register" className={cn(buttonVariants({ variant: "brand", size: "pill-sm" }), "max-sm:hidden")}>
          Register Free
        </a>
      </Wrap>
    </header>
  );
}
