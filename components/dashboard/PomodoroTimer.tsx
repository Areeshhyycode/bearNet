"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

const FOCUS_SECONDS = 25 * 60;

/** Cozy study timer — the one bit of interactivity on the hub. */
export function PomodoroTimer() {
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_SECONDS);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const secs = String(secondsLeft % 60).padStart(2, "0");
  const finished = secondsLeft === 0;

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => (finished ? reset() : setRunning((v) => !v))}
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-4 py-2 font-body-sm text-body-sm font-semibold shadow-sm transition-all duration-200 active:scale-95",
          running
            ? "bg-tertiary-container text-on-tertiary-container"
            : "bg-primary-container text-on-primary-container hover:bg-primary-container/80",
        )}
        aria-label={running ? "Pause study timer" : "Start study timer"}
      >
        <Timer className="h-[18px] w-[18px]" />
        <span className="font-label-code text-label-code tabular-nums">
          {mins}:{secs}
        </span>
        <span className="text-on-primary-fixed-variant">
          {finished ? "🌸 Tea break!" : running ? "☕ Focusing…" : "☕ Cozy Study"}
        </span>
      </button>

      {secondsLeft !== FOCUS_SECONDS && (
        <button
          type="button"
          onClick={reset}
          aria-label="Reset timer"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container text-on-surface-variant transition-colors hover:text-on-surface"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      )}

      <button
        type="button"
        title="Study ambient lo-fi music"
        className="rounded-full bg-surface-container px-3 py-2 font-body-sm text-body-sm text-on-surface-variant transition-all hover:text-on-surface"
      >
        🎧 Lo-fi Radio
      </button>
    </div>
  );

  function reset() {
    setRunning(false);
    setSecondsLeft(FOCUS_SECONDS);
  }
}
