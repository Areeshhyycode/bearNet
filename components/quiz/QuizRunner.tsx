"use client";

import { useState } from "react";
import { QuestionCard } from "./QuestionCard";
import { QUIZ_QUESTIONS } from "@/lib/mock-data";

/**
 * Walks through the mock questions so the interface can be reviewed.
 * Selections are remembered for the session only and never scored.
 */
export function QuizRunner({ timeLabel }: { timeLabel?: string }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const question = QUIZ_QUESTIONS[index];

  return (
    <QuestionCard
      question={question}
      index={index}
      total={QUIZ_QUESTIONS.length}
      selected={answers[question.id]}
      timeLabel={timeLabel}
      onSelect={(optionId) =>
        setAnswers((prev) => ({ ...prev, [question.id]: optionId }))
      }
      onPrev={() => setIndex((i) => Math.max(0, i - 1))}
      onNext={() =>
        setIndex((i) => (i + 1) % QUIZ_QUESTIONS.length)
      }
    />
  );
}
