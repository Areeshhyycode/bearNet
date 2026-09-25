"use client";

import { useProgress } from "@/lib/progress-store";

/** Weekly study minutes as soft blush bars, from real session time. */
export function ActivityChart() {
  const { weeklyActivity, profile, minutesThisWeek } = useProgress();
  const goal = profile.dailyGoalMinutes;

  // Keep bars readable even on a quiet week.
  const max = Math.max(goal, ...weeklyActivity.map((d) => d.minutes), 1);

  return (
    <div className="flex flex-col gap-space-md rounded-[28px] bg-surface-container-lowest p-space-lg shadow-cozy">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h3 className="font-headline-md text-[16px] font-bold text-on-surface">
            ☕ This week&apos;s study time
          </h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            {minutesThisWeek === 0
              ? "No sessions logged yet — quizzes and the timer count toward this."
              : `${minutesThisWeek} minutes over the last 7 days`}
          </p>
        </div>
        <span className="rounded-full bg-surface-container-low px-3 py-1 font-label-badge text-label-badge text-on-surface-variant">
          Goal: {goal} min/day
        </span>
      </div>

      <div className="flex h-44 items-end justify-between gap-2">
        {weeklyActivity.map((day) => {
          const height = Math.round((day.minutes / max) * 100);
          const hitGoal = day.minutes >= goal;

          return (
            <div
              key={day.date}
              className="flex h-full flex-1 flex-col items-center justify-end gap-2"
            >
              <span className="font-label-badge text-label-badge text-on-surface-variant">
                {day.minutes || ""}
              </span>
              <div
                className={`w-full rounded-full transition-all duration-700 ease-out ${
                  hitGoal
                    ? "bg-primary-container"
                    : day.minutes > 0
                      ? "bg-surface-container-high"
                      : "bg-surface-container"
                }`}
                style={{ height: `${Math.max(height, day.minutes > 0 ? 6 : 3)}%` }}
                title={`${day.day}: ${day.minutes} minutes`}
              />
              <span className="font-label-badge text-label-badge font-semibold text-on-surface-variant">
                {day.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
