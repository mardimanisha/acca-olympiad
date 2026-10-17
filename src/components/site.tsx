import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/motion";

/** Centered page container (1280px max, fluid gutters). */
export function Wrap({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mx-auto max-w-[1280px] px-[clamp(16px,3vw,32px)]", className)} {...props} />;
}

/** Standard vertical rhythm for content sections. */
export function Section({ className, ...props }: React.ComponentProps<"section">) {
  return <section className={cn("scroll-mt-20 py-[clamp(28px,3.5vw,48px)]", className)} {...props} />;
}

/** Eyebrow, headline (one line where it fits) and an optional intro paragraph below. */
export function SectionHead({
  eyebrow,
  title,
  intro,
  center,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
  center?: boolean;
}) {
  return (
    <FadeIn className={cn("mb-[22px] sm:mb-8", center && "text-center")}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="h-section">{title}</h2>
      {intro && <p className={cn("mt-2.5 max-w-[72ch] text-[1.02rem]", center && "mx-auto")}>{intro}</p>}
    </FadeIn>
  );
}
