import Image from "next/image";

/**
 * Header logo. On mobile it is invisible and only reserves the slot (`#header-logo-slot`) that the hero heading's
 * logo travels to on scroll. Visible from `sm` up.
 */
export function HeaderLogo() {
  return (
    <a id="header-logo-slot" href="#s01" aria-label="ZSkillup home" className="max-sm:pointer-events-none max-sm:invisible">
      <Image src="/zskillup-logo-black.png" alt="ZSkillup" width={95} height={32} className="h-8 w-auto" preload />
    </a>
  );
}
