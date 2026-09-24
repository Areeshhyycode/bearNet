import { WEEKLY_ACTIVITY } from "@/lib/mock-data";

/** Weekly study minutes as soft blush bars. */
export function ActivityChart() {
  const max = Math.max(...WEEKLY_ACTIVITY.map((d) => d.minutes));

  return (
    <div className="flex flex-col gap-space-md rounded-[28px] bg-surface-container-lowest p-space-lg shadow-cozy">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h3 className="font-headline-md text-[16px] font-bold text-on-surface">
            ☕ This week&apos;s study time
          </h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            {WEEKLY_ACTIVITY.reduce((sum, d) => sum + d.minutes, 0)} minutes
            across 7 cozy sessions
          </p>
        </div>
        <span className="rounded-full bg-surface-container-low px-3 py-1 font-label-badge text-label-badge text-on-surface-variant">
          Goal: 45 min/day
        </span>
      </div>

      <div className="flex h-44 items-end justify-between gap-2">
        {WEEKLY_ACTIVITY.map((day) => {
          const height = Math.round((day.minutes / max) * 100);
          const hitGoal = day.minutes >= 45;
          return (
            <div
              key={day.day}
              className="flex h-full flex-1 flex-col items-center justify-end gap-2"
            >
              <span className="font-label-badge text-label-badge text-on-surface-variant">
                {day.minutes}
              </span>
              <div
                className={`w-full rounded-full transition-all duration-700 ease-out ${
                  hitGoal ? "bg-primary-container" : "bg-surface-container-high"
                }`}
                style={{ height: `${height}%` }}
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
