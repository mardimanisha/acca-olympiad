import { HeaderLogo } from "@/components/header-logo";
import { buttonVariants } from "@/components/ui/button";
import { Wrap } from "@/components/site";
import { MobileMenu } from "@/components/mobile-menu";
import { NavPills } from "@/components/nav-pills";
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
    <header className="relative bg-canvas/90 backdrop-blur-md">
      <Wrap className="flex items-center justify-between py-2.5 sm:py-3">
        <HeaderLogo />
        <NavPills />
        <div className="flex items-center gap-2.5">
          <a href="#register" className={cn(buttonVariants({ variant: "brand", size: "pill-sm" }), "max-sm:hidden")}>
            Register Now
          </a>
          <MobileMenu />
        </div>
      </Wrap>
    </header>
  );
}
