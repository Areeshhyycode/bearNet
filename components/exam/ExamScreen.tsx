"use client";

import { PageHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { QuizSession } from "@/components/quiz/QuizSession";
import { useProgress } from "@/lib/progress-store";

export function ExamScreen() {
  const { runs, examsCompleted, preferences } = useProgress();

  const examRuns = runs.filter((run) => run.mode === "exam");
  const best = examRuns.reduce(
    (top, run) => (run.percent > (top?.percent ?? -1) ? run : top),
    examRuns[0],
  );
  const passed = examRuns.filter((run) => run.passed).length;

  /** Readiness is simply the average of recent exam scores. */
  const readiness =
    examRuns.length === 0
      ? null
      : Math.round(
          examRuns.slice(0, 5).reduce((sum, r) => sum + r.percent, 0) /
            Math.min(5, examRuns.length),
        );

  return (
    <>
      <PageHeading
        title={
          <>
            <span aria-hidden>🎀</span> Let&apos;s See What You Remember!
          </>
        }
        subtitle="A full exam simulation built from your notes — pick a topic, set the difficulty, and take a proper run at it. Answers stay hidden until the end."
        badges={
          <>
            <Badge tone="blush" size="md">
              <span aria-hidden>🎓</span> {preferences.certTarget}
            </Badge>
            <Badge tone="neutral" size="md">
              {examsCompleted === 0
                ? "No exams taken yet"
                : `${examsCompleted} taken · ${passed} passed`}
            </Badge>
          </>
        }
      />

      <section className="grid grid-cols-2 gap-space-md lg:grid-cols-4">
        <StatCard
          emoji="🎓"
          label="Exams Completed"
          value={examsCompleted}
          caption={examsCompleted === 0 ? "Your first is below" : `${passed} passed`}
        />
        <StatCard
          emoji="🏅"
          label="Best Score"
          value={best ? `${best.percent}%` : "—"}
          caption={best ? best.topic : "No runs yet"}
        />
        <StatCard emoji="📜" label="Pass Mark" value="80%" caption="Net+ standard" />
        <StatCard
          emoji="🌸"
          label="Readiness"
          value={readiness === null ? "—" : `${readiness}%`}
          caption={
            readiness === null ? "Take an exam to measure" : "Average of last 5"
          }
        />
      </section>

      <QuizSession mode="exam" />
    </>
  );
}
