"use client";

import { ArrowLeft, ArrowRight, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { OptionCard } from "@/components/ui/option-card";
import type { QuizQuestion } from "@/lib/mock-data";

/**
 * Question surface shared by the quiz drill and the exam room.
 * Choosing an option only paints the selection — nothing is graded.
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
}: {
  question: QuizQuestion;
  index: number;
  total: number;
  selected?: string;
  onSelect: (optionId: string) => void;
  onPrev?: () => void;
  onNext?: () => void;
  timeLabel?: string;
}) {
  const percent = Math.round(((index + 1) / total) * 100);
  const isLast = index === total - 1;

  return (
    <div className="flex flex-col gap-space-lg rounded-[28px] bg-surface-container-lowest p-space-md shadow-cozy sm:p-space-xl">
      {/* Meta row */}
      <div className="flex flex-col gap-space-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
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
              <span className="rounded-full bg-surface-container-low px-3 py-1 font-label-code text-label-code text-on-surface">
                ⏱️ {timeLabel}
              </span>
            )}
            <button
              type="button"
              className="flex items-center gap-1 rounded-full bg-surface-container-low px-3 py-1 font-body-sm text-body-sm text-on-surface-variant transition-colors hover:text-tertiary"
            >
              <Flag className="h-3.5 w-3.5" /> Flag
            </button>
          </div>
        </div>

        <ProgressBar value={percent} size="sm" label="Quiz progress" />
      </div>

      {/* Prompt */}
      <h2 className="font-headline-md text-headline-md font-bold leading-snug text-on-surface">
        {question.prompt}
      </h2>

      {/* Options */}
      <div className="grid grid-cols-1 gap-space-sm sm:grid-cols-2">
        {question.options.map((option, optionIndex) => (
          <OptionCard
            key={option.id}
            label={String.fromCharCode(65 + optionIndex)}
            title={option.text}
            selected={selected === option.id}
            onSelect={() => onSelect(option.id)}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-space-sm border-t border-outline-variant/40 pt-space-md">
        <span className="font-body-sm text-body-sm text-on-surface-variant">
          🐻 Take your time — answers are not graded in this preview.
        </span>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={onPrev} disabled={index === 0}>
            <ArrowLeft className="h-4 w-4" /> Previous
          </Button>
          <Button variant="primary" onClick={onNext}>
            {isLast ? "Finish" : "Next Question"}{" "}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
