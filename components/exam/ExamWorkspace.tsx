"use client";

import { useState } from "react";
import { QuizSetup } from "@/components/quiz/QuizSetup";
import { QuizRunner } from "@/components/quiz/QuizRunner";
import { ExamResult } from "./ExamResult";
import { cn } from "@/lib/utils";

const VIEWS = [
  { id: "setup", emoji: "🎀", label: "Exam Setup" },
  { id: "room", emoji: "📝", label: "Exam Room" },
  { id: "result", emoji: "🐻", label: "Result Screen" },
] as const;

type View = (typeof VIEWS)[number]["id"];

/**
 * Switches between the three exam screens so every state of the
 * interface is reachable while there is no exam engine behind it.
 */
export function ExamWorkspace() {
  const [view, setView] = useState<View>("setup");

  return (
    <div className="flex flex-col gap-space-lg">
      <div className="flex flex-wrap items-center justify-between gap-space-sm rounded-full bg-surface-container-low p-1.5">
        <div className="flex flex-wrap items-center gap-1">
          {VIEWS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setView(item.id)}
              aria-pressed={view === item.id}
              className={cn(
                "rounded-full px-space-md py-2 font-body-sm text-body-sm transition-all duration-200",
                view === item.id
                  ? "bg-primary-container font-semibold text-on-primary-container shadow-sm"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
              )}
            >
              <span aria-hidden>{item.emoji}</span> {item.label}
            </button>
          ))}
        </div>
        <span className="px-3 font-body-sm text-body-sm text-on-surface-variant">
          Preview every screen — no exam logic runs yet.
        </span>
      </div>

      <div key={view} className="animate-fade-up">
        {view === "setup" && (
          <QuizSetup
            title="🎀 Let's See What You Remember!"
            ctaLabel="Enter Exam Room"
          />
        )}
        {view === "room" && <QuizRunner timeLabel="28:45" />}
        {view === "result" && <ExamResult />}
      </div>
    </div>
  );
}
