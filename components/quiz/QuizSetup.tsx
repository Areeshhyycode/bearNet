"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Segmented } from "@/components/ui/segmented";
import { useNotes } from "@/lib/notes-store";
import { QUIZ_TOPIC_CHOICES } from "@/lib/mock-data";
import type { Difficulty } from "@/lib/quiz-types";
import { cn } from "@/lib/utils";

const DIFFICULTIES: { value: Difficulty; label: string; emoji: string }[] = [
  { value: "easy", label: "Easy", emoji: "🌱" },
  { value: "medium", label: "Medium", emoji: "🎀" },
  { value: "hard", label: "Hard", emoji: "🔥" },
];

const COUNTS = [
  { value: 5, label: "5" },
  { value: 10, label: "10" },
  { value: 20, label: "20" },
];

/** Topic / difficulty / length picker that hands a config to the session. */
export function QuizSetup({
  title = "Pick your drill",
  ctaLabel = "Start Quiz",
  defaultCount = 5,
  onStart,
}: {
  title?: string;
  ctaLabel?: string;
  defaultCount?: number;
  onStart: (config: { topic: string; difficulty: Difficulty; count: number }) => void;
}) {
  const { notes } = useNotes();
  const [topic, setTopic] = useState("mixed");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [count, setCount] = useState(defaultCount);

  /** Offer the learner's own topics first, then the standard ones. */
  const choices = useMemo(() => {
    const fromNotes = [...new Set(notes.map((note) => note.category))].map(
      (name) => ({
        id: name,
        emoji: "📗",
        title: name,
        caption: `${notes.filter((n) => n.category === name).length} of your notes`,
      }),
    );

    const seen = new Set(fromNotes.map((c) => c.id));
    const rest = QUIZ_TOPIC_CHOICES.filter((c) => !seen.has(c.id));
    return [QUIZ_TOPIC_CHOICES[0], ...fromNotes, ...rest.slice(1)];
  }, [notes]);

  return (
    <Card className="flex flex-col gap-space-lg p-space-md sm:p-space-xl">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
          {title}
        </h2>
        <div className="flex items-center gap-2">
          <Badge tone={notes.length > 0 ? "mint" : "outline"}>
            {notes.length > 0
              ? `🐼 built from your ${notes.length} note${notes.length === 1 ? "" : "s"}`
              : "🐼 no notes yet — using Network+ basics"}
          </Badge>
          <span className="rounded-full bg-surface-container-low px-3 py-1 font-body-sm text-body-sm text-on-surface-variant">
            Est. {Math.max(1, Math.round(count * 0.8))} min
          </span>
        </div>
      </div>

      {/* Topics */}
      <div className="space-y-space-sm">
        <span className="font-label-badge text-label-badge font-semibold uppercase tracking-wider text-on-surface-variant">
          Choose a topic
        </span>
        <div className="grid grid-cols-2 gap-space-sm md:grid-cols-3">
          {choices.map((choice) => {
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
          {notes.length > 0
            ? "🐼 Questions are generated from your own notes."
            : "🌸 Write a few notes and these become personal to you."}
        </p>
        <Button
          variant="primary"
          size="lg"
          onClick={() => onStart({ topic, difficulty, count })}
        >
          {ctaLabel} 🎀
        </Button>
      </div>
    </Card>
  );
}
