import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { ModuleTone } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

/**
 * One of the six study-station cards on the hub.
 * `children` renders the tinted detail block in the middle.
 */
export function ModuleCard({
  href,
  emoji,
  bearEmoji,
  title,
  description,
  cta,
  tone = "soft",
  footnote,
  online = false,
  children,
}: {
  href: string;
  emoji: string;
  bearEmoji: string;
  title: string;
  description: string;
  cta: string;
  tone?: ModuleTone;
  footnote?: string;
  online?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <Card
      hoverable
      className="group relative flex flex-col justify-between"
      // article semantics without losing the Card styling
      role="article"
    >
      <div
        className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-low text-[18px]"
        aria-hidden
      >
        {bearEmoji}
      </div>

      <div className="space-y-space-md">
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden>
            {emoji}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                {title}
              </h3>
              {online && (
                <span className="h-2 w-2 animate-pulse rounded-full bg-tertiary" />
              )}
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {description}
            </p>
          </div>
        </div>

        {children}

        {footnote && (
          <p className="line-clamp-2 font-body-sm text-body-sm text-on-surface-variant">
            {footnote}
          </p>
        )}
      </div>

      <div className="pt-space-lg">
        <Link
          href={href}
          className={cn(
            "inline-flex w-full items-center justify-between rounded-full px-4 py-2.5 font-body-sm text-body-sm font-semibold transition-all duration-200",
            tone === "strong"
              ? "bg-primary-container text-on-primary-container shadow-sm hover:bg-primary-fixed-dim group-hover:shadow-md"
              : "bg-surface-container-high text-on-surface hover:bg-primary-container hover:text-on-primary-container group-hover:shadow-sm",
          )}
        >
          <span>{cta}</span>
          <ArrowRight className="h-[18px] w-[18px] transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </Card>
  );
}
