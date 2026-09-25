"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/lib/progress-store";

/** Certification readiness, measured from real exam runs. */
export function ExamCountdown() {
  const { profile, runs, examsCompleted, quizAccuracy, streak } = useProgress();

  const examRuns = runs.filter((run) => run.mode === "exam");
  const readiness =
    examRuns.length === 0
      ? null
      : Math.round(
          examRuns.slice(0, 5).reduce((sum, r) => sum + r.percent, 0) /
            Math.min(5, examRuns.length),
        );

  const cells = [
    { value: examsCompleted, label: "Exams", accent: false },
    {
      value: quizAccuracy === null ? "—" : `${quizAccuracy}%`,
      label: "Accuracy",
      accent: false,
    },
    {
      value: readiness === null ? "—" : `${readiness}%`,
      label: "Ready",
      accent: true,
    },
  ];

  return (
    <div className="flex flex-col justify-between gap-space-md rounded-[28px] bg-surface-container-lowest p-space-md shadow-cozy sm:p-space-lg lg:col-span-4">
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-2">
          <span className="font-label-badge text-label-badge font-semibold uppercase tracking-wider text-on-surface-variant">
            Certification target
          </span>
          <Badge tone="lavender">🔥 {streak}d streak</Badge>
        </div>
        <h3 className="font-headline-md text-[18px] font-bold text-on-surface">
          {profile.certTarget}
        </h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          {readiness === null
            ? "Take a full exam run and Panda can estimate how ready you are."
            : readiness >= 80
              ? "You are sitting above the pass mark. Keep it steady. 🌸"
              : `${80 - readiness}% below the pass mark — a couple more runs should close it.`}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {cells.map((cell) => (
          <div
            key={cell.label}
            className="flex-1 rounded-xl bg-surface-container-low p-2 text-center"
          >
            <div
              className={`font-headline-md text-headline-md font-bold ${
                cell.accent ? "text-tertiary" : "text-on-surface"
              }`}
            >
              {cell.value}
            </div>
            <div className="font-label-badge text-label-badge text-on-surface-variant">
              {cell.label}
            </div>
          </div>
        ))}
      </div>

      <Button variant="secondary" block href="/exam">
        {examsCompleted === 0 ? "Take my first exam" : "Enter the exam room"}
      </Button>
    </div>
  );
}
