import { Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { LAB_CHALLENGES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const STATUS_TONE = {
  "In progress": "blush",
  Completed: "mint",
  Locked: "outline",
} as const;

/** Challenge shelf beside the active scenario. */
export function ChallengeList() {
  return (
    <div className="flex flex-col gap-space-sm rounded-[28px] bg-surface-container-low p-space-lg">
      <h3 className="font-headline-md text-[15px] font-bold text-on-surface">
        🧪 Lab Challenges
      </h3>

      {LAB_CHALLENGES.map((challenge) => {
        const locked = challenge.status === "Locked";
        return (
          <div
            key={challenge.id}
            className={cn(
              "flex flex-col gap-2 rounded-[20px] bg-surface-container-lowest p-space-md shadow-sm transition-all",
              locked ? "opacity-70" : "hover:-translate-y-0.5 hover:shadow-cozy",
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <span className="text-lg" aria-hidden>
                  {challenge.emoji}
                </span>
                <div className="min-w-0">
                  <div className="truncate font-body-md text-body-md font-semibold text-on-surface">
                    {challenge.title}
                  </div>
                  <div className="truncate font-body-sm text-body-sm text-on-surface-variant">
                    {challenge.caption}
                  </div>
                </div>
              </div>
              {locked ? (
                <Lock className="h-4 w-4 shrink-0 text-on-surface-variant" />
              ) : (
                <Badge tone={STATUS_TONE[challenge.status]}>
                  {challenge.status}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              <ProgressBar value={challenge.progress} size="sm" />
              <span className="shrink-0 font-label-badge text-label-badge text-on-surface-variant">
                {challenge.difficulty}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
