"use client";

import { ArrowLeft, ArrowRight, Check, Flag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { OptionCard } from "@/components/ui/option-card";
import type { QuizQuestion } from "@/lib/quiz-types";
import { cn } from "@/lib/utils";

/**
 * One question. In quiz mode `reveal` marks right and wrong immediately;
 * exam mode keeps everything neutral until the end.
 */
export function QuestionCard({
  question,
  index,
  total,
  selected,
  onSelect,
  onPrev,
  onNext,
  timeLabel,
  reveal = false,
  flagged = false,
  onToggleFlag,
  answeredCount,
}: {
  question: QuizQuestion;
  index: number;
  total: number;
  selected?: string;
  onSelect: (optionId: string) => void;
  onPrev?: () => void;
  onNext?: () => void;
  timeLabel?: string;
  reveal?: boolean;
  flagged?: boolean;
  onToggleFlag?: () => void;
  answeredCount?: number;
}) {
  const percent = Math.round(((index + 1) / total) * 100);
  const isLast = index === total - 1;
  const answered = Boolean(selected);
  const showAnswer = reveal && answered;
  const isCorrect = selected === question.correctId;

  return (
    <div className="flex flex-col gap-space-lg rounded-[28px] bg-surface-container-lowest p-space-md shadow-cozy sm:p-space-xl">
      {/* Meta row */}
      <div className="flex flex-col gap-space-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-container font-body-sm text-body-sm font-bold text-on-primary-container">
              {index + 1}
            </span>
            <span className="font-label-badge text-label-badge font-semibold uppercase tracking-wider text-on-surface-variant">
              Question {index + 1} of {total}
            </span>
            <Badge tone="lavender">{question.topic}</Badge>
          </div>

          <div className="flex items-center gap-2">
            {timeLabel && (
              <span className="rounded-full bg-surface-container-low px-3 py-1 font-label-code text-label-code text-on-surface tabular-nums">
                ⏱️ {timeLabel}
              </span>
            )}
            <button
              type="button"
              onClick={onToggleFlag}
              className={cn(
                "flex items-center gap-1 rounded-full px-3 py-1 font-body-sm text-body-sm transition-colors",
                flagged
                  ? "bg-tertiary-fixed font-semibold text-on-tertiary-fixed-variant"
                  : "bg-surface-container-low text-on-surface-variant hover:text-tertiary",
              )}
            >
              <Flag className="h-3.5 w-3.5" /> {flagged ? "Flagged" : "Flag"}
            </button>
          </div>
        </div>

        <ProgressBar value={percent} size="sm" label="Progress through the questions" />
      </div>

      {/* Prompt */}
      <h2 className="font-headline-md text-headline-md font-bold leading-snug text-on-surface">
        {question.prompt}
      </h2>

      {/* Options */}
      <div className="grid grid-cols-1 gap-space-sm sm:grid-cols-2">
        {question.options.map((option, optionIndex) => {
          let state: "idle" | "correct" | "incorrect" = "idle";
          if (showAnswer) {
            if (option.id === question.correctId) state = "correct";
            else if (option.id === selected) state = "incorrect";
          }

          return (
            <OptionCard
              key={option.id}
              label={String.fromCharCode(65 + optionIndex)}
              title={option.text}
              selected={selected === option.id}
              state={state}
              onSelect={() => !showAnswer && onSelect(option.id)}
            />
          );
        })}
      </div>

      {/* Explanation after answering (quiz mode only) */}
      {showAnswer && (
        <div
          className={cn(
            "flex items-start gap-3 rounded-[20px] p-space-md animate-fade-up",
            isCorrect ? "bg-[#E4F5EB]" : "bg-error-container/60",
          )}
        >
          <span
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
              isCorrect ? "bg-[#8FCBAA] text-white" : "bg-error text-on-error",
            )}
          >
            {isCorrect ? (
              <Check className="h-4 w-4" strokeWidth={3} />
            ) : (
              <X className="h-4 w-4" strokeWidth={3} />
            )}
          </span>
          <div className="min-w-0">
            <p className="font-body-md text-body-md font-semibold text-on-surface">
              {isCorrect ? "Correct! 🎀" : "Not quite — here's why"}
            </p>
            {question.explanation && (
              <p className="mt-0.5 font-body-sm text-body-sm leading-relaxed text-on-surface-variant">
                {question.explanation}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-space-sm border-t border-outline-variant/40 pt-space-md">
        <span className="font-body-sm text-body-sm text-on-surface-variant">
          {answeredCount !== undefined
            ? `🐻 ${answeredCount} of ${total} answered`
            : "🐻 Take your time."}
        </span>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={onPrev} disabled={index === 0}>
            <ArrowLeft className="h-4 w-4" /> Previous
          </Button>
          <Button variant="primary" onClick={onNext}>
            {isLast ? "Finish" : "Next Question"} <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
