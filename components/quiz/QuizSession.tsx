"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AlertTriangle, Sparkles } from "lucide-react";
import { QuizSetup } from "./QuizSetup";
import { QuestionCard } from "./QuestionCard";
import { ResultView } from "./ResultView";
import { BearMascot } from "@/components/bears/BearMascot";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNotes } from "@/lib/notes-store";
import { useProgress } from "@/lib/progress-store";
import { pickFromBank } from "@/lib/question-bank";
import {
  gradeQuiz,
  type Difficulty,
  type QuizQuestion,
  type QuizResult,
} from "@/lib/quiz-types";

type Phase = "setup" | "loading" | "running" | "result";

type Config = { topic: string; difficulty: Difficulty; count: number };

/**
 * Drives a full run: pick settings, fetch questions (AI with an offline
 * fallback), answer them, then grade and bank the result.
 */
export function QuizSession({ mode }: { mode: "quiz" | "exam" }) {
  const { notes } = useNotes();
  const { recordRun } = useProgress();

  const [phase, setPhase] = useState<Phase>("setup");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [index, setIndex] = useState(0);
  const [config, setConfig] = useState<Config | null>(null);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);

  const startedAt = useRef<number>(0);

  // Tick the on-screen timer while a run is in progress.
  useEffect(() => {
    if (phase !== "running") return;
    const id = setInterval(
      () => setElapsed(Math.floor((Date.now() - startedAt.current) / 1000)),
      1000,
    );
    return () => clearInterval(id);
  }, [phase]);

  const start = useCallback(
    async (next: Config) => {
      setConfig(next);
      setPhase("loading");
      setNotice(null);
      setAnswers({});
      setFlags({});
      setIndex(0);

      const payload = {
        topic: next.topic,
        difficulty: next.difficulty,
        count: next.count,
        notes: notes.slice(0, 12).map((note) => ({
          title: note.title,
          topic: note.topic,
          body: note.body.join("\n\n"),
        })),
      };

      let loaded: QuizQuestion[] = [];

      try {
        const response = await fetch("/api/quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await response.json();

        if (!response.ok) throw new Error(data?.error ?? "Generation failed");
        loaded = data.questions ?? [];

        if (loaded.length < next.count) {
          // Top up from the offline bank so the count is honoured.
          const extra = pickFromBank({
            topicTitle: next.topic === "mixed" ? null : next.topic,
            difficulty: next.difficulty,
            count: next.count - loaded.length,
          });
          loaded = [...loaded, ...extra].slice(0, next.count);
        }
      } catch (error) {
        loaded = pickFromBank({
          topicTitle: next.topic === "mixed" ? null : next.topic,
          difficulty: next.difficulty,
          count: next.count,
        });
        setNotice(
          error instanceof Error
            ? `Panda could not generate questions (${error.message}) — using the built-in question bank instead.`
            : "Using the built-in question bank.",
        );
      }

      if (loaded.length === 0) {
        setNotice("No questions available. Please try again.");
        setPhase("setup");
        return;
      }

      setQuestions(loaded);
      startedAt.current = Date.now();
      setElapsed(0);
      setPhase("running");
    },
    [notes],
  );

  const finish = useCallback(() => {
    if (!config) return;

    const graded = gradeQuiz({
      mode,
      topic: config.topic === "mixed" ? "Mixed Review" : config.topic,
      difficulty: config.difficulty,
      questions,
      answers,
      seconds: Math.floor((Date.now() - startedAt.current) / 1000),
      passMark: mode === "exam" ? 80 : 70,
    });

    setResult(graded);
    recordRun(graded);
    setPhase("result");
  }, [config, mode, questions, answers, recordRun]);

  /* --------------------------------- views -------------------------------- */

  if (phase === "setup") {
    return (
      <div className="flex flex-col gap-space-md">
        {notice && <Notice text={notice} />}
        <QuizSetup
          title={
            mode === "exam"
              ? "🎀 Let's See What You Remember!"
              : "Build a quick drill"
          }
          ctaLabel={mode === "exam" ? "Enter Exam Room" : "Start Quick Quiz"}
          defaultCount={mode === "exam" ? 10 : 5}
          onStart={start}
        />
      </div>
    );
  }

  if (phase === "loading") {
    return (
      <div className="flex flex-col items-center gap-space-md rounded-[28px] bg-surface-container-lowest p-space-xl text-center shadow-cozy">
        <BearMascot variant="panda" size={120} animated />
        <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
          <Sparkles className="mr-1 inline h-5 w-5 text-tertiary" />
          Panda is writing your questions…
        </h2>
        <p className="max-w-md font-body-md text-body-md text-on-surface-variant">
          {notes.length > 0
            ? `Reading ${notes.length} note${notes.length === 1 ? "" : "s"} to build ${config?.count} questions on ${config?.topic === "mixed" ? "a mix of topics" : config?.topic}.`
            : `You have no notes yet, so Panda is using standard Network+ material for ${config?.count} questions.`}
        </p>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2.5 w-2.5 animate-typing-dot rounded-full bg-primary-container"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (phase === "result" && result) {
    return (
      <div className="flex flex-col gap-space-md">
        {notice && <Notice text={notice} />}
        <ResultView
          result={result}
          onRetry={() => {
            setResult(null);
            setPhase("setup");
          }}
        />
      </div>
    );
  }

  const question = questions[index];
  const answeredCount = Object.keys(answers).length;
  const minutes = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const seconds = String(elapsed % 60).padStart(2, "0");

  return (
    <div className="flex flex-col gap-space-md">
      {notice && <Notice text={notice} />}

      <QuestionCard
        question={question}
        index={index}
        total={questions.length}
        selected={answers[question.id]}
        answeredCount={answeredCount}
        timeLabel={`${minutes}:${seconds}`}
        // A drill teaches as you go; an exam stays quiet until the end.
        reveal={mode === "quiz"}
        flagged={Boolean(flags[question.id])}
        onToggleFlag={() =>
          setFlags((prev) => ({ ...prev, [question.id]: !prev[question.id] }))
        }
        onSelect={(optionId) =>
          setAnswers((prev) => ({ ...prev, [question.id]: optionId }))
        }
        onPrev={() => setIndex((i) => Math.max(0, i - 1))}
        onNext={() => {
          if (index === questions.length - 1) finish();
          else setIndex((i) => i + 1);
        }}
      />

      {/* Question jump bar */}
      <div className="flex flex-wrap items-center justify-between gap-space-sm rounded-full bg-surface-container-low px-space-md py-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {questions.map((q, i) => (
            <button
              key={q.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to question ${i + 1}`}
              className={`flex h-7 w-7 items-center justify-center rounded-full font-label-badge text-label-badge transition-all ${
                i === index
                  ? "bg-primary text-on-primary shadow-sm"
                  : answers[q.id]
                    ? "bg-primary-container text-on-primary-container"
                    : flags[q.id]
                      ? "bg-tertiary-fixed text-on-tertiary-fixed-variant"
                      : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <Button variant="secondary" size="sm" onClick={finish}>
          Finish &amp; see score
        </Button>
      </div>
    </div>
  );
}

function Notice({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 rounded-[20px] bg-primary-fixed px-space-md py-3">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-on-primary-fixed-variant" />
      <p className="font-body-sm text-body-sm text-on-primary-fixed">{text}</p>
      <Badge tone="outline" className="ml-auto shrink-0">
        offline bank
      </Badge>
    </div>
  );
}
