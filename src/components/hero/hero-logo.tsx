"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const SRC = "/zskillup-logo-black.png";

/**
 * Logo slot inside the hero heading. From `sm` up it is the visible logo; on mobile it is an invisible placeholder
 * that keeps the heading's layout while `PinnedLogo` sits on top of it.
 */
export function HeroLogoHome() {
  return (
    <span
      id="hero-logo-home"
      className="mr-1 inline-block h-[1.38em] w-[calc(1.38em*95/32)] translate-y-[0.22em] align-baseline max-sm:invisible"
    >
      <Image src={SRC} alt="ZSkillup" width={95} height={32} className="h-full w-auto" />
    </span>
  );
}

/**
 * Mobile only. Starts exactly over `#hero-logo-home`, rises with the page, then pins in the header's logo slot
 * (`#header-logo-slot`). The vertical pin is `position: sticky`, so it is handled by the browser's scroller and cannot
 * jitter. The sideways travel is a scroll-driven CSS animation (see `globals.css`); browsers without
 * `animation-timeline` fall back to updating it on scroll.
 */
export function PinnedLogo() {
  const wrap = useRef<HTMLDivElement>(null);
  const logo = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const wrap0 = wrap.current;
    const logo0 = logo.current;
    const home = document.getElementById("hero-logo-home");
    const slot = document.getElementById("header-logo-slot");
    const before = wrap0?.previousElementSibling as HTMLElement | null;
    if (!wrap0 || !logo0 || !home || !slot || !before) return;
    const native = CSS.supports("animation-timeline: scroll()");
    let dx = 0;
    let d = 1;

    const measure = () => {
      const h = home.getBoundingClientRect();
      const s = slot.getBoundingClientRect();
      const wrapTop = wrap0.parentElement!.getBoundingClientRect().top + window.scrollY + before.offsetHeight;
      const homeTop = h.top + window.scrollY;
      const offset = homeTop - wrapTop; // resting distance of the logo below the sticky wrapper
      d = Math.max(1, homeTop - s.top); // scroll distance until the logo reaches the header slot
      dx = s.left - h.left;
      wrap0.style.top = `${s.top - offset}px`;
      logo0.style.top = `${offset}px`;
      logo0.style.left = `${h.left}px`;
      logo0.style.setProperty("--logo-d", `${d}px`);
      logo0.style.setProperty("--logo-dx", `${dx}px`);
      logo0.style.visibility = "visible";
      if (!native) slide();
    };
    const slide = () => {
      const p = Math.min(1, Math.max(0, window.scrollY / d));
      logo0.style.transform = `translateX(${dx * p}px)`;
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.documentElement);
    ro.observe(home);
    if (!native) window.addEventListener("scroll", slide, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", slide);
    };
  }, []);

  return (
    <div ref={wrap} aria-hidden={false} className="pointer-events-none sticky z-50 h-0 sm:hidden">
      <a
        ref={logo}
        data-logo-slide
        href="#s01"
        aria-label="ZSkillup home"
        style={{ visibility: "hidden" }}
        className="pointer-events-auto absolute block h-8 w-[calc(2rem*95/32)]"
      >
        <Image src={SRC} alt="ZSkillup" width={95} height={32} className="h-full w-auto" />
      </a>
    </div>
  );
}
