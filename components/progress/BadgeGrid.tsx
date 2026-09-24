import { BADGES, TOPIC_MASTERY } from "@/lib/mock-data";
import { ProgressBar } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

/** Earned and locked achievement pins. */
export function BadgeGrid() {
  return (
    <div className="flex flex-col gap-space-md rounded-[28px] bg-surface-container-lowest p-space-lg shadow-cozy">
      <div className="flex items-center justify-between">
        <h3 className="font-headline-md text-[16px] font-bold text-on-surface">
          🏅 Badges
        </h3>
        <span className="font-label-badge text-label-badge text-on-surface-variant">
          {BADGES.filter((b) => b.earned).length} of {BADGES.length} earned
        </span>
      </div>

      <div className="grid grid-cols-2 gap-space-sm sm:grid-cols-3">
        {BADGES.map((badge) => (
          <div
            key={badge.title}
            className={cn(
              "flex flex-col items-center gap-1 rounded-[20px] p-space-md text-center transition-all",
              badge.earned
                ? "bg-primary-fixed hover:-translate-y-0.5"
                : "bg-surface-container-low opacity-60",
            )}
          >
            <span className="text-2xl" aria-hidden>
              {badge.emoji}
            </span>
            <span className="font-body-sm text-body-sm font-semibold text-on-surface">
              {badge.title}
            </span>
            <span className="font-label-badge text-label-badge text-on-surface-variant">
              {badge.earned ? badge.caption : `🔒 ${badge.caption}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Per-topic mastery bars. */
export function MasteryList() {
  return (
    <div className="flex flex-col gap-space-md rounded-[28px] bg-surface-container-lowest p-space-lg shadow-cozy">
      <div className="flex items-center justify-between">
        <h3 className="font-headline-md text-[16px] font-bold text-on-surface">
          🌸 Topic mastery
        </h3>
        <span className="font-label-badge text-label-badge text-on-surface-variant">
          Updated today
        </span>
      </div>

      <div className="flex flex-col gap-space-sm">
        {TOPIC_MASTERY.map((topic) => (
          <div key={topic.title} className="space-y-1">
            <div className="flex items-center justify-between font-body-sm text-body-sm">
              <span className="text-on-surface">{topic.title}</span>
              <span
                className={cn(
                  "font-bold",
                  topic.percent >= 85
                    ? "text-tertiary"
                    : topic.percent >= 70
                      ? "text-on-surface"
                      : "text-on-surface-variant",
                )}
              >
                {topic.percent}%
              </span>
            </div>
            <ProgressBar
              value={topic.percent}
              size="sm"
              barClassName={
                topic.percent >= 85
                  ? "bg-primary"
                  : topic.percent >= 70
                    ? "bg-primary-container"
                    : "bg-tertiary-container"
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
