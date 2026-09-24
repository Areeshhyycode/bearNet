import { JOURNEY } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

/** Horizontal roadmap rail — five cozy ranks from Sprout to VAPT. */
export function JourneyTrack({ fillPercent = 36 }: { fillPercent?: number }) {
  return (
    <div className="w-full overflow-x-auto py-4 no-scrollbar">
      <div className="relative flex min-w-[720px] items-center justify-between">
        {/* Connector rails */}
        <div className="absolute left-6 right-6 top-1/2 z-0 h-1 -translate-y-1/2 rounded-full bg-surface-container" />
        <div
          className="absolute left-6 top-1/2 z-0 h-1 -translate-y-1/2 rounded-full bg-primary transition-all duration-700"
          style={{ width: `${fillPercent}%` }}
        />

        {JOURNEY.map((stage) => (
          <div
            key={stage.id}
            className={cn(
              "relative z-10 flex flex-col items-center gap-2",
              stage.state === "locked" && "opacity-70",
            )}
          >
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full text-xl transition-transform hover:scale-105",
                stage.state === "completed" &&
                  "bg-primary text-on-primary shadow-sm",
                stage.state === "current" &&
                  "bg-primary-container text-on-primary-container shadow-md ring-4 ring-primary-fixed",
                stage.state === "locked" &&
                  "bg-surface-container-high text-on-surface-variant",
              )}
              aria-hidden
            >
              {stage.emoji}
            </div>
            <div className="text-center">
              <div className="font-headline-md text-[14px] font-bold text-on-surface">
                {stage.title}
              </div>
              <div
                className={cn(
                  "font-label-badge text-label-badge",
                  stage.state === "completed"
                    ? "font-semibold text-tertiary"
                    : stage.state === "current"
                      ? "font-semibold text-on-surface-variant"
                      : "text-on-surface-variant",
                )}
              >
                {stage.caption}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Vertical variant used on the Progress page. */
export function JourneyLadder() {
  return (
    <ol className="flex flex-col">
      {JOURNEY.map((stage, index) => (
        <li key={stage.id} className="flex gap-space-md">
          {/* Rail */}
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-2xl",
                stage.state === "completed" && "bg-primary text-on-primary",
                stage.state === "current" &&
                  "bg-primary-container text-on-primary-container ring-4 ring-primary-fixed",
                stage.state === "locked" &&
                  "bg-surface-container-high text-on-surface-variant opacity-70",
              )}
              aria-hidden
            >
              {stage.emoji}
            </div>
            {index < JOURNEY.length - 1 && (
              <div
                className={cn(
                  "my-1 w-1 flex-1 rounded-full",
                  stage.state === "locked"
                    ? "bg-surface-container"
                    : "bg-primary-fixed-dim",
                )}
              />
            )}
          </div>

          {/* Copy */}
          <div
            className={cn(
              "mb-space-md flex-1 rounded-[20px] p-space-md transition-colors",
              stage.state === "current"
                ? "bg-primary-fixed"
                : "bg-surface-container-low",
              stage.state === "locked" && "opacity-70",
            )}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-headline-md text-[16px] font-bold text-on-surface">
                {stage.title}
              </h3>
              <span className="font-label-badge text-label-badge font-semibold uppercase tracking-wider text-on-surface-variant">
                {stage.caption}
              </span>
            </div>
            <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
              {stage.description}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
