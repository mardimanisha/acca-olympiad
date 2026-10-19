# NCO 2027 landing page (V15 "Bento Grid")

Next.js port of `../nco-2027-landing-v15.html`, built with Tailwind CSS 4, shadcn/ui (base-nova / Base UI) and Motion.

```bash
npm run dev     # http://localhost:3000
npm run build
```

## Layout

- `src/app/page.tsx` composes sections `s01`, `s03`–`s12` and `s14`–`s16` in the same order as the HTML design (the s02 "15 paths" marquee and the s13 "About ZSkillup" section were removed).
- `src/components/sections/*`: one file per section (`hero`, `conversation`, `receive`, `career-explorer`, `videos`, `mentor`, `assessment` (+ steps), `report`, `support`, `rewards`, `faq`, `closing` (final CTA + footer)).
- `src/components/motion.tsx`: `Tile` (bento card in white/mint/navy/teal/amber), `Stagger`, `FadeIn`, `Bar` and the `MotionProvider` (respects reduced motion).
- `src/lib/content.ts`: page copy. `src/lib/careers.ts`: career explorer data (copied verbatim from V15).
- `src/lib/career-store.ts`: selected career, shared by the hero compass and the explorer, mirrored in `#career=<id>`.
- Brand tokens (teal, navy, mint, amber …) are defined in `src/app/globals.css` and mapped onto the shadcn variables.

## Not wired up yet

- Registration form validates and shows a confirmation but does not submit anywhere.
- Video and reel cards have no video sources.
- Footer legal links point to `#`.
- FAQ answers 3–10 were drafted from facts elsewhere on the page and need review.
- Countdown targets 10:00 IST on 20 Dec 2026, a placeholder until the start time is confirmed.
