import { cn } from "@/lib/utils";

/** Sparkle eyebrow + headline pairing used at the top of every section. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  aside,
  className,
  size = "lg",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  aside?: React.ReactNode;
  className?: string;
  size?: "md" | "lg";
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-end justify-between gap-space-sm",
        className,
      )}
    >
      <div className="space-y-0.5">
        {eyebrow && (
          <div className="flex items-center gap-1.5 font-label-badge text-label-badge font-bold uppercase tracking-wider text-tertiary">
            <span aria-hidden>✦</span> {eyebrow}
          </div>
        )}
        <h2
          className={cn(
            "font-bold text-on-surface",
            size === "lg"
              ? "font-headline-lg text-headline-lg"
              : "font-headline-md text-headline-md",
          )}
        >
          {title}
        </h2>
      </div>
      {description && !aside && (
        <p className="max-w-md font-body-sm text-body-sm text-on-surface-variant">
          {description}
        </p>
      )}
      {aside}
    </div>
  );
}

/** Page-level title block with the big headline treatment. */
export function PageHeading({
  title,
  subtitle,
  badges,
  actions,
  className,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badges?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-space-md lg:flex-row lg:items-end lg:justify-between",
        className,
      )}
    >
      <div className="space-y-space-sm">
        {badges && <div className="flex flex-wrap items-center gap-2">{badges}</div>}
        <h1 className="font-headline-xl text-headline-xl-mobile font-bold tracking-tight text-on-surface sm:text-headline-xl">
          {title}
        </h1>
        {subtitle && (
          <p className="max-w-2xl font-body-lg text-body-lg text-on-surface-variant">
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-space-sm">{actions}</div>
      )}
    </div>
  );
}
