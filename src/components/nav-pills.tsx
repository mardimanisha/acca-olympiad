"use client";

import { useEffect, useRef, useState } from "react";
import { NAV } from "@/lib/content";
import { cn } from "@/lib/utils";

/** Header nav pills; the green pill follows the section currently in view. */
export function NavPills() {
  const [active, setActive] = useState(NAV[0].href);
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);
  const clickLock = useRef(false);
  const idleTimer = useRef<number | undefined>(undefined);
  const linkRefs =useRef<Record<string, HTMLAnchorElement | null>>({});

  useEffect(() => {
    const ids = NAV.map((n) => n.href.slice(1));
    const update = () => {
      const line = 120;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      // At the very bottom, the last section may never reach the line.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        current = ids[ids.length - 1];
      }
      setActive(`#${current}`);
    };
    // After a tab click, the smooth scroll passes over other sections; hold the clicked tab until it stops.
    const onScroll = () => {
      if (!clickLock.current) return update();
      window.clearTimeout(idleTimer.current);
      idleTimer.current = window.setTimeout(() => {
        clickLock.current = false;
        update();
      }, 150);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.clearTimeout(idleTimer.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    const measure = () => {
      const el = linkRefs.current[active];
      if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active]);

  return (
    <nav className="relative hidden gap-1.5 rounded-full border border-line bg-white p-[5px] text-[0.93rem] font-semibold lg:flex">
      {pill && (
        <span
          aria-hidden
          className="absolute top-[5px] bottom-[5px] rounded-full bg-mint transition-[left,width] duration-300 ease-out motion-reduce:transition-none"
          style={{ left: pill.left, width: pill.width }}
        />
      )}
      {NAV.map((n) => (
        <a
          key={n.href}
          href={n.href}
          ref={(el) => {
            linkRefs.current[n.href] = el;
          }}
          onClick={() => {
            clickLock.current = true;
            setActive(n.href);
            // If the page doesn't scroll (already at target), release the lock.
            window.clearTimeout(idleTimer.current);
            idleTimer.current = window.setTimeout(() => {
              clickLock.current = false;
            }, 300);
          }}
          aria-current={active === n.href ? "true" : undefined}
          className={cn(
            "relative rounded-full px-4 py-2 text-navy transition-colors duration-300",
            active === n.href && "text-teal-deep",
          )}
        >
          {n.label}
        </a>
      ))}
    </nav>
  );
}
