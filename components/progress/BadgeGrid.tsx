"use client";

import { BADGE_DEFINITIONS } from "@/lib/mock-data";
import { useNotes } from "@/lib/notes-store";
import { useProgress } from "@/lib/progress-store";
import { ProgressBar } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

/** Achievements, each one computed from real activity. */
export function BadgeGrid() {
  const { notes } = useNotes();
  const { runs, streak, labsSolved, quizzesCompleted, rank } = useProgress();

  const earned: Record<string, boolean> = {
    "first-note": notes.length >= 1,
    "streak-7": streak >= 7,
    "quiz-5": quizzesCompleted >= 5,
    "sharp-shot": runs.some((run) => run.percent === 100),
    "exam-pass": runs.some((run) => run.mode === "exam" && run.passed),
    "lab-solved": labsSolved.length >= 1,
    "note-collector": notes.length >= 10,
    "polar-pro": rank.id === "vapt",
  };

  const earnedCount = Object.values(earned).filter(Boolean).length;

  return (
    <div className="flex flex-col gap-space-md rounded-[28px] bg-surface-container-lowest p-space-lg shadow-cozy">
      <div className="flex items-center justify-between">
        <h3 className="font-headline-md text-[16px] font-bold text-on-surface">
          🏅 Badges
        </h3>
        <span className="font-label-badge text-label-badge text-on-surface-variant">
          {earnedCount} of {BADGE_DEFINITIONS.length} earned
        </span>
      </div>

      <div className="grid grid-cols-2 gap-space-sm sm:grid-cols-4">
        {BADGE_DEFINITIONS.map((badge) => {
          const isEarned = earned[badge.id];
          return (
            <div
              key={badge.id}
              className={cn(
                "flex flex-col items-center gap-1 rounded-[20px] p-space-md text-center transition-all",
                isEarned
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
                {isEarned ? "Earned ✓" : `🔒 ${badge.caption}`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Per-topic mastery, built from every graded answer so far. */
export function MasteryList() {
  const { topicMastery } = useProgress();

  return (
    <div className="flex flex-col gap-space-md rounded-[28px] bg-surface-container-lowest p-space-lg shadow-cozy">
      <div className="flex items-center justify-between">
        <h3 className="font-headline-md text-[16px] font-bold text-on-surface">
          🌸 Topic mastery
        </h3>
        <span className="font-label-badge text-label-badge text-on-surface-variant">
          {topicMastery.length === 0 ? "No data yet" : "From your answers"}
        </span>
      </div>

      {topicMastery.length === 0 ? (
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Take a quiz or an exam and every topic you touch shows up here, scored
          from your actual answers.
        </p>
      ) : (
        <div className="flex flex-col gap-space-sm">
          {topicMastery.map((topic) => (
            <div key={topic.topic} className="space-y-1">
              <div className="flex items-center justify-between font-body-sm text-body-sm">
                <span className="text-on-surface">{topic.topic}</span>
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
                  {topic.percent}%{" "}
                  <span className="font-normal text-on-surface-variant">
                    ({topic.total} q)
                  </span>
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
      )}
    </div>
  );
}
