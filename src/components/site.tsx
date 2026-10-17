import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/motion";

/** Centered page container (1280px max, fluid gutters). */
export function Wrap({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mx-auto max-w-[1280px] px-[clamp(16px,3vw,32px)]", className)} {...props} />;
}

/** Standard vertical rhythm for content sections. */
export function Section({ className, ...props }: React.ComponentProps<"section">) {
  return <section className={cn("scroll-mt-16 py-[clamp(48px,6vw,80px)]", className)} {...props} />;
}

/** Eyebrow + headline on the left, optional intro paragraph on the right. */
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
    <FadeIn
      className={cn(
        "mb-[22px] flex flex-col items-start gap-2.5 sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-x-12 sm:gap-y-6",
        center && "items-center text-center sm:justify-center",
      )}
    >
      <div className="max-w-[640px]">
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="h-section">{title}</h2>
      </div>
      {intro && <p className="m-0 max-w-[44ch] text-[1.02rem]">{intro}</p>}
    </FadeIn>
  );
}
