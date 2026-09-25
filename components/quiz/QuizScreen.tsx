"use client";

import { PageHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { BearMascot } from "@/components/bears/BearMascot";
import { QuizSession } from "./QuizSession";
import { useProgress } from "@/lib/progress-store";
import { formatDuration } from "@/lib/quiz-types";

export function QuizScreen() {
  const { quizAccuracy, quizzesCompleted, runs, topicMastery } = useProgress();

  const quizRuns = runs.filter((run) => run.mode === "quiz");
  const lastRun = quizRuns[0];
  const weakest = [...topicMastery].sort((a, b) => a.percent - b.percent)[0];

  const averageSeconds =
    quizRuns.length > 0
      ? Math.round(
          quizRuns.reduce((sum, r) => sum + r.seconds / Math.max(1, r.total), 0) /
            quizRuns.length,
        )
      : null;

  return (
    <>
      <PageHeading
        title={
          <>
            <span aria-hidden>🧠</span> Quiz Me
          </>
        }
        subtitle="Short active-recall sprints. Answer fast, then find out what quietly slipped away."
        badges={
          <>
            <Badge tone="blush" size="md">
              <span aria-hidden>💡</span> Active recall sprint
            </Badge>
            <Badge tone="neutral" size="md">
              {quizzesCompleted === 0
                ? "No drills yet — your first one starts below"
                : `${quizzesCompleted} drill${quizzesCompleted === 1 ? "" : "s"} done · ${quizAccuracy}% accuracy`}
            </Badge>
          </>
        }
      />

      <section className="grid grid-cols-2 gap-space-md lg:grid-cols-4">
        <StatCard
          emoji="✨"
          label="Accuracy"
          value={quizAccuracy === null ? "—" : `${quizAccuracy}%`}
          caption={
            quizAccuracy === null ? "After your first run" : "Across every run"
          }
        />
        <StatCard
          emoji="🔥"
          label="Drills Done"
          value={quizzesCompleted}
          caption={lastRun ? `Last: ${lastRun.score}/${lastRun.total}` : "None yet"}
        />
        <StatCard
          emoji="⏱️"
          label="Avg. Answer"
          value={averageSeconds === null ? "—" : formatDuration(averageSeconds)}
          caption="Per question"
        />
        <StatCard
          emoji="🎯"
          label="Weakest Topic"
          value={weakest ? weakest.topic : "—"}
          caption={weakest ? `${weakest.percent}% mastery` : "Take a quiz to find out"}
        />
      </section>

      <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-12">
        <div className="lg:col-span-8">
          <QuizSession mode="quiz" />
        </div>

        <div className="flex flex-col gap-space-lg lg:col-span-4">
          <div className="flex flex-col items-center gap-2 rounded-[28px] bg-primary-fixed p-space-lg text-center">
            <BearMascot variant="grizzly" size={96} animated />
            <h2 className="font-headline-md text-[16px] font-bold text-on-primary-fixed">
              Grizzly&apos;s drill rules
            </h2>
            <ul className="space-y-1 font-body-sm text-body-sm text-on-primary-fixed/90">
              <li>🌸 Answer before you look anything up.</li>
              <li>🧮 Wrong answers show you why, right away.</li>
              <li>☕ Five minutes counts as a full session.</li>
            </ul>
          </div>

          <div className="flex flex-col gap-space-sm rounded-[28px] bg-surface-container-low p-space-lg">
            <h3 className="font-headline-md text-[15px] font-bold text-on-surface">
              🎀 Recent drills
            </h3>

            {quizRuns.length === 0 ? (
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Nothing here yet. Finish a drill and your scores start stacking
                up.
              </p>
            ) : (
              quizRuns.slice(0, 5).map((run) => (
                <div
                  key={run.id}
                  className="flex items-center justify-between gap-2 rounded-xl bg-surface-container-lowest px-3 py-2 font-body-sm text-body-sm shadow-sm"
                >
                  <span className="min-w-0 truncate text-on-surface-variant">
                    {run.topic}
                  </span>
                  <span
                    className={`shrink-0 font-bold ${
                      run.percent >= 80 ? "text-tertiary" : "text-on-surface"
                    }`}
                  >
                    {run.score}/{run.total}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
