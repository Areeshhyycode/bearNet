"use client";

import Link from "next/link";
import { ArrowRight, Check, RotateCcw, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressBar, ProgressRing } from "@/components/ui/progress";
import { BearMascot } from "@/components/bears/BearMascot";
import { useNotes } from "@/lib/notes-store";
import { XP } from "@/lib/progress-store";
import { formatDuration, type QuizResult } from "@/lib/quiz-types";
import { cn } from "@/lib/utils";

/** Score screen for both a quiz drill and a full exam. */
export function ResultView({
  result,
  onRetry,
}: {
  result: QuizResult;
  onRetry: () => void;
}) {
  const { notes } = useNotes();

  const strong = result.byTopic.filter((t) => t.percent >= 70);
  const revise = result.byTopic.filter((t) => t.percent < 70);

  const perCorrect =
    result.mode === "exam" ? XP.perCorrectExam : XP.perCorrectQuiz;
  const bonus = result.mode === "exam" && result.passed ? XP.examPassed : 0;
  const earned = result.score * perCorrect + bonus;

  /** Notes the learner already has on the topics they fumbled. */
  const recommended = notes
    .filter((note) => revise.some((topic) => note.topic === topic.topic))
    .slice(0, 3);

  const missingTopics = revise
    .filter((topic) => !notes.some((note) => note.topic === topic.topic))
    .slice(0, 3);

  const headline =
    result.percent === 100
      ? "Perfect run! 🎀"
      : result.percent >= 80
        ? "Really strong 🌸"
        : result.percent >= 50
          ? "Good start 🌱"
          : "Worth another pass ☕";

  return (
    <div className="flex flex-col gap-space-lg">
      {/* Score header */}
      <div className="relative overflow-hidden rounded-[28px] bg-surface-container-low p-space-md shadow-hero sm:p-space-xl">
        <div className="pointer-events-none absolute -right-14 -top-14 h-72 w-72 rounded-full bg-primary-container/25 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center gap-space-lg lg:flex-row lg:justify-between">
          <div className="flex items-center gap-space-md">
            <BearMascot
              variant={result.percent >= 80 ? "grizzly" : "polar"}
              size={96}
              animated
            />
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={result.passed ? "mint" : "neutral"} size="md">
                  {result.mode === "exam"
                    ? result.passed
                      ? "🎉 Passed"
                      : "Below 80% pass mark"
                    : "Drill complete"}
                </Badge>
                <Badge tone="outline">+{earned} XP</Badge>
              </div>
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">
                🐻 Your Result — {headline}
              </h2>
              <p className="max-w-md font-body-md text-body-md text-on-surface-variant">
                {result.topic} · {result.difficulty} · finished in{" "}
                {formatDuration(result.seconds)}.
              </p>
            </div>
          </div>

          <ProgressRing value={result.percent} size={160} stroke={14}>
            <span className="font-headline-xl text-[34px] font-bold leading-none text-on-surface">
              {result.score} / {result.total}
            </span>
            <span className="mt-1 font-headline-md text-[20px] font-bold text-tertiary">
              {result.percent}%
            </span>
          </ProgressRing>
        </div>
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-3">
        <Card className="flex flex-col gap-space-md">
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden>
              🌟
            </span>
            <h3 className="font-headline-md text-[16px] font-bold text-on-surface">
              Strong Topics
            </h3>
          </div>
          {strong.length === 0 ? (
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Nothing above 70% this time — that just means there is room to
              grow. Try the same topic again after a revision pass.
            </p>
          ) : (
            strong.map((topic) => (
              <div key={topic.topic} className="space-y-1.5">
                <div className="flex items-center justify-between font-body-sm text-body-sm">
                  <span className="text-on-surface">{topic.topic}</span>
                  <span className="font-bold text-tertiary">
                    {topic.correct}/{topic.total}
                  </span>
                </div>
                <ProgressBar value={topic.percent} size="sm" />
              </div>
            ))
          )}
        </Card>

        <Card className="flex flex-col gap-space-md">
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden>
              🌸
            </span>
            <h3 className="font-headline-md text-[16px] font-bold text-on-surface">
              Topics to Revise
            </h3>
          </div>
          {revise.length === 0 ? (
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Nothing to revise — you were above 70% on every topic. 🎀
            </p>
          ) : (
            revise.map((topic) => (
              <div key={topic.topic} className="space-y-1.5">
                <div className="flex items-center justify-between font-body-sm text-body-sm">
                  <span className="text-on-surface">{topic.topic}</span>
                  <span className="font-bold text-on-surface-variant">
                    {topic.correct}/{topic.total}
                  </span>
                </div>
                <ProgressBar
                  value={topic.percent}
                  size="sm"
                  barClassName="bg-tertiary-container"
                />
              </div>
            ))
          )}
        </Card>

        <Card className="flex flex-col gap-space-md">
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden>
              📚
            </span>
            <h3 className="font-headline-md text-[16px] font-bold text-on-surface">
              Recommended Notes
            </h3>
          </div>

          {recommended.map((note) => (
            <Link
              key={note.id}
              href={`/notes/${note.id}`}
              className="group flex items-center gap-2 rounded-xl bg-surface-container-low px-3 py-2.5 font-body-sm text-body-sm text-on-surface transition-all hover:-translate-y-0.5 hover:bg-primary-fixed"
            >
              <span aria-hidden>{note.emoji}</span>
              <span className="min-w-0 flex-1 truncate">{note.title}</span>
              <ArrowRight className="h-4 w-4 shrink-0 text-on-surface-variant transition-transform group-hover:translate-x-1" />
            </Link>
          ))}

          {missingTopics.map((topic) => (
            <Link
              key={topic.topic}
              href="/notes/new"
              className="group flex items-center gap-2 rounded-xl border-2 border-dashed border-primary-container px-3 py-2.5 font-body-sm text-body-sm text-on-surface-variant transition-all hover:bg-primary-fixed"
            >
              <span aria-hidden>✏️</span>
              <span className="min-w-0 flex-1 truncate">
                Write a note on {topic.topic}
              </span>
            </Link>
          ))}

          {recommended.length === 0 && missingTopics.length === 0 && (
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Nothing to send you back to — good work. 🌷
            </p>
          )}

          <div className="mt-auto flex flex-col gap-2 pt-1">
            <Button variant="secondary" block href="/tutor">
              🐼 Revise with Panda
            </Button>
            <Button variant="ghost" block onClick={onRetry}>
              <RotateCcw className="h-4 w-4" /> Try another run
            </Button>
          </div>
        </Card>
      </div>

      {/* Per-question review */}
      <Card className="flex flex-col gap-space-md">
        <h3 className="font-headline-md text-[16px] font-bold text-on-surface">
          📋 Question review
        </h3>

        <div className="flex flex-col gap-space-sm">
          {result.answers.map((answer, index) => {
            const chosen = answer.question.options.find(
              (o) => o.id === answer.chosenId,
            );
            const correct = answer.question.options.find(
              (o) => o.id === answer.question.correctId,
            );

            return (
              <div
                key={answer.question.id}
                className={cn(
                  "rounded-[20px] p-space-md",
                  answer.correct ? "bg-[#E4F5EB]" : "bg-surface-container-low",
                )}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                      answer.correct
                        ? "bg-[#8FCBAA] text-white"
                        : "bg-error-container text-on-error-container",
                    )}
                  >
                    {answer.correct ? (
                      <Check className="h-4 w-4" strokeWidth={3} />
                    ) : (
                      <X className="h-4 w-4" strokeWidth={3} />
                    )}
                  </span>

                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="font-body-md text-body-md font-semibold text-on-surface">
                      {index + 1}. {answer.question.prompt}
                    </p>

                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Your answer:{" "}
                      <span
                        className={cn(
                          "font-semibold",
                          answer.correct ? "text-tertiary" : "text-error",
                        )}
                      >
                        {chosen ? chosen.text : "skipped"}
                      </span>
                      {!answer.correct && (
                        <>
                          {" · Correct: "}
                          <span className="font-semibold text-on-surface">
                            {correct?.text}
                          </span>
                        </>
                      )}
                    </p>

                    {answer.question.explanation && (
                      <p className="font-body-sm text-body-sm leading-relaxed text-on-surface-variant">
                        {answer.question.explanation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
