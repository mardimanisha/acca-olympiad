"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NAV } from "@/lib/content";

/** Hamburger menu with the header nav links, shown below `lg` where the nav pills are hidden. */
export function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((o) => !o)}
        className="grid size-10 place-items-center rounded-full border border-line bg-white text-navy"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 top-0 -z-10 bg-navy/20" onClick={() => setOpen(false)} aria-hidden />
          <nav
            id="mobile-menu"
            className="absolute inset-x-0 top-full border-t border-line bg-white px-4 py-3 shadow-lg"
          >
            <ul className="mx-auto flex max-w-[1104px] flex-col">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-3 text-center text-[1.02rem] font-semibold text-navy hover:bg-mint hover:text-teal-deep"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
              <li className="mt-1 sm:hidden">
                <a
                  href="#register"
                  onClick={() => setOpen(false)}
                  className="block rounded-full bg-teal px-4 py-3 text-center text-[0.95rem] font-bold text-white"
                >
                  Register Now
                </a>
              </li>
            </ul>
          </nav>
        </>
      )}
    </div>
  );
}
