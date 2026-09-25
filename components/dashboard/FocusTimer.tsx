"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Timer } from "lucide-react";
import { useProgress } from "@/lib/progress-store";
import { useToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

const PRESETS = [25, 45, 60, 90];

/**
 * Focus timer with a remembered duration.
 *
 * Whole minutes are banked as study time as they pass, so closing the tab
 * mid-session does not lose what was already worked.
 */
export function FocusTimer() {
  const { preferences, recordStudyMinutes, updatePreferences } = useProgress();
  const toast = useToast();

  const preferred = preferences.timer.focusMinutes;
  const [minutes, setMinutes] = useState(preferred);
  const [secondsLeft, setSecondsLeft] = useState(preferred * 60);
  const [running, setRunning] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [customValue, setCustomValue] = useState(String(preferred));

  const bankedRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Adopt the stored preference once it arrives from the server.
  useEffect(() => {
    if (running) return;
    setMinutes(preferred);
    setSecondsLeft(preferred * 60);
    setCustomValue(String(preferred));
  }, [preferred, running]);

  useEffect(() => {
    if (!running) return;

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setRunning(false);
          toast.success("🌸 Focus block finished — take a tea break!");
          return 0;
        }

        const elapsed = minutes * 60 - (prev - 1);
        const whole = Math.floor(elapsed / 60);
        if (whole > bankedRef.current) {
          recordStudyMinutes(whole - bankedRef.current);
          bankedRef.current = whole;
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, minutes, recordStudyMinutes, toast]);

  function choose(nextMinutes: number) {
    const safe = Math.min(Math.max(Math.round(nextMinutes), 1), 180);
    setRunning(false);
    setMinutes(safe);
    setSecondsLeft(safe * 60);
    bankedRef.current = 0;
    updatePreferences({ timer: { ...preferences.timer, focusMinutes: safe } });
  }

  function reset() {
    setRunning(false);
    setSecondsLeft(minutes * 60);
    bankedRef.current = 0;
  }

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const finished = secondsLeft === 0;
  const percent = Math.round(
    ((minutes * 60 - secondsLeft) / Math.max(1, minutes * 60)) * 100,
  );

  return (
    <div className="flex flex-col gap-space-sm rounded-[22px] bg-surface-container-lowest p-space-md shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 font-label-badge text-label-badge font-semibold uppercase tracking-wider text-on-surface-variant">
          <Timer className="h-3.5 w-3.5 text-tertiary" /> Focus timer
        </span>
        <span className="font-body-sm text-body-sm text-on-surface-variant">
          {running ? "☕ Focusing…" : finished ? "🌸 Done!" : `${minutes} min block`}
        </span>
      </div>

      {/* Clock */}
      <div className="flex items-center gap-space-md">
        <span className="font-label-code text-[34px] font-semibold leading-none tabular-nums text-on-surface sm:text-[40px]">
          {mm}:{ss}
        </span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => (finished ? reset() : setRunning((v) => !v))}
            aria-label={running ? "Pause timer" : "Start timer"}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-on-primary shadow-sm transition-all hover:bg-tertiary active:scale-95"
          >
            {running ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="ml-0.5 h-5 w-5" />
            )}
          </button>
          <button
            type="button"
            onClick={reset}
            aria-label="Reset timer"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container text-on-surface-variant transition-colors hover:text-on-surface"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Duration presets */}
      <div className="flex flex-wrap items-center gap-1.5">
        {PRESETS.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => {
              setCustomOpen(false);
              choose(value);
            }}
            className={cn(
              "rounded-full px-3 py-1 font-body-sm text-body-sm transition-colors",
              !customOpen && minutes === value
                ? "bg-primary-container font-semibold text-on-primary-container shadow-sm"
                : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
            )}
          >
            {value}m
          </button>
        ))}

        <button
          type="button"
          onClick={() => setCustomOpen((v) => !v)}
          className={cn(
            "rounded-full px-3 py-1 font-body-sm text-body-sm transition-colors",
            customOpen || !PRESETS.includes(minutes)
              ? "bg-primary-container font-semibold text-on-primary-container shadow-sm"
              : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high",
          )}
        >
          Custom
        </button>

        {customOpen && (
          <span className="flex items-center gap-1.5">
            <input
              type="number"
              min={1}
              max={180}
              value={customValue}
              onChange={(event) => setCustomValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") choose(Number(customValue) || 25);
              }}
              aria-label="Custom minutes"
              className="w-16 rounded-full bg-surface-container-low px-3 py-1 font-body-sm text-body-sm text-on-surface outline-none ring-1 ring-inset ring-transparent focus:ring-primary-container"
            />
            <button
              type="button"
              onClick={() => choose(Number(customValue) || 25)}
              className="rounded-full bg-primary px-3 py-1 font-body-sm text-body-sm font-semibold text-on-primary"
            >
              Set
            </button>
          </span>
        )}
      </div>
    </div>
  );
}
