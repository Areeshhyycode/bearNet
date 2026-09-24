"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Segmented } from "@/components/ui/segmented";
import { QUIZ_TOPIC_CHOICES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const DIFFICULTIES = [
  { value: "easy", label: "Easy", emoji: "🌱" },
  { value: "medium", label: "Medium", emoji: "🎀" },
  { value: "hard", label: "Hard", emoji: "🔥" },
];

const COUNTS = [
  { value: 5, label: "5" },
  { value: 10, label: "10" },
  { value: 20, label: "20" },
];

/**
 * Topic / difficulty / length picker.
 * Selection is visual state only — nothing is generated yet.
 */
export function QuizSetup({
  title = "Pick your drill",
  ctaLabel = "Start Quiz",
}: {
  title?: string;
  ctaLabel?: string;
}) {
  const [topic, setTopic] = useState("mixed");
  const [difficulty, setDifficulty] = useState("medium");
  const [count, setCount] = useState(10);

  return (
    <Card className="flex flex-col gap-space-lg p-space-md sm:p-space-xl">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
          {title}
        </h2>
        <span className="rounded-full bg-surface-container-low px-3 py-1 font-body-sm text-body-sm text-on-surface-variant">
          Est. {Math.round(count * 0.8)} min
        </span>
      </div>

      {/* Topics */}
      <div className="space-y-space-sm">
        <span className="font-label-badge text-label-badge font-semibold uppercase tracking-wider text-on-surface-variant">
          Choose a topic
        </span>
        <div className="grid grid-cols-2 gap-space-sm md:grid-cols-3">
          {QUIZ_TOPIC_CHOICES.map((choice) => {
            const selected = topic === choice.id;
            return (
              <button
                key={choice.id}
                type="button"
                onClick={() => setTopic(choice.id)}
                aria-pressed={selected}
                className={cn(
                  "flex flex-col items-start gap-1 rounded-[20px] p-space-md text-left transition-all duration-200 active:scale-[0.98]",
                  selected
                    ? "bg-primary-fixed shadow-soft ring-2 ring-primary-container"
                    : "bg-surface-container-low hover:-translate-y-0.5 hover:bg-surface-container-high",
                )}
              >
                <span className="text-xl" aria-hidden>
                  {choice.emoji}
                </span>
                <span className="font-body-md text-body-md font-semibold text-on-surface">
                  {choice.title}
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  {choice.caption}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Difficulty + count */}
      <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
        <div className="space-y-space-sm">
          <span className="font-label-badge text-label-badge font-semibold uppercase tracking-wider text-on-surface-variant">
            Difficulty
          </span>
          <Segmented
            options={DIFFICULTIES}
            value={difficulty}
            onChange={setDifficulty}
            label="Difficulty"
            className="w-full"
          />
        </div>

        <div className="space-y-space-sm">
          <span className="font-label-badge text-label-badge font-semibold uppercase tracking-wider text-on-surface-variant">
            How many questions?
          </span>
          <Segmented
            options={COUNTS}
            value={count}
            onChange={setCount}
            label="Question count"
            className="w-full"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-space-sm border-t border-outline-variant/40 pt-space-md">
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          🐼 Panda will build this from your notes once the engine is wired up.
        </p>
        <Button variant="primary" size="lg">
          {ctaLabel} 🎀
        </Button>
      </div>
    </Card>
  );
}
