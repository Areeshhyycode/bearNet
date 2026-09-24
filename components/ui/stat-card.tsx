import { cn } from "@/lib/utils";
import { Card } from "./card";

/** Compact metric tile: emoji, big number, caption. */
export function StatCard({
  emoji,
  value,
  label,
  caption,
  tone = "lowest",
  className,
}: {
  emoji: string;
  value: React.ReactNode;
  label: string;
  caption?: string;
  tone?: "lowest" | "low" | "blush";
  className?: string;
}) {
  const toneClass = {
    lowest: "bg-surface-container-lowest",
    low: "bg-surface-container-low shadow-soft",
    blush: "bg-primary-fixed shadow-soft",
  }[tone];

  return (
    <Card className={cn("p-space-md", toneClass, className)}>
      <div className="flex items-start justify-between gap-2">
        <span className="font-label-badge text-label-badge uppercase tracking-wider text-on-surface-variant">
          {label}
        </span>
        <span className="text-[18px] leading-none" aria-hidden>
          {emoji}
        </span>
      </div>
      <div className="mt-2 font-headline-lg text-headline-lg font-bold text-on-surface">
        {value}
      </div>
      {caption && (
        <p className="mt-0.5 font-body-sm text-body-sm text-on-surface-variant">
          {caption}
        </p>
      )}
    </Card>
  );
}
